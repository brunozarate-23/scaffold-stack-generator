import { getOption } from '../stack-catalog/catalog'
import { validateCompatibility } from '../stack-catalog/compatibility'
import type { ProjectConfiguration } from '../projects/schema'

const text = (value: string) => value.replaceAll('\r\n', '\n').trim()
const section = (heading: string, body?: string) => body ? `## ${heading}\n\n${text(body)}` : ''

const frontend: Record<string, string> = {
  nextjs: 'Use Next.js with the App Router and TypeScript. Prefer React Server Components for pages and data-loading components; introduce Client Components only for browser-side state or interactivity.',
  'react-vite': 'Use React, Vite, and TypeScript. Keep routing, data access, and application state explicit and isolated from presentational components.',
  nuxt: 'Use Nuxt, Vue, and TypeScript. Prefer Nuxt server rendering and composables with clear boundaries between server data access and UI.',
}
const backend: Record<string, string> = {
  'nextjs-fullstack': 'Implement backend concerns inside the Next.js application with Server Components, Server Actions, and Route Handlers. Keep data access outside presentation components.',
  'node-rest': 'Implement a standalone TypeScript Fastify REST API. Keep the web and API applications separate under `apps/web` and `apps/api`, with typed API contracts.',
  supabase: 'Use Supabase for PostgreSQL and applicable managed services. Use its supported SDK and server-side integrations; keep privileged operations on the server.',
}
const database: Record<string, string> = {
  postgresql: 'Use PostgreSQL as the primary relational database. Isolate access from presentation components and keep schemas and migrations version-controlled.',
  sqlite: 'Use SQLite for embedded relational persistence. Isolate database access and version-control migrations.',
  mongodb: 'Use MongoDB only for an intentionally document-oriented data model. Define indexes and validation rules alongside collections.',
}
const ui: Record<string, string> = {
  shadcn: 'Use Tailwind CSS, shadcn/ui, and Lucide icons. Prefer existing primitives before creating foundational components; compose them into application-specific UI.',
  tailwind: 'Use Tailwind CSS without a predefined component system. Build components specifically for the application and keep repeated patterns consistent.',
  'material-ui': 'Use Material UI as the component ecosystem. Establish consistent theme tokens and compose its primitives before adding custom foundations.',
  custom: 'Establish a small design system with tokens, typography, spacing, and reusable primitives before creating feature-specific components.',
}
const integrations: Record<string, string> = {
  authentication: 'Add authentication appropriate to the selected backend. Enforce authorization server-side and never trust client-provided identity.',
  stripe: 'Use Stripe only for selected billing needs. Keep secret keys server-side, verify webhooks, and model billing state explicitly.',
  resend: 'Use Resend for transactional application email. Keep API keys server-side and use explicit, tested email templates.',
  'object-storage': 'Use S3-compatible object storage. Prefer Supabase Storage when Supabase is the backend, and validate uploads before storing them.',
  posthog: 'Use PostHog for explicit product events. Document event names and do not collect sensitive data unnecessarily.',
  sentry: 'Use Sentry for production error monitoring. Send actionable context without exposing secrets or personally sensitive data.',
}

export function generateProjectMarkdown(config: ProjectConfiguration) {
  const failures = validateCompatibility(config)
  if (failures.length) throw new Error(`Unsupported stack configuration: ${failures.join(' ')}`)
  const labels = ['frontend', 'backend', 'database', 'ui'] as const
  for (const category of labels) if (!getOption(category, config[category])) throw new Error(`Unsupported ${category}: ${config[category]}`)
  for (const integration of config.integrations) if (!getOption('integration', integration)) throw new Error(`Unsupported integration: ${integration}`)
  const architecture = [
    `### Frontend\n\n${frontend[config.frontend]}`,
    config.backend !== 'none' ? `### Backend\n\n${backend[config.backend]}` : '',
    config.database !== 'none' ? `### Database\n\n${database[config.database]}` : '',
    `### UI System\n\n${ui[config.ui]}`,
    config.integrations.length ? `### Integrations\n\n${config.integrations.map((slug) => `- **${getOption('integration', slug)!.name}:** ${integrations[slug]}`).join('\n')}` : '',
  ].filter(Boolean).join('\n\n')
  return [
    `# ${text(config.name)}`,
    section('Product Context', config.description ?? 'Define and implement this project according to the selected architecture.'),
    section('Goals', 'Build a maintainable application that follows the technical decisions below. Keep the implementation focused on the product requirements.'),
    section('Technical Architecture', architecture),
    section('Repository Structure', config.backend === 'node-rest' ? 'Use `apps/web` for the frontend and `apps/api` for the Fastify service.' : 'Organize feature logic, shared UI, server-side data access, and validation into focused modules.'),
    section('Architecture Rules', 'Keep business logic separate from presentation components. Reuse existing patterns and do not introduce major frameworks or dependencies without justification.'),
    section('Coding Conventions', 'Use strict TypeScript, small focused modules, descriptive names, and validate external input at application boundaries.'),
    config.database !== 'none' ? section('Data Access Rules', 'Access data through server-side modules. Keep migrations version-controlled, validate writes, and avoid database logic in presentation components.') : '',
    section('UI Rules', 'Prefer clear hierarchy, accessible semantics, responsive layouts, useful whitespace, and restrained visual treatment. Avoid unnecessary decorative effects.'),
    section('Security Requirements', 'Never expose secrets to the client. Validate server input, render Markdown safely, and do not execute arbitrary user-supplied code.'),
    section('Environment Variables', 'Document required environment variables in `.env.example`. Never commit real credentials or API keys.'),
    section('Development Workflow', 'Inspect the existing repository before changes. Run applicable linting, type checking, and tests before considering work complete.'),
    section('Definition of Done', 'The feature matches this specification, handles errors and loading states, is responsive, and passes applicable linting, type checking, and tests.'),
    section('Agent Instructions', 'Before implementing a feature:\n\n1. Read this PROJECT.md completely.\n2. Inspect the existing repository before modifying architecture.\n3. Reuse existing components and patterns.\n4. Do not introduce new frameworks or major dependencies without justification.\n5. Keep business logic separate from presentation components.\n6. Follow the architecture defined in this document.\n7. Validate assumptions against the existing codebase.\n8. Prefer small, reviewable changes.\n9. Run applicable linting, type checking, and tests before considering a task complete.\n\nIf the existing codebase conflicts with this document, identify the conflict before changing architectural direction.'),
  ].filter(Boolean).join('\n\n') + '\n'
}
