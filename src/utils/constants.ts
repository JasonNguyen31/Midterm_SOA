import type { LoginTexts, Language } from '../types/auth.types';

// Auth credentials for multiple students
export const AUTH_CREDENTIALS = {
    ACCOUNTS: [
        {
            USERNAME: '521h0185',
            PASSWORD: '123456'
        },
        {
            USERNAME: '521h0186',
            PASSWORD: 'abc123'
        },
        {
            USERNAME: '521h0187',
            PASSWORD: 'pass123'
        }
    ]
} as const;

// Legacy support for existing code
export const LEGACY_AUTH = {
    USERNAME: '521h0185',
    PASSWORD: '123456'
} as const;

export const LOGIN_TEXTS: Record<Language, LoginTexts> = {
    vi: {
        greeting: 'XIN CHÀO!',
        studentIdPlaceholder: 'Mã sinh viên',
        passwordPlaceholder: 'Nhập mật khẩu',
        signIn: 'ĐĂNG NHẬP',
        pleaseLogin: 'Đăng nhập để sử dụng hệ thống thông tin sinh viên!',
        errorTitle: 'Sai tên đăng nhập hoặc mật khẩu! Vui lòng kiểm tra và đăng nhập lại!',
        okButton: 'OK',
        processing: 'Đang xử lý...'
    },
    en: {
        greeting: 'HI!',
        studentIdPlaceholder: 'StudentID code',
        passwordPlaceholder: 'Password',
        signIn: 'SIGN IN',
        pleaseLogin: 'Please log in for using!',
        errorTitle: 'Wrong username or password! Please check and log in again!',
        okButton: 'OK',
        processing: 'Processing...'
    }
} as const;

export const UI_CONSTANTS = {
    MOBILE_BREAKPOINT: 768,
    LOGIN_DELAY: 1000, // mô phỏng độ trễ api
    COLORS: {
        PRIMARY: '#d9534f',
        BODY_WHITE: '#e6e5e5c4',
        GRAY_LIGHT: '#f9fafb',
        GRAY_BORDER: '#d1d5db',
        GRAY_TEXT: '#6b7280',
        GRAY_PLACEHOLDER: '#9ca3af',
        TEXT_DARK: '#374151',
        ERROR_RED: '#ef4444'
    }
} as const;

export const PAGE_TITLES = {
    LOGIN: 'Login - Student Portal',
    PAYMENT: 'Tuition Payment - Student Portal',
} as const;