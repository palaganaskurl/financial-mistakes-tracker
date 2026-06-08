CREATE TABLE `recurring` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`category` text NOT NULL,
	`frequency` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`is_active` integer NOT NULL DEFAULT true,
	`user_id` text NOT NULL REFERENCES user(id) ON DELETE CASCADE,
	`date_created` integer NOT NULL,
	`date_updated` integer
);
