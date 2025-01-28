"""First migration

Revision ID: 2025_01_24_170508
Revises:
Create Date: 2025-01-24 17:05:10.853346

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "2025_01_24_170508"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE `roles` (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `name` VARCHAR(50) NOT NULL UNIQUE,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    """)
    op.execute("""
        INSERT INTO `roles` (`id`, `name`)
        VALUES
            (1, 'admin'),
            (2, 'staff'),
            (3, 'client');
               """)

    op.execute("""
        CREATE TABLE `personal_infos` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        `phone_number` VARCHAR(255) NOT NULL,
        `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `deleted_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
""")
    op.execute("""
        CREATE TABLE `users` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        `role_id` INT UNSIGNED COLLATE utf8mb4_unicode_ci NOT NULL,
        `personal_info_id` BIGINT UNSIGNED COLLATE utf8mb4_unicode_ci NOT NULL,
        `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `deleted_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `users_email_unique` (`email`),
        KEY `roles_users_foreign` (`role_id`),
        CONSTRAINT `roles_users_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`),
        KEY `user_personal_info` (`personal_info_id`),
        CONSTRAINT `user_personal_info` FOREIGN KEY (`personal_info_id`) REFERENCES `personal_infos`(`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
""")
    op.execute("""
        CREATE TABLE `guests` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        `user_id` BIGINT UNSIGNED COLLATE utf8mb4_unicode_ci,
        `personal_info_id` BIGINT UNSIGNED COLLATE utf8mb4_unicode_ci NOT NULL,
        `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `deleted_at` timestamp NULL DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `guests_users_foreign` (`user_id`),
        CONSTRAINT `guests_users_foreign` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
        KEY `guest_personal_info` (`personal_info_id`),
        CONSTRAINT `guest_personal_info` FOREIGN KEY (`personal_info_id`) REFERENCES `personal_infos`(`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
""")
    op.execute("""
        CREATE TABLE `rooms` (
            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `room_number` INT UNSIGNED NOT NULL,
            `name` VARCHAR(255) NULL,
            `room_type` VARCHAR(50) NULL,
            `price_per_night` FLOAT NOT NULL,
            `capacity` INT UNSIGNED NOT NULL,
            `description` TEXT COLLATE utf8mb4_unicode_ci NULL,
            `deleted_at` TIMESTAMP NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            CHECK (capacity > 0)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
""")
    op.execute("""
    INSERT INTO `rooms` (`id`,`room_number`, `name`, `room_type`, `price_per_night`, `capacity`) VALUES 
    (1, '101', NULL, 'Single', '60', '1'),
    (2, '102', NULL, 'Single', '60', '1'),
    (3, '103', NULL, 'Single', '60', '1'),
    (4, '104', NULL, 'Double', '80', '2'),
    (5, '105', NULL, 'Double', '80', '2'),
    (6, '106', NULL, 'Double', '80', '2'),
    (7, '201', NULL, 'Deluxe Double', '120', '2'),
    (8, '202', NULL, 'Deluxe Double', '120', '2'),
    (9, '203', NULL, 'Deluxe Double', '120', '2'),
    (10, '204', NULL, 'Deluxe Double', '120', '2'),
    (11, '205', NULL, 'Deluxe Double', '120', '2'),
    (12, '301', NULL, 'Suite', '180', '3'),
    (13, '302', NULL, 'Suite', '180', '3'),
    (14, '303', NULL, 'Suite', '180', '4'),
    (15, '304', NULL, 'Suite', '180', '5'),
    (16, '305', NULL, 'Suite', '180', '6'),
    (17, '401', 'Suite Presidenziale', 'Presidential Suite', '260', '8');
""")
    op.execute("""
        CREATE TABLE `closings` (
            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `from_date` DATE NOT NULL,
            `to_date` DATE NOT NULL,
            `reason` VARCHAR(255),
            PRIMARY KEY (`id`),
            CHECK (from_date <= to_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

""")
    op.execute("""
        CREATE TABLE `reservations` (
            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `guest_id` BIGINT UNSIGNED NOT NULL, 
            `room_id` BIGINT UNSIGNED NOT NULL, 
            `check_in_date` DATE NOT NULL,      
            `check_out_date` DATE NOT NULL,     
            `total_cost` FLOAT NOT NULL, 
            `persons` INT NOT NULL, 
            `notes` VARCHAR(255),              
            `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted_at` TIMESTAMP NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            KEY `reservations_guests_foreign` (`guest_id`),
            KEY `reservations_rooms_foreign` (`room_id`),
            KEY `reservations_check_in_date` (`check_in_date`),
            KEY `reservations_check_out_date` (`check_out_date`),
            CONSTRAINT `reservations_guests_foreign` FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`),
            CONSTRAINT `reservations_rooms_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`),
            CHECK (check_in_date < check_out_date)
        );
""")


def downgrade() -> None:
    op.execute("""DROP TABLE closings""")
    op.execute("""DROP TABLE reservations""")
    op.execute("""DROP TABLE rooms""")
    op.execute("""DROP TABLE guests""")
    op.execute("""DROP TABLE users""")
    op.execute("""DROP TABLE roles""")
    op.execute("""DROP TABLE personal_infos""")
