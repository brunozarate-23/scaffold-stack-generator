export const categories = ['frontend', 'backend', 'database', 'ui', 'integration'] as const
export type StackCategory = (typeof categories)[number]

export type StackOption = {
  slug: string
  category: StackCategory
  name: string
  description: string
  details: string
  sortOrder: number
}

export const stackOptions: StackOption[] = [
  { slug: 'nextjs', category: 'frontend', name: 'Next.js', description: 'React framework for full-stack applications.', details: 'React · Next.js · TypeScript', sortOrder: 1 },
  { slug: 'react-vite', category: 'frontend', name: 'React + Vite', description: 'Fast client-focused React application.', details: 'React · Vite · TypeScript', sortOrder: 2 },
  { slug: 'nuxt', category: 'frontend', name: 'Nuxt', description: 'Vue framework for SSR applications.', details: 'Vue · Nuxt · TypeScript', sortOrder: 3 },
  { slug: 'nextjs-fullstack', category: 'backend', name: 'Next.js Full-stack', description: 'Backend inside the Next.js app.', details: 'Server Components · Actions · Route Handlers', sortOrder: 1 },
  { slug: 'node-rest', category: 'backend', name: 'Node.js REST API', description: 'A separate Fastify REST service.', details: 'TypeScript · REST · Fastify', sortOrder: 2 },
  { slug: 'supabase', category: 'backend', name: 'Supabase', description: 'Managed backend services and PostgreSQL.', details: 'PostgreSQL · Auth · Storage', sortOrder: 3 },
  { slug: 'none', category: 'backend', name: 'None', description: 'A frontend-only application.', details: 'No persistent backend', sortOrder: 4 },
  { slug: 'none', category: 'database', name: 'None', description: 'No persistence is required.', details: 'Frontend-only or stateless', sortOrder: 1 },
  { slug: 'postgresql', category: 'database', name: 'PostgreSQL', description: 'Default relational database recommendation.', details: 'Relational · production-ready', sortOrder: 2 },
  { slug: 'sqlite', category: 'database', name: 'SQLite', description: 'A simple embedded relational database.', details: 'Local-first · prototypes', sortOrder: 3 },
  { slug: 'mongodb', category: 'database', name: 'MongoDB', description: 'Document database for intentional document models.', details: 'Document-oriented', sortOrder: 4 },
  { slug: 'shadcn', category: 'ui', name: 'shadcn/ui', description: 'Composable accessible React primitives.', details: 'Tailwind CSS · Lucide', sortOrder: 1 },
  { slug: 'tailwind', category: 'ui', name: 'Tailwind CSS', description: 'Build application-specific components with utility CSS.', details: 'No component library', sortOrder: 2 },
  { slug: 'material-ui', category: 'ui', name: 'Material UI', description: 'Mature React component ecosystem.', details: 'React components', sortOrder: 3 },
  { slug: 'custom', category: 'ui', name: 'Custom', description: 'Establish a design system before feature components.', details: 'No predefined library', sortOrder: 4 },
  { slug: 'authentication', category: 'integration', name: 'Authentication', description: 'User identity and access management.', details: 'Adapted to backend', sortOrder: 1 },
  { slug: 'stripe', category: 'integration', name: 'Stripe', description: 'Subscriptions, payments, and billing.', details: 'Checkout · webhooks', sortOrder: 2 },
  { slug: 'resend', category: 'integration', name: 'Resend', description: 'Transactional application email.', details: 'Invitations · notifications', sortOrder: 3 },
  { slug: 'object-storage', category: 'integration', name: 'Object Storage', description: 'S3-compatible file storage.', details: 'Uploads · assets', sortOrder: 4 },
  { slug: 'posthog', category: 'integration', name: 'PostHog', description: 'Product analytics and event tracking.', details: 'Privacy-conscious analytics', sortOrder: 5 },
  { slug: 'sentry', category: 'integration', name: 'Sentry', description: 'Production error monitoring.', details: 'Errors · performance', sortOrder: 6 },
]

export function optionsFor(category: StackCategory) {
  return stackOptions.filter((option) => option.category === category).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getOption(category: StackCategory, slug: string) {
  return stackOptions.find((option) => option.category === category && option.slug === slug)
}
