# Contribution Guidelines

Thank you for your interest in contributing to the Polar platform! These guidelines are designed to make the contribution process smooth and effective for everyone.

## Git Workflow

We use a feature-branch-based workflow. All pull requests should be targeted against the `main` branch.

1.  **Create a Branch:** Create a new branch from the latest `main`. Please use the following naming convention:
    - `feature/<feature-name>` for new features (e.g., `feature/post-editing`)
    - `bugfix/<bug-name>` for bug fixes (e.g., `bugfix/login-form-validation`)
    - `chore/<description>` for maintenance tasks (e.g., `chore/upgrade-dependencies`)

2.  **Develop:** Make your changes on your branch. Ensure your code adheres to the project's coding standards.

3.  **Commit:** Write clear and concise commit messages.

4.  **Test:** Add or update tests for your changes. Run the entire test suite to ensure nothing has broken.
    ```bash
    pnpm test
    ```

5.  **Push & Pull Request:** Push your branch to the remote repository and open a Pull Request (PR) against the `main` branch.
    - Provide a clear title and description for your PR.
    - Link any relevant issues.

6.  **Code Review:** At least one team member must review and approve your PR before it can be merged. Address any feedback or requested changes.

## Coding Standards

### TypeScript
- **Type Safety:** Avoid using `any` whenever possible. Leverage TypeScript's utility types and type inference.
- **ESM:** Use ES Module syntax (`import`/`export`).
- **Readability:** Write clean, readable, and self-documenting code.

### Linting & Formatting
- We use **ESLint** for code quality and **Prettier** for code formatting.
- Before committing, it's a good practice to run the linter:
  ```bash
  pnpm lint
  ```
- The CI pipeline will fail if there are any linting or formatting errors.

## Development Process

- **Keep it Small:** PRs should be small and focused on a single task. This makes them easier and faster to review.
- **Stay Updated:** Regularly rebase your branch on the latest `main` to avoid complex merge conflicts.
  ```bash
  git fetch origin
  git rebase origin/main
  ```
- **Communicate:** If you're working on a large feature, communicate your plan with the team to ensure alignment.