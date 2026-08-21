import { describe, expect, it } from 'vitest'
import { generateProjectMarkdown } from './generate'

const base = { name: 'Acme', description: 'A customer portal', frontend: 'nextjs', backend: 'nextjs-fullstack', database: 'postgresql', ui: 'shadcn', integrations: ['stripe', 'sentry'] }
describe('PROJECT.md generator', () => {
  it('creates deterministic architecture instructions', () => { const output = generateProjectMarkdown(base); expect(output).toContain('Use Next.js with the App Router'); expect(output).toContain('Stripe'); expect(output).toContain('## Agent Instructions') })
  it('omits irrelevant data sections', () => { const output = generateProjectMarkdown({ ...base, backend: 'none', database: 'none', integrations: [] }); expect(output).not.toContain('### Backend'); expect(output).not.toContain('## Data Access Rules') })
  it('rejects unsupported configurations', () => expect(() => generateProjectMarkdown({ ...base, frontend: 'nuxt', ui: 'shadcn' })).toThrow('Unsupported stack configuration'))
})
