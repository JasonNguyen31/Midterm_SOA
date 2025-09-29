import React, { useEffect, useState } from 'react';
import { getCurrentTuitionFee } from '../../../data/mockData';

interface PaymentDetailsProps {
    searchedStudent: any;
    currentUser: any;
    language: 'vi' | 'en';
    termsAccepted: boolean; // Thêm prop này
    onTermsChange: (accepted: boolean) => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
    searchedStudent,
    currentUser,
    language,
    termsAccepted, // Nhận từ parent
    onTermsChange
}) => {
    const [internalTermsAccepted, setInternalTermsAccepted] = useState(termsAccepted);

    const tuitionFee = searchedStudent ? getCurrentTuitionFee(searchedStudent.studentId) : null;

    // Đồng bộ state nội bộ với prop từ parent
    useEffect(() => {
        setInternalTermsAccepted(termsAccepted);
    }, [termsAccepted]);

    const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const accepted = e.target.checked;
        setInternalTermsAccepted(accepted);
        onTermsChange(accepted);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm" style={{ padding: '10px' }}>
            <h3 className="text-lg font-bold" style={{ color: '#d9534f', marginBottom: '5px' }}>
                {language === 'vi' ? 'Thông tin thanh toán' : 'Payment Details'}
            </h3>
            <div>
                <div style={{ marginBottom: '8px' }}>
                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '3px' }}>
                        {language === 'vi' ? 'Số dư khả dụng (Người nộp)' : 'Available Balance (Payer)'}
                    </label>
                    <input
                        type="text"
                        value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentUser.availableBalance)}
                        readOnly
                        className="w-full bg-green-50 border border-green-300 rounded-sm font-bold text-green-700"
                        style={{ paddingLeft: '10px', outline: 'none', cursor: 'default' }}
                        onFocus={(e) => e.target.blur()}
                    />
                </div>
                <div style={{ marginBottom: '9px' }}>
                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '3px' }}>
                        {language === 'vi' ? 'Học phí cần thanh toán' : 'Tuition Fee'}
                    </label>
                    <input
                        type="text"
                        value={
                            searchedStudent && tuitionFee
                                ? tuitionFee.total > 0
                                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tuitionFee.total)
                                    : language === 'vi' ? 'Đã thanh toán học phí' : 'Tuition paid'
                                : ''
                        }
                        readOnly
                        placeholder={language === 'vi' ? 'Tự động hiển thị' : 'Auto display'}
                        className={`w-full border rounded-sm font-bold ${searchedStudent && tuitionFee && tuitionFee.total > 0
                                ? 'bg-yellow-50 border-yellow-300 text-red-600'
                                : searchedStudent && tuitionFee && tuitionFee.total === 0
                                    ? 'bg-green-50 border-green-300 text-green-700'
                                    : 'bg-gray-50 border-gray-300 text-gray-500'
                            }`}
                        style={{ paddingLeft: '10px', outline: 'none', cursor: 'default' }}
                        onFocus={(e) => e.target.blur()}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '5px' }}>
                        {language === 'vi' ? 'Các thỏa thuận' : 'Terms & Conditions'}
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={internalTermsAccepted}
                            onChange={handleTermsChange}
                            disabled={!searchedStudent}
                            className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            style={{
                                marginRight: '8px',
                                outline: 'none',
                                cursor: searchedStudent ? 'pointer' : 'not-allowed',
                                opacity: searchedStudent ? 1 : 0.5
                            }}
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm text-gray-700"
                            style={{
                                opacity: searchedStudent ? 1 : 0.5,
                                cursor: searchedStudent ? 'pointer' : 'not-allowed'
                            }}
                        >
                            {language === 'vi' ? 'Tôi đồng ý với các điều khoản' : 'I agree to terms & conditions'}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetails;