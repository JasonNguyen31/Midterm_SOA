import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { PAGE_TITLES, UI_CONSTANTS } from '../../utils/constants';
import { getCurrentStudentData } from '../../utils/auth';
import type { Language } from '../../types/auth.types';
import PaymentForm from '../../components/payment/PaymentForm/PaymentForm';
import { languageService } from '../../utils/languageService';

const TuitionPayment: React.FC = () => {
    const navigate = useNavigate();
    const [language, setLanguage] = useState<Language>(() => languageService.getLanguage());
    const [resetFormKey, setResetFormKey] = useState<number>(0);

    const [currentStudentData] = useState(() => getCurrentStudentData());

    useDocumentTitle(PAGE_TITLES.PAYMENT);

    // Lắng nghe thay đổi ngôn ngữ từ các trang khác
    useEffect(() => {
        const unsubscribe = languageService.subscribe((newLanguage) => {
            setLanguage(newLanguage);
        });

        return unsubscribe;
    }, []);

    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'vi' : 'en';
        setLanguage(newLanguage);
        languageService.setLanguage(newLanguage);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setResetFormKey(prev => prev + 1);
        navigate('/');
    };

    const texts = {
        vi: {
            title: 'THÔNG TIN HỌC PHÍ - LỆ PHÍ',
            paymentInfo: 'Thông Tin Thanh Toán Học Phí',
            footer: {
                copyright: '©2013 Đại học Tôn Đức Thắng',
                developer: 'Ứng dụng được phát triển bởi TDT Software Team'
            }
        },
        en: {
            title: 'TUITION FEES INFORMATION',
            paymentInfo: 'Payment Information',
            footer: {
                copyright: '©2013 Ton Duc Thang University',
                developer: 'Application developed by TDT Software Team'
            }
        }
    };

    if (!currentStudentData) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: UI_CONSTANTS.COLORS.BODY_WHITE }}>
            {/* Header */}
            <div className="w-full px-6 py-4" style={{ backgroundColor: UI_CONSTANTS.COLORS.PRIMARY, padding: '20px' }}>
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center">
                        <h1 className="text-white text-2xl font-bold tracking-wide">
                            {texts[language].title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleLanguage}
                            className="w-10 h-6 rounded-sm overflow-hidden border border-white hover:border-blue-200 transition-colors shadow-md"
                            title={language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
                        >
                            {language === 'vi' ? (
                                <img src="https://flagcdn.com/w80/gb.png" alt="English" className="w-full h-full object-cover" />
                            ) : (
                                <img src="https://flagcdn.com/w80/vn.png" alt="Tiếng Việt" className="w-full h-full object-cover" />
                            )}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="text-white hover:text-red-200 transition-colors p-2"
                            title={language === 'vi' ? 'Đăng xuất' : 'Logout'}
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 01-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
                <div className="w-full max-w-7xl" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                    <div className="rounded-lg shadow-md" style={{ marginBottom: '20px', marginTop: '20px', padding: '20px', backgroundColor: UI_CONSTANTS.COLORS.GRAY_LIGHT }}>
                        <h2 className="text-2xl font-bold" style={{ color: UI_CONSTANTS.COLORS.PRIMARY, marginBottom: '20px' }}>
                            {texts[language].paymentInfo}
                        </h2>

                        <PaymentForm currentUser={currentStudentData} language={language} key={resetFormKey} />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full mt-auto" style={{ backgroundColor: UI_CONSTANTS.COLORS.GRAY_LIGHT, padding: '20px 0' }}>
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-700 font-medium" style={{ marginBottom: '5px' }}>
                        {texts[language].footer.copyright}
                    </p>
                    <p className="text-gray-600 text-sm">
                        {texts[language].footer.developer}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default TuitionPayment;