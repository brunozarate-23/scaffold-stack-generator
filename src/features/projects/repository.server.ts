import '@tanstack/react-start/server-only'
import { desc, eq, inArray } from 'drizzle-orm'
import { getDatabase } from '../../db/client.server'
import { projectIntegrations, projects } from '../../db/schema'
import { generateProjectMarkdown } from '../project-generation/generate'
import { getOption } from '../stack-catalog/catalog'
import { stackOptionId } from '../stack-catalog/seed.server'
import type { ProjectConfiguration } from './schema'

export type SavedProject = ProjectConfiguration & { id: string; createdAt: string; updatedAt: string; markdown: string }

function mapProject(row: typeof projects.$inferSelect, integrationRows: (typeof projectIntegrations.$inferSelect)[]): SavedProject {
  const config: ProjectConfiguration = {
    name: row.name, description: row.description ?? undefined,
    frontend: row.frontendId.replace('frontend:', ''), backend: row.backendId.replace('backend:', ''),
    database: row.databaseId.replace('database:', ''), ui: row.uiId.replace('ui:', ''),
    integrations: integrationRows.map((item) => item.integrationId.replace('integration:', '')),
  }
  return { id: row.id, createdAt: row.createdAt, updatedAt: row.updatedAt, ...config, markdown: generateProjectMarkdown(config) }
}

export async function listProjects() {
  const db = getDatabase()
  const rows = await db.select().from(projects).orderBy(desc(projects.updatedAt)).all()
  const ids = rows.map((row) => row.id)
  const integrations = ids.length ? await db.select().from(projectIntegrations).where(inArray(projectIntegrations.projectId, ids)).all() : []
  return rows.map((row) => mapProject(row, integrations.filter((integration) => integration.projectId === row.id)))
}

export async function findProject(id: string) {
  const db = getDatabase()
  const row = await db.select().from(projects).where(eq(projects.id, id)).get()
  if (!row) return null
  const integrations = await db.select().from(projectIntegrations).where(eq(projectIntegrations.projectId, id)).all()
  return mapProject(row, integrations)
}

export async function saveProject(config: ProjectConfiguration, id: string = crypto.randomUUID()) {
  const db = getDatabase()
  const now = new Date().toISOString()
  const values = { id, name: config.name, description: config.description ?? null, createdAt: now, updatedAt: now,
    frontendId: stackOptionId('frontend', config.frontend), backendId: stackOptionId('backend', config.backend),
    databaseId: stackOptionId('database', config.database), uiId: stackOptionId('ui', config.ui) }
  db.transaction((tx) => {
    const exists = tx.select({ id: projects.id }).from(projects).where(eq(projects.id, id)).get()
    if (exists) tx.update(projects).set({ ...values, updatedAt: now }).where(eq(projects.id, id)).run()
    else tx.insert(projects).values(values).run()
    tx.delete(projectIntegrations).where(eq(projectIntegrations.projectId, id)).run()
    if (config.integrations.length) tx.insert(projectIntegrations).values(config.integrations.map((slug) => ({ id: crypto.randomUUID(), projectId: id, integrationId: stackOptionId('integration', slug), createdAt: now }))).run()
  })
  const project = await findProject(id)
  if (!project) throw new Error('Project could not be saved.')
  return project
}

export function projectSummary(project: SavedProject) {
  return { frontend: getOption('frontend', project.frontend)?.name, backend: getOption('backend', project.backend)?.name, database: getOption('database', project.database)?.name, ui: getOption('ui', project.ui)?.name }
}
