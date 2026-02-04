CREATE TABLE `financialDrama` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`amount` text NOT NULL,
	`date` text NOT NULL,
	`category` text NOT NULL,
	`is_planned` integer DEFAULT true NOT NULL,
	`notes` text,
	`date_created` integer NOT NULL,
	`date_updated` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`password` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);