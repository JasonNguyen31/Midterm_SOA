-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 19, 2025 lúc 05:50 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `tuitionpayment`
--
CREATE DATABASE IF NOT EXISTS `tuitionpayment` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tuitionpayment`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `otps`
--

CREATE TABLE `otps` (
  `username` varchar(50) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `created_at` datetime NOT NULL,
  `expiry` datetime NOT NULL,
  `mssv` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payment_histories`
--

CREATE TABLE `payment_histories` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `mssv` varchar(50) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `date` datetime NOT NULL,
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payment_histories`
--

INSERT INTO `payment_histories` (`id`, `username`, `mssv`, `amount`, `date`, `status`) VALUES
(1, '521h0187', '521h0187', 15050000.00, '2025-10-01 10:00:00', 'success'),
(2, 'michael', '521h0185', 15050000.00, '2025-10-13 00:51:46', 'success'),
(3, 'michael', '521h0185', 150000.00, '2025-10-13 02:27:57', 'success'),
(4, 'michael', '521h0185', 15000000.00, '2025-10-13 02:45:06', 'success'),
(5, 'michael', '521h0185', 15000000.00, '2025-10-13 02:48:32', 'success'),
(6, 'michael', '521h0185', 1500000.00, '2025-10-13 02:50:39', 'success'),
(7, 'michael', '521h0185', 15000000.00, '2025-10-13 03:05:32', 'success'),
(8, 'michael', '521h0185', 150000.00, '2025-10-13 03:38:03', 'success'),
(9, 'michael', '521h0185', 150000.00, '2025-10-13 07:14:57', 'success'),
(10, 'michael', '521h0185', 150000.00, '2025-10-13 07:23:52', 'success');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `students`
--

CREATE TABLE `students` (
  `mssv` varchar(50) NOT NULL,
  `full_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `students`
--

INSERT INTO `students` (`mssv`, `full_name`) VALUES
('521h0185', 'Nguyen Van A'),
('521h0186', 'Tran Thi B'),
('521h0187', 'Le Van C');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tuition_debts`
--

CREATE TABLE `tuition_debts` (
  `mssv` varchar(50) NOT NULL,
  `amount_due` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tuition_debts`
--

INSERT INTO `tuition_debts` (`mssv`, `amount_due`) VALUES
('521h0185', 15050000.00),
('521h0186', 18359091.00),
('521h0187', 10000000000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `balance` decimal(15,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`username`, `password`, `full_name`, `phone`, `email`, `balance`) VALUES
('521h0185', '$2b$12$6mxgvZZCfbbhhjCCBzY2/u.Bh03K90B7lNoTMW52KDjSpULB0XAWK', 'Nguyen Van A', '0123456789', 'avaaioeoe@gmail.com', 25000000.00),
('521h0186', '$2b$12$0dFMU8jcEda.aqWnqKCuxeZWo/i8xGESaM9RL3IX/q5Rm7xEo3DhO', 'Tran Thi B', '0987654321', 'tranthib@example.com', 18000000.00),
('521h0187', '$2b$12$9K26EEAoS9WR6j6dJxfddOnVW8PBZEEHQyQv5eH9BF3heQrSoMhcO', 'Le Van C', '0912345678', 'levanc@example.com', 30000000.00),
('michael', '$2b$12$6mxgvZZCfbbhhjCCBzY2/u.Bh03K90B7lNoTMW52KDjSpULB0XAWK', 'Michael Smith', '0123456789', 'twilightcrmison@gmail.com', 97850000.00);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `otps`
--
ALTER TABLE `otps`
  ADD PRIMARY KEY (`username`);

--
-- Chỉ mục cho bảng `payment_histories`
--
ALTER TABLE `payment_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`),
  ADD KEY `mssv` (`mssv`);

--
-- Chỉ mục cho bảng `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`mssv`);

--
-- Chỉ mục cho bảng `tuition_debts`
--
ALTER TABLE `tuition_debts`
  ADD PRIMARY KEY (`mssv`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `payment_histories`
--
ALTER TABLE `payment_histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `otps`
--
ALTER TABLE `otps`
  ADD CONSTRAINT `otps_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`);

--
-- Các ràng buộc cho bảng `payment_histories`
--
ALTER TABLE `payment_histories`
  ADD CONSTRAINT `payment_histories_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `payment_histories_ibfk_2` FOREIGN KEY (`mssv`) REFERENCES `students` (`mssv`);

--
-- Các ràng buộc cho bảng `tuition_debts`
--
ALTER TABLE `tuition_debts`
  ADD CONSTRAINT `tuition_debts_ibfk_1` FOREIGN KEY (`mssv`) REFERENCES `students` (`mssv`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
