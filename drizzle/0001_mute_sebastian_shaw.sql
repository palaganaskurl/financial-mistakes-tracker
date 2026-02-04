PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_financialDrama` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
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
INSERT INTO `__new_financialDrama`("id", "type", "amount", "date", "category", "is_planned", "notes", "date_created", "date_updated", "user_id") SELECT "id", "type", "amount", "date", "category", "is_planned", "notes", "date_created", "date_updated", "user_id" FROM `financialDrama`;--> statement-breakpoint
DROP TABLE `financialDrama`;--> statement-breakpoint
ALTER TABLE `__new_financialDrama` RENAME TO `financialDrama`;--> statement-breakpoint
PRAGMA foreign_keys=ON;