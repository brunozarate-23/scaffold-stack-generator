import type { ProjectConfiguration } from '../projects/schema'

export type SelectionState = Partial<ProjectConfiguration>
export type CompatibilityResult = { valid: boolean; reason?: string }

export function compatibilityFor(category: keyof Pick<ProjectConfiguration, 'backend' | 'database' | 'ui'>, slug: string, values: SelectionState): CompatibilityResult {
  if (category === 'backend' && slug === 'nextjs-fullstack' && values.frontend !== 'nextjs') return { valid: false, reason: 'Next.js Full-stack requires the Next.js frontend.' }
  if (category === 'database' && values.backend === 'none' && slug !== 'none') return { valid: false, reason: 'A frontend-only project cannot use a database.' }
  if (category === 'database' && values.backend === 'supabase' && slug !== 'postgresql') return { valid: false, reason: 'Supabase uses PostgreSQL.' }
  if (category === 'ui' && values.frontend === 'nuxt' && ['shadcn', 'material-ui'].includes(slug)) return { valid: false, reason: 'This UI system is available for React-based frontends only.' }
  return { valid: true }
}

export function validateCompatibility(values: ProjectConfiguration): string[] {
  const failures = (['backend', 'database', 'ui'] as const).map((category) => compatibilityFor(category, values[category], values)).filter((result) => !result.valid).map((result) => result.reason!)
  return [...new Set(failures)]
}

export function resetInvalidSelections(values: SelectionState): { values: SelectionState; reset: (keyof SelectionState)[] } {
  const next = { ...values }
  const reset: (keyof SelectionState)[] = []
  for (const category of ['backend', 'database', 'ui'] as const) {
    const slug = next[category]
    if (slug && !compatibilityFor(category, slug, next).valid) {
      delete next[category]
      reset.push(category)
    }
  }
  return { values: next, reset }
}
