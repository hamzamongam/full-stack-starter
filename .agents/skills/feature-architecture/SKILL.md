---
name: Feature Architecture Style
description: Guidelines for scaffolding a new feature using the existing domain/ui structure and ORPC definitions.
---

# Feature Architecture & Code Style Guide

This project follows a strict **Vertical Slices** architectural pattern. When creating or modifying features, you MUST adhere to this structure to maintain consistency, security, and React 19/Compiler performance.

## Directory Structure

Every new feature should be placed in `src/features/<featureName>/`. 
The feature directory is split into two main areas: `domain` (server/business logic) and `ui` (client/presentation layer).

```text
src/features/[featureName]/
├── domain/                          # Server-side & Business Logic
│   ├── [featureName].contract.ts    # ORPC contract definitions
│   ├── [featureName].repo.ts        # Database access (Prisma)
│   ├── [featureName].router.ts      # ORPC router implementations
│   ├── [featureName].schema.ts      # Consolidated Zod & TS Types
│   └── [featureName].service.ts     # Business logic layer
└── ui/                              # Client-side & React Components
    ├── components/                  # Flat list of UI components & modals
    ├── hooks/                       # Custom hooks (Queries/Mutations)
    └── view/                        # Page-level containers (Views)
```

## Domain Layer

### 1. Schema (`[featureName].schema.ts`)
- **Single Source of Truth**: Define all Zod schemas and TypeScript types here. Do NOT create separate `type.ts` files.
- **Custom Messages**: Use user-friendly error messages (e.g., `.min(1, "Title is required")`).
- **Prisma Integration**: Export `TaskModel` or similar Prisma payload types for service layer use.

### 2. Repository (`[featureName].repo.ts`)
- **Strict Typing**: Use Prisma-generated types for inputs (e.g., `Prisma.TaskWhereInput`).
- **Flexibility**: Always support optional `orderBy` and `where` parameters in `getAll` methods instead of hardcoding sort order.
- **Transaction Support**: Use `$transaction` for count + findMany operations.

### 3. Router (`[featureName].router.ts`)
- **Security First**: Use the pre-configured `authedProcedure` for all routes requiring authentication.
- **Context Injection**: Use `. $context<Context>().use(requiredAuthMiddleware)` if manual setup is required.

## UI Layer

### 1. React 19 & Compiler Optimization
- **Stable Constants**: Define data table columns, static configs, and initial states as `const` **outside** the component. This allows the **React Compiler** to optimize the component without manual `useMemo` hooks.
- **Optimistic UI**: Implement `onMutate` handlers in feature hooks to provide a "premium" snappy feel (zero-latency updates).

### 2. Components (`components/`)
- **Flat Structure**: All feature-specific components, including Modals and Dialogs, live here. Do not use a `widgets` subfolder.
- **Composition**: Use small, focused components (e.g., `featureActionRow`, `featureForm`) rather than large monoliths.

## Key Rules
- **Pure Domain**: The `domain` folder must NEVER import from the `ui` folder.
- **Secure by Default**: Every new ORPC router MUST be protected by authorization middleware unless it is explicitly public (e.g., Login/Signup).
- **Clean Cleanup**: Delete empty `data/`, `type.ts`, or redundant directories immediately.
