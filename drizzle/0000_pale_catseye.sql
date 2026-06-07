CREATE TABLE `financialDrama` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`date` text NOT NULL,
	`category` text NOT NULL,
	`is_planned` integer DEFAULT true NOT NULL,
	`notes` text,
	`date_created` integer NOT NULL,
	`date_updated` integer,
	`user_id` text NOT NULL,
	`blessings_account_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`blessings_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'PHP' NOT NULL,
	`date_created` integer NOT NULL,
	`date_updated` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
