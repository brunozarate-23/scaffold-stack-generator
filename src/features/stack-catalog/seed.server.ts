import '@tanstack/react-start/server-only'
import { eq } from 'drizzle-orm'
import { getDatabase } from '../../db/client.server'
import { stackOptions as stackOptionsTable } from '../../db/schema'
import { stackOptions } from './catalog'

export function stackOptionId(category: string, slug: string) {
  return `${category}:${slug}`
}

export async function seedCatalog() {
  const db = getDatabase()
  for (const option of stackOptions) {
    await db.insert(stackOptionsTable).values({
      id: stackOptionId(option.category, option.slug), category: option.category, slug: option.slug,
      name: option.name, description: option.description, metadata: JSON.stringify({ details: option.details }), sortOrder: option.sortOrder,
    }).onConflictDoUpdate({ target: [stackOptionsTable.category, stackOptionsTable.slug], set: { name: option.name, description: option.description, metadata: JSON.stringify({ details: option.details }), sortOrder: option.sortOrder, enabled: true } })
  }
}

export async function catalogIsSeeded() {
  const db = getDatabase()
  return Boolean(await db.select({ id: stackOptionsTable.id }).from(stackOptionsTable).where(eq(stackOptionsTable.id, 'frontend:nextjs')).get())
}
