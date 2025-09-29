PHÂN HỆ THANH TOÁN HỌC PHÍ CỦA ỨNG DỤNG IBANKING

IBanking Frontend là phần giao diện người dùng của hệ thống thanh toán học phí trực tuyến, được phát triển theo kiến trúc hướng dịch vụ (SOA). Dự án bao gồm:

- Trang đăng nhập: Xác thực người dùng với validation và error handling
- Trang thanh toán: Xử lý thanh toán học phí
- Xác thực OTP: Bảo mật giao dịch qua email
- Giao diện responsive: Tương thích mọi thiết bị

# Yêu cầu hệ thống

- Node.js >= 16.0.0
- npm >= 8.0.0

# Khởi chạy ứng dụng React Vite + TailwindCSS

npm create vite@latest midtermproject
cd midtermproject
npm install
npm install tailwindcss @tailwindcss/vite
npm install axios react-router-dom
npm run dev

# Chạy dự án có sẵn

# clone hoặc tải dự án về

cd project
npm install
cp .env.example .env
npm run dev
mở trình duyệt tại http://localhost:5173

# Kiến trúc dự án (SOA)

- UI Layer: Pages & Components
- Business Logic: Utils & Auth Logic
- Service Layer: API & Authentication
- Data Layer: Types & Constants

# Cấu trúc thư mục

src/
├── components/ # Các component giao diện
│ ├── common/ # Component dùng chung
│ ├── Button/ # Button component với disabled support
│ └── Modal/ # Modal components (ErrorModal)
├── pages/ # Các trang chính
│ ├── Login/ # Trang đăng nhập với validation
│ └── Payment/ # Trang thanh toán
├── utils/ # Logic và tiện ích
│ ├── auth.ts # Logic xác thực và đăng nhập
│ └── constants.ts # Hằng số và text đa ngôn ngữ
├── types/ # Định nghĩa TypeScript
│ └── auth.types.ts # Types cho authentication
├── context/ # Quản lý state toàn cục
├── hooks/ # Custom React hooks
├── services/ # Lớp dịch vụ SOA
│ ├── api/ # Dịch vụ API (authApi, paymentApi)
│ └── utils/ # Tiện ích (validation, helpers)
└── styles/ # CSS toàn cục

# Công nghệ sử dụng

| Công nghệ    | Phiên bản | Mục đích         |
| ------------ | --------- | ---------------- |
| React        | 18+       | Framework UI     |
| TypeScript   | 5+        | Type safety      |
| Vite         | 5+        | Build tool nhanh |
| TailwindCSS  | 3+        | CSS framework    |
| React Router | 6+        | Routing          |
| Axios        | 1+        | HTTP client      |

# Tính năng đã triển khai

## Đăng nhập

- Form validation với icons và focus states
- Hiển thị/ẩn mật khẩu
- Error modal với đa ngôn ngữ (Việt/Anh)
- Loading state với disabled inputs
- Responsive design cho mobile/desktop
- Tài khoản test: `521h0185` / `123456`

### Authentication Logic

- Validation credentials tách biệt
- Simulate API calls với delay
- LocalStorage để lưu user session
- Type-safe với TypeScript interfaces
- Centralized error handling

### UI/UX

- Responsive design cho mọi thiết bị
- Theme màu banking chuyên nghiệp
- Loading states và error handling
- Đa ngôn ngữ (Việt Nam/English)
- Smooth transitions và hover effects

### Kiến trúc Code

- Logic tách biệt khỏi UI components
- Reusable ErrorModal component
- Constants quản lý tập trung
- Type definitions cho maintainability
- Clean imports với `import type`

## Tính năng sắp triển khai

### Thanh toán học phí

- Form nhập thông tin thanh toán
- Tra cứu học phí theo mã sinh viên
- Xác thực OTP qua email
- Xử lý giao dịch an toàn

## Demo

### Tài khoản test

- Username: `521h0185`
- Password: `123456`

### Thử nghiệm

- Đăng nhập đúng: Chuyển hướng thành công
- Đăng nhập sai: Hiển thị error modal
- Responsive: Test trên mobile/tablet/desktop
- Đa ngôn ngữ: Click flag để chuyển đổi

## Thành viên nhóm

- Frontend Developer: React.js, TypeScript, UI/UX
- Backend Developer 1: FastAPI, Authentication
- Backend Developer 2: Database, Payment API
