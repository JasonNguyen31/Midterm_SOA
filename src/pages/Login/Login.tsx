import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import ErrorModal from '../../components/common/Modal/ErrorModal';
import { simulateLogin } from '../../utils/auth';
import { LOGIN_TEXTS, PAGE_TITLES, UI_CONSTANTS } from '../../utils/constants';
import type { Language, LoginCredentials } from '../../types/auth.types';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { languageService } from '../../utils/languageService';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [language, setLanguage] = useState<Language>(() => languageService.getLanguage());
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useDocumentTitle(PAGE_TITLES.LOGIN);

    // Lắng nghe thay đổi ngôn ngữ từ các trang khác
    useEffect(() => {
        const unsubscribe = languageService.subscribe((newLanguage) => {
            setLanguage(newLanguage);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const credentials: LoginCredentials = { studentId, password };
            const response = await simulateLogin(credentials);

            if (response.success && response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                navigate('/tuition-payment');
            } else {
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setShowErrorModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'vi' : 'en';
        setLanguage(newLanguage);
        languageService.setLanguage(newLanguage);
    };

    const texts = LOGIN_TEXTS[language];
    const isMobile = windowWidth <= UI_CONSTANTS.MOBILE_BREAKPOINT;

    return (
        <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: UI_CONSTANTS.COLORS.BODY_WHITE, padding: '32px 16px' }}>
            <div className="w-full max-w-6xl h-[600px] bg-white rounded-xl overflow-hidden flex relative"
                style={{
                    boxShadow: '8px 5px 5px rgba(0,0,0,0.5), 10px 10px 20px rgba(0,0,0,0.2)',
                    maxWidth: '1152px',
                    height: 'auto',
                    minHeight: '600px'
                }}>

                {!isMobile && (
                    <div
                        className="flex-col items-center justify-center relative p-8"
                        style={{
                            backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
                            width: '40%',
                            display: 'flex'
                        }}
                    >
                        <div className="text-left">
                            {language === 'vi' ? (
                                <>
                                    <h1 className="text-5xl font-bold text-white mb-2 tracking-wide leading-tight">CỔNG</h1>
                                    <h2 className="text-5xl font-bold text-white mb-1 tracking-wide leading-tight">THÔNG TIN</h2>
                                    <h3 className="text-5xl font-bold text-white tracking-wide leading-tight">SINH VIÊN</h3>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-5xl font-bold text-white mb-2 tracking-wide leading-tight">STUDENT</h1>
                                    <h2 className="text-5xl font-bold text-white tracking-wide leading-tight">PORTAL</h2>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {!isMobile && (
                    <div className="absolute left-[40%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: UI_CONSTANTS.COLORS.PRIMARY }}
                            >
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                <div
                    className="bg-white flex flex-col items-center justify-center p-8"
                    style={{
                        width: isMobile ? '100%' : '60%',
                        minHeight: '600px',
                        marginTop: '30px'
                    }}
                >
                    <div className="w-full max-w-sm">
                        <div className="absolute top-8 right-8">
                            <button
                                onClick={toggleLanguage}
                                style={{ cursor: 'pointer' }}
                                className="w-12 h-8 rounded-sm overflow-hidden border border-gray-300 hover:border-gray-400 transition-colors shadow-md"
                            >
                                {language === 'en' ? (
                                    <img
                                        src="https://flagcdn.com/w80/vn.png"
                                        alt="Vietnam Flag"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src="https://flagcdn.com/w80/gb.png"
                                        alt="UK Flag"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </button>
                        </div>

                        <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                            <h3 className="text-4xl font-bold" style={{ color: UI_CONSTANTS.COLORS.PRIMARY }}>
                                {texts.greeting}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '48px',
                                    borderRadius: '8px',
                                    border: `1px solid ${UI_CONSTANTS.COLORS.GRAY_BORDER}`,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '100%',
                                        backgroundColor: UI_CONSTANTS.COLORS.GRAY_LIGHT,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRight: `1px solid ${UI_CONSTANTS.COLORS.GRAY_BORDER}`
                                    }}>
                                        <svg
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                color: focusedInput === 'studentId' ? UI_CONSTANTS.COLORS.ERROR_RED : UI_CONSTANTS.COLORS.GRAY_TEXT,
                                                transition: 'color 0.3s ease'
                                            }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder={texts.studentIdPlaceholder}
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        onFocus={() => setFocusedInput('studentId')}
                                        onBlur={() => setFocusedInput(null)}
                                        disabled={isLoading}
                                        style={{
                                            flex: 1,
                                            height: '100%',
                                            border: 'none',
                                            outline: 'none',
                                            paddingLeft: '16px',
                                            paddingRight: '16px',
                                            fontSize: '16px',
                                            fontWeight: 'normal',
                                            color: UI_CONSTANTS.COLORS.TEXT_DARK,
                                            backgroundColor: 'transparent',
                                            cursor: isLoading ? 'not-allowed' : 'text'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px', position: 'relative' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '48px',
                                    borderRadius: '8px',
                                    border: `1px solid ${UI_CONSTANTS.COLORS.GRAY_BORDER}`,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '100%',
                                        backgroundColor: UI_CONSTANTS.COLORS.GRAY_LIGHT,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRight: `1px solid ${UI_CONSTANTS.COLORS.GRAY_BORDER}`
                                    }}>
                                        <svg
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                color: focusedInput === 'password' ? UI_CONSTANTS.COLORS.ERROR_RED : UI_CONSTANTS.COLORS.GRAY_TEXT,
                                                transition: 'color 0.3s ease'
                                            }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={texts.passwordPlaceholder}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedInput('password')}
                                        onBlur={() => setFocusedInput(null)}
                                        disabled={isLoading}
                                        style={{
                                            flex: 1,
                                            height: '100%',
                                            border: 'none',
                                            outline: 'none',
                                            paddingLeft: '16px',
                                            paddingRight: '50px',
                                            fontSize: '16px',
                                            fontWeight: 'normal',
                                            color: UI_CONSTANTS.COLORS.TEXT_DARK,
                                            backgroundColor: 'transparent',
                                            cursor: isLoading ? 'not-allowed' : 'text'
                                        }}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        border: 'none',
                                        background: 'transparent',
                                        color: UI_CONSTANTS.COLORS.GRAY_PLACEHOLDER,
                                        padding: '4px'
                                    }}
                                >
                                    {showPassword ? (
                                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div style={{ paddingTop: '0px', display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        width: '200px',
                                        backgroundColor: isLoading ? UI_CONSTANTS.COLORS.GRAY_PLACEHOLDER : UI_CONSTANTS.COLORS.PRIMARY,
                                        borderColor: isLoading ? UI_CONSTANTS.COLORS.GRAY_PLACEHOLDER : UI_CONSTANTS.COLORS.PRIMARY,
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        opacity: isLoading ? 0.7 : 1
                                    }}
                                >
                                    {isLoading ? texts.processing : texts.signIn}
                                </Button>
                            </div>
                        </form>

                        <div style={{ marginTop: '10px' }} className="text-center">
                            <p className="text-gray-400 text-sm">{texts.pleaseLogin}</p>
                        </div>
                    </div>
                </div>

                <ErrorModal
                    isOpen={showErrorModal}
                    onClose={() => setShowErrorModal(false)}
                    title={texts.errorTitle}
                    okButtonText={texts.okButton}
                />
            </div>
        </div>
    );
};

export default Login;