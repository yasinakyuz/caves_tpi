-- --------------------------------------------------------
-- Hôte:                         localhost
-- Version du serveur:           8.0.36 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour caves
CREATE DATABASE IF NOT EXISTS `caves` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `caves`;

-- Listage de la structure de la table caves. announcements
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `situation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_date` date DEFAULT NULL,
  `users_idusers` int NOT NULL,
  `products_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_idusers` (`users_idusers`),
  KEY `products_id` (`products_id`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`users_idusers`) REFERENCES `users` (`id`),
  CONSTRAINT `announcements_ibfk_2` FOREIGN KEY (`products_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table caves.announcements : ~8 rows (environ)
INSERT INTO `announcements` (`id`, `title`, `situation`, `creation_date`, `update_date`, `delete_date`, `users_idusers`, `products_id`) VALUES
	(69, 'pomme', 'disponible', '2024-04-29 07:45:20', '2024-04-29 07:45:20', NULL, 17, 77),
	(70, 'carrot', 'disponible', '2024-04-29 07:46:15', '2024-04-29 07:46:15', NULL, 22, 78),
	(71, 'champignons', 'good', '2024-05-07 07:13:59', '2024-05-07 07:13:59', NULL, 23, 79),
	(72, 'mais', 'disponible', '2024-05-07 07:22:46', '2024-05-07 07:22:46', NULL, 23, 80),
	(73, 'mais_corrige', 'mais', '2024-05-07 07:24:24', '2024-05-07 07:24:24', NULL, 23, 81),
	(74, 'carrot', 'disponible', '2024-05-07 07:51:38', '2024-05-07 07:51:38', NULL, 17, 82),
	(75, 'carrot', 'good', '2024-05-07 08:13:52', '2024-05-07 08:13:52', NULL, 22, 83),
	(76, 'pomme', 'pommeysa', '2024-05-07 08:46:43', '2024-05-07 08:46:43', NULL, 17, 84),
	(77, 'pomme', 'good', '2024-05-07 09:07:15', '2024-05-07 09:07:15', NULL, 22, 85),
	(78, 'mais2', 'bon', '2024-05-07 09:10:36', '2024-05-07 09:10:36', NULL, 23, 86);

-- Listage de la structure de la table caves. categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name_category` varchar(20) NOT NULL,
  `other_category` varchar(20) DEFAULT NULL,
  `products_id_products` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_id_products` (`products_id_products`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`products_id_products`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table caves.categories : ~6 rows (environ)
INSERT INTO `categories` (`id`, `name_category`, `other_category`, `products_id_products`) VALUES
	(1, '2', NULL, 79),
	(2, '2', NULL, 80),
	(3, 'legumes', NULL, 82),
	(4, '', NULL, 83),
	(5, 'fruits', NULL, 84),
	(6, 'legume', NULL, 85),
	(7, 'fruit', NULL, 86);

-- Listage de la structure de la table caves. comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_text` varchar(255) NOT NULL,
  `comment_time` date NOT NULL,
  `users_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_id` (`users_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table caves.comments : ~0 rows (environ)

-- Listage de la structure de la table caves. messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `buyer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `announcement_id` int NOT NULL,
  `message_text` varchar(255) NOT NULL,
  `sent_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buyer_id` (`buyer_id`),
  KEY `seller_id` (`seller_id`),
  KEY `announcement_id` (`announcement_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table caves.messages : ~0 rows (environ)

-- Listage de la structure de la table caves. photos
CREATE TABLE IF NOT EXISTS `photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img_name` varchar(45) NOT NULL,
  `url` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `products_id_products` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_id_products` (`products_id_products`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`products_id_products`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table caves.photos : ~8 rows (environ)
INSERT INTO `photos` (`id`, `img_name`, `url`, `description`, `products_id_products`) VALUES
	(55, 'pomme.png', '/Frontend/images/pomme.png', '', 77),
	(56, 'carrot.png', '/Frontend/images/carrot.png', '', 78),
	(57, 'champignons_coop.jpg', '/Frontend/images/champignons_coop.jpg', '', 79),
	(58, 'mais_coop.jpg', '/Frontend/images/mais_coop.jpg', '', 80),
	(59, 'mais_coop.jpg', '/Frontend/images/mais_coop.jpg', '', 81),
	(60, 'carrot_2_ysn.jpg', '/Frontend/images/carrot_2_ysn.jpg', '', 82),
	(61, 'carrot_fruits_migros.jpg', '/Frontend/images/carrot_fruits_migros.jpg', '', 83),
	(62, 'pomme.jpg', '/Frontend/images/pomme.jpg', '', 84),
	(63, 'mais_coop.jpg', '/Frontend/images/mais_coop.jpg', '', 86);

-- Listage de la structure de la table caves. products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prdct_name` varchar(45) NOT NULL,
  `price` float NOT NULL,
  `stock` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table caves.products : ~10 rows (environ)
INSERT INTO `products` (`id`, `prdct_name`, `price`, `stock`) VALUES
	(77, 'pomme', 3, 3),
	(78, 'CARROT', 5, 0),
	(79, 'champignons', 4, 4),
	(80, 'mais', 1, 4),
	(81, 'mais', 2, 3),
	(82, 'carrot', 3, 4),
	(83, 'carrot_fruits', 3, 6),
	(84, 'pomme', 3, 4),
	(85, 'pomme', 2, 3),
	(86, 'mais fruit', 1, 4);

-- Listage de la structure de la table caves. users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `company_name` varchar(45) DEFAULT NULL,
  `e_mail` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `street` varchar(20) NOT NULL,
  `building_number` varchar(10) NOT NULL,
  `postal_code` int NOT NULL,
  `city` varchar(20) NOT NULL,
  `canton` varchar(15) NOT NULL,
  `register_date` date NOT NULL,
  `updated_date` date NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table caves.users : ~2 rows (environ)
INSERT INTO `users` (`id`, `name`, `firstname`, `company_name`, `e_mail`, `phone`, `street`, `building_number`, `postal_code`, `city`, `canton`, `register_date`, `updated_date`, `password`) VALUES
	(17, 'yasin', 'yasin', 'yasin company', 'yasin@gmail.com', '123', 'Rue de l\'industrie', '28', 1400, 'Yverdon-les-Bains', 'Vaud', '2024-03-06', '2024-04-26', '$2y$10$kI//XczOZjMzyCDtTINRKOtRqmvDYbQe/rAsb4GnAmyyfe3MVurUa'),
	(22, 'migros', 'migros', 'migros renens', 'migrosrenens@gmail.com', '41778522565', 'Rue de la Mèbre', '9', 1020, 'Renens', 'Vaud', '2024-04-26', '2024-04-26', '$2y$10$Wb.mUe6ZwwJtm9bwuxfvXetwIL7wfWKVbonpUjeXzdqQQXHTvYC3O'),
	(23, 'coop', 'coop', 'coop', 'coop@gmail.com', '1234', 'Aarbergergasse', '53', 3011, 'Bern', 'Bern', '2024-05-02', '2024-05-02', '$2y$10$2lSmtM2SDag4YYLuEywEaOZYCExQ6yRM8uPr08pxmfHpJckEeaWS.');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
