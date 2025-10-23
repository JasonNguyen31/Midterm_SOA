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
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Tài khoản demo](#tài-khoản-demo)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Thêm user mới](#thêm-user-mới-vào-hệ-thống)
- [Troubleshooting](#troubleshooting)
- [Thành viên nhóm](#thành-viên-nhóm)

## TỔNG QUAN

Dự án xây dựng phân hệ thanh toán học phí trực tuyến, là một phần của hệ thống iBanking. Ứng dụng cho phép sinh viên:

- Đăng nhập an toàn với xác thực username/password
- Tra cứu thông tin học phí theo mã sinh viên
- Thực hiện thanh toán học phí trực tuyến
- Có thể thanh toán học phí cho người khác
- Xác thực giao dịch qua mã OTP gửi email
- Hỗ trợ đa ngôn ngữ (Tiếng Việt/English)

## TÍNH NĂNG CHÍNH

### 1. Xác thực và bảo mật

- Đăng nhập với mã sinh viên và mật khẩu
- Password hashing với bcrypt
- Validation đầu vào với error handling
- Protected routes - bảo vệ các trang yêu cầu đăng nhập
- Session management với localStorage
- Xác thực OTP qua email với expiry 5 phút

### 2. Quản lý học phí

- Tra cứu học phí theo mã sinh viên từ database
- Hiển thị chi tiết: học phí, phí dịch vụ, tổng cộng
- Kiểm tra số dư khả dụng
- Hiển thị trạng thái thanh toán (Đã thanh toán/Chưa thanh toán)
- Cập nhật số dư realtime sau thanh toán

### 3. Thanh toán trực tuyến

- Form nhập thông tin thanh toán với validation
- Kiểm tra số dư trước khi thanh toán
- Xác nhận giao dịch với checkbox điều khoản
- Nhập mã OTP 6 số với đếm ngược thời gian
- Xử lý thành công/thất bại giao dịch
- Lưu lịch sử giao dịch vào database

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
| Axios            | Latest    | HTTP client                 |

### Backend Framework & Libraries

| Công nghệ        | Phiên bản | Mục đích            |
| ---------------- | --------- | ------------------- |
| Python           | 3.8+      | Backend runtime     |
| FastAPI          | Latest    | REST API framework  |
| uvicorn          | Latest    | ASGI server         |
| pymysql          | Latest    | MySQL connector     |
| bcrypt           | Latest    | Password hashing    |
| python-multipart | Latest    | Form data handling  |
| smtplib          | Built-in  | Email sending (OTP) |

### Database

| Công nghệ | Phiên bản | Mục đích            |
| --------- | --------- | ------------------- |
| MySQL     | 5.7+      | Relational database |
| XAMPP     | Latest    | Local server stack  |

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
- **API Communication**: Axios với async/await
- **Email Service**: Gmail SMTP với App Password

## YÊU CẦU HỆ THỐNG

### Frontend

```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Backend

```bash
Python >= 3.8
pip >= 21.0
```

### Database

```bash
MySQL >= 5.7 (đi kèm với XAMPP)
XAMPP (hoặc MySQL server riêng)
```

## CÀI ĐẶT VÀ CHẠY DỰ ÁN

### 1. Clone hoặc tải dự án về

```bash
git git clone -b App_v1 https://github.com/JasonNguyen31/Midterm_SOA.git folder_name
cd folder_name
```

### 2. Cài đặt Database

**Bước 1:** Mở XAMPP và start **Apache** và **MySQL**

**Bước 2:** Click vào nút **Admin** của MySQL để mở phpMyAdmin

**Bước 3:** Import database

1. Trong phpMyAdmin, click vào tab **Import**
2. Click **Choose File** và chọn file `tuitionpayment.sql`
3. Kéo xuống dưới và click nút **Go** để import

**Kết quả:** Database `tuitionpayment` cùng với tất cả các bảng và dữ liệu mẫu sẽ được tạo tự động.

> **Lưu ý:** File SQL đã bao gồm lệnh `CREATE DATABASE`, bạn không cần tạo database thủ công.

### 3. Cài đặt Dependencies

**Frontend:**

```bash
npm install
```

**Backend:**

```bash
pip install fastapi uvicorn pymysql bcrypt python-multipart
```

### 4. Chạy Development Servers

Mở **2 tab Terminal/Command Prompt** (cả hai đều ở thư mục `folder_name`)

#### Tab 1: Frontend

```bash
npm run dev
```

✅ Frontend sẽ chạy tại: `http://localhost:5173`

#### Tab 2: Backend

```bash
python app.py
```

_(Chương trình sẽ tự động chạy uvicorn server)_

✅ Backend sẽ chạy tại: `http://localhost:8000`

**Kiểm tra Backend:**

- API Documentation (Swagger UI): http://localhost:8000/docs
- Alternative docs (ReDoc): http://localhost:8000/redoc

**Lưu ý quan trọng:**

- Đảm bảo MySQL trong XAMPP đang chạy
- Port 5173 và 8000 chưa được sử dụng
- Chờ backend khởi động xong trước khi thao tác trên frontend

### 5. Build Production

```bash
npm run build
```

### 6. Preview Production Build

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
midtermsoa/
├── app.py                    # Backend FastAPI server
├── add_user.py              # Script thêm user vào database
├── tuitionpayment.sql       # Database schema & sample data
├── public/                   # Static assets
│   └── fonts/               # Font files
├── src/
│   ├── components/          # React components
│   │   ├── common/         # Shared components
│   │   │   ├── Button/     # Button component
│   │   │   └── Modal/      # Modal components
│   │   └── payment/        # Payment-specific components
│   │       ├── PayerInfo/  # Thông tin người nộp
│   │       ├── TuitionInfo/ # Thông tin học phí
│   │       ├── PaymentDetails/ # Chi tiết thanh toán
│   │       └── PaymentForm/ # Form thanh toán chính
│   ├── data/                # Mock data interfaces (legacy)
│   │   ├── mockData.ts     # Type definitions
│   │   └── index.ts        # Data exports
│   ├── hooks/               # Custom React hooks
│   │   └── useDocumentTitle.ts
│   ├── pages/               # Page components
│   │   ├── Login/          # Trang đăng nhập
│   │   └── TuitionPayment/ # Trang thanh toán
│   ├── services/            # Business logic layer
│   ├── styles/              # Global styles
│   │   └── global.css      # Global CSS & Tailwind
│   ├── types/               # TypeScript definitions
│   │   ├── auth.types.ts   # Authentication types
│   │   └── payment.types.ts # Payment types
│   ├── utils/               # Utility functions
│   │   ├── auth.ts         # Authentication logic
│   │   ├── constants.ts    # App constants
│   │   └── languageService.ts # i18n service
│   ├── App.tsx              # Root component với routing
│   └── main.tsx             # Application entry point
├── index.html               # HTML template
├── package.json             # Frontend dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── eslint.config.js         # ESLint configuration
└── README.md                # Documentation
```

## KIẾN TRÚC HỆ THỐNG

### Kiến trúc SOA (Service Oriented Architecture)

```
┌─────────────────────────────────────────────┐
│           PRESENTATION LAYER                │
│       (Pages & Components - UI/UX)          │
│   - Login Page                              │
│   - TuitionPayment Page                     │
│   - Reusable Components                     │
├─────────────────────────────────────────────┤
│           BUSINESS LOGIC LAYER              │
│        (Utils, Hooks, Auth Logic)           │
│   - Authentication Service                  │
│   - Language Service                        │
│   - Form Validation                         │
├─────────────────────────────────────────────┤
│              SERVICE LAYER                  │
│       (API Services, Data Services)         │
│   - FastAPI REST Endpoints                  │
│   - Email Service (OTP)                     │
│   - Database Access Layer                   │
├─────────────────────────────────────────────┤
│               DATA LAYER                    │
│       (Database, Types, Constants)          │
│   - MySQL Database                          │
│   - TypeScript Interfaces                   │
│   - Application Constants                   │
└─────────────────────────────────────────────┘
```

### Component Architecture

**Common Components** (Reusable)

- **Button**: Custom button với disabled state và loading
- **ErrorModal**: Modal hiển thị thông báo lỗi thân thiện

**Payment Components** (Feature-specific)

- **PayerInfo**: Hiển thị thông tin người nộp tiền (readonly)
- **TuitionInfo**: Tra cứu và hiển thị học phí theo MSSV
- **PaymentDetails**: Chi tiết thanh toán, số dư, và điều khoản
- **PaymentForm**: Component chính quản lý toàn bộ payment flow

### State Management

- **Local State**: useState cho component state
- **Refs**: useRef để tương tác với child components
- **Persistence**: localStorage cho session và language preference
- **Context**: Language service với event-driven updates
- **API State**: Axios với async/await pattern

### Routing Structure

```
/ (Login)
└── /tuition-payment (Protected)
    └── requires authentication
    └── auto-redirect to login if not authenticated
```

## DATABASE SCHEMA

### Bảng: `users` (Khách hàng)

Lưu thông tin người dùng và số dư tài khoản

| Column    | Type          | Description            |
| --------- | ------------- | ---------------------- |
| username  | VARCHAR(50)   | PK - Tên đăng nhập     |
| password  | VARCHAR(255)  | Mật khẩu (bcrypt hash) |
| full_name | VARCHAR(100)  | Họ tên đầy đủ          |
| phone     | VARCHAR(20)   | Số điện thoại          |
| email     | VARCHAR(100)  | Email                  |
| balance   | DECIMAL(15,2) | Số dư khả dụng (VNĐ)   |

### Bảng: `students` (Sinh viên)

Lưu thông tin cơ bản sinh viên

| Column    | Type         | Description      |
| --------- | ------------ | ---------------- |
| mssv      | VARCHAR(50)  | PK - Mã số SV    |
| full_name | VARCHAR(100) | Họ tên sinh viên |

### Bảng: `tuition_debts` (Công nợ học phí)

Lưu số tiền học phí còn nợ của từng sinh viên

| Column     | Type          | Description            |
| ---------- | ------------- | ---------------------- |
| mssv       | VARCHAR(50)   | PK, FK - Mã số SV      |
| amount_due | DECIMAL(15,2) | Số tiền học phí còn nợ |

### Bảng: `otps` (Mã OTP tạm thời)

Lưu mã OTP cho xác thực giao dịch

| Column     | Type        | Description               |
| ---------- | ----------- | ------------------------- |
| username   | VARCHAR(50) | PK, FK - User             |
| otp        | VARCHAR(6)  | Mã OTP 6 số               |
| created_at | DATETIME    | Thời gian tạo             |
| expiry     | DATETIME    | Thời gian hết hạn         |
| mssv       | VARCHAR(50) | Mã SV liên quan giao dịch |

### Bảng: `payment_histories` (Lịch sử giao dịch)

Lưu tất cả các giao dịch thanh toán

| Column   | Type          | Description                 |
| -------- | ------------- | --------------------------- |
| id       | INT           | PK, Auto Increment          |
| username | VARCHAR(50)   | FK - Người thanh toán       |
| mssv     | VARCHAR(50)   | FK - SV được thanh toán     |
| amount   | DECIMAL(15,2) | Số tiền giao dịch           |
| date     | DATETIME      | Ngày giờ giao dịch          |
| status   | VARCHAR(20)   | Trạng thái (success/failed) |

### Relationships

- `users.username` → `otps.username` (1:1)
- `users.username` → `payment_histories.username` (1:N)
- `students.mssv` → `tuition_debts.mssv` (1:1)
- `students.mssv` → `payment_histories.mssv` (1:N)

## API ENDPOINTS

Backend cung cấp các REST API endpoints:

### Authentication

#### POST `/api/login`

Xác thực người dùng và tạo session

**Request Body:**

```json
{
  "username": "521h0185",
  "password": "123456"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "username": "521h0185",
    "name": "Nguyen Van A"
  }
}
```

**Response (Error):**

```json
{
  "detail": "Invalid username or password"
}
```

### User Management

#### GET `/api/user/{username}`

Lấy thông tin chi tiết của user

**Response:**

```json
{
  "username": "521h0185",
  "full_name": "Nguyen Van A",
  "phone": "0123456789",
  "email": "avaaioeoe@gmail.com",
  "balance": 25000000.0
}
```

### Student Information

#### GET `/api/student/{mssv}`

Lấy thông tin sinh viên và học phí còn nợ

**Response:**

```json
{
  "mssv": "521h0185",
  "full_name": "Nguyen Van A",
  "amount_due": 15050000.0
}
```

### OTP & Payment

#### POST `/api/generate-otp`

Tạo mã OTP và gửi qua email

**Request Body:**

```json
{
  "username": "521h0185",
  "mssv": "521h0185"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP generated and sent"
}
```

#### POST `/api/verify-otp`

Xác thực mã OTP

**Request Body:**

```json
{
  "username": "521h0185",
  "mssv": "521h0185",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP verified"
}
```

#### POST `/api/payment`

Xử lý thanh toán học phí

**Request Body:**

```json
{
  "username": "521h0185",
  "mssv": "521h0185",
  "amount": 15050000.0
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment processed successfully"
}
```

### Utility

#### POST `/api/add-user`

Thêm user mới vào hệ thống (Admin only)

**Request Body:**

```json
{
  "username": "newuser",
  "full_name": "New User",
  "phone": "0123456789",
  "email": "newuser@example.com",
  "password": "password123",
  "balance": 10000000.0
}
```

---

**📚 API Documentation:**

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## CẤU HÌNH MÔI TRƯỜNG

### Database Configuration (trong app.py)

```python
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",      # ⚠️ Để trống cho XAMPP mặc định
    "database": "tuitionpayment",
    "port": 3306
}
```

### Email Configuration (trong app.py)

```python
EMAIL_SENDER = "guidervirus****@gmail.com"
EMAIL_PASSWORD = "ttay **** **** ****"  # App Password
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
```

**⚠️ LƯU Ý BẢO MẬT:**

- Email credentials hiện tại chỉ dùng cho **development/demo**
- Credentials trên đã được mask/thay đổi
- **KHÔNG** commit credentials thật lên Git trong production
- Người dùng cần tạo App Password riêng của mình
- Gmail yêu cầu **App Password**, không dùng password thường

### CORS Configuration (trong app.py)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Lưu ý:** Thay đổi `allow_origins` khi deploy production

## TÀI KHOẢN DEMO

### Tài khoản 1 (Sinh viên - Có học phí chưa thanh toán)

```
Mã sinh viên: 521h0185
Mật khẩu: 123456
Số dư khả dụng: 25,000,000 VNĐ
Học phí còn nợ: 15,050,000 VNĐ
Email: avaaioeoe@gmail.com
```

### Tài khoản 2 (Sinh viên - Có học phí chưa thanh toán)

```
Mã sinh viên: 521h0186
Mật khẩu: abc123
Số dư khả dụng: 18,000,000 VNĐ
Học phí còn nợ: 18,359,091 VNĐ
Email: tranthib@example.com
```

### Tài khoản 3 (Sinh viên - Số dư cao, học phí rất lớn)

```
Mã sinh viên: 521h0187
Mật khẩu: pass123
Số dư khả dụng: 30,000,000 VNĐ
Học phí còn nợ: 10,000,000,000 VNĐ
Email: levanc@example.com
Lưu ý: Học phí quá lớn để test trường hợp số dư không đủ
```

### Tài khoản 4 (Khách hàng - Không phải sinh viên)

```
Username: michael
Mật khẩu: 123456
Số dư khả dụng: 97,850,000 VNĐ
Email: twilightcrmison@gmail.com
Lưu ý: Đây là tài khoản khách hàng, có thể thanh toán học phí cho sinh viên khác
```

## HƯỚNG DẪN SỬ DỤNG

### 1. Đăng nhập

1. Mở ứng dụng tại `http://localhost:5173`
2. Nhập mã sinh viên hoặc username (ví dụ: `521h0185` hoặc `michael`)
3. Nhập mật khẩu (ví dụ: `123456`)
4. Click nút "ĐĂNG NHẬP"
5. Hệ thống sẽ xác thực và chuyển đến trang thanh toán

### 2. Tra cứu học phí

1. Sau khi đăng nhập, vào trang "Thanh toán học phí"
2. Nhập mã sinh viên cần tra cứu vào ô "Mã sinh viên"
3. Nhấn **Enter** hoặc click ra ngoài
4. Hệ thống tự động hiển thị:
   - Họ tên sinh viên
   - Số tiền học phí còn nợ
   - Trạng thái thanh toán

### 3. Thanh toán học phí

#### Bước 1: Kiểm tra thông tin

- **Thông tin người nộp**: Hiển thị tự động (readonly)
- **Thông tin sinh viên**: Nhập MSSV để tra cứu
- **Số dư khả dụng**: Hiển thị số dư hiện tại
- **Học phí cần thanh toán**: Tự động hiển thị sau khi tra cứu

#### Bước 2: Xác nhận điều khoản

- Tick vào checkbox "Tôi đồng ý với các điều khoản"
- Nút "XÁC NHẬN GIAO DỊCH" sẽ được kích hoạt

#### Bước 3: Nhận mã OTP

1. Click nút "XÁC NHẬN GIAO DỊCH"
2. Hệ thống kiểm tra:
   - Thông tin sinh viên hợp lệ
   - Số dư đủ để thanh toán
   - Học phí còn nợ > 0
3. Mã OTP 6 số được gửi đến email của user
4. Form nhập OTP xuất hiện với đếm ngược 5 phút

#### Bước 4: Nhập OTP và thanh toán

1. Kiểm tra email và lấy mã OTP 6 số
2. Nhập từng số vào 6 ô tương ứng
3. Click nút "THANH TOÁN" khi đã nhập đủ 6 số
4. Hệ thống xử lý:
   - Xác thực OTP
   - Trừ số dư người nộp
   - Cập nhật học phí về 0
   - Lưu lịch sử giao dịch
   - Gửi email xác nhận
5. Thông báo thành công và tự động reload form

**Lưu ý về OTP:**

- Mã OTP có hiệu lực **5 phút**
- Được phép nhập sai tối đa **3 lần**
- Nếu hết thời gian hoặc sai quá 3 lần, cần bắt đầu lại
- Có thể click "Gửi lại mã OTP" nếu cần

### 4. Chuyển đổi ngôn ngữ

1. Click vào icon cờ ở góc trên bên phải
2. Hệ thống hỗ trợ:
   - 🇻🇳 Tiếng Việt (mặc định)
   - 🇬🇧 English
3. Ngôn ngữ được lưu tự động vào localStorage
4. Áp dụng cho cả hai trang (Login & Payment)

### 5. Đăng xuất

1. Click vào icon đăng xuất (logout) ở góc trên bên phải
2. Hệ thống sẽ:
   - Xóa session khỏi localStorage
   - Reset form state
   - Quay về trang đăng nhập

## THÊM USER MỚI VÀO HỆ THỐNG

### Cách 1: Sử dụng Python Script

```bash
python add_user.py <username> <full_name> <phone> <email> <balance>
```

**Ví dụ:**

```bash
python add_user.py john_doe "John Doe" "0901234567" "john@example.com" 5000000
# Hệ thống sẽ prompt yêu cầu nhập password
Enter password for the new user: ********
```

**Output:**

```
User john_doe added successfully!
```

### Cách 2: Sử dụng API Endpoint

**Request:**

```bash
POST http://localhost:8000/api/add-user
Content-Type: application/json

{
  "username": "john_doe",
  "full_name": "John Doe",
  "phone": "0901234567",
  "email": "john@example.com",
  "password": "your_password",
  "balance": 5000000
}
```

**Response:**

```json
{
  "success": true,
  "message": "User john_doe added successfully"
}
```

### Cách 3: Thêm trực tiếp vào Database

1. Mở phpMyAdmin
2. Chọn database `tuitionpayment`
3. Chọn bảng `users`
4. Click **Insert** và điền thông tin
5. Với password, cần hash bằng bcrypt trước

**Lưu ý:** Password phải được hash bằng bcrypt. Khuyến nghị dùng Cách 1 hoặc 2.

## TÍNH NĂNG ĐẶC BIỆT

### 1. Xác thực OTP - Chi tiết Flow

**Quy trình xử lý OTP:**

1. **User click "XÁC NHẬN GIAO DỊCH"**

   - Frontend gửi request đến `/api/generate-otp`
   - Request body: `{username, mssv}`

2. **Backend tạo OTP**

   - Generate random 6 số
   - Tính expiry = hiện tại + 5 phút
   - Lưu vào bảng `otps`

3. **Gửi email**

   - Kết nối Gmail SMTP (port 587)
   - Gửi email chứa mã OTP
   - Email template: "Your OTP code is XXXXXX. It expires in 5 minutes."

4. **Frontend hiển thị form OTP**

   - 6 ô input riêng biệt
   - Countdown timer 5 phút (300 giây)
   - Auto-focus vào ô tiếp theo khi nhập
   - Backspace để quay lại ô trước

5. **User nhập OTP**

   - Có thể sai tối đa 3 lần
   - Mỗi lần sai: counter tăng, xóa input
   - Lần thứ 4: Block và reload trang

6. **Backend verify OTP**

   - Check OTP khớp với database
   - Check chưa hết hạn (expiry > NOW())
   - Nếu hợp lệ: Xóa OTP khỏi database

7. **Xử lý thanh toán**

   - BEGIN TRANSACTION
   - Trừ số dư user: `UPDATE users SET balance = balance - amount`
   - Cập nhật học phí: `UPDATE tuition_debts SET amount_due = 0`
   - Lưu lịch sử: `INSERT INTO payment_histories`
   - COMMIT TRANSACTION
   - Gửi email xác nhận thành công

8. **Frontend cập nhật**
   - Hiển thị thông báo thành công
   - Fetch lại user data (balance mới)
   - Reset form về trạng thái ban đầu
   - Clear localStorage state

**Bảo mật:**

- ✅ OTP chỉ có hiệu lực 5 phút
- ✅ Tối đa 3 lần nhập sai → reload trang
- ✅ OTP bị xóa sau khi verify thành công (one-time use)
- ✅ Mỗi giao dịch có OTP riêng biệt
- ✅ Email được mã hóa qua TLS/STARTTLS

### 2. Validation đầy đủ

**Frontend Validation:**

- Kiểm tra thông tin sinh viên tồn tại
- So sánh tên sinh viên nhập vào với database
- Kiểm tra số dư trước khi giao dịch
- Kiểm tra học phí > 0
- Xác thực checkbox điều khoản đã tick

**Backend Validation:**

- Verify username tồn tại
- Verify password với bcrypt
- Check student MSSV tồn tại
- Check balance đủ để thanh toán
- Check amount khớp với tuition debt
- Validate OTP format (6 số)
- Check OTP chưa expired

### 3. Responsive Design

**Breakpoints:**

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile-specific features:**

- Ẩn sidebar màu đỏ trên Login page
- Stack form elements vertically
- Touch-friendly button sizes (min 44x44px)
- Larger font sizes cho input fields

### 4. Error Handling

**Error Modal hiển thị cho:**

- Sai username/password
- Không tìm thấy sinh viên
- Số dư không đủ
- OTP không đúng hoặc hết hạn
- Lỗi kết nối database
- Lỗi gửi email
- Lỗi network

**User-friendly messages:**

- Tiếng Việt và English
- Không expose technical details
- Gợi ý hành động tiếp theo

### 5. State Persistence

**Lưu vào localStorage:**

- User session (username, name)
- Language preference (vi/en)
- Payment form state khi reload:
  - Student ID đã nhập
  - Student name
  - Searched student data
  - Terms accepted checkbox
  - OTP input state
  - Countdown timer

**Auto-restore:**

- Khi reload trang Payment
- Tránh mất dữ liệu khi refresh
- Clear state sau thanh toán thành công

## BEST PRACTICES ĐÃ ÁP DỤNG

### Code Organization

- ✅ Component-based architecture
- ✅ Separation of concerns (SOA)
- ✅ Reusable components với props và types
- ✅ Type-safe với TypeScript
- ✅ Consistent naming conventions
- ✅ Clear folder structure

### Performance

- ✅ useCallback/useMemo cho optimization
- ✅ Lazy loading cho routes có thể thêm
- ✅ Code splitting với Vite
- ✅ Optimize re-renders với proper state management

### Security

- ✅ Protected routes với authentication check
- ✅ Input validation frontend & backend
- ✅ XSS prevention với React (auto-escape)
- ✅ CSRF protection ready (token có thể thêm)
- ✅ Password hashing với bcrypt
- ✅ OTP expiry và rate limiting
- ✅ Không expose sensitive data trong frontend

### User Experience

- ✅ Loading states cho async operations
- ✅ Comprehensive error handling
- ✅ Responsive design cho mọi device
- ✅ Accessibility features
- ✅ Smooth transitions và animations
- ✅ Clear feedback cho user actions
- ✅ Keyboard navigation support (Tab, Enter, Backspace)

### Code Quality

- ✅ ESLint cho code linting
- ✅ TypeScript cho type safety
- ✅ Consistent code formatting
- ✅ Comments cho complex logic
- ✅ Clear variable và function names

## TROUBLESHOOTING

### Lỗi thường gặp

#### 1. Port 5173 đã được sử dụng

```bash
Error: Port 5173 is already in use
```

**Giải pháp:**

```typescript
// Thay đổi port trong vite.config.ts
export default defineConfig({
  server: {
    port: 3000, // Hoặc port khác
  },
});
```

#### 2. Port 8000 đã được sử dụng

```bash
ERROR: [Errno 48] Address already in use
```

**Giải pháp:**

```python
# Trong app.py, dòng cuối cùng
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Đổi port
```

Hoặc kill process đang dùng port:

```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

#### 3. Lỗi cài đặt dependencies

```bash
npm ERR! code ERESOLVE
```

**Giải pháp:**

```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Hoặc force install
npm install --force
```

#### 4. Lỗi kết nối Database

```bash
pymysql.err.OperationalError: (2003, "Can't connect to MySQL server on 'localhost'")
```

**Giải pháp:**

- ✅ Kiểm tra XAMPP MySQL đã start chưa
- ✅ Kiểm tra port 3306 chưa bị chiếm
- ✅ Kiểm tra DB_CONFIG trong app.py
- ✅ Test connection: `mysql -u root -p` trong terminal

#### 5. Lỗi gửi email OTP

```bash
SMTPAuthenticationError: (535, b'5.7.8 Username and Password not accepted')
```

**Giải pháp:**

1. Sử dụng **App Password** thay vì password Gmail thường
2. Tạo App Password:
   - Vào Google Account Settings
   - Security → 2-Step Verification
   - App passwords → Generate
3. Copy App Password vào `EMAIL_PASSWORD` trong app.py
4. Đảm bảo "Less secure app access" đã bật (nếu cần)

Hoặc lỗi:

```bash
Error sending email: [Errno 61] Connection refused
```

**Giải pháp:**

- Kiểm tra internet connection
- Kiểm tra firewall không block port 587
- Thử SMTP port khác (465 cho SSL)

#### 6. CORS Error

```bash
Access to XMLHttpRequest blocked by CORS policy
```

**Giải pháp:**

- ✅ Kiểm tra backend đang chạy tại `http://localhost:8000`
- ✅ Kiểm tra frontend đang chạy tại `http://localhost:5173`
- ✅ Kiểm tra CORS config trong app.py:

```python
allow_origins=["http://localhost:5173"]  # Phải khớp với frontend URL
```

#### 7. TypeScript errors

```bash
error TS2307: Cannot find module
```

**Giải pháp:**

```bash
# Clear TypeScript cache
rm -rf node_modules/.tmp
rm -rf node_modules/.vite

# Reinstall
npm install

# Restart dev server
npm run dev
```

#### 8. Database không có data

**Giải pháp:**

1. Re-import file `tuitionpayment.sql`
2. Hoặc chạy lại từng bảng:

```bash
# Trong phpMyAdmin, chọn database tuitionpayment
# Vào tab SQL và paste nội dung file tuitionpayment.sql
```

#### 9. OTP không nhận được email

**Checklist:**

- ✅ Kiểm tra email credentials trong app.py
- ✅ Kiểm tra spam folder trong email
- ✅ Kiểm tra email đúng trong database
- ✅ Kiểm tra console log trong terminal backend
- ✅ Test gửi email thủ công

#### 10. Session mất sau khi reload

**Giải pháp:**

- Kiểm tra localStorage có data không:

```javascript
// Trong browser console
localStorage.getItem("user");
localStorage.getItem("paymentFormState");
```

- Nếu null: Problem với authentication flow
- Clear cache và login lại

#### 11. Module not found (Python)

```bash
ModuleNotFoundError: No module named 'fastapi'
```

**Giải pháp:**

```bash
# Kiểm tra pip đang dùng Python version nào
which python
which pip

# Reinstall packages
pip install fastapi uvicorn pymysql bcrypt python-multipart

# Hoặc dùng pip3 nếu có nhiều Python version
pip3 install fastapi uvicorn pymysql bcrypt python-multipart
```

#### 12. Password bcrypt không khớp

**Giải pháp:**

- Đảm bảo password trong database đã được hash bằng bcrypt
- Kiểm tra format hash: `$2b$12$...` (60 ký tự)
- Re-add user bằng script add_user.py
- Không nhập password plain text vào database

### Debugging Tips

1. **Check Backend Logs:**

```bash
# Terminal chạy backend sẽ hiển thị tất cả requests
# Xem status code, error messages, database queries
```

2. **Check Browser Console:**

```bash
# F12 → Console tab
# Xem network requests, errors, state logs
```

3. **Check Network Tab:**

```bash
# F12 → Network tab
# Xem API requests/responses, status codes
# Check request payload và response data
```

4. **Database Queries:**

```sql
-- Trong phpMyAdmin
SELECT * FROM users WHERE username = '521h0185';
SELECT * FROM students WHERE mssv = '521h0185';
SELECT * FROM tuition_debts WHERE mssv = '521h0185';
SELECT * FROM otps WHERE username = '521h0185';
SELECT * FROM payment_histories ORDER BY date DESC LIMIT 10;
```

## LIÊN HỆ & HỖ TRỢ

- **Repository**: https://github.com/JasonNguyen31/Midterm_SOA
- **Issues**: https://github.com/JasonNguyen31/Midterm_SOA/issues
- **Email**: 521h0185@student.tdtu.edu.vn

## THÀNH VIÊN NHÓM

- **Nguyễn Hoàng Việt** - 521H0185
- **Nguyễn Ngọc Nghĩa** - 523H0062
- **Nguyễn Ngọc Trinh Nghi** - 523H0061

## LICENSE

Copyright © 2025 Ton Duc Thang University. All rights reserved.

Developed by TDT Software Team for educational purposes.

---

## LƯU Ý QUAN TRỌNG

⚠️ **Đây là dự án giáo dục với mục đích học tập**

**KHÔNG sử dụng cho:**

- ❌ Mục đích thương mại
- ❌ Production environment thực tế
- ❌ Xử lý dữ liệu người dùng thật
- ❌ Giao dịch tài chính thật

**CẦN BỔ SUNG trước khi production:**

- 🔐 Environment variables cho sensitive data
- 🔐 HTTPS/SSL certificates
- 🔐 Rate limiting và DDoS protection
- 🔐 Logging và monitoring system
- 🔐 Backup và disaster recovery
- 🔐 Security audit và penetration testing
- 🔐 Terms of Service và Privacy Policy
- 🔐 Compliance với các quy định (GDPR, v.v.)

---

**Phiên bản:** 1.0.0  
**Cập nhật:** October 2025  
**Branch:** App_v1
