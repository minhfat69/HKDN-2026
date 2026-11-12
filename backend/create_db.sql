CREATE DATABASE IF NOT EXISTS `appdatmon` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `appdatmon`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) UNIQUE,
  `phone` varchar(20) UNIQUE NOT NULL,
  `username` varchar(40) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` text,
  `points` integer DEFAULT 0,
  `totalSpent` decimal(12,2) DEFAULT 0,
  `role` ENUM ('CUSTOMER', 'STAFF', 'KITCHEN', 'HOST', 'ADMIN') DEFAULT 'CUSTOMER',
  `tier` ENUM ('MEMBER', 'SILVER', 'GOLD', 'VIP') DEFAULT 'MEMBER',
  `membershipTier` ENUM ('BAC', 'VANG', 'VIP') DEFAULT 'BAC' COMMENT 'Mới thêm — UC09, UC25',
  `pinCode` varchar(255) COMMENT 'Mới thêm — mã PIN Admin duyệt hủy món, UC23.3',
  `status` ENUM ('ACTIVE', 'BLOCKED') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT = 'Quản lý toàn bộ tài khoản tương tác với hệ thống';

CREATE TABLE IF NOT EXISTS `restaurant_tables` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `tableNumber` integer UNIQUE NOT NULL,
  `qrCode` text NOT NULL,
  `capacity` integer DEFAULT 4,
  `status` ENUM ('AVAILABLE', 'BOOKED', 'OCCUPIED', 'CLEANING') DEFAULT 'AVAILABLE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `image` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `category_id` bigint NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `costPrice` decimal(10,2) DEFAULT 0 COMMENT 'Giá vốn nguyên liệu dự kiến — UC31',
  `image` text,
  `stock` integer DEFAULT 0,
  `isAvailable` boolean DEFAULT true,
  `isSecretMenu` boolean DEFAULT false COMMENT 'Món thuộc Menu ẩn dành riêng cho VIP — UC25',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `reservations` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `table_id` bigint,
  `guestName` varchar(255) NOT NULL,
  `guestPhone` varchar(255) NOT NULL,
  `reservationTime` timestamp NOT NULL,
  `numberOfGuests` integer DEFAULT 1,
  `note` text,
  `status` ENUM ('PENDING', 'CONFIRMED', 'ARRIVED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'EXPIRED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `vouchers` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `code` varchar(50) UNIQUE NOT NULL,
  `discountType` ENUM ('PERCENT', 'FIXED') DEFAULT 'FIXED',
  `discountValue` decimal(10,2) DEFAULT 0,
  `discountPercent` integer NOT NULL DEFAULT 0,
  `minOrderValue` decimal(12,2) DEFAULT 0,
  `maxDiscount` decimal(10,2),
  `usageLimit` integer DEFAULT 100,
  `maxUsage` integer DEFAULT 0 COMMENT '0 = không giới hạn',
  `usedCount` integer DEFAULT 0,
  `expiredAt` datetime,
  `expiryDate` date,
  `isActive` boolean DEFAULT true,
  `status` ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `table_id` bigint,
  `reservation_id` bigint,
  `voucher_id` bigint COMMENT 'Mới thêm — UC25.1',
  `voucherCode` varchar(50),
  `orderType` ENUM ('DINE_IN', 'DELIVERY', 'TAKEAWAY') DEFAULT 'DINE_IN' COMMENT 'Mới thêm — UC07',
  `deliveryAddress` text COMMENT 'Mới thêm — UC07, bắt buộc nếu orderType=DELIVERY',
  `recipientPhone` varchar(20) COMMENT 'SĐT người nhận Delivery — UC07',
  `totalPrice` decimal(10,2) NOT NULL,
  `discountAmount` decimal(10,2) DEFAULT 0,
  `finalPrice` decimal(10,2) NOT NULL,
  `pointsUsed` integer DEFAULT 0 COMMENT 'Mới thêm — UC25.1',
  `vatRate` decimal(5,2) DEFAULT 8 COMMENT 'Mới thêm — UC18',
  `vatAmount` decimal(10,2) DEFAULT 0 COMMENT 'Mới thêm — UC18',
  `note` text,
  `cancelReason` varchar(255),
  `isWaste` boolean DEFAULT false,
  `isRecipeDeducted` boolean DEFAULT false,
  `status` ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  `paymentStatus` ENUM ('UNPAID', 'PAID') DEFAULT 'UNPAID',
  `paymentMethod` varchar(50),
  `isPointsAdded` boolean DEFAULT false,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `order_id` bigint,
  `product_id` bigint,
  `quantity` integer NOT NULL DEFAULT 1,
  `unitPrice` decimal(10,2) NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `note` text,
  `status` ENUM ('WAITING', 'COOKING', 'DONE', 'CANCELLED') DEFAULT 'WAITING'
);

CREATE TABLE IF NOT EXISTS `payments` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `order_id` bigint,
  `amount` decimal(10,2) NOT NULL,
  `paymentMethod` varchar(50) NOT NULL DEFAULT 'CASH',
  `payment_method` ENUM ('CASH', 'PAYOS') DEFAULT 'CASH',
  `transactionCode` varchar(255) COMMENT 'Mã giao dịch cổng PayOS — đối soát Webhook UC24.2',
  `transaction_code` varchar(255) COMMENT 'Mã giao dịch cổng PayOS — đối soát Webhook UC24.2',
  `status` ENUM ('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
  `paidAt` timestamp NULL,
  `paid_at` timestamp NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `totalPrice` decimal(10,2) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `cart_id` bigint,
  `product_id` bigint,
  `quantity` integer DEFAULT 1,
  `unitPrice` decimal(10,2) NOT NULL,
  `note` text
);

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `phone` varchar(20),
  `dish_name` varchar(150),
  `content` text,
  `rating` integer NOT NULL,
  `status` ENUM ('VISIBLE', 'HIDDEN') DEFAULT 'VISIBLE' COMMENT 'Mới thêm — UC33 kiểm duyệt',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` ENUM ('ORDER', 'PAYMENT', 'POINT', 'PROMOTION', 'SYSTEM') DEFAULT 'SYSTEM',
  `is_read` boolean DEFAULT false,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `ingredients` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `barcode` varchar(100) UNIQUE,
  `name` varchar(150) UNIQUE NOT NULL,
  `unit` varchar(30) NOT NULL DEFAULT 'gram',
  `totalQuantity` decimal(12,2) DEFAULT 0,
  `currentStock` decimal(10,2) DEFAULT 0,
  `costPerUnit` decimal(10,2) DEFAULT 0,
  `minThreshold` decimal(12,2) DEFAULT 500,
  `minStock` decimal(10,2) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `inventory_batches` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `ingredient_id` bigint NOT NULL,
  `batchCode` varchar(100),
  `lotNumber` varchar(50),
  `barcode` varchar(100) COMMENT 'UC30.1 — quét mã vạch/QR',
  `quantityImported` decimal(12,2) DEFAULT 0,
  `quantityReceived` decimal(10,2) DEFAULT 0,
  `quantityRemaining` decimal(12,2) NOT NULL DEFAULT 0,
  `unit` varchar(20),
  `unitCost` decimal(10,2) DEFAULT 0 COMMENT 'Phục vụ báo cáo P&L — UC31',
  `mfgDate` date,
  `expDate` date COMMENT 'Dùng để gợi ý xuất kho FEFO — UC30.2',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `inventory_transactions` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `ingredient_id` bigint NOT NULL,
  `batch_id` bigint COMMENT 'Chỉ dùng khi type=OUT — lô bị trừ (FEFO)',
  `type` ENUM ('IN', 'OUT') NOT NULL DEFAULT 'IN',
  `quantity` decimal(10,2) NOT NULL DEFAULT 0,
  `unit` varchar(20) DEFAULT 'kg',
  `note` varchar(255),
  `transactionDate` date,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `recipes` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `ingredient_id` bigint NOT NULL,
  `amountRequired` decimal(10,2) NOT NULL DEFAULT 0,
  `quantityNeeded` decimal(10,2) DEFAULT 0,
  `unit` varchar(20) DEFAULT 'g',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `recipe_items` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `ingredient_id` bigint NOT NULL,
  `quantityNeeded` decimal(10,2) NOT NULL DEFAULT 0,
  `unit` varchar(20) DEFAULT 'g',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `waitlist` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `table_id` bigint COMMENT 'Mới thêm — bàn khách được xếp sau khi hết chờ',
  `guestName` varchar(100) NOT NULL,
  `guestPhone` varchar(20) NOT NULL,
  `partySize` integer NOT NULL DEFAULT 2,
  `note` text,
  `estimatedWaitMinutes` integer DEFAULT 0,
  `notifiedAt` datetime,
  `seatedAt` datetime,
  `status` ENUM ('WAITING', 'NOTIFIED', 'SEATED', 'CANCELLED', 'NO_SHOW') DEFAULT 'WAITING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `shifts` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `staff_id` bigint,
  `openedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `closedAt` timestamp NULL,
  `openingCash` decimal(12,2) DEFAULT 0,
  `closingCashActual` decimal(12,2),
  `closingCash` decimal(12,2),
  `expectedCash` decimal(12,2) DEFAULT 0,
  `discrepancy` decimal(12,2) DEFAULT 0,
  `difference` decimal(12,2),
  `status` ENUM ('OPEN', 'CLOSED') DEFAULT 'OPEN',
  `note` text
);

CREATE TABLE IF NOT EXISTS `void_logs` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `order_item_id` bigint NOT NULL,
  `type` ENUM ('VOID', 'WASTE') NOT NULL,
  `reason` varchar(255) NOT NULL,
  `quantity` integer DEFAULT 1,
  `authorizedBy` bigint NOT NULL COMMENT 'Admin xác nhận bằng PIN — UC23.3',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
ALTER TABLE `reservations` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `reservations` ADD FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`);
ALTER TABLE `orders` ADD FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`);
ALTER TABLE `order_items` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
ALTER TABLE `order_items` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `payments` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
ALTER TABLE `carts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `cart_items` ADD FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`);
ALTER TABLE `cart_items` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `reviews` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `notifications` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `inventory_batches` ADD FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`);
ALTER TABLE `inventory_transactions` ADD FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`);
ALTER TABLE `inventory_transactions` ADD FOREIGN KEY (`batch_id`) REFERENCES `inventory_batches` (`id`);
ALTER TABLE `recipes` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `recipes` ADD FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`);
ALTER TABLE `recipe_items` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `recipe_items` ADD FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`);
ALTER TABLE `waitlist` ADD FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`);
ALTER TABLE `shifts` ADD FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`);
ALTER TABLE `void_logs` ADD FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`);
ALTER TABLE `void_logs` ADD FOREIGN KEY (`authorizedBy`) REFERENCES `users` (`id`);
