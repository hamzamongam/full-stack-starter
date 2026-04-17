---
name: CRUD Standards and Form Design
description: Guidelines for standardizing CRUD operations (List, Add, Edit, Delete) and Form designs in the UI layer.
---

# CRUD & Form Design Standards

This guide outlines the standard architecture and styling for implementing List, Create, Update, and Delete operations, alongside form designs, in the UI layer of any feature.

## 1. List Views
The List View acts as the entry point for viewing feature records.

- **Component**: Use `PageLayout` from `@/components/layouts/page-layout` as the root container.
- **Data Fetching**: Use TanStack `useQuery` paired with the `orpc` client (e.g., `orpc.feature.getAll.queryOptions({ input: { page: 1, limit: 10 } })`).
- **Actions**: Add a "Create" button in the `actions` prop of `PageLayout`. The button should use `BaseButton`, include a `lucide-react` `Plus` icon, and navigate via `@tanstack/react-router` `Link`.
- **Table**: Move the actual table rendering to a separate `[Feature]ListTable` component. Pass the fetched `data` and `isLoading` state as props.

## 2. Add and Edit Views
Add and Edit operations usually share the same underlying Form component but are kept as separate views for clarity.

### Add View (`AdminAdd[Feature]View.tsx` / `Add[Feature]Modal.tsx`)
- Container: Uses `@components/ui/dialog` or `PageLayout`.
- Base-UI Trigger: Because we use `@base-ui`, components like `DialogTrigger` use the `render={<YourElement />}` prop instead of Radix's `asChild`. Example: `<DialogTrigger render={<BaseButton>Add</BaseButton>} />`
- Behavior: Initializes the feature's custom form hook without an ID.
- Submit Action: Loading state (`isLoading={isPending}`).

### Edit View (`AdminEdit[Feature]View.tsx`)
- Parameter: Receives `id` as a prop (from the route).
- Data Fetching: Queries `orpc.feature.getById` using `useQuery` to fetch the entity.
- Loading/Error States: Display a loading spinner or an error fallback if data cannot be fetched using conditional returns.
- Hook Initialization: Passes the fetched data to the custom form hook to initialize `defaultValues`.

## 3. Custom Form Hook (`use[Feature]Form.tsx`)
This encapsulates the complex logic of data mutations and cache invalidation.

- Uses `useOrpcMutation` from `@/hooks/useOrpcMutation`.
- **Optimistic Updates**: Highly recommended. In `onMutate`, cancel outgoing queries, snapshot the previous data, and update the cache so the UI reacts instantly.
- **Cache Invalidation**: On `onSuccess` or `onSettled`, forcefully invalidate the `getAll` and `getById` query keys to ensure fresh data.
- **Default Values**: Provides a fallback `defaultValues` object mapping database properties to form expectations.
- **Navigation**: Imports `useNavigate` from `@tanstack/react-router` to redirect back to the List view on successful mutation.
- **State Setup**: Relies on `useBaseForm` hook to initialize the `react-hook-form` context.

## 4. Form Design (`[Feature]Form.tsx`)
The standard approach to constructing visually cohesive forms.

- **Wrapper**: Wrap everything inside `<BaseForm>` and attach the `form` and `onSubmit` props. Include a fade-in animation (`animate-in fade-in slide-in-from-bottom-4 duration-500 px-1 pb-4`).
- **Layout Construction**: Use CSS Grid. A common layout splits into a 2/3 main column and a 1/3 sidebar column (`grid grid-cols-1 md:grid-cols-3 gap-6`).
  - **Main Column (`md:col-span-2`)**: For primary inputs like Name, Description, Pricing.
  - **Sidebar Column**: For metadata like Status, Images, and Categories.
- **Field Grouping**: Use `<BaseForm.Card title="Section Name">` to create semantic groups of fields (e.g., Basic Information, Pricing, Inventory).
- **Inputs & Fields**:
  - Implement actual fields using `<BaseForm.Item control={form.control} name="fieldName" label="Field Label">`.
  - Inside the wrapper, use standard Base components: `<BaseInput>`, `<BaseSelect>`, or `shadcn` components like `<Textarea>`.
