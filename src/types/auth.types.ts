export interface LoginCredentials {
    studentId: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    user?: User;
}

export interface User {
    id: string;
    studentId: string;
    name?: string;
    role: 'student';
}

export type Language = 'en' | 'vi';

export interface LoginTexts {
    greeting: string;
    studentIdPlaceholder: string;
    passwordPlaceholder: string;
    signIn: string;
    pleaseLogin: string;
    errorTitle: string;
    okButton: string;
    processing: string;
}

export interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    okButtonText: string;
}

export interface StudentInfo {
    studentId: string;
    fullName: string;
    className: string;
    course: string;
    email: string;
    phone: string;
    availableBalance: number;
}