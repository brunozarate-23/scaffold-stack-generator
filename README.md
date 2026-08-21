# Scaffold

Scaffold helps you define a software project's architecture and export it as a structured `PROJECT.md` for AI coding agents to follow.

Create a project, choose its frontend, backend, database, UI system, and integrations, then review, save, and download the generated specification.

## Stack

- TanStack Start, TanStack Router, React, and TypeScript
- Tailwind CSS and Radix UI primitives
- SQLite with Drizzle ORM
- Bun

## Requirements

- [Bun](https://bun.sh/) installed

## Run locally

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

3. Create and seed the SQLite database:

   ```bash
   bun run db:migrate
   bun run db:seed
   ```

4. Start the development server:

   ```bash
   bun run dev
   ```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to the project dashboard.

## Useful commands

```bash
bun run typecheck  # Check TypeScript
bun run lint       # Run ESLint
bun run test       # Run tests
bun run build      # Create a production build
bun run start      # Run the production build
```

## Database

The default database location is `data/scaffold.sqlite`, configured through `DATABASE_URL` in `.env`. Database migrations are stored in `drizzle/`.

To generate a new migration after updating the schema:

```bash
bun run db:generate
bun run db:migrate
```

## Project structure

```text
src/
├── components/           # Shared UI and project-builder components
├── db/                   # SQLite client, schema, migrations, and seeding
├── features/             # Project, stack-catalog, and specification logic
└── routes/               # TanStack Start file-based routes
```

For product requirements and architecture decisions, see [PROJECT.md](./PROJECT.md).
