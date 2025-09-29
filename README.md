# PHÂN HỆ THANH TOÁN HỌC PHÍ TRỰC TUYẾN

Phân hệ thanh toán học phí trực tuyến được xây dựng theo kiến trúc hướng dịch vụ (SOA - Service Oriented Architecture), cung cấp giao diện thân thiện cho sinh viên thực hiện thanh toán học phí một cách an toàn và tiện lợi.

## MỤC LỤC

- [Tổng quan](#tổng-quan)
- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Tài khoản demo](#tài-khoản-demo)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Thành viên nhóm](#thành-viên-nhóm)

## TỔNG QUAN

Dự án xây dựng phân hệ thanh toán học phí trực tuyến, là một phần của hệ thống iBanking. Ứng dụng cho phép sinh viên:

- Đăng nhập an toàn với xác thực username/password
- Tra cứu thông tin học phí theo mã sinh viên
- Thực hiện thanh toán học phí trực tuyến
- Xác thực giao dịch qua mã OTP gửi email
- Hỗ trợ đa ngôn ngữ (Tiếng Việt/English)

## TÍNH NĂNG CHÍNH

### 1. Xác thực và bảo mật

- Đăng nhập với mã sinh viên và mật khẩu
- Validation đầu vào với error handling
- Protected routes - bảo vệ các trang yêu cầu đăng nhập
- Session management với localStorage
- Xác thực OTP qua email

### 2. Quản lý học phí

- Tra cứu học phí theo mã sinh viên
- Hiển thị chi tiết: học phí, phí dịch vụ, tổng cộng
- Kiểm tra số dư khả dụng
- Hiển thị trạng thái thanh toán (Đã thanh toán/Chưa thanh toán)

### 3. Thanh toán trực tuyến

- Form nhập thông tin thanh toán với validation
- Kiểm tra số dư trước khi thanh toán
- Xác nhận giao dịch với checkbox điều khoản
- Nhập mã OTP 6 số với đếm ngược thời gian
- Xử lý thành công/thất bại giao dịch

### 4. Giao diện người dùng

- Responsive design - tương thích mọi thiết bị
- Theme màu chuyên nghiệp (Banking style)
- Đa ngôn ngữ (Vietnamese/English)
- Loading states và error modals
- Smooth transitions và hover effects

## CÔNG NGHỆ SỬ DỤNG

### Frontend Framework & Libraries

| Công nghệ        | Phiên bản | Mô tả                       |
| ---------------- | --------- | --------------------------- |
| React            | 19.1.1    | UI Framework                |
| TypeScript       | 5.8.3     | Type safety & Development   |
| Vite             | 7.1.7     | Build tool & Dev server     |
| React Router DOM | 7.9.3     | Client-side routing         |
| TailwindCSS      | 4.1.13    | Utility-first CSS framework |

### Development Tools

| Công nghệ         | Phiên bản | Mục đích                 |
| ----------------- | --------- | ------------------------ |
| ESLint            | 9.36.0    | Code linting             |
| TypeScript ESLint | 8.44.0    | TypeScript linting rules |
| Vite Plugin React | 5.0.3     | React Fast Refresh       |

### Key Features Implementation

- **State Management**: React Hooks (useState, useEffect, useRef)
- **Custom Hooks**: useDocumentTitle, language service
- **Type Safety**: TypeScript interfaces & types
- **Storage**: localStorage for session persistence
- **Validation**: Form validation với error handling
- **Styling**: TailwindCSS với custom configurations

## YÊU CẦU HỆ THỐNG

```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

## CÀI ĐẶT VÀ CHẠY DỰ ÁN

### 1. Clone hoặc tải dự án về

```bash
git clone https://github.com/JasonNguyen31/Midterm_SOA.git
cd Midterm_SOA
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 4. Build production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

### Scripts khác

```bash
# Lint code
npm run lint

# Type check
npm run type-check
```

## CẤU TRÚC DỰ ÁN

```
midtermproject/
├── public/                    # Static assets
│   └── fonts/                # Font files
├── src/
│   ├── components/           # React components
│   │   ├── common/          # Shared components
│   │   │   ├── Button/      # Button component
│   │   │   └── Modal/       # Modal components
│   │   └── payment/         # Payment-specific components
│   │       ├── PayerInfo/   # Thông tin người nộp
│   │       ├── TuitionInfo/ # Thông tin học phí
│   │       ├── PaymentDetails/ # Chi tiết thanh toán
│   │       └── PaymentForm/ # Form thanh toán chính
│   ├── data/                 # Mock data & interfaces
│   │   ├── mockData.ts      # Student data, transactions
│   │   └── index.ts         # Data exports
│   ├── hooks/                # Custom React hooks
│   │   └── useDocumentTitle.ts
│   ├── pages/                # Page components
│   │   ├── Login/           # Trang đăng nhập
│   │   └── TuitionPayment/  # Trang thanh toán
│   ├── services/             # Business logic layer
│   ├── styles/               # Global styles
│   │   └── global.css       # Global CSS & Tailwind
│   ├── types/                # TypeScript definitions
│   │   ├── auth.types.ts    # Authentication types
│   │   └── payment.types.ts # Payment types
│   ├── utils/                # Utility functions
│   │   ├── auth.ts          # Authentication logic
│   │   ├── constants.ts     # App constants
│   │   └── languageService.ts # i18n service
│   ├── App.tsx               # Root component với routing
│   └── main.tsx              # Application entry point
├── index.html                # HTML template
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # Documentation
```

## KIẾN TRÚC HỆ THỐNG

### Kiến trúc SOA (Service Oriented Architecture)

```
┌─────────────────────────────────────────────┐
│           PRESENTATION LAYER                |
│       (Pages & Components - UI/UX)          |
├─────────────────────────────────────────────┤
│           BUSINESS LOGIC LAYER              |
│        (Utils, Hooks, Auth Logic)           |
├─────────────────────────────────────────────┤
│              SERVICE LAYER                  |
│       (API Services, Data Services)         │
├─────────────────────────────────────────────┤
│               DATA LAYER                    |
│       (Types, Constants, Mock Data)         │
└─────────────────────────────────────────────┘
```

### Component Architecture

**Common Components** (Reusable)

- Button: Custom button với disabled state
- ErrorModal: Modal hiển thị thông báo lỗi

**Payment Components** (Feature-specific)

- PayerInfo: Hiển thị thông tin người nộp tiền
- TuitionInfo: Tra cứu và hiển thị học phí
- PaymentDetails: Chi tiết thanh toán và điều khoản
- PaymentForm: Component chính quản lý flow thanh toán

### State Management

- **Local State**: useState cho component state
- **Refs**: useRef để tương tác với child components
- **Persistence**: localStorage cho session và language
- **Context**: Language service với event-driven updates

### Routing Structure

```
/ (Login)
└── /tuition-payment (Protected)
    └── requires authentication
```

## TÀI KHOẢN DEMO

### Tài khoản 1 (Có học phí chưa thanh toán)

```
Mã sinh viên: 521h0185
Mật khẩu: 123456
Số dư khả dụng: 25,000,000 VNĐ
Học phí còn nợ: 15,050,000 VNĐ
```

### Tài khoản 2 (Có học phí chưa thanh toán)

```
Mã sinh viên: 521h0186
Mật khẩu: abc123
Số dư khả dụng: 18,000,000 VNĐ
Học phí còn nợ: 18,359,091 VNĐ
```

### Tài khoản 3 (Đã thanh toán đủ học phí)

```
Mã sinh viên: 521h0187
Mật khẩu: pass123
Số dư khả dụng: 30,000,000 VNĐ
Học phí còn nợ: 0 VNĐ (Đã thanh toán)
```

### Mã OTP Demo

```
OTP: 123456
Thời gian hiệu lực: 5 phút (300 giây)
```

## HƯỚNG DẪN SỬ DỤNG

### 1. Đăng nhập

1. Mở ứng dụng tại `http://localhost:5173`
2. Nhập mã sinh viên (ví dụ: `521h0185`)
3. Nhập mật khẩu (ví dụ: `123456`)
4. Click nút "ĐĂNG NHẬP"

### 2. Tra cứu học phí

1. Sau khi đăng nhập, vào trang "Thanh toán học phí"
2. Nhập mã sinh viên cần tra cứu
3. Nhấn Enter hoặc click nút tìm kiếm
4. Hệ thống hiển thị thông tin học phí

### 3. Thanh toán học phí

1. Kiểm tra thông tin:
   - Thông tin người nộp (tự động hiển thị)
   - Thông tin sinh viên cần nộp (nhập mã sinh viên)
   - Số tiền cần thanh toán
2. Tick vào checkbox "Tôi đồng ý với các điều khoản"

3. Click nút "XÁC NHẬN GIAO DỊCH"

4. Nhập mã OTP (6 số) trong vòng 5 phút

   - Mã OTP demo: `123456`
   - Có thể click "Gửi lại mã OTP" nếu hết thời gian

5. Click nút "THANH TOÁN" để hoàn tất

### 4. Chuyển đổi ngôn ngữ

- Click vào cờ ở góc trên bên phải
- Hệ thống hỗ trợ Tiếng Việt và English
- Ngôn ngữ được lưu tự động

### 5. Đăng xuất

- Click vào icon đăng xuất ở góc trên bên phải
- Hệ thống sẽ xóa session và quay về trang đăng nhập

## TÍNh NĂNG ĐẶC BIỆT

### 1. Xác thực OTP

- Mã OTP 6 số được "gửi" qua email (mô phỏng)
- Đếm ngược thời gian 5 phút (300 giây)
- Tự động vô hiệu hóa khi hết thời gian
- Có thể gửi lại mã OTP mới

### 2. Validation đầy đủ

- Kiểm tra thông tin sinh viên
- Kiểm tra số dư trước khi thanh toán
- Kiểm tra trạng thái học phí
- Xác thực checkbox điều khoản

### 3. Responsive Design

- Tối ưu cho mobile, tablet, desktop
- Adaptive layout theo kích thước màn hình
- Touch-friendly cho mobile devices

### 4. Error Handling

- Modal thông báo lỗi rõ ràng
- Validation messages chi tiết
- User-friendly error messages

### 5. State Persistence

- Lưu trạng thái form khi reload trang
- Lưu ngôn ngữ đã chọn
- Lưu session đăng nhập

## BEST PRACTICES ĐÃ ÁP DỤNG

### Code Organization

- Component-based architecture
- Separation of concerns (SOA)
- Reusable components
- Type-safe với TypeScript

### Performance

- React.memo cho components
- useCallback/useMemo cho optimization
- Lazy loading cho routes
- Code splitting với Vite

### Security

- Protected routes
- Input validation
- XSS prevention
- CSRF protection (ready for backend)

### User Experience

- Loading states
- Error handling
- Responsive design
- Accessibility features

## TROUBLESHOOTING

### Lỗi thường gặp

**1. Port 5173 đã được sử dụng**

```bash
# Thay đổi port trong vite.config.ts
server: {
  port: 3000
}
```

**2. Lỗi cài đặt dependencies**

```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. TypeScript errors**

```bash
# Clear TypeScript cache
rm -rf node_modules/.tmp
npm run dev
```

## LIÊN HỆ & HỖ TRỢ

- **Repository**: https://github.com/JasonNguyen31/Midterm_SOA
- **Issues**: https://github.com/JasonNguyen31/Midterm_SOA/issues
- **Email**: 521h0185@student.tdtu.edu.vn

## LICENSE

Copyright © 2025 Ton Duc Thang University. All rights reserved.

Developed by TDT Software Team for educational purposes.

---

**Lưu ý**: Đây là dự án giáo dục với mock data. Không sử dụng cho mục đích thương mại hoặc production environment mà chưa có backend thực tế và các biện pháp bảo mật cần thiết.
