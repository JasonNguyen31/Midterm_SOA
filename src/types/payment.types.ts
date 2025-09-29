export interface PaymentFormProps {
    studentData: any;
    language: 'vi' | 'en';
    currentUser?: any; 
}

export interface PaymentSection {
    title: string;
    className?: string;
}