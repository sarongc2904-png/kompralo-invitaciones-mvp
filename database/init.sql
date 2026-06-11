-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'CLIENT') NOT NULL DEFAULT 'CLIENT',
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Template` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `previewUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `templateId` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `honoree` VARCHAR(191) NOT NULL,
    `eventDate` DATETIME(3) NOT NULL,
    `eventTime` VARCHAR(191) NOT NULL,
    `venue` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `mapsUrl` VARCHAR(191) NULL,
    `musicUrl` VARCHAR(191) NULL,
    `dressCode` VARCHAR(191) NULL,
    `giftTable` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `heroImage` VARCHAR(191) NULL,
    `gallery` JSON NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Event_slug_key`(`slug`),
    INDEX `Event_ownerId_idx`(`ownerId`),
    INDEX `Event_templateId_idx`(`templateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guest` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `seats` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('PENDING', 'CONFIRMED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Guest_eventId_idx`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rsvp` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `guestId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'DECLINED') NOT NULL,
    `message` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Rsvp_eventId_idx`(`eventId`),
    INDEX `Rsvp_guestId_idx`(`guestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `eventId` VARCHAR(191) NULL,
    `provider` ENUM('STRIPE', 'MERCADO_PAGO') NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'FAILED', 'CANCELED') NOT NULL DEFAULT 'PENDING',
    `planId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'mxn',
    `providerRef` VARCHAR(191) NULL,
    `checkoutUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordResetToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `Template`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guest` ADD CONSTRAINT `Guest_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rsvp` ADD CONSTRAINT `Rsvp_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rsvp` ADD CONSTRAINT `Rsvp_guestId_fkey` FOREIGN KEY (`guestId`) REFERENCES `Guest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;



INSERT INTO `User` (`id`, `name`, `email`, `passwordHash`, `role`, `createdAt`, `updatedAt`) VALUES ('admin-user', 'Admin Kompralo', 'admin@kompralo.com.mx', '$2b$10$V1wCbXSz/0YFQCsHCXDQ8e5/v9CjCaE9WGN2VVloSmNVz9Py4OqUO', 'ADMIN', NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `role`=VALUES(`role`), `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('xv-rosa-dorado', 'Rosa Dorado', 'XV años', 'Rosa champagne, oro fino', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80', '/demo/xv', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('xv-royal-blue', 'Royal Blue', 'XV años', 'Azul real, plata', 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80', '/demo/xv', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('xv-princess-gold', 'Princess Gold', 'XV años', 'Marfil, oro, blush', 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80', '/demo/xv', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('boda-black-gold', 'Black Gold', 'Bodas', 'Negro, oro, blanco', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80', '/demo/boda', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('boda-white-floral', 'White Floral', 'Bodas', 'Blanco floral, verde suave', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80', '/demo/boda', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('boda-olive-luxury', 'Olive Luxury', 'Bodas', 'Olivo, crema, oro', 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80', '/demo/boda', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('bautizo-classic-beige', 'Classic Beige', 'Bautizos', 'Beige clasico, blanco', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80', '/demo/bautizo', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('bautizo-sky-blue', 'Sky Blue', 'Bautizos', 'Azul cielo, perla', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80', '/demo/bautizo', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('bautizo-minimal-white', 'Minimal White', 'Bautizos', 'Blanco, dorado tenue', 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=900&q=80', '/demo/bautizo', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('cumple-neon-party', 'Neon Party', 'Cumpleaños', 'Neon, negro, magenta', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80', '/demo/cumple', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('cumple-black-premium', 'Black Premium', 'Cumpleaños', 'Negro, champagne', 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=900&q=80', '/demo/cumple', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
INSERT INTO `Template` (`id`, `name`, `category`, `description`, `imageUrl`, `previewUrl`, `isActive`, `createdAt`, `updatedAt`) VALUES ('cumple-tropical-luxury', 'Tropical Luxury', 'Cumpleaños', 'Tropical, oro, coral', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80', '/demo/cumple', true, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `category`=VALUES(`category`), `description`=VALUES(`description`), `imageUrl`=VALUES(`imageUrl`), `previewUrl`=VALUES(`previewUrl`), `isActive`=true, `updatedAt`=NOW(3);
