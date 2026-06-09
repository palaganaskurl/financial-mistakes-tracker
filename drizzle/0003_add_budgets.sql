CREATE TABLE `budgets` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`amount_limit` integer NOT NULL,
	`period` text NOT NULL DEFAULT 'monthly',
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`user_id` text NOT NULL REFERENCES `user`(`id`) ON DELETE CASCADE,
	`date_created` integer NOT NULL,
	`date_updated` integer
);
