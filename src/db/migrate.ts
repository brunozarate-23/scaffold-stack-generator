import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { getDatabase } from './client.server'

await migrate(getDatabase(), { migrationsFolder: './drizzle' })
console.log('Database migrations applied.')
