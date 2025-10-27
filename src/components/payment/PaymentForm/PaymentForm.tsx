import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PayerInfo from '../PayerInfo/PayerInfo';
import TuitionInfo from '../TuitionInfo/TuitionInfo';
import type { TuitionInfoRef } from '../TuitionInfo/TuitionInfo';
import PaymentDetails from '../PaymentDetails/PaymentDetails';
import Button from '../../common/Button/Button';
import { UI_CONSTANTS } from '../../../utils/constants';
import type { StudentData, UserData } from '../../../types/auth.types';
import ErrorModal from '../../common/Modal/ErrorModal';


export interface PaymentHistoryItem {
    id: number;
    mssv: string;
    full_name: string | null;
    amount: number;
    date: string;
    status: string;
}

interface PaymentFormProps {
    currentUser: UserData;
    language: 'vi' | 'en';
    onPaymentHistoryUpdate?: (history: PaymentHistoryItem[], isStudent: boolean, tuitionStatus: number) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ currentUser, language, onPaymentHistoryUpdate }) => {

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [inputStudentId, setInputStudentId] = useState('');
    const [inputStudentName, setInputStudentName] = useState('');
    const [searchedStudent, setSearchedStudent] = useState<StudentData | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(300);
    const [loading, setLoading] = useState(false);

    const [shouldReloadAfterModal, setShouldReloadAfterModal] = useState(false);
    const [updatedUser, setUpdatedUser] = useState<UserData>(currentUser);
    const [otpAttempts, setOtpAttempts] = useState(0);

    const tuitionInfoRef = useRef<TuitionInfoRef>(null);

    // Load state từ localStorage khi component mount
    useEffect(() => {
        const savedState = localStorage.getItem('paymentFormState');
        if (savedState) {
            const state = JSON.parse(savedState);
            setInputStudentId(state.inputStudentId || '');
            setInputStudentName(state.inputStudentName || '');
            setSearchedStudent(state.searchedStudent || null);
            setTermsAccepted(state.termsAccepted || false);
            setShowOTPInput(state.showOTPInput || false);
            setOtpValue(state.otpValue || '');
            setTimeRemaining(state.timeRemaining || 300);
        }
    }, []);

    // Lưu state vào localStorage mỗi khi có thay đổi
    useEffect(() => {
        const state = {
            inputStudentId,
            inputStudentName,
            searchedStudent,
            termsAccepted,
            showOTPInput,
            otpValue,
            timeRemaining
        };
        localStorage.setItem('paymentFormState', JSON.stringify(state));
    }, [inputStudentId, inputStudentName, searchedStudent, termsAccepted, showOTPInput, otpValue, timeRemaining]);

    // Fetch payment history and student status
    useEffect(() => {
        async function fetchData() {
            try {
                const historyRes = await axios.get(`http://localhost:8000/api/payment-history/${currentUser.username}`);
                const history = historyRes.data.history;

                let isStudent = false;
                let tuitionStatus = 0;

                try {
                    const studentRes = await axios.get(`http://localhost:8000/api/student/${currentUser.username}`);
                    isStudent = true;
                    tuitionStatus = studentRes.data.amount_due;
                } catch (error: any) {
                    isStudent = false;
                }

                // Notify parent component about payment history update
                if (onPaymentHistoryUpdate) {
                    onPaymentHistoryUpdate(history, isStudent, tuitionStatus);
                }
            } catch (error: any) {
                console.error('Error fetching payment data:', error);
            }
        }
        fetchData();
    }, [currentUser.username, onPaymentHistoryUpdate]);

    // Timer đếm ngược cho OTP
    useEffect(() => {
        if (showOTPInput && timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else if (timeRemaining === 0 && showOTPInput) {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi' ? 'Mã OTP đã hết hạn!' : 'OTP code has expired!');
            setOtpValue('');
        }
    }, [showOTPInput, timeRemaining, language]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTermsChange = (accepted: boolean) => {
        setTermsAccepted(accepted);
    };

    const handleTuitionDataChange = (studentId: string, studentName: string, student: any) => {
        setInputStudentId(studentId);
        setInputStudentName(studentName);
        setSearchedStudent(student);

        setTermsAccepted(false);
        setShowOTPInput(false);
        setOtpValue('');
        setTimeRemaining(300);
        setOtpAttempts(0);
    };

    const hasFilledAllFields = () => {
        return inputStudentId.trim() !== '' && inputStudentName.trim() !== '';
    };

    const isStudentInfoValid = () => {
        if (!hasFilledAllFields()) return false;
        if (!searchedStudent) return false;
        return inputStudentName.trim().toLowerCase() === searchedStudent.full_name.toLowerCase();
    };

    const isButtonEnabled = () => {
        return termsAccepted && hasFilledAllFields() && !loading;
    };

    const handleConfirmTransaction = async () => {
        if (!isButtonEnabled()) return;

        if (!isStudentInfoValid()) {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi'
                ? 'Thông tin sinh viên không đúng! Vui lòng kiểm tra lại mã sinh viên và họ tên.'
                : 'Student information is incorrect! Please check the student ID and full name.');
            return;
        }

        if (!searchedStudent || searchedStudent.amount_due === 0) {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi'
                ? 'Sinh viên này không có khoản nợ học phí nào'
                : 'This student has no outstanding tuition fees');
            return;
        }

        if (updatedUser.balance < searchedStudent.amount_due) {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi'
                ? 'Số dư khả dụng không đủ để thanh toán'
                : 'Insufficient balance to complete the payment');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/generate-otp', {
                username: updatedUser.username,
                mssv: searchedStudent.mssv
            });
            console.log('OTP generation response:', response.data);
            setShowOTPInput(true);
            setTimeRemaining(300);
            setOtpAttempts(0);
        } catch (error: any) {
            console.error('OTP generation error:', error.response?.data || error.message);
            setErrorMessage(language === 'vi' ? 'Lỗi tạo OTP' : 'Error generating OTP');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        console.log('Payment attempted with OTP:', otpValue);
        if (otpValue.trim() === '') {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi' ? 'Vui lòng nhập mã OTP' : 'Please enter OTP code');
            return;
        }

        setLoading(true);
        try {
            const verifyResponse = await axios.post('http://localhost:8000/api/verify-otp', {
                username: updatedUser.username,
                mssv: searchedStudent!.mssv,
                otp: otpValue
            });
            console.log('OTP verification response:', verifyResponse.data);

            if (verifyResponse.data.success) {
                const paymentResponse = await axios.post('http://localhost:8000/api/payment', {
                    username: updatedUser.username,
                    mssv: searchedStudent!.mssv,
                    amount: searchedStudent!.amount_due
                });
                console.log('Payment response:', paymentResponse.data);

                setShowErrorModal(true);
                setErrorMessage(language === 'vi' ? 'Thanh toán thành công!' : 'Payment successful!');

                const userResponse = await axios.get(`http://localhost:8000/api/user/${updatedUser.username}`);
                setUpdatedUser(userResponse.data);
                setShouldReloadAfterModal(true);
                setOtpAttempts(0);

                setShowOTPInput(false);
                setOtpValue('');
                setTermsAccepted(false);
                setInputStudentId('');
                setInputStudentName('');
                setSearchedStudent(null);
                setTimeRemaining(300);
                tuitionInfoRef.current?.reset();
                localStorage.removeItem('paymentFormState');

                // Update payment history
                const historyRes = await axios.get(`http://localhost:8000/api/payment-history/${currentUser.username}`);
                if (onPaymentHistoryUpdate) {
                    const studentRes = await axios.get(`http://localhost:8000/api/student/${currentUser.username}`).catch(() => null);
                    onPaymentHistoryUpdate(
                        historyRes.data.history,
                        !!studentRes,
                        studentRes?.data?.amount_due || 0
                    );
                }

                console.log('Form reset after payment');
            } else {
                setOtpAttempts(prev => prev + 1);
                console.log('Current OTP attempts:', otpAttempts + 1);

                if (otpAttempts + 1 >= 3) {
                    setShowErrorModal(true);
                    setErrorMessage(language === 'vi'
                        ? 'Đã vượt quá số lần nhập OTP cho phép!'
                        : 'Exceeded allowed OTP attempts!');
                    setShouldReloadAfterModal(true);
                    setShowOTPInput(false);
                    setOtpValue('');
                    setTermsAccepted(false);
                    setInputStudentId('');
                    setInputStudentName('');
                    setSearchedStudent(null);
                    setTimeRemaining(300);
                    tuitionInfoRef.current?.reset();
                    localStorage.removeItem('paymentFormState');
                    console.log('Form reset after max OTP attempts');
                } else {
                    setShowErrorModal(true);
                    setErrorMessage(language === 'vi' ? 'Mã OTP không đúng!' : 'Invalid OTP code!');
                    setOtpValue('');
                    console.log('Invalid OTP');
                }
            }
        } catch (error: any) {
            console.error('Payment error:', error.response?.data || error.message);

            if (error.response?.status === 400 && error.response.data.message === 'Invalid OTP') {
                setOtpAttempts(prev => prev + 1);

                if (otpAttempts + 1 >= 3) {
                    setShowErrorModal(true);
                    setErrorMessage(language === 'vi'
                        ? 'Đã vượt quá số lần nhập OTP cho phép!'
                        : 'Exceeded allowed OTP attempts!');
                    setShouldReloadAfterModal(true);
                    setShowOTPInput(false);
                    setOtpValue('');
                    setTermsAccepted(false);
                    setInputStudentId('');
                    setInputStudentName('');
                    setSearchedStudent(null);
                    setTimeRemaining(300);
                    tuitionInfoRef.current?.reset();
                    localStorage.removeItem('paymentFormState');
                    console.log('Form reset after max OTP attempts');
                } else {
                    setShowErrorModal(true);
                    setErrorMessage(language === 'vi' ? 'Mã OTP không đúng!' : 'Invalid OTP code!');
                    setOtpValue('');
                    console.log('Invalid OTP');
                }
            } else {
                setErrorMessage(language === 'vi' ? 'Lỗi thanh toán' : 'Payment error');
                setShowErrorModal(true);
                setShouldReloadAfterModal(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        console.log('Resending OTP');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/generate-otp', {
                username: updatedUser.username,
                mssv: searchedStudent!.mssv
            });
            console.log('Resend OTP response:', response.data);
            setOtpValue('');
            setTimeRemaining(300);
            setOtpAttempts(0);
            setShowErrorModal(true);
            setErrorMessage(language === 'vi' ? 'Mã OTP mới đã được gửi!' : 'New OTP code has been sent!');
        } catch (error: any) {
            console.error('Resend OTP error:', error.response?.data || error.message);
            setErrorMessage(language === 'vi' ? 'Lỗi gửi lại OTP' : 'Error resending OTP');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    const getModalButtonText = () => {
        if (errorMessage === (language === 'vi' ? 'Mã OTP không đúng!' : 'Invalid OTP code!')) {
            return language === 'vi' ? 'Nhập lại' : 'Retry';
        } else if (errorMessage === (language === 'vi' ? 'Đã vượt quá số lần nhập OTP cho phép!' : 'Exceeded allowed OTP attempts!')) {
            return language === 'vi' ? 'Trở về' : 'Back';
        } else {
            return language === 'vi' ? 'Đồng ý' : 'OK';
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PayerInfo currentUser={updatedUser} language={language} />
                <TuitionInfo ref={tuitionInfoRef} language={language} onDataChange={handleTuitionDataChange} />
                <PaymentDetails
                    searchedStudent={searchedStudent}
                    currentUser={updatedUser}
                    language={language}
                    termsAccepted={termsAccepted}
                    onTermsChange={handleTermsChange}
                />
            </div>

            {/* OTP Input Section */}
            {showOTPInput && (
                <div className="flex justify-center">
                    <div
                        style={{ width: '100%', maxWidth: '400px', padding: '20px', cursor: 'pointer' }}
                        onClick={() => {
                            const firstEmptyIndex = otpValue.length;
                            const targetInput = document.getElementById(`otp-${firstEmptyIndex < 6 ? firstEmptyIndex : 5}`);
                            targetInput?.focus();
                        }}
                    >
                        <h3 className="text-lg font-bold text-center" style={{ color: UI_CONSTANTS.COLORS.PRIMARY, marginBottom: '10px' }}>
                            {language === 'vi' ? 'Nhập mã OTP' : 'Enter OTP Code'}
                        </h3>
                        <p className="text-sm text-gray-600 text-center" style={{ marginBottom: '15px' }}>
                            {language === 'vi'
                                ? 'Mã OTP đã được gửi đến email của bạn'
                                : 'OTP code has been sent to your email'}
                        </p>

                        {/* OTP Input with 6 separate boxes */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '12px',
                            margin: '0 auto',
                            maxWidth: '350px'
                        }}>
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        maxLength={1}
                                        value={otpValue[index] || ''}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value) {
                                                const newOtp = otpValue.split('');
                                                newOtp[index] = value;
                                                setOtpValue(newOtp.join('').slice(0, 6));

                                                if (index < 5) {
                                                    const nextInput = document.getElementById(`otp-${index + 1}`);
                                                    nextInput?.focus();
                                                }
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' || e.key === 'Delete') {
                                                if (otpValue[index]) {
                                                    const newOtp = otpValue.split('');
                                                    newOtp[index] = '';
                                                    setOtpValue(newOtp.join(''));
                                                } else if (index > 0) {
                                                    const prevInput = document.getElementById(`otp-${index - 1}`);
                                                    prevInput?.focus();
                                                }
                                            }
                                        }}
                                        id={`otp-${index}`}
                                        style={{
                                            width: '45px',
                                            height: '55px',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            border: 'none',
                                            borderBottom: `3px solid ${otpValue[index] ? UI_CONSTANTS.COLORS.PRIMARY : '#d1d5db'}`,
                                            outline: 'none',
                                            background: 'transparent',
                                            color: UI_CONSTANTS.COLORS.PRIMARY,
                                            transition: 'border-color 0.2s',
                                            cursor: 'text'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderBottomColor = UI_CONSTANTS.COLORS.PRIMARY;
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderBottomColor = otpValue[index] ? UI_CONSTANTS.COLORS.PRIMARY : '#d1d5db';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Timer và Resend button */}
                        <div className="text-center" style={{ marginTop: '20px' }}>
                            {timeRemaining > 0 ? (
                                <p className="text-sm font-bold" style={{ color: timeRemaining < 60 ? '#ef4444' : '#6b7280' }}>
                                    {language === 'vi' ? 'Thời gian còn lại: ' : 'Time remaining: '}
                                    <span style={{ fontSize: '16px' }}>{formatTime(timeRemaining)}</span>
                                </p>
                            ) : (
                                <button
                                    onClick={handleResendOTP}
                                    style={{
                                        backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
                                        color: 'white',
                                        padding: '8px 24px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    {language === 'vi' ? 'Gửi lại mã OTP' : 'Resend OTP'}
                                </button>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 text-center" style={{ marginTop: '8px' }}>
                            {language === 'vi'
                                ? 'Mã OTP có hiệu lực trong 5 phút'
                                : 'OTP code is valid for 5 minutes'}
                        </p>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="text-center">
                {!showOTPInput ? (
                    <Button
                        type="button"
                        disabled={!isButtonEnabled()}
                        style={{
                            width: '250px',
                            backgroundColor: isButtonEnabled() ? UI_CONSTANTS.COLORS.PRIMARY : '#ccc',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            padding: '12px 24px',
                            marginTop: '20px',
                            cursor: isButtonEnabled() ? 'pointer' : 'not-allowed',
                            opacity: isButtonEnabled() ? 1 : 0.6,
                            outline: 'none',
                            border: 'none',
                            boxShadow: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none'
                        }}
                        onClick={handleConfirmTransaction}
                    >
                        {loading ? (language === 'vi' ? 'Đang xử lý...' : 'Processing...') : (language === 'vi' ? 'XÁC NHẬN GIAO DỊCH' : 'CONFIRM TRANSACTION')}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        disabled={otpValue.length !== 6}
                        style={{
                            width: '250px',
                            backgroundColor: otpValue.length === 6 ? UI_CONSTANTS.COLORS.PRIMARY : '#ccc',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            padding: '12px 24px',
                            cursor: otpValue.length === 6 ? 'pointer' : 'not-allowed',
                            opacity: otpValue.length === 6 ? 1 : 0.6,
                            outline: 'none',
                            border: 'none',
                            boxShadow: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none'
                        }}
                        onClick={handlePayment}
                    >
                        {loading ? (language === 'vi' ? 'Đang xử lý...' : 'Processing...') : (language === 'vi' ? 'THANH TOÁN' : 'PAY NOW')}
                    </Button>
                )}
            </div>

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => {
                    setShowErrorModal(false);
                    if (shouldReloadAfterModal) {
                        console.log('Reloading page after modal close');
                        window.location.reload();
                    }
                }}
                title={errorMessage}
                okButtonText={getModalButtonText()}
            />
        </>
    );
};

export default PaymentForm;