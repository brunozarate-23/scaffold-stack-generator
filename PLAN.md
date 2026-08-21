# Scaffold Alpha 1 Implementation Plan

## Context

Scaffold is a greenfield web application that guides a user through technical architecture choices, persists one canonical project configuration, and deterministically generates a useful `PROJECT.md` for AI coding agents.

The repository currently contains only [`PROJECT.md`](./PROJECT.md); there is no application scaffold or reusable code. The specification also conflicts with itself: its main stack is TanStack Start + SQLite without auth, while later completion/priority sections refer to Next.js, Supabase, PostgreSQL, RLS, and users. The user resolved these conflicts as follows:

- TanStack Start + TanStack Router + React 19 + TypeScript.
- Bun for package management and the production server runtime.
- SQLite through Drizzle ORM and Bun's native `bun:sqlite` driver.
- Single-user Alpha with no authentication or ownership model.
- Unit/integration automation only; manually verify the complete browser journey.
- Deliver the complete Alpha as one build rather than reviewable product milestones.

The first implementation task is to make `PROJECT.md` consistent with these decisions. TanStack Start's stable SSR/server-function execution model will be used; experimental React Server Components and Next.js conventions will not be introduced.

## Approach

### Application architecture

- Scaffold with the current TanStack CLI conventions: Vite, React 19, file-based TanStack Router routes, full-document SSR, strict TypeScript, and Bun scripts.
- Use route loaders only to call server functions because loaders are isomorphic. Put database access in `*.server.ts` modules and expose validated reads/mutations with `createServerFn`.
- Target a persistent Bun server and local SQLite file. Keep the database path server-only and configurable through `DATABASE_URL`; provide `.env.example` and ignore runtime database files.
- Use Tailwind CSS v4, shadcn/ui primitives, and Lucide icons. Establish a restrained lemon-green/black theme, compact dashboard shell, accessible focus states, and responsive mobile layout without adding a second styling system.

### Domain and persistence

- Define a canonical Zod `ProjectConfiguration` with bounded project name, optional normalized description, one slug per required category, and a deduplicated integration slug array. Infer TypeScript types from this schema.
- Keep one typed stack catalog in source as the editable source for Alpha option metadata and database seed/upsert data. Persist `stack_options` and `compatibility_rules` so projects can use foreign keys and runtime UI can remain data-driven. Keep Markdown generation fragments in source code, keyed by stable slugs.
- Implement the specification's tables with SQLite constraints:
  - `projects`: text UUID, name/description, frontend/backend/database/UI option foreign keys, created/updated timestamps.
  - `project_integrations`: text UUID, project/option foreign keys, nullable JSON configuration reserved for later, unique project+integration, cascade delete.
  - `stack_options`: category, unique stable slug, display metadata JSON, enabled flag, sort order.
  - `compatibility_rules`: source/target option foreign keys and checked relationship (`compatible`, `incompatible`, `requires`).
- Seed/upsert only the explicitly supported Alpha options and rules. Use transactions for project + integration writes. Generate Markdown from the canonical joined configuration on demand rather than storing a second source of truth.

### Compatibility and builder behavior

- Centralize compatibility evaluation so the UI and server submission checks use the same pure functions. At minimum enforce:
  - `nextjs-fullstack` is available only with the `nextjs` frontend.
  - React-only UI systems (`shadcn`, `material-ui`) are unavailable for Nuxt; Tailwind and Custom remain available.
  - frontend-only backend (`none`) requires database `none`.
  - Supabase uses PostgreSQL; choosing it resets any incompatible database choice.
  - changing an upstream choice that invalidates backend/database/UI warns the user and clears only invalid dependent values.
- Build one controlled, reusable seven-step vertical-tab wizard for create and edit. Preserve valid draft values when navigating non-linearly, show completion/error status per step, validate fields at step boundaries and the full configuration on submit, and require explicit confirmation before Reset.
- Use selectable cards for single choices and toggle cards for integrations. Render compatibility explanations and disabled reasons rather than allowing an invalid final submission.

### Deterministic generation

- Implement a small composer plus separate fragment modules for every supported frontend, backend, database, UI, and integration slug; avoid one large conditional function.
- Always emit the requested document shape in stable order, omit irrelevant sections (for example database/data-access instructions for a frontend-only project), escape/normalize user-provided name and description, and finish with the required AI agent instructions.
- Treat unsupported slugs or invalid combinations as typed generation errors. Test representative complete documents and every fragment/omission rule with stable fixtures.

### Product surfaces

- `/`: minimal landing page with the specified headline, supporting copy, and Create Project CTA.
- `/dashboard`: project count, recently updated projects, all projects, Create Project action, and a useful first-run empty state; no auth redirects or analytics.
- `/projects/new`: empty reusable builder; successful create navigates to detail.
- `/projects/$projectId`: header, architecture summary, integration list, generated Markdown preview, Copy feedback, Edit link, and Download action.
- `/projects/$projectId/edit`: preloaded reusable builder; successful save updates `updatedAt`, replaces integration rows transactionally, and navigates to refreshed detail.
- A server route for download loads and validates the project, regenerates Markdown, and responds as UTF-8 Markdown with `Content-Disposition: attachment; filename="PROJECT.md"`.
- Use `react-markdown` without raw-HTML support for previewing generated content. Add route-level pending/not-found/error UI and shadcn toast feedback for recoverable copy/save/generation failures.

## Files to modify

Exact CLI-generated boilerplate may vary with the current release, but implementation should converge on these critical paths:

- `PROJECT.md` — remove Next.js/Supabase/PostgreSQL/RLS/user contradictions; document Bun server, SQLite, single-user Alpha, manual browser acceptance, and corrected priority order.
- `package.json`, `bun.lock`, `tsconfig.json`, `vite.config.ts`, `components.json` — scripts and framework/tool configuration.
- `.env.example`, `.gitignore`, `drizzle.config.ts` — server database path, ignored SQLite artifacts, and migration configuration.
- `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/dashboard.tsx` — root document, landing, and dashboard.
- `src/routes/projects/**` — create, detail, edit, and download server route using TanStack file-route conventions.
- `src/styles/app.css` — Tailwind import, design tokens, typography, and global layout.
- `src/components/ui/**` — only shadcn primitives actually used.
- `src/components/layout/**`, `src/components/dashboard/**` — shell, navigation, empty state, and project cards.
- `src/components/project-builder/**` — vertical steps, cards/toggles, review, reset warning, and shared form state.
- `src/db/schema.ts`, `src/db/client.server.ts`, `src/db/migrate.server.ts`, `drizzle/**` — schema, Bun SQLite client, migration runner, and versioned migrations.
- `src/features/stack-catalog/catalog.ts`, `compatibility.ts`, `queries.server.ts`, `seed.server.ts` — definitions, pure rule engine, runtime reads, and idempotent seed/upsert.
- `src/features/projects/schema.ts`, `repository.server.ts`, `server-functions.ts`, `mappers.ts` — canonical validation, transactional persistence, RPC boundary, and DB/domain mapping.
- `src/features/project-generation/generate.ts`, `shared.ts`, `frontend/**`, `backend/**`, `database/**`, `ui/**`, `integrations/**` — deterministic composer and per-technology fragments.
- Colocated `*.test.ts(x)` and `src/test/**` — Vitest setup, fixtures, isolated SQLite integration harness, and tests.

## Reuse

- There is no existing application code to reuse.
- Reuse the TanStack-generated root/router structure and framework APIs; do not recreate routing, RPC, or hydration infrastructure.
- Reuse shadcn/ui Button, Card, Tabs, Alert/Dialog, Tooltip, Switch/Checkbox, Skeleton, and toast primitives as needed rather than creating foundational controls.
- Reuse the canonical Zod schema across wizard validation, server functions, persistence mapping, compatibility validation, and generation.
- Reuse the same catalog slugs/metadata for database seeding, cards, review/detail labels, compatibility inputs, and generator dispatch.
- Reuse one project-builder component and one server-side save pipeline for create/edit semantics where practical.
- Reuse the pure compatibility engine on client choice changes and again on the server before any write.

## Steps

- [ ] 1. Reconcile `PROJECT.md` with the confirmed Alpha stack, no-auth model, SQLite completion criteria, corrected implementation priority, and realistic TanStack Start SSR terminology.
- [ ] 2. Scaffold the current TanStack Start app with Bun, Vite, React 19, strict TypeScript, Tailwind v4, shadcn/ui configuration, Lucide, ESLint, and Vitest; add `dev`, `build`, `start`, `lint`, `typecheck`, `test`, and database scripts.
- [ ] 3. Add environment validation, Bun-server/Nitro production configuration, ignored database files, Drizzle schema/config, initial migration, server-only client, startup/deploy migration command, and isolated test database helper.
- [ ] 4. Define and idempotently seed all Alpha stack options and explicit compatibility rules; implement catalog queries and stable sorting.
- [ ] 5. Implement the canonical project Zod schema and pure compatibility evaluator/reset calculation; exhaustively test valid and invalid combinations.
- [ ] 6. Implement composable per-stack Markdown fragments and the deterministic composer; add fixtures/snapshots for representative combinations, omissions, user text, and all integrations.
- [ ] 7. Implement transactional project repository operations and validated TanStack server functions for list/count, detail, create, and update; add not-found/generation error mapping and SQLite integration tests.
- [ ] 8. Build the root document, theme, responsive dashboard shell, minimal landing page, dashboard cards, recent/all lists, skeletons, and empty/error states.
- [ ] 9. Build the shared non-linear builder with seven vertical steps, selection cards/toggles, disabled reasons, reset confirmation, step/full validation, and warning-driven dependent resets; add focused component tests for state transitions.
- [ ] 10. Connect create and edit routes to catalog/project loaders and mutations, ensure failed saves preserve the draft, and navigate successful writes to refreshed project detail.
- [ ] 11. Build project detail, safe Markdown preview, clipboard feedback, and server-generated `PROJECT.md` download with correct headers; cover generator/download response logic in tests.
- [ ] 12. Complete loading/not-found/page-error states, responsive behavior, keyboard/focus semantics, labels/descriptions, toast messaging, and remove unused scaffold/demo code.
- [ ] 13. Run all quality gates, review the production client bundle for server-only leakage, inspect the final diff, and manually execute the complete Alpha journey in desktop and mobile browser viewports.

## Verification

### Automated

- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`
- Verify a clean database can apply all versioned migrations and idempotently seed the catalog.
- Unit tests cover name/description bounds, integration deduplication, every compatibility rule, dependent reset behavior, deterministic ordering, irrelevant-section omission, Markdown-safe user text, unsupported slugs, and generator errors.
- SQLite integration tests use an isolated temporary database and cover list/count, create/read/update, integration replacement, timestamps, foreign keys, transaction rollback, and not-found behavior.
- Component-level tests cover non-linear navigation, visible validation, disabled reasons, upstream-change warnings/resets, review output, and reset confirmation. No Playwright/Cypress suite is required for Alpha.

### Manual browser acceptance

1. Start from a migrated empty database and confirm landing CTA and dashboard first-use state.
2. Create projects across representative combinations, including Next.js full-stack, separate Node API, Supabase/PostgreSQL, Nuxt-compatible UI, and frontend-only/None database.
3. Attempt every incompatible choice and confirm it is disabled or explained; change upstream selections and confirm warning + targeted reset.
4. Review and save a complete project; confirm dashboard counts/order and project detail architecture.
5. Inspect rendered Markdown, copy it, and download it; verify the file is valid UTF-8 Markdown and always named `PROJECT.md`.
6. Edit every category and description, save, and confirm updated ordering plus regenerated preview/copy/download content.
7. Check loading, malformed/missing project ID, failed persistence/generation, and empty states without blank screens or leaked internals.
8. Repeat core interactions at desktop and mobile widths with keyboard navigation; inspect focus, contrast, overflow, and browser console errors.
9. Start the production Bun build against a persistent SQLite file and repeat a create/read/download smoke check.
