create database fitness_db;
use fitness_db;
create table `users`(
	`user_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `fullname` VARCHAR(255) DEFAULT NULL,
    `email` VARCHAR(255) DEFAULT NULL,
    `phone` VARCHAR(15) DEFAULT NULL,
    `vip` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
select * from users;
create table `blog`(
	`blog_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `blog_description` VARCHAR(255) DEFAULT NULL,
    `content` LONGTEXT,
    `author` VARCHAR(255) NOT NULL,
    `blog_image` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`blog_id`) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
select * from blog;
create table `meals`(
	`meal_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `meal_name` VARCHAR(255) NOT NULL,
    `meal_type` VARCHAR(255) NOT NULL,
    `recipe` VARCHAR(255),
    `calories` INT(10) NOT NULL,
    `making` LONGTEXT,
    `meal_description` LONGTEXT,
    `meal_vip` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`meal_id`) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
select * from meals;

create table `workouts`(
	`workout_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `workout_name` VARCHAR(255) NOT NULL,
    `workout_type` VARCHAR(255) NOT NULL,
    `difficulty` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
	`equipment` VARCHAR(255),
    `burn_estimate` INT(10) NOT NULL,
    `workout_vip` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
    `tutorial_video` VARCHAR(255),
    PRIMARY KEY (`workout_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
select * from workouts;


