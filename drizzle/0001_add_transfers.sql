CREATE TABLE `transfers` (
	`id` text PRIMARY KEY NOT NULL,
	`from_account_id` text REFERENCES accounts(id) ON DELETE SET NULL,
	`to_account_id` text REFERENCES accounts(id) ON DELETE SET NULL,
	`amount` integer NOT NULL,
	`date` text NOT NULL,
	`notes` text,
	`user_id` text NOT NULL REFERENCES user(id) ON DELETE CASCADE,
	`date_created` integer NOT NULL
);
