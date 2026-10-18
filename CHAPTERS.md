# Framework Evolution — Chapter by Chapter

Append-only record of how `playforge-framework/` grows across the course, with verification runs and lesson notes for Opus.

---

## ch07 — First Page Object (`LoginPage`)

### What arrived
- `src/pages/LoginPage.js`: The first page object representing the Meridian Ops login page. Encapsulates user-facing locators (`getByLabel`, `getByRole`, `getByTestId`) and actions (`goto`, `login`).
- `tests/smoke/login.spec.js`: Refactored to import and instantiate `LoginPage`.
- `playwright.config.js`: Updated HTML reporter config to `{ open: 'never' }` in both CI and local runs to avoid hanging test runners.

### Run
- Repeat new spec (`npx playwright test tests/smoke/login.spec.js --repeat-each=3 --reporter=list`):
  `3 passed (4.2s)`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `2 passed (3.4s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `2 passed (3.2s)`

### Lesson notes for Opus
- **Locators vs. Assertions separation:** Students coming from Selenium or writing ad-hoc scripts frequently put assertions inside page object methods (e.g. `assertLoggedIn()`). Playwright's [Page Object Models guide](https://playwright.dev/docs/pom) recommends exposing locators and action methods while keeping `expect(locator)...` assertions in test files. This ensures that failure traces point directly to test intent and keep page objects reusable across varying assertions.
- **Accessible labels:** Meridian Ops' login fields use `<label for="...">Work email</label>` and `<label for="...">Password</label>`, matching `page.getByLabel()`. Using labels teaches accessibility-first locators over brittle CSS classes or IDs.
- **Deterministic transport:** Pinning `?mock=static&seed=42` prevents Service Worker background registration on first load from wiping out filled credentials.

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- None. All specs passed against live Meridian Ops.

---

## ch16 — Test Organization and Tag Filtering

### What arrived
- Folders organized by test type: `tests/smoke/`, `tests/ui/`, `tests/api/`, and `tests/e2e/`.
- `tests/ui/catalog.spec.js`: UI test verifying catalog product grid and search input, tagged `@regression`.
- `tests/api/health.spec.js`: API smoke and regression test verifying `/api/health` status and schema, tagged `@smoke @regression`.
- `tests/e2e/orders-flow.spec.js`: End-to-end user journey test verifying clerk login and navigating to orders table, tagged `@regression`.
- `tests/smoke/home.spec.js` and `tests/smoke/login.spec.js`: Updated test titles to include `@smoke` tags.
- `package.json`: Added `test:smoke` (`playwright test --grep @smoke`) and `test:regression` (`playwright test --grep @regression`).

### Run
- Repeat new specs (`--repeat-each=3 --reporter=list`):
  - `tests/ui/catalog.spec.js`: `3 passed (4.3s)`
  - `tests/api/health.spec.js`: `3 passed (1.7s)`
  - `tests/e2e/orders-flow.spec.js`: `3 passed (5.1s)`
- Filter scripts:
  - `npm run test:smoke`: `3 passed (3.7s)`
  - `npm run test:regression`: `3 passed (4.5s)`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `5 passed (7.4s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `5 passed (7.5s)`

### Lesson notes for Opus
- **Tag conventions in Playwright:** Playwright uses regex grep matching on test titles rather than separate config files for suites. Placing `@smoke` and `@regression` directly in `test('title @tag', ...)` allows filtering via `--grep @smoke` or `--grep-invert @regression` per [Playwright Test Annotations & Tags](https://playwright.dev/docs/test-annotations#tag-tests).
- **Test categorization hierarchy:** Separating `tests/smoke`, `tests/ui`, `tests/api`, and `tests/e2e` establishes a clean test pyramid. Smoke tests run in seconds on every push; regression runs cover broader UI and E2E journeys.
- **Request context for API tests:** In `tests/api/health.spec.js`, using `{ request }` fixture avoids launching a browser entirely, running in under 200ms.

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- None. All specs passed against live Meridian Ops.

---

## ch18 — Environment Selection and Validation

### What arrived
- `config/environments.js`: Updated to select `config/.env.<env>` via `ENV=local|dev|qa|staging|prod` (defaults to `prod`), enforces allowed values, and validates required keys (`BASE_URL`) failing fast with a list of all missing keys.
- `config/.env.example`: Template for environment files with guidance.
- `config/.env.dev`, `config/.env.qa`, `config/.env.staging`: Environment configurations pointing to Meridian Ops (`https://practice.learnplayforge.com`).

### Run
- Validation check (`ENV=invalid`):
  `Error: Invalid ENV "invalid". Allowed values: local, dev, qa, staging, prod`
- Dev run (`ENV=dev npx playwright test tests/api/health.spec.js --reporter=list`):
  `1 passed (1.1s)`
- QA run (`ENV=qa npx playwright test tests/api/health.spec.js --reporter=list`):
  `1 passed (1.0s)`
- Full suite run 1 (`CI=1 ENV=prod npx playwright test --reporter=list`):
  `5 passed (7.3s)`
- Full suite run 2 (`CI=1 ENV=prod npx playwright test --reporter=list`):
  `5 passed (7.1s)`

### Lesson notes for Opus
- **Dotenv override semantics:** Using `dotenv.config({ path, override: false })` ensures that variables provided via CI/CD runners or the terminal shell take precedence over `.env` files on disk.
- **Fail-fast validation:** Checking all required keys in one pass and displaying `[KEY1, KEY2]` prevents the frustrating cycle of discovering missing variables one run at a time in CI.
- **Single practice host across environments:** In the PlayForge curriculum, all remote environments (`dev`, `qa`, `staging`, `prod`) intentionally point to `https://practice.learnplayforge.com`. This simulates an enterprise tiering model while ensuring student runs remain completely reproducible against the pinned mock platform.

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- None. All specs passed against live Meridian Ops.
