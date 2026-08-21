import { describe, expect, it } from 'vitest'
import { compatibilityFor, resetInvalidSelections, validateCompatibility } from './compatibility'

describe('stack compatibility', () => {
  it('limits Next.js full-stack to Next.js', () => expect(compatibilityFor('backend', 'nextjs-fullstack', { frontend: 'react-vite' }).valid).toBe(false))
  it('requires PostgreSQL for Supabase', () => expect(compatibilityFor('database', 'sqlite', { backend: 'supabase' }).valid).toBe(false))
  it('limits React-only UI systems for Nuxt', () => expect(compatibilityFor('ui', 'shadcn', { frontend: 'nuxt' }).valid).toBe(false))
  it('clears only invalid dependent values', () => expect(resetInvalidSelections({ frontend: 'nuxt', backend: 'nextjs-fullstack', database: 'sqlite', ui: 'shadcn' }).reset).toEqual(['backend', 'ui']))
  it('validates a complete incompatible configuration', () => expect(validateCompatibility({ name: 'Test', frontend: 'react-vite', backend: 'none', database: 'sqlite', ui: 'tailwind', integrations: [] })).toHaveLength(1))
})
