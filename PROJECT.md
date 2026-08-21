# Scaffold

> Working title. The product name is temporary and should be easy to replace before public release.

## 1. Product Overview

Scaffold is a web application for creating structured software project specifications for AI coding agents.

A user defines the technical architecture of a project through a guided interface:

1. Create a project.
2. Give the project a name and description.
3. Select a frontend stack.
4. Select a backend architecture.
5. Select a database if required.
6. Select a UI system.
7. Select optional integrations.
8. Review the resulting architecture.
9. Create the project.
10. View it from a project dashboard.
11. Download a generated `PROJECT.md`.

The generated `PROJECT.md` is intended to be placed at the root of a new software repository and given to an AI coding agent such as Claude Code, Codex, Pi, Cursor, Gemini CLI, or similar tools.

The primary value of Scaffold is not generating application source code.

The primary value is turning product and technical decisions into a clear, consistent, machine-readable implementation specification.

---

# 2. MVP Goal

The MVP must allow a user to go from:

> "I want to build a web application"

to:

> "Here is a structured PROJECT.md describing exactly how this application should be built."

The MVP should prioritize:

* simplicity
* clear architecture choices
* high-quality generated specifications
* predictable output
* minimal setup
* strong compatibility with AI coding agents

The MVP should NOT attempt to be:

* an IDE
* an AI coding agent
* a code generator
* a deployment platform
* a visual website builder
* a full project-management tool
* a GitHub alternative

Those capabilities may be explored later.

---

# 3. Product Stack

Scaffold itself should use the following stack.

## Frontend

* TanStack Start
* TanStack Router
* React
* TypeScript

Use TanStack Start SSR and route loaders for initial rendering and data loading.

TanStack Start route loaders are isomorphic, so database access and mutations must use server functions or server-only modules. Use browser-side React state only when client-side interactivity is necessary.

## Styling

* Tailwind CSS
* shadcn/ui
* Lucide icons

Make a dashboard-like interface, with Linear UI style. The main colors are default dark-mode with lime green as the primary color.
Avoid excessive gradients, glassmorphism, oversized rounded containers, decorative animations, emojis and generic "AI SaaS" visual patterns.

Prefer:

* restrained border radius
* strong typography
* compact forms
* clear information hierarchy
* neutral colors
* useful whitespace
* desktop-first dashboard ergonomics
* responsive mobile support
* no full uppercase except key words.

## Backend

Use TanStack Start as the application backend.

Prefer:

* TanStack Actions for application mutations where appropriate
* TanStack Start server functions for validated application reads and mutations
* TanStack Start server routes when an HTTP endpoint is necessary

Do not create a separate backend service for the MVP.

## Database

Use:

* SQLite
* Drizzle ORM

## Authentication

Nothing for Alpha 1. Alpha is deliberately single-user and does not implement accounts or project ownership. Authentication and server-side ownership checks must be added together in a future authenticated release.

## Validation

Use Zod for application-level schemas and validation.

The project configuration schema must have a canonical Zod representation.

## Package Manager

Use Bun.

---

# 4. Core Product Concepts

The application revolves around three concepts:

## User

An Scaffold user.

A user can own multiple projects.

## Project

A saved software project specification.

Example:

```text
Project
├── General information
├── Frontend
├── Backend
├── Database
├── UI
├── Integrations
└── Generated specification
```

## Stack Option

A selectable technical option supported by Scaffold.
Stack options should ultimately be data-driven rather than hardcoded throughout the UI.

---

# 5. Alpha Supported Stack

Alpha 1 intentionally supports a small number of technologies.

Do not add additional frameworks without explicitly updating this specification.

## 5.1 Frontend

Supported frontend options:

### Next.js

Runtime/framework:

* React
* Next.js
* TypeScript

Recommended for:

* full-stack web applications
* SaaS applications
* dashboards
* content-driven applications

### React + Vite

Runtime/framework:

* React
* Vite
* TypeScript

Recommended for:

* SPAs
* frontend-only applications
* applications with a separate backend

### Nuxt

Runtime/framework:

* Vue
* Nuxt
* TypeScript

Recommended for:

* Vue-based full-stack applications
* Vue dashboards
* SSR applications

---

# 5.2 Backend Architecture

Supported backend options:

## Next.js Full-stack

Backend implemented inside the Next.js application.

Use:

* Server Components
* Server Actions
* Route Handlers

Available only when Next.js is selected as the frontend.

## Node.js REST API

Standalone Node.js backend.

Use:

* TypeScript
* REST
* Fastify

The frontend and backend are separate applications.

Recommended repository structure:

```text
apps/
  web/
  api/
```

## Supabase

Backend-as-a-Service architecture.

Use Supabase for applicable services:

* PostgreSQL
* Auth
* Storage
* server-side functions where required

The frontend communicates with Supabase using its supported SDK and server-side integrations.

## None

Frontend-only application.

No persistent backend is required.

---

# 5.3 Database

Supported database options:

## None

Use when the application does not require persistence.

## PostgreSQL

Default relational database recommendation.

## SQLite

Use for:

* simple applications
* local-first applications
* prototypes
* applications where operating a database server is unnecessary

## MongoDB

Use where a document-oriented data model has been intentionally selected.

Do not recommend MongoDB merely because an application contains JSON-like data.

---

# 5.4 UI Systems

Supported UI options:

## shadcn/ui

Use:

* Tailwind CSS
* shadcn/ui
* Lucide

This should be the recommended/default option for React and Next.js projects.

## Tailwind CSS

Use Tailwind without a predefined component system.

Components should be built specifically for the application.

## Material UI

Use Material UI's component ecosystem.

Available for React-based projects.

## Custom

No predefined component library.

The generated PROJECT.md must instruct the coding agent to establish a basic design system before creating feature-specific components.

---

# 5.5 Optional Integrations

Alpha supports the following optional integrations.

## Authentication

Provide authentication and user management.

The generated specification should adapt the implementation to the selected backend.

For example:

* Supabase backend → Supabase Auth
* Next.js backend → selected compatible authentication implementation

## Stripe

Use for:

* subscriptions
* payments
* checkout
* billing

Do not add Stripe unless selected.

## Resend

Use for application-generated transactional email.

Examples:

* invitations
* verification emails
* notifications
* transactional messages

## Object Storage

Support S3-compatible object storage.

If Supabase is selected as the backend, prefer Supabase Storage unless the user explicitly specifies another provider.

## PostHog

Use for product analytics and optional event tracking.

## Sentry

Use for production error monitoring.

---

# 6. Compatibility Rules

Some technical selections are incompatible.

The UI must prevent invalid combinations rather than allowing them and displaying an error later.
Next.js Full-stack must only be selectable when Next.js is the frontend.
UI options should also respect framework compatibility.
If changing one selection invalidates another selection, warn the user and reset the incompatible value.

---

# 7. Project Creation Flow

Project creation should use a non-linear vertical tabbed multi-step wizard.

Route:

```text
/projects/new
```

Steps:

```text
1. Project
2. Frontend
3. Backend
4. Database
5. UI
6. Integrations
7. Review
```

---

# 7.1 Project

Fields:

### Project Name

A name is required. No more than 144 characters.

### Description

Optional but recommended.
The generated specification should use this information to provide context to the coding agent.

---

# 7.2 Frontend

Display frontend options as selectable cards.

Each option should display:

* name
* short description
* ecosystem/framework
* recommended use cases

Only one option may be selected.

---

# 7.3 Backend

Display compatible backend architectures.
Disable or hide incompatible selections.
Each backend option should explain the architectural consequence of the selection.

---

# 7.4 Database

First determine whether the selected backend requires or supports a database.
The user selects:

* None
* PostgreSQL
* SQLite
* MongoDB

Display a short explanation for each option.

---

# 7.5 UI

Allow the user to select one UI strategy.
Display a small visual preview where practical.
Options should use cards rather than a traditional HTML select.

---

# 7.6 Integrations

Display integrations as independent toggles/cards.
Selecting an integration may expose additional configuration questions in future versions.
Alpha only needs to record the integration selection.
API keys are NOT collected during project creation.

---

# 7.7 Review

Display the entire architecture before project creation.
Allow the user to return to previous steps and edit selections.

Primary action: Create Project
Secondary action: Reset Project

---

# 8. Dashboard

After authentication, users should arrive at:

```text
/dashboard
```

The dashboard should display:
* page title
* Create Project action
* project count
* recently updated projects
* all projects

Do not overbuild dashboard analytics for Alpha 1.
A project card should contain:
* project name
* frontend
* backend
* database
* UI
* updated date
* Open action

---

# 9. Project Dashboard

Route:

```text
/projects/[projectId]
```

Display:

## Header

* project name
* description
* Edit
* Download PROJECT.md

## Architecture

Display sections for:

* frontend
* backend
* database
* UI
* integrations

## PROJECT.md Preview

Display the generated Markdown specification.

The preview should use a Markdown renderer.

Actions:

```text
Copy
Download PROJECT.md
```

Downloading must generate a real `.md` file using the project name:

```text
PROJECT.md
```

The downloaded filename should always be `PROJECT.md`, rather than deriving the filename from the application's project name, because AI agents commonly expect project instruction files at predictable repository locations.

---

# 10. Project Editing

Route:

```text
/projects/[projectId]/edit
```

Reuse the project creation interface.
Saving changes must regenerate the project's generated PROJECT.md.

---

# 11. PROJECT.md Generation

This is the core feature of Scaffold.
Generated output must not simply repeat selected values.
It must translate the user's selections into implementation instructions.

Bad output:

```markdown
Frontend: Next.js
Database: PostgreSQL
UI: shadcn
```

Expected output:

```markdown
## Frontend Architecture

Use Next.js with the App Router and TypeScript.

Prefer React Server Components for pages and data-loading components.
Introduce Client Components only when browser-side state or interactivity requires them.

## Database

Use PostgreSQL as the primary relational database.

Database access must be isolated from presentation components.
Database schemas and migrations must be version-controlled.

## UI

Use Tailwind CSS and shadcn/ui.

Prefer existing shadcn/ui primitives before creating new foundational UI components.
Application-specific components should compose those primitives.
```

The generation system therefore requires templates and rules rather than simple string concatenation.

---

# 12. Generated PROJECT.md Structure

Every generated PROJECT.md should follow approximately this structure:

```markdown
# {Project Name}

## Product Context

## Goals

## Technical Architecture

### Frontend

### Backend

### Database

### UI System

### Integrations

## Repository Structure

## Architecture Rules

## Coding Conventions

## Data Access Rules

## UI Rules

## Security Requirements

## Environment Variables

## Development Workflow

## Definition of Done

## Agent Instructions
```

Sections may be omitted when irrelevant.
For example, a frontend-only project should not contain unnecessary database instructions.

---

# 13. Agent Instructions

Every generated PROJECT.md must end with instructions specifically targeted at AI coding agents.
Example:

```markdown
## Agent Instructions

Before implementing a feature:

1. Read this PROJECT.md completely.
2. Inspect the existing repository before modifying architecture.
3. Reuse existing components and patterns.
4. Do not introduce new frameworks or major dependencies without justification.
5. Keep business logic separate from presentation components.
6. Follow the architecture defined in this document.
7. Validate assumptions against the existing codebase.
8. Prefer small, reviewable changes.
9. Run applicable linting, type checking, and tests before considering a task complete.

If the existing codebase conflicts with this document, identify the conflict before changing architectural direction.
```

This section is important because the primary consumer of the generated document is an AI coding agent.

---

# 14. Data Model

Alpha can use the following basic model.

## projects

```text
id
name
description

frontend_id
backend_id
database_id
ui_id

created_at
updated_at
```

## project_integrations

```text
id
project_id
integration_id
configuration
created_at
```

## stack_options

```text
id
category
slug
name
description
metadata
enabled
sort_order
```

Possible categories:

```text
frontend
backend
database
ui
integration
```

## compatibility_rules

```text
id
source_option_id
target_option_id
relationship
```

Possible relationships:

```text
compatible
incompatible
requires
```

This allows the supported stack catalog to evolve without rewriting UI logic.

---

# 15. Type Model

The application should maintain a canonical validated project configuration.

Conceptually:

```typescript
type ProjectConfiguration = {
  name: string
  description?: string

  frontend: FrontendOption
  backend: BackendOption
  database: DatabaseOption
  ui: UIOption

  integrations: IntegrationOption[]
}
```

Do not pass unstructured configuration objects throughout the application.

Validate project configurations using Zod.

---

# 16. Suggested Application Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── projects/
│   │   ├── new/
│   │   └── [projectId]/
│   │       └── edit/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── projects/
│   └── project-builder/
│
├── features/
│   ├── projects/
│   ├── project-generation/
│   └── stack-catalog/
│
├── lib/
│   ├── validation/
│   └── utils/
│
├── server/
│   ├── projects/
│   └── stack-catalog/
│
└── types/
```

Avoid organizing all business logic inside React components.
Feature-specific logic should live within feature modules or server modules.

---

# 17. PROJECT.md Generator Architecture

PROJECT.md generation should be deterministic for Alpha 1.
Do NOT use an LLM API to generate the document in the initial version.
Instead use composable templates.

Conceptually:

```text
generateProjectMarkdown(project)
    │
    ├── generateHeader()
    ├── generateProductContext()
    ├── generateFrontendSection()
    ├── generateBackendSection()
    ├── generateDatabaseSection()
    ├── generateUISection()
    ├── generateIntegrationSections()
    ├── generateArchitectureRules()
    ├── generateEnvironmentVariables()
    ├── generateDefinitionOfDone()
    └── generateAgentInstructions()
```

Each technology should own its generation fragment.

Example:

```text
generators/
├── frontend/
│   ├── nextjs.ts
│   ├── react-vite.ts
│   └── nuxt.ts
│
├── backend/
│   ├── nextjs.ts
│   ├── node-rest.ts
│   ├── supabase.ts
│   └── none.ts
│
├── database/
│   ├── postgres.ts
│   ├── sqlite.ts
│   ├── mongodb.ts
│   └── none.ts
│
├── ui/
│   ├── shadcn.ts
│   ├── tailwind.ts
│   ├── mui.ts
│   └── custom.ts
│
└── integrations/
    ├── authentication.ts
    ├── stripe.ts
    ├── resend.ts
    ├── storage.ts
    ├── posthog.ts
    └── sentry.ts
```

This architecture is important.
Do not implement the generator as one large conditional function.

---

# 18. Generated Content Model

Each stack option should eventually support metadata similar to:

```typescript
interface StackDefinition {
  id: string
  name: string
  category: StackCategory
  description: string

  compatibleWith?: string[]
  requires?: string[]

  projectMd: {
    architecture?: string
    conventions?: string
    structure?: string
    security?: string
    environment?: string
    agentInstructions?: string
  }
}
```

Alpha may initially implement these definitions in TypeScript rather than storing every generation template in the database.
The database should store project selections.
The application's source code should own generation behavior.

---

# 19. Security

Implement the following from the beginning:

* database-level access restrictions where applicable
* server-side input validation
* safe Markdown rendering
* no secret API keys stored in project configuration
* no arbitrary code execution

Never trust `projectId` alone to authorize access.
Every project operation must confirm ownership.

---

# 20. Error Handling

Provide explicit handling for:
* project not found
* unauthorized project access
* invalid stack configuration
* database failure
* failed save
* failed PROJECT.md generation
* unsupported compatibility combination

Use user-facing toast notifications for recoverable operations.
Use dedicated error states for page-level failures.

---

# 21. Empty States

The dashboard must have a proper first-use state.
Do not show empty charts or meaningless statistics.

---

# 22. MVP Routes

Required routes:

```text
/
 /dashboard

 /projects/new
 /projects/[projectId]
 /projects/[projectId]/edit
```

Optional server endpoints may exist under:

```text
/api/*
```

Do not expose unnecessary public APIs.

---

# 23. Landing Page

The public landing page can remain minimal for Alpha.
It should explain:

### Headline

Define your stack. Give your agent the plan.

### Supporting message

Create a structured software architecture and export it as a PROJECT.md your AI coding agent can follow.

### CTA

Create Project
No elaborate marketing site is required during Alpha.

---

# 24. Alpha User Journey

The primary acceptance flow is:

```text
User
 ↓
Dashboard
 ↓
Create Project
 ↓
Enter Name
 ↓
Choose Frontend
 ↓
Choose Backend
 ↓
Choose Database
 ↓
Choose UI
 ↓
Choose Integrations
 ↓
Review
 ↓
Create
 ↓
Project Dashboard
 ↓
Preview PROJECT.md
 ↓
Download PROJECT.md
 ↓
Place file inside repository
 ↓
Open repository using AI coding agent
```

This entire flow must work before additional product features are added.

---

# 25. Out of Scope for Alpha

Do not implement the following during Alpha 1:

* AI-generated architecture
* LLM API integrations
* auth
* GitHub repository creation
* GitLab integration
* repository inspection
* automatic code generation
* deployment
* hosting
* CI/CD generation
* Docker generation
* editable PROJECT.md templates
* project collaboration
* teams
* organizations
* comments
* public projects
* sharing
* billing
* project import
* stack marketplace
* community templates
* mobile application
* VS Code extension
* CLI
* MCP server

These are potential post-MVP capabilities.

---

# 26. Potential Future Features

The architecture should not prevent future support for:

## More stack categories

* ORM
* auth
* API architecture
* monorepo tooling
* package manager
* testing framework
* deployment
* hosting
* CI/CD
* caching
* queues
* search
* logging
* observability

## More frameworks

* SvelteKit
* Astro
* TanStack Start
* Hono
* FastAPI
* Django
* Go
* Rust

## More databases

* MySQL
* MariaDB
* Redis
* DynamoDB
* Cloudflare D1

## AI assistance

Future versions may allow:

```text
Describe your application
        ↓
AI proposes architecture
        ↓
User modifies architecture
        ↓
Scaffold generates PROJECT.md
```

The AI should recommend configurations.

It should not silently decide architecture for the user.

## Repository integration

Future versions may connect to:

* GitHub
* GitLab

Possible workflow:

```text
Create architecture
        ↓
Connect repository
        ↓
Commit PROJECT.md
```

## Additional agent files

Future versions may generate:

```text
PROJECT.md
AGENTS.md
CLAUDE.md
README.md
architecture.md
design.md
```

These should derive from one canonical project definition rather than containing duplicated contradictory instructions.

---

# 27. Product Principle

Scaffold should treat the project configuration as the source of truth.

```text
                    Project Configuration
                            │
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
      PROJECT.md        Future AGENTS.md   Future tooling
```

The Markdown document is an output.
It is not the underlying data model.
This distinction is important because it allows Scaffold to eventually produce multiple agent-specific formats from the same architecture.

---

# 28. Alpha Completion Criteria

Alpha 1 is complete when:
* a user can create a project
* project name and description can be stored
* frontend can be selected
* backend can be selected
* database can be selected
* UI system can be selected
* integrations can be selected
* incompatible combinations are prevented
* projects persist in SQLite
* users can see their projects on a dashboard
* users can reopen a project
* users can edit a project
* a useful PROJECT.md is generated from selections
* generated Markdown can be previewed
* generated Markdown can be copied
* generated Markdown can be downloaded
* Alpha operates as a single-user local workspace; no authentication or ownership boundary exists yet
* the complete primary user journey works
* linting passes
* TypeScript checking passes
* production build passes

---

# 29. Implementation Priority

Implement in this order:

```text
1. Base TanStack Start application
2. shadcn/ui design foundation
3. SQLite and Drizzle configuration
4. Database schema and migrations
5. Stack catalog
7. Project configuration schema
8. Project creation wizard
9. Compatibility engine
10. Project persistence
11. Dashboard
12. Project detail page
13. PROJECT.md generator
14. Markdown preview
15. Download functionality
16. Editing
17. Error/empty/loading states
18. Responsive polish
19. Testing and cleanup
```

Do not begin future features until the Alpha acceptance flow is complete.

---

# 30. Definition of Done

A feature is complete when:

* implementation matches this specification
* TypeScript passes without errors
* linting passes
* production build succeeds
* server-side authorization is enforced
* loading states exist where required
* errors are handled
* empty states are handled
* responsive behavior is acceptable
* no unnecessary dependencies were introduced
* existing components were reused where appropriate
* related dead code has been removed

---

# 31. Instructions for AI Coding Agents

This file is the architectural source of truth for Scaffold.
Before modifying the project:

1. Read this document completely.
2. Inspect the existing repository.
3. Understand existing architecture before creating new abstractions.
4. Prefer existing components, utilities, schemas, and patterns.
5. Do not introduce a new framework, database, state-management library, or major dependency without explicit justification.
6. Keep database operations and business logic outside presentation components.
7. Maintain strict TypeScript typing.
8. Validate all external input.
9. Enforce authorization server-side.
10. Avoid duplicating architecture or business logic.
11. Prefer small modules over large multi-purpose files.
12. Do not prematurely generalize Alpha features for hypothetical future use cases.
13. Keep generated PROJECT.md behavior deterministic.
14. Do not introduce an LLM dependency into the PROJECT.md generator during Alpha.
15. Run linting, type checking, and applicable tests after meaningful changes.
16. Do not consider a feature complete merely because the UI renders.
17. Preserve the Alpha scope defined in this document.

When this document conflicts with an implementation detail in the repository, identify the conflict and determine whether the implementation or this specification is outdated before changing architectural direction.
