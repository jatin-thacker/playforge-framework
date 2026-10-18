# PlayForge Framework Starter

Starter repository for the PlayForge test automation course, reflecting the project state at the end of Chapter 5 ("Your First Playwright Test").

Built on Playwright and Node.js with native ECMAScript Modules (ESM).

## Prerequisites

- Node.js 20.11 or higher
- npm 10 or higher

## Quickstart

Follow these steps to clone, set up, and execute the smoke test suite:

```bash
# 1. Clone the repository
git clone <repo-url>
cd playforge-framework

# 2. Install pinned dependencies
npm ci

# 3. Install the Playwright Chromium browser
npx playwright install chromium

# 4. Run the test suite
npx playwright test

# 5. Open the HTML test report
npx playwright show-report
```

## Environments

The test suite is configured to run against different environments using the `ENV` variable. Configuration files are stored in `config/`:

- **`prod` (default):** Targets live Meridian Ops at `https://practice.learnplayforge.com` (`config/.env.prod`).
- **`local`:** Targets a local instance of the practice app at `http://127.0.0.1:8777` (`config/.env.local`).

### Switching Environments

To run tests against a non-default environment, specify `ENV`:

**macOS / Linux:**
```bash
ENV=local npx playwright test
```

**Windows (PowerShell):**
```powershell
$env:ENV="local"; npx playwright test; Remove-Item Env:\ENV
```

**Windows (cmd):**
```cmd
set ENV=local && npx playwright test
```

If `BASE_URL` is missing or undefined in the selected environment file, the framework fails immediately with a clear error identifying the variable and file path.

### Why `?mock=static` and `seed=42`

Tests navigate with `?mock=static&seed=42`:
- `?mock=static` makes Meridian Ops answer from fixed files instead of a service worker, which reloads the page once on a fresh browser context.
- `seed=42` makes mock data deterministic and identical across every test run.
- Meridian Ops automatically carries both parameters across internal links and redirects (including post-login redirects).

## Project Structure

```
playforge-framework/
  ├── .github/
  │   └── workflows/
  │       └── playwright.yml      # GitHub Actions CI workflow
  ├── config/
  │   ├── .env.local              # Local environment variables
  │   ├── .env.prod               # Production environment variables
  │   └── environments.js         # Environment loader and validator
  ├── tests/
  │   └── smoke/
  │       ├── home.spec.js        # Home page smoke test
  │       └── login.spec.js       # Clerk login smoke test
  ├── .gitignore                  # Ignored files and artifacts
  ├── package.json                # Project metadata and pinned dependencies
  ├── playwright.config.js        # Playwright runner configuration
  └── README.md                   # Documentation and usage guide
```
