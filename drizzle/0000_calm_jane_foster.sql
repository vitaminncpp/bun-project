-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `games` (
	`id` varchar(255) NOT NULL,
	`playerW` varchar(255) NOT NULL,
	`playerB` varchar(255) NOT NULL,
	`status` enum('PENDING','ACTIVE','FINISHED','ABORTED','INVALID','CANCELED') NOT NULL DEFAULT 'PENDING',
	`result` enum('WHITE_WIN','BLACK_WIN','DRAW','WHITE_WIN_BY_RESIGNATION','BLACK_WIN_BY_RESIGNATION','WHITE_WIN_ON_TIME','BLACK_WIN_ON_TIME','DRAW_INSUFFICIENT_MATERIAL','DRAW_STALEMATE','DRAW_THREEFOLD_REPETITION','DRAW_FIFTY_MOVE_RULE','DRAW_AGREEMENT','ABORTED','PENDING') NOT NULL DEFAULT 'PENDING',
	`ratingChangeW` int NOT NULL DEFAULT 0,
	`ratingChangeB` int NOT NULL DEFAULT 0,
	`startedAt` datetime NOT NULL,
	`endedAt` datetime NOT NULL,
	`timeControl` int NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `games_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moves` (
	`id` varchar(255) NOT NULL,
	`gameId` varchar(255) NOT NULL,
	`moveNumber` int NOT NULL,
	`player` enum('WHITE','BLACK') NOT NULL,
	`fromFile` enum('a','b','c','d','e','f','g','h') NOT NULL,
	`fromRank` tinyint NOT NULL,
	`toFile` enum('a','b','c','d','e','f','g','h') NOT NULL,
	`toRank` tinyint NOT NULL,
	`piece` enum('PAWN','KNIGHT','BISHOP','ROOK','QUEEN','KING') NOT NULL,
	`moveType` enum('REGULAR','CAPTURE','CASTLE','EN_PASSANT','CHECK','CHECKMATE') NOT NULL,
	`capturedPiece` enum('PAWN','KNIGHT','BISHOP','ROOK','QUEEN','KING'),
	`promotion` enum('PAWN','KNIGHT','BISHOP','ROOK','QUEEN','KING'),
	`notation` varchar(255) NOT NULL,
	`createdAt` datetime,
	`updatedAt` datetime,
	CONSTRAINT `moves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`rating` int NOT NULL DEFAULT 400,
	`gamesPlayed` int NOT NULL DEFAULT 0,
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`draws` int NOT NULL DEFAULT 0,
	`bio` varchar(255),
	`avatarUrl` varchar(255),
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `userId` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `role_actions` (
	`id` varchar(255) NOT NULL,
	`roleId` varchar(255) NOT NULL,
	`action` enum('INSERT_USER','DELETE_USER','UPDATE_USER') NOT NULL,
	`description` varchar(255),
	CONSTRAINT `role_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` varchar(255) NOT NULL,
	`rolename` varchar(255) NOT NULL,
	`description` varchar(255),
	`is_deleted` varchar(255) NOT NULL DEFAULT '0',
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `rolename` UNIQUE(`rolename`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`roleId` varchar(255) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `user_roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_roles_roleId_userId_unique` UNIQUE(`userId`,`roleId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`username` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`isDeleted` tinyint(1) NOT NULL DEFAULT 0,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `username` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`playerW`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `games` ADD CONSTRAINT `games_ibfk_2` FOREIGN KEY (`playerB`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `moves` ADD CONSTRAINT `moves_ibfk_1` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `role_actions` ADD CONSTRAINT `role_actions_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `playerW` ON `games` (`playerW`);--> statement-breakpoint
CREATE INDEX `playerB` ON `games` (`playerB`);--> statement-breakpoint
CREATE INDEX `gameId` ON `moves` (`gameId`);--> statement-breakpoint
CREATE INDEX `roleId` ON `role_actions` (`roleId`);--> statement-breakpoint
CREATE INDEX `roleId` ON `user_roles` (`roleId`);
*/