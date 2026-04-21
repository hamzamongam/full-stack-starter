---
name: CRUD Standards and Form Design
description: Guidelines for standardizing CRUD operations (List, Add, Edit, Delete) and Form designs in the UI layer.
---

# CRUD & Form Design Standards

This guide outlines the standard architecture for implementing List, Create, Update, and Delete operations. It is optimized for **React 19**, the **React Compiler**, and **Vertical Slice** architecture.

## 1. List Operations (The DataTable Pattern)
List views must provide high-performance data visualization with stable rendering.

- **Component**: Use `PageLayout` from `@/components/layouts/page-layout`.
- **Data Fetching**: Use TanStack `useQuery` or `useInfiniteQuery`.
- **Table Stability (React 19)**: Define `COLUMNS` as a `static constant` **outside** the React component. This ensures the **React Compiler** treats the column definitions as stable, preventing unnecessary table re-renders or focus issues.
- **Action Rows**: Move row-specific actions (Edit, Delete, View) to a dedicated `[Feature]ActionRow` component inside the table's `cell` definition.

## 2. Add and Edit Operations (Modals & Forms)
CRUD operations should be colocated within the feature directory to maintain the vertical slice.

- **Organization**: Implementation components (like `Add[Feature]Modal.tsx` or `Edit[Feature]Modal.tsx`) must live in `src/features/[featureName]/ui/components/`. 
- **Trigger Pattern**: Use the `@base-ui` pattern: `<DialogTrigger render={<BaseButton>...</BaseButton>} />`.
- **Shared Forms**: Both Add and Edit should share a single `[Feature]Form.tsx` component that accepts a `mode` prop ("create" or "edit").

## 3. The Custom Form Hook (`use[Feature]Form.tsx`)
This hook centralizes mutation logic and optimistic UI state.

- **Optimistic UI**: Use `onMutate` to provide zero-latency feedback by updating the TanStack cache before the server responds.
- **Cache Invalidation**: Properly handle `onSuccess` and `onSettled` to keep the List View and Entity Detail views in sync.
- **Validation**: Rely on the consolidated `[featureName].schema.ts` for Zod validation logic.

## 4. Form Design Best Practices
Standard approach to constructing premium, cohesive forms.

- **Layout**: Use `BaseForm` with a standard layout (e.g., Grid for sidebars or single-column for simple modals).
- **Validation UX**: Schemas MUST include custom error messages (e.g., `z.string().min(1, "Name is required")`) to provide clear feedback.
- **Loading UX**: Always disable the submit button and show a loading spinner (`isPending`) during active mutations.

## Key Rules
- **No Floating Types**: All types used in CRUD operations MUST be imported from the feature's `domain/` layer.
- **Flat UI Components**: Keep all feature UI elements in a flat list under `ui/components/`.
- **Static Definitions**: If a value (like dropdown options or table columns) is independent of props, define it OUTSIDE the component.
