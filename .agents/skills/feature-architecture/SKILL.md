---
name: Feature Architecture Style
description: Guidelines for scaffolding a new feature using the existing domain/ui structure and ORPC definitions.
---

# Feature Architecture & Code Style Guide

This project follows a strict feature-based architecture pattern. When creating or modifying features, you MUST adhere to this structure to maintain consistency across the codebase.

## Directory Structure

Every new feature should be placed in `src/features/<featureName>/`. 
The feature directory is split into two main areas: `domain` (server/business logic) and `ui` (client/presentation layer).

```text
src/features/[featureName]/
├── domain/                          # Server-side & Business Logic
│   ├── [featureName].schema.ts      # Zod schemas & TypeScript types
│   ├── [featureName].repo.ts        # Database access (Prisma queries)
│   ├── [featureName].service.ts     # Business logic layer (uses repo)
│   ├── [featureName].contract.ts    # ORPC contract definitions (inputs/outputs)
│   └── [featureName].router.ts      # ORPC router implementations
└── ui/                              # Client-side & React Components
    ├── components/                  # UI components specific to the feature
    ├── hooks/                       # Custom hooks (e.g., specific TanStack queries/mutations)
    └── view/                        # Page-level view containers
```

## Domain Layer

### 1. Schema (`[featureName].schema.ts`)
- Defines Zod schemas for input validation and database models.
- Exports inferred TypeScript types (e.g., `export type TFeature = z.infer<typeof FeatureSchema>;`).
- Contains constants or base schemas used across the feature.

### 2. Repository (`[featureName].repo.ts`)
- Contains all raw database interaction utilizing Prisma (`import { prisma } from "@/db";`).
- Defined as a class: `export class FeatureRepository { constructor(private db: typeof prisma) {} ... }`.
- Methods should return raw data or null/undefined.

### 3. Service (`[featureName].service.ts`)
- Handles business logic, validations, and orchestrates calls between repositories or other services.
- Defined as a class: `export class FeatureService { constructor(private featureRepo: FeatureRepository) {} ... }`.
- Throw domain-specific errors if necessary.

### 4. Contract (`[featureName].contract.ts`)
- Uses `@orpc/contract` and Zod to define input/output schemas for the feature's API.
- Reuses schemas from `[featureName].schema.ts`.
- Example format:
  ```typescript
  export const FeatureContract = oc.router({
      create: oc.input(CreateSchema).output(SuccessResponseSchema(ModelSchema)),
      // ...
  });
  ```

### 5. Router (`[featureName].router.ts`)
- Implements the contract's routes using `@orpc/server`.
- Reuses `toSuccessResponse` formatting utility.
- Exposes standard CRUD or business operations.

## UI Layer

### 1. Components (`components/`)
- Dumb React components for visualizing feature structures.
- Use `lucide-react` for icons and standard UI/Design systems available in `src/components/ui/`.

### 2. Hooks (`hooks/`)
- Contains feature specific abstractions or local state logic.

### 3. View (`view/`)
- Smart components acting as whole page sections or features.
- Connects to data sources via TanStack query using ORPC client.
- Orchestrates multiple `components/`.

## Key Rules
- NEVER mix UI logic inside the `domain` folder or vice versa.
- ALWAYS use the Repository pattern for database queries.
- Validate all incoming ORPC requests using Zod schemas defined in `[featureName].schema.ts`.
