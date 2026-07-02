```markdown
# caja-chica Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `caja-chica` repository, a TypeScript React codebase. You'll learn how to structure files, write imports/exports, follow commit message guidelines, and write tests. This guide also provides suggested commands for common workflows.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.tsx`, `expenseList.ts`

### Import Style
- Use **relative imports** for modules.
  - Example:
    ```typescript
    import { ExpenseItem } from './expenseItem';
    import { formatDate } from '../utils/dateUtils';
    ```

### Export Style
- Use **named exports**.
  - Example:
    ```typescript
    // expenseItem.ts
    export function ExpenseItem(props: Props) { ... }
    ```

### Commit Patterns
- Commit messages are **freeform** (no strict type prefixes).
- Average commit message length: ~57 characters.
- Prefixes are sometimes used but not enforced.

  **Example:**
  ```
  Add new expense form with validation
  ```

## Workflows

### Adding a New Component
**Trigger:** When you need to create a new UI component.
**Command:** `/add-component`

1. Create a new file in camelCase, e.g., `myNewComponent.tsx`.
2. Use a named export for your component.
    ```typescript
    export function MyNewComponent() { ... }
    ```
3. Import the component using a relative path where needed.
    ```typescript
    import { MyNewComponent } from './myNewComponent';
    ```
4. Write a corresponding test file if applicable (see Testing Patterns).

### Writing a Commit
**Trigger:** When committing changes.
**Command:** `/commit`

1. Write a descriptive, freeform commit message (~57 chars).
2. Optionally use a prefix, but it's not required.
    ```
    Update expense list to support filtering by date
    ```

### Importing and Exporting Modules
**Trigger:** When sharing code between files.
**Command:** `/import-export`

1. Export functions/components using named exports.
    ```typescript
    export function calculateTotal() { ... }
    ```
2. Import using relative paths.
    ```typescript
    import { calculateTotal } from '../utils/calculateTotal';
    ```

## Testing Patterns

- Test files use the pattern: `*.test.*`
  - Example: `expenseList.test.tsx`
- The testing framework is **unknown** from analysis, but tests should be colocated with the code or in a `__tests__` directory.
- Example test file:
    ```typescript
    // expenseList.test.tsx
    import { render } from '@testing-library/react';
    import { ExpenseList } from './expenseList';

    test('renders expense list', () => {
      render(<ExpenseList expenses={[]} />);
      // assertions...
    });
    ```

## Commands
| Command         | Purpose                                         |
|-----------------|-------------------------------------------------|
| /add-component  | Scaffold a new React component                  |
| /commit         | Write a commit message following conventions     |
| /import-export  | Reference for import/export patterns             |
```
