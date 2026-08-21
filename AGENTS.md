# AGENTS.md

## Project

This project uses **TanStack Start**.

Before planning, implementing, or modifying anything, read:

- [`PROJECT.md`](./PROJECT.md) — product requirements, architecture, stack, conventions, and project scope.

`PROJECT.md` is the primary source of truth for this repository.

## Development Guidelines

- Follow TanStack Start conventions and recommended patterns.
- Use TypeScript.
- Prefer simple, maintainable solutions over unnecessary abstractions.
- Reuse existing components, utilities, and patterns before creating new ones.
- Keep components and modules focused and reasonably small.
- Maintain type safety; avoid `any` unless absolutely necessary.
- Do not introduce new dependencies without a clear reason.
- Follow the existing project structure and naming conventions.
- Do not change architecture or technology choices defined in `PROJECT.md` without explicit approval.

## Before Making Changes

1. Read `PROJECT.md`.
2. Inspect the relevant existing code.
3. Understand existing patterns before introducing new ones.
4. Make the smallest coherent change necessary.

## After Making Changes

Run the relevant checks when available:

```bash
bun run typecheck
bun run lint
bun run test
