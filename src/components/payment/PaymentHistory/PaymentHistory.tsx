import React from 'react';
import { UI_CONSTANTS } from '../../../utils/constants';

interface PaymentHistoryItem {
    id: number;
    mssv: string;
    full_name: string | null;
    amount: number;
    date: string;
    status: string;
}

interface PaymentHistoryProps {
    paymentHistory: PaymentHistoryItem[];
    isStudent: boolean;
    tuitionStatus: number;
    language: 'vi' | 'en';
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
    paymentHistory,
    isStudent,
    tuitionStatus,
    language
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm" style={{ padding: '20px', marginTop: '24px', marginBottom: '24px', backgroundColor: UI_CONSTANTS.COLORS.GRAY_LIGHT }}>
            <h2 className="text-2xl font-bold" style={{ color: UI_CONSTANTS.COLORS.PRIMARY, marginBottom: '20px' }}>
                {language === 'vi' ? 'Lịch Sử Giao Dịch' : 'Payment History'}
            </h2>

            {isStudent && (
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#eaeaeaff', borderRadius: '8px' }}>
                    <span className="font-semibold" style={{ color: '#374151' }}>
                        {language === 'vi' ? 'Tình trạng học phí: ' : 'Tuition Status: '}
                    </span>
                    <span style={{
                        color: tuitionStatus > 0 ? '#ef4444' : '#10b981',
                        fontWeight: 'bold'
                    }}>
                        {language === 'vi'
                            ? (tuitionStatus > 0 ? 'Nợ học phí' : 'Đã thanh toán')
                            : (tuitionStatus > 0 ? 'Outstanding Debt' : 'Paid')}
                    </span>
                </div>
            )}

            {paymentHistory.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                    <table className="w-full" style={{
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        tableLayout: 'fixed',
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#eaeaeaff' }}>
                                <th style={{
                                    borderRight: '1px solid #d1d5db',
                                    borderBottom: '1px solid #d1d5db',
                                    padding: '12px',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    color: '#374151',
                                    width: '15%'
                                }}>
                                    MSSV
                                </th>
                                <th style={{
                                    borderRight: '1px solid #d1d5db',
                                    borderBottom: '1px solid #d1d5db',
                                    padding: '12px',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    color: '#374151',
                                    width: '25%'
                                }}>
                                    {language === 'vi' ? 'Họ Tên' : 'Full Name'}
                                </th>
                                <th style={{
                                    borderRight: '1px solid #d1d5db',
                                    borderBottom: '1px solid #d1d5db',
                                    padding: '12px',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    color: '#374151',
                                    width: '25%'
                                }}>
                                    {language === 'vi' ? 'Số Tiền' : 'Amount'}
                                </th>
                                <th style={{
                                    borderBottom: '1px solid #d1d5db',
                                    padding: '12px',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    color: '#374151',
                                    width: '35%'
                                }}>
                                    {language === 'vi' ? 'Ngày' : 'Date'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map((item, index) => (
                                <tr
                                    key={item.id}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#eaeaeaff'
                                    }}
                                >
                                    <td style={{
                                        borderRight: '1px solid #d1d5db',
                                        borderBottom: index === paymentHistory.length - 1 ? 'none' : '1px solid #d1d5db',
                                        padding: '12px',
                                        textAlign: 'center',
                                        color: '#374151'
                                    }}>
                                        {item.mssv}
                                    </td>
                                    <td style={{
                                        borderRight: '1px solid #d1d5db',
                                        borderBottom: index === paymentHistory.length - 1 ? 'none' : '1px solid #d1d5db',
                                        padding: '12px',
                                        textAlign: 'center',
                                        color: '#374151'
                                    }}>
                                        {item.full_name || 'N/A'}
                                    </td>
                                    <td style={{
                                        borderRight: '1px solid #d1d5db',
                                        borderBottom: index === paymentHistory.length - 1 ? 'none' : '1px solid #d1d5db',
                                        padding: '12px',
                                        textAlign: 'center',
                                        color: '#374151',
                                        fontWeight: '500'
                                    }}>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(item.amount)}
                                    </td>
                                    <td style={{
                                        borderBottom: index === paymentHistory.length - 1 ? 'none' : '1px solid #d1d5db',
                                        padding: '12px',
                                        textAlign: 'center',
                                        color: '#374151'
                                    }}>
                                        {new Date(item.date).toLocaleString(
                                            language === 'vi' ? 'vi-VN' : 'en-US',
                                            {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            }
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: '#6b7280',
                    backgroundColor: '#eaeaeaff',
                    borderRadius: '8px'
                }}>
                    <svg
                        style={{
                            width: '48px',
                            height: '48px',
                            margin: '0 auto 12px',
                            color: '#d1d5db'
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <p style={{ fontSize: '16px', fontWeight: '500' }}>
                        {language === 'vi' ? 'Chưa có lịch sử giao dịch' : 'No payment history'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;