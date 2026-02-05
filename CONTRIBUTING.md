# Contributing to SEO Command Center

First off, thanks for taking the time to contribute! 🎉

This document provides guidelines and instructions for contributing to the SEO Command Center project.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites
- Node.js >= 20.9
- pnpm >= 8.x
- Git
- macOS, Linux, or Windows (with WSL)

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/JeromyJSmith/seo_command_center.git
cd seo_command_center

# Install dependencies using pnpm
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

## Development Workflow

### Branches
- `master` - Production-ready code
- `develop` - Development branch for next release
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `docs/*` - Documentation branches

### Making Changes

1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes:
   - Follow the existing code style
   - Write meaningful commit messages
   - Add tests for new functionality
   - Update documentation as needed

3. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request:
   - Use the provided PR template
   - Link related issues
   - Add descriptive title and description

## Commit Message Convention

We follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring without feature/bug changes
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Build process, dependencies, etc.

### Example
```
feat(folder-scanner): add recursive directory analysis

Implement recursive scanning of folder structures with file type
analysis and manifest generation for AI documentation.

Closes #123
```

## Code Style

### TypeScript
- Use strict TypeScript (`strict: true` in tsconfig.json)
- Define explicit types for function parameters and returns
- Avoid `any` types

### React/Next.js
- Use functional components
- Use hooks instead of class components
- Follow React best practices
- Use Server Components when possible

### Formatting
- ESLint and Prettier are configured
- Run `pnpm lint` to check for issues
- Run `pnpm format` to auto-fix formatting issues

## Testing

- Write tests for new features
- Write tests for bug fixes
- Run `pnpm test` before submitting PR
- Aim for >80% code coverage

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for public APIs
- Update CHANGELOG.md
- Include code examples when helpful

## PR Review Process

1. At least one approval required before merge
2. All CI checks must pass
3. No merge conflicts
4. Code review feedback must be addressed
5. Squash commits before merging (recommended)

## Reporting Bugs

Use the Bug Report issue template:
- Clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Environment details
- Screenshots if applicable

## Feature Requests

Use the Feature Request issue template:
- Problem description
- Proposed solution
- Alternative approaches
- Use cases

## Questions?

Feel free to:
- Open a Discussion
- Ask in GitHub Issues
- Contact the maintainers

---

**Happy Contributing!** 🚀

Co-Authored-By: Warp <agent@warp.dev>
