export type Language = 'en' | 'vi';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface User {
  username: string;
  name: string;
  
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    user?: User;
}

export interface UserData {
  username: string;
  full_name: string;
  phone: string | null;
  email: string;
  balance: number;
}

export interface StudentData {
  mssv: string;
  full_name: string;
  amount_due: number;
}


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