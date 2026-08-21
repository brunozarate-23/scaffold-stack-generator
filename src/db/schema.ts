import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

const timestamps = {
  createdAt: text('created_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
}

export const stackOptions = sqliteTable('stack_options', {
  id: text('id').primaryKey(),
  category: text('category', { enum: ['frontend', 'backend', 'database', 'ui', 'integration'] }).notNull(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  metadata: text('metadata').notNull().default('{}'),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull(),
}, (table) => [uniqueIndex('stack_options_category_slug').on(table.category, table.slug)])

export const compatibilityRules = sqliteTable('compatibility_rules', {
  id: text('id').primaryKey(),
  sourceOptionId: text('source_option_id').notNull().references(() => stackOptions.id, { onDelete: 'cascade' }),
  targetOptionId: text('target_option_id').notNull().references(() => stackOptions.id, { onDelete: 'cascade' }),
  relationship: text('relationship', { enum: ['compatible', 'incompatible', 'requires'] }).notNull(),
})

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  frontendId: text('frontend_id').notNull().references(() => stackOptions.id),
  backendId: text('backend_id').notNull().references(() => stackOptions.id),
  databaseId: text('database_id').notNull().references(() => stackOptions.id),
  uiId: text('ui_id').notNull().references(() => stackOptions.id),
  ...timestamps,
})

export const projectIntegrations = sqliteTable('project_integrations', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  integrationId: text('integration_id').notNull().references(() => stackOptions.id),
  configuration: text('configuration'),
  createdAt: timestamps.createdAt,
}, (table) => [uniqueIndex('project_integrations_project_option').on(table.projectId, table.integrationId)])
