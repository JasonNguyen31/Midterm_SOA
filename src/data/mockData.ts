export interface StudentInfo {
    studentId: string;
    fullName: string;
    className: string;
    course: string;
    phone: string;
    email: string;
    availableBalance: number; // VNĐ
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number; // VNĐ
    type: 'payment' | 'refund';
    status: 'completed' | 'pending' | 'failed';
    semester: string;
}

export interface TuitionFee {
    semester: string;
    academicYear: string;
    tuitionFee: number;
    serviceFee: number;
    total: number;
    dueDate: string;
    status: 'unpaid' | 'paid' | 'overdue';
}

// Mock student database - Student 1
export const mockStudentData: StudentInfo = {
    studentId: '521h0185',
    fullName: 'Nguyễn Hoàng Việt',
    className: '21H50203',
    course: 'K25',
    phone: '0797702318',
    email: '521h0185@student.tdtu.edu.vn',
    availableBalance: 25000000
};

// Mock student database - Student 2
export const mockStudentData2: StudentInfo = {
    studentId: '521h0186',
    fullName: 'Trần Thị Mai Anh',
    className: '21H50204',
    course: 'K25',
    phone: '0987654321',
    email: '521h0186@student.tdtu.edu.vn',
    availableBalance: 18000000
};

export const mockStudentData3: StudentInfo = {
    studentId: '521h0187',
    fullName: 'Lê Văn Nam',
    className: '21H50205',
    course: 'K25',
    phone: '0912345678',
    email: '521h0187@student.tdtu.edu.vn',
    availableBalance: 30000000
};

// Mock all students array
export const mockStudentsDatabase: StudentInfo[] = [
    mockStudentData,
    mockStudentData2,
    mockStudentData3
];

// Mock transaction history - Student 1
export const mockTransactions: Transaction[] = [
    {
        id: 'TX001',
        date: '2024-08-15',
        description: 'Thanh toán học phí học kỳ 1 năm học 2024-2025',
        amount: 15050000,
        type: 'payment',
        status: 'completed',
        semester: 'HK1-2024-2025'
    },
    {
        id: 'TX002',
        date: '2024-02-20',
        description: 'Thanh toán học phí học kỳ 2 năm học 2023-2024',
        amount: 14800000,
        type: 'payment',
        status: 'completed',
        semester: 'HK2-2023-2024'
    },
    {
        id: 'TX003',
        date: '2023-08-25',
        description: 'Thanh toán học phí học kỳ 1 năm học 2023-2024',
        amount: 14500000,
        type: 'payment',
        status: 'completed',
        semester: 'HK1-2023-2024'
    },
    {
        id: 'TX004',
        date: '2023-07-10',
        description: 'Hoàn tiền phí dịch vụ',
        amount: 100000,
        type: 'refund',
        status: 'completed',
        semester: 'HK2-2022-2023'
    }
];

// Mock transaction history - Student 2
export const mockTransactions2: Transaction[] = [
    {
        id: 'TX005',
        date: '2024-08-20',
        description: 'Thanh toán học phí học kỳ 1 năm học 2024-2025',
        amount: 15050000,
        type: 'payment',
        status: 'completed',
        semester: 'HK1-2024-2025'
    },
    {
        id: 'TX006',
        date: '2024-02-25',
        description: 'Thanh toán học phí học kỳ 2 năm học 2023-2024',
        amount: 14800000,
        type: 'payment',
        status: 'completed',
        semester: 'HK2-2023-2024'
    },
    {
        id: 'TX007',
        date: '2023-09-01',
        description: 'Thanh toán học phí học kỳ 1 năm học 2023-2024',
        amount: 14500000,
        type: 'payment',
        status: 'completed',
        semester: 'HK1-2023-2024'
    }
];

export const mockTransactions3: Transaction[] = [
    {
        id: 'TX008',
        date: '2024-08-10',
        description: 'Thanh toán học phí học kỳ 1 năm học 2024-2025',
        amount: 15050000,
        type: 'payment',
        status: 'completed',
        semester: 'HK1-2024-2025'
    },
    {
        id: 'TX009',
        date: '2024-12-20',
        description: 'Thanh toán học phí học kỳ 2 năm học 2024-2025',
        amount: 15050000,
        type: 'payment',
        status: 'completed',
        semester: 'HK2-2024-2025'
    },
    {
        id: 'TX010',
        date: '2024-02-15',
        description: 'Thanh toán học phí học kỳ 2 năm học 2023-2024',
        amount: 14800000,
        type: 'payment',
        status: 'completed',
        semester: 'HK2-2023-2024'
    }
];

// Mock current tuition fees - Student 1
export const mockCurrentTuitionFee: TuitionFee = {
    semester: 'HK2-2024-2025',
    academicYear: '2024-2025',
    tuitionFee: 15000000,
    serviceFee: 50000,
    total: 15050000,
    dueDate: '2025-02-15',
    status: 'unpaid'
};

// Mock current tuition fees - Student 2
export const mockCurrentTuitionFee2: TuitionFee = {
    semester: 'HK2-2024-2025',
    academicYear: '2024-2025',
    tuitionFee: 15000000,
    serviceFee: 50000,
    total: 18359091,
    dueDate: '2025-02-15',
    status: 'unpaid'
};

export const mockCurrentTuitionFee3: TuitionFee = {
    semester: 'HK2-2024-2025',
    academicYear: '2024-2025',
    tuitionFee: 0,
    serviceFee: 0,
    total: 0,
    dueDate: '2025-02-15',
    status: 'paid'
};

// Helper functions
export const getStudentById = (studentId: string): StudentInfo | null => {
    return mockStudentsDatabase.find(student => student.studentId === studentId) || null;
};

export const getTransactionHistory = (studentId: string): Transaction[] => {
    if (studentId === '521h0185') return mockTransactions;
    if (studentId === '521h0186') return mockTransactions2;
    if (studentId === '521h0187') return mockTransactions3;
    return [];
};

export const getCurrentTuitionFee = (studentId: string): TuitionFee | null => {
    if (studentId === '521h0185') return mockCurrentTuitionFee;
    if (studentId === '521h0186') return mockCurrentTuitionFee2;
    if (studentId === '521h0187') return mockCurrentTuitionFee3;
    return null;
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};