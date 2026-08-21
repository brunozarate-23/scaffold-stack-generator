import '@tanstack/react-start/server-only'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL ?? './data/scaffold.sqlite'
  const client = new Database(databaseUrl)
  client.run('PRAGMA foreign_keys = ON')
  return drizzle({ client })
}
