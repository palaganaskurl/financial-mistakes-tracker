CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'PHP' NOT NULL,
	`date_created` integer NOT NULL,
	`date_updated` integer,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
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
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	`account_id` text REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `transfers` (
	`id` text PRIMARY KEY NOT NULL,
	`from_account_id` text REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE set null,
	`to_account_id` text REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE set null,
	`amount` integer NOT NULL,
	`date` text NOT NULL,
	`notes` text,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	`date_created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recurring` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`category` text NOT NULL,
	`frequency` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`is_active` integer DEFAULT true NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	`date_created` integer NOT NULL,
	`date_updated` integer
);
--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`amount_limit` integer NOT NULL,
	`period` text NOT NULL DEFAULT 'monthly',
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	`date_created` integer NOT NULL,
	`date_updated` integer
);
