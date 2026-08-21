import { z } from 'zod'

const selection = z.string().min(1)
export const projectConfigurationSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(144),
  description: z.string().trim().max(2000).optional(),
  frontend: selection,
  backend: selection,
  database: selection,
  ui: selection,
  integrations: z.array(selection).max(6).refine((values) => new Set(values).size === values.length, 'Integrations must be unique'),
})

export type ProjectConfiguration = z.infer<typeof projectConfigurationSchema>
export const projectIdSchema = z.object({ projectId: z.string().uuid() })
