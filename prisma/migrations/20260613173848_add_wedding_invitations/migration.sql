-- CreateTable: WeddingInvitation y WeddingRsvp
-- Aplicar en Hostinger desde phpMyAdmin o panel SSH

CREATE TABLE `WeddingInvitation` (
    `id`          VARCHAR(191) NOT NULL,
    `userId`      VARCHAR(191) NOT NULL,
    `slug`        VARCHAR(191) NOT NULL,
    `style`       ENUM('JARDIN', 'CIELO', 'ARENA') NOT NULL DEFAULT 'JARDIN',
    `nombre1`     VARCHAR(191) NOT NULL,
    `nombre2`     VARCHAR(191) NOT NULL,
    `frase`       TEXT NULL,
    `fecha`       DATETIME(3) NOT NULL,
    `hora`        VARCHAR(191) NOT NULL,
    `lugar`       VARCHAR(191) NOT NULL,
    `direccion`   VARCHAR(191) NULL,
    `mapsUrl`     VARCHAR(191) NULL,
    `musicaUrl`   VARCHAR(191) NULL,
    `dresscode`   VARCHAR(191) NULL,
    `regalos`     TEXT NULL,
    `fotoportada` VARCHAR(191) NULL,
    `fotos`       JSON NULL,
    `modules`     JSON NULL,
    `vistas`      INTEGER NOT NULL DEFAULT 0,
    `confirmados` INTEGER NOT NULL DEFAULT 0,
    `rechazados`  INTEGER NOT NULL DEFAULT 0,
    `pagado`      BOOLEAN NOT NULL DEFAULT false,
    `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`   DATETIME(3) NOT NULL,

    UNIQUE INDEX `WeddingInvitation_slug_key`(`slug`),
    INDEX `WeddingInvitation_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `WeddingRsvp` (
    `id`           VARCHAR(191) NOT NULL,
    `invitationId` VARCHAR(191) NOT NULL,
    `nombre`       VARCHAR(191) NOT NULL,
    `email`        VARCHAR(191) NULL,
    `telefono`     VARCHAR(191) NULL,
    `asistentes`   INTEGER NOT NULL DEFAULT 1,
    `status`       ENUM('CONFIRMED', 'DECLINED') NOT NULL,
    `mensaje`      TEXT NULL,
    `createdAt`    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WeddingRsvp_invitationId_idx`(`invitationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WeddingInvitation`
    ADD CONSTRAINT `WeddingInvitation_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeddingRsvp`
    ADD CONSTRAINT `WeddingRsvp_invitationId_fkey`
    FOREIGN KEY (`invitationId`) REFERENCES `WeddingInvitation`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;
