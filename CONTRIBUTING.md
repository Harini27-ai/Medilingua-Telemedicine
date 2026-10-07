# Contributing to MediLingua

Thank you for your interest in contributing to **MediLingua**! We welcome contributions from healthcare technologists, developers, translators, and open-source enthusiasts.

## Code of Conduct

This project is governed by the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the Repository:** Create your own fork on GitHub.
2. **Clone Locally:**
   ```bash
   git clone https://github.com/<your-username>/Medilingua-Telemedicine.git
   cd Medilingua-Telemedicine
   ```
3. **Install Dependencies:**
   ```bash
   npm run install:all
   ```
4. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```

## Development Workflow

- Run frontend dev server: `npm run dev:frontend`
- Run backend API server: `npm run dev:backend`
- Ensure code compiles cleanly without syntax errors before committing.

## Commit Message Conventions

We follow the Conventional Commits standard:
- `feat:` A new user-facing feature
- `fix:` A bug fix
- `docs:` Documentation improvements
- `style:` Formatting, missing semicolons, etc.
- `refactor:` Code restructuring without functional change
- `test:` Adding or updating tests
- `ci:` Continuous Integration changes

## Submitting Pull Requests

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request pointing to `main`.
3. Provide a clear description of the problem solved and test steps conducted.
4. Verify all automated CI checks pass.
