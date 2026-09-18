CREATE TABLE `portfolio_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(180) NOT NULL,
	`category` varchar(100) NOT NULL,
	`type` varchar(120),
	`description` text,
	`challenge` text,
	`objective` text,
	`solution` text,
	`result` text,
	`tools` text,
	`coverUrl` text,
	`galleryUrls` text,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `portfolio_projects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `quote_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`company` varchar(180),
	`phone` varchar(80),
	`email` varchar(320),
	`services` text NOT NULL,
	`projectType` varchar(180),
	`deadline` varchar(100),
	`budget` varchar(120),
	`description` text,
	`preferredContact` enum('whatsapp','email','phone') NOT NULL DEFAULT 'whatsapp',
	`status` enum('new','in_review','quote_sent','waiting_client','in_production','in_revision','completed','cancelled') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quote_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_catalog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(180) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`deliverables` text,
	`imageUrl` text,
	`priceMode` enum('fixed','from','quote') NOT NULL DEFAULT 'quote',
	`priceLabel` varchar(100),
	`estimatedTimeline` varchar(100),
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_catalog_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_catalog_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(120) NOT NULL,
	`settingValue` text,
	`isPublic` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_settingKey_unique` UNIQUE(`settingKey`)
);
