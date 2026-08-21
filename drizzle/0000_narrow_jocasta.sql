CREATE TABLE `compatibility_rules` (
	`id` text PRIMARY KEY NOT NULL,
	`source_option_id` text NOT NULL,
	`target_option_id` text NOT NULL,
	`relationship` text NOT NULL,
	FOREIGN KEY (`source_option_id`) REFERENCES `stack_options`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_option_id`) REFERENCES `stack_options`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `project_integrations` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`integration_id` text NOT NULL,
	`configuration` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`integration_id`) REFERENCES `stack_options`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_integrations_project_option` ON `project_integrations` (`project_id`,`integration_id`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`frontend_id` text NOT NULL,
	`backend_id` text NOT NULL,
	`database_id` text NOT NULL,
	`ui_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`frontend_id`) REFERENCES `stack_options`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`backend_id`) REFERENCES `stack_options`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`database_id`) REFERENCES `stack_options`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ui_id`) REFERENCES `stack_options`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stack_options` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`metadata` text DEFAULT '{}' NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`sort_order` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stack_options_category_slug` ON `stack_options` (`category`,`slug`);