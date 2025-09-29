import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { getCurrentTuitionFee, getStudentById } from '../../../data/mockData';
import ErrorModal from '../../common/Modal/ErrorModal';

interface TuitionInfoProps {
    language: 'vi' | 'en';
    onDataChange: (studentId: string, studentName: string, student: any) => void;
}

export interface TuitionInfoRef {
    reset: () => void;
}

const TuitionInfo = forwardRef<TuitionInfoRef, TuitionInfoProps>(({ language, onDataChange }, ref) => {
    const [inputStudentId, setInputStudentId] = useState('');
    const [studentData, setStudentData] = useState<any>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const tuitionFee = studentData ? getCurrentTuitionFee(studentData.studentId) : null;

    // Expose reset method to parent
    useImperativeHandle(ref, () => ({
        reset: () => {
            setInputStudentId('');
            setStudentData(null);
            onDataChange('', '', null);
        }
    }));

    const handleSearch = () => {
        if (inputStudentId.trim() === '') {
            setErrorMessage(language === 'vi' ? 'Vui lòng nhập mã sinh viên' : 'Please enter student ID');
            setShowErrorModal(true);
            setStudentData(null);
            onDataChange('', '', null);
            return;
        }

        const foundStudent = getStudentById(inputStudentId.trim());

        if (foundStudent) {
            setStudentData(foundStudent);
            onDataChange(inputStudentId, foundStudent.fullName, foundStudent);
        } else {
            setStudentData(null);
            onDataChange(inputStudentId, '', null);
            setErrorMessage(language === 'vi' ? 'Không tìm thấy sinh viên với mã này' : 'Student not found with this ID');
            setShowErrorModal(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleInputChange = (value: string) => {
        setInputStudentId(value);
        setStudentData(null);
        onDataChange('', '', null);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm" style={{ padding: '10px' }}>
            <h3 className="text-lg font-bold" style={{ color: '#d9534f', marginBottom: '5px' }}>
                {language === 'vi' ? 'Thông tin học phí' : 'Tuition Information'}
            </h3>
            <div>
                <div style={{ marginBottom: '8px' }}>
                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '3px' }}>
                        {language === 'vi' ? 'Mã sinh viên' : 'Student ID'}
                    </label>
                    <input
                        type="text"
                        value={inputStudentId}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={language === 'vi' ? 'Nhập mã sinh viên và nhấn Enter' : 'Enter student ID and press Enter'}
                        className="w-full bg-white border border-gray-300 rounded-sm"
                        style={{ paddingLeft: '10px', outline: 'none' }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#d9534f';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '3px' }}>
                        {language === 'vi' ? 'Họ tên sinh viên' : 'Student Name'}
                    </label>
                    <input
                        type="text"
                        value={studentData?.fullName || ''}
                        readOnly
                        placeholder={language === 'vi' ? 'Tự động hiển thị' : 'Auto display'}
                        className="w-full bg-gray-50 border border-gray-300 rounded-sm"
                        style={{ paddingLeft: '10px', outline: 'none', cursor: 'default' }}
                        onFocus={(e) => e.target.blur()}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '3px' }}>
                        {language === 'vi' ? 'Số tiền cần nộp' : 'Amount Due'}
                    </label>
                    <input
                        type="text"
                        value={
                            studentData && tuitionFee
                                ? tuitionFee.total > 0
                                    ? new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(tuitionFee.total)
                                    : language === 'vi'
                                        ? 'Đã thanh toán học phí'
                                        : 'Tuition paid'
                                : ''
                        }
                        readOnly
                        placeholder={language === 'vi' ? 'Tự động hiển thị' : 'Auto display'}
                        className={`w-full border rounded-sm font-bold ${studentData && tuitionFee && tuitionFee.total > 0
                                ? 'bg-yellow-50 border-yellow-300 text-red-600'
                                : studentData && tuitionFee && tuitionFee.total === 0
                                    ? 'bg-green-50 border-green-300 text-green-700'
                                    : 'bg-gray-50 border-gray-300 text-gray-500'
                            }`}
                        style={{ paddingLeft: '10px', outline: 'none', cursor: 'default' }}
                        onFocus={(e) => e.target.blur()}
                    />
                </div>
            </div>

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title={errorMessage}
                okButtonText={language === 'vi' ? 'Đồng ý' : 'OK'}
            />
        </div>
    );
});

TuitionInfo.displayName = 'TuitionInfo';

export default TuitionInfo;