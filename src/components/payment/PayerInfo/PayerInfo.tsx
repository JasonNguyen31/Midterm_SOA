import React from 'react';

interface PayerInfoProps {
    currentUser: any;
    language: 'vi' | 'en';
}

const PayerInfo: React.FC<PayerInfoProps> = ({ currentUser, language }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm" style={{ padding: '10px' }}>
            <h3 className="text-lg font-bold" style={{ color: '#d9534f', marginBottom: '5px' }}>
                {language === 'vi' ? 'Thông tin khách hàng' : 'Customer Information'}
            </h3>
            <div>
                <div style={{ marginBottom: '8px' }}>
                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '3px' }}>
                        {language === 'vi' ? 'Họ tên khách hàng' : 'Customer Name'}
                    </label>
                    <input
                        type="text"
                        value={currentUser.fullName}
                        readOnly
                        className="w-full bg-gray-50 border border-gray-300 rounded-sm"
                        style={{ paddingLeft: '10px', outline: 'none', cursor: 'default' }}
                        onFocus={(e) => e.target.blur()}
                    />
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '3px' }}>
                        {language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                    </label>
                    <input
                        type="text"
                        value={currentUser.phone}
                        readOnly
                        className="w-full bg-gray-50 border border-gray-300 rounded-sm"
                        style={{ paddingLeft: '10px', outline: 'none', cursor: 'default' }}
                        onFocus={(e) => e.target.blur()}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '3px' }}>
                        {language === 'vi' ? 'Email' : 'Email'}
                    </label>
                    <input
                        type="text"
                        value={currentUser.email}
                        readOnly
                        className="w-full bg-gray-50 border border-gray-300 rounded-sm"
                        style={{ paddingLeft: '10px', outline: 'none', cursor: 'default' }}
                        onFocus={(e) => e.target.blur()}
                    />
                </div>
            </div>
        </div>
    );
};

export default PayerInfo;