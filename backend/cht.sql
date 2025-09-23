CREATE TABLE `friend_requests` (
  `_id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `from` CHAR(36) NOT NULL,
  `to` CHAR(36) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`_id`)
);


CREATE TABLE `friends` (
  `user1` CHAR(36) NOT NULL,
  `user2` CHAR(36) NOT NULL,
  PRIMARY KEY (`user1`, `user2`)
);


CREATE TABLE `offline_message` (
  `_id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `to` CHAR(36) NOT NULL,
  `from` CHAR(36) NOT NULL,
  `delivered` VARCHAR(20) DEFAULT NULL,
  `message` MEDIUMTEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`_id`)
);




CREATE TABLE `users` (
  `_id` CHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `contact` VARCHAR(10) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `dp` MEDIUMBLOB,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `contact` (`contact`)
);

