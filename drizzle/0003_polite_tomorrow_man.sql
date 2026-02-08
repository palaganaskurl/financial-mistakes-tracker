PRAGMA foreign_keys=OFF;--> statement-breakpoint
PRAGMA defer_foreign_keys = on;
CREATE TABLE `__new_financialDrama` (
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
INSERT INTO `__new_financialDrama`("id", "type", "amount", "date", "category", "is_planned", "notes", "date_created", "date_updated", "user_id", "blessings_account_id") SELECT "id", "type", "amount", "date", "category", "is_planned", "notes", "date_created", "date_updated", "user_id", "blessings_account_id" FROM `financialDrama`;--> statement-breakpoint
DROP TABLE `financialDrama`;--> statement-breakpoint
ALTER TABLE `__new_financialDrama` RENAME TO `financialDrama`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA defer_foreign_keys = off;
CREATE TABLE `__new_accounts` (
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
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "name", "type", "balance", "currency", "date_created", "date_updated", "user_id") SELECT "id", "name", "type", "balance", "currency", "date_created", "date_updated", "user_id" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;