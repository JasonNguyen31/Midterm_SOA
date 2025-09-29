import React, { useState, useEffect, useRef } from 'react';
import PayerInfo from '../PayerInfo/PayerInfo';
import TuitionInfo from '../TuitionInfo/TuitionInfo';
import type { TuitionInfoRef } from '../TuitionInfo/TuitionInfo';
import PaymentDetails from '../PaymentDetails/PaymentDetails';
import Button from '../../common/Button/Button';
import { UI_CONSTANTS } from '../../../utils/constants';
import { getStudentById, getCurrentTuitionFee } from '../../../data/mockData';
import ErrorModal from '../../../components/common/Modal/ErrorModal';

interface PaymentFormProps {
    currentUser: any;
    language: 'vi' | 'en';
}

const PaymentForm: React.FC<PaymentFormProps> = ({ currentUser, language }) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [inputStudentId, setInputStudentId] = useState('');
    const [inputStudentName, setInputStudentName] = useState('');
    const [searchedStudent, setSearchedStudent] = useState<any>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(300);

    // Ref to TuitionInfo component
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

        // Reset checkbox và OTP input khi thay đổi sinh viên
        setTermsAccepted(false);
        setShowOTPInput(false);
        setOtpValue('');
        setTimeRemaining(300);
    };

    const hasFilledAllFields = () => {
        return inputStudentId.trim() !== '' && inputStudentName.trim() !== '';
    };

    const isStudentInfoValid = () => {
        if (!hasFilledAllFields()) return false;

        const foundStudent = getStudentById(inputStudentId.trim());
        if (!foundStudent) return false;

        return inputStudentName.trim().toLowerCase() === foundStudent.fullName.toLowerCase();
    };

    const isButtonEnabled = () => {
        return termsAccepted && hasFilledAllFields();
    };

    const handleConfirmTransaction = () => {
        if (!isButtonEnabled()) return;

        if (!isStudentInfoValid()) {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi'
                ? 'Thông tin sinh viên không đúng! Vui lòng kiểm tra lại mã sinh viên và họ tên.'
                : 'Student information is incorrect! Please check the student ID and full name.');
            return;
        }

        const tuitionFee = getCurrentTuitionFee(searchedStudent.studentId);
        if (!tuitionFee || tuitionFee.total === 0) {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi'
                ? 'Sinh viên này không có khoản nợ học phí nào'
                : 'This student has no outstanding tuition fees');
            return;
        }

        if (currentUser.availableBalance < tuitionFee.total) {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi'
                ? 'Số dư khả dụng không đủ để thanh toán'
                : 'Insufficient balance to complete the payment');
            return;
        }

        setShowOTPInput(true);
        setTimeRemaining(300);
    };

    const handlePayment = () => {
        const correctOTP = "123456";

        if (otpValue.trim() === '') {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi' ? 'Vui lòng nhập mã OTP' : 'Please enter OTP code');
            return;
        }

        if (otpValue === correctOTP) {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi' ? 'Thanh toán thành công!' : 'Payment successful!');

            setTimeout(() => {
                // Reset PaymentForm state
                setShowOTPInput(false);
                setOtpValue('');
                setTermsAccepted(false);
                setInputStudentId('');
                setInputStudentName('');
                setSearchedStudent(null);
                setTimeRemaining(300);
                setShowErrorModal(false);

                // Reset TuitionInfo via ref
                tuitionInfoRef.current?.reset();

                // Clear localStorage
                localStorage.removeItem('paymentFormState');
            }, 2000);
        } else {
            setShowErrorModal(true);
            setErrorMessage(language === 'vi' ? 'Mã OTP không đúng!' : 'Invalid OTP code!');
        }
    };

    // Hàm Resend OTP
    const handleResendOTP = () => {
        setOtpValue('');
        setTimeRemaining(300);
        setShowErrorModal(true);
        setErrorMessage(language === 'vi' ? 'Mã OTP mới đã được gửi!' : 'New OTP code has been sent!');
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PayerInfo currentUser={currentUser} language={language} />
                <TuitionInfo ref={tuitionInfoRef} language={language} onDataChange={handleTuitionDataChange} />
                <PaymentDetails
                    searchedStudent={searchedStudent}
                    currentUser={currentUser}
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
                                            if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
                                                const prevInput = document.getElementById(`otp-${index - 1}`);
                                                prevInput?.focus();
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
                        {language === 'vi' ? 'XÁC NHẬN GIAO DỊCH' : 'CONFIRM TRANSACTION'}
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
                        {language === 'vi' ? 'THANH TOÁN' : 'PAY NOW'}
                    </Button>
                )}
            </div>

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title={errorMessage}
                okButtonText={language === 'vi' ? 'Đồng ý' : 'OK'}
            />
        </>
    );
};

export default PaymentForm;