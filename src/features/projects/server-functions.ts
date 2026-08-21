import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getOption } from '../stack-catalog/catalog'
import { validateCompatibility } from '../stack-catalog/compatibility'
import { seedCatalog } from '../stack-catalog/seed.server'
import { findProject, listProjects, saveProject } from './repository.server'
import { projectConfigurationSchema, projectIdSchema } from './schema'

const validConfiguration = projectConfigurationSchema.superRefine((value, context) => {
  for (const category of ['frontend', 'backend', 'database', 'ui'] as const) {
    if (!getOption(category, value[category])) context.addIssue({ code: 'custom', path: [category], message: `Unsupported ${category} option.` })
  }
  for (const slug of value.integrations) if (!getOption('integration', slug)) context.addIssue({ code: 'custom', path: ['integrations'], message: 'Unsupported integration option.' })
  for (const issue of validateCompatibility(value)) context.addIssue({ code: 'custom', message: issue })
})

export const getProjects = createServerFn({ method: 'GET' }).handler(async () => {
  await seedCatalog()
  return listProjects()
})

export const getProject = createServerFn({ method: 'GET' }).validator(projectIdSchema).handler(async ({ data }) => {
  await seedCatalog()
  return findProject(data.projectId)
})

export const createProject = createServerFn({ method: 'POST' }).validator(validConfiguration).handler(async ({ data }) => {
  await seedCatalog()
  return saveProject(data)
})

export const updateProject = createServerFn({ method: 'POST' }).validator(z.object({ id: z.string().uuid(), configuration: validConfiguration })).handler(async ({ data }) => {
  await seedCatalog()
  const existing = await findProject(data.id)
  if (!existing) throw new Error('Project not found')
  return saveProject(data.configuration, data.id)
})
