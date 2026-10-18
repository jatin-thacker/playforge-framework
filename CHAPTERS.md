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

---

## ch19 — Custom Fixtures Architecture

### What arrived
- `src/fixtures/index.js`: Extends Playwright's base `test` with custom page-object fixtures (including `loginPage`) and re-exports `test` and `expect`.
- All specs (`tests/smoke/home.spec.js`, `tests/smoke/login.spec.js`, `tests/ui/catalog.spec.js`, `tests/api/health.spec.js`, `tests/e2e/orders-flow.spec.js`): Updated to import `{ test, expect }` exclusively from `src/fixtures/index.js`, eliminating direct imports from `@playwright/test`.

### Run
- Repeat refactored fixture spec (`npx playwright test tests/smoke/login.spec.js --repeat-each=3 --reporter=list`):
  `3 passed (3.6s)`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `5 passed (7.0s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `5 passed (6.9s)`

### Lesson notes for Opus
- **Single import rule:** Requiring every spec to import `test` and `expect` from `src/fixtures/index.js` establishes an architectural foundation where any new fixture, setup hook, or custom matcher is instantly available to every test in the repository without editing test headers.
- **Fixture lifecycle vs. `beforeEach`:** Traditional test frameworks rely on `beforeEach` hooks and shared mutable variables (`let loginPage; beforeEach(...)`). Playwright fixtures are lazily instantiated on demand per test, clean up automatically after `await use(...)`, and run in parallel workers safely without state contamination per [Playwright Test Fixtures](https://playwright.dev/docs/test-fixtures).

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- None. All specs passed against live Meridian Ops.

---

## ch20 — Complete Page Object Layer and Reusable Components

### What arrived
- `src/components/TableComponent.js`: Reusable component for HTML data tables (row lookups, cells, header queries).
- `src/components/ModalComponent.js`: Reusable component for modal dialogs (open, save, cancel, field locators).
- `src/components/DatePickerComponent.js`: Reusable component for date picker panels and date inputs.
- `src/pages/OrdersPage.js`: Full page object for orders management, wrapping table and edit modal components.
- `src/pages/CatalogPage.js`: Full page object for catalog search, category filtering, and cart operations.
- `src/pages/FulfilmentPage.js`: Full page object for order fulfilment multi-step wizard, wrapping date picker component.
- `src/fixtures/index.js`: Registered `ordersPage`, `catalogPage`, and `fulfilmentPage` fixtures.
- `tests/ui/catalog.spec.js` and `tests/e2e/orders-flow.spec.js`: Refactored to use `catalogPage` and `ordersPage` fixtures.
- `tests/ui/fulfilment.spec.js`: New spec verifying fulfilment wizard step 1 and step indicator.

### Run
- Repeat new fulfilment spec (`npx playwright test tests/ui/fulfilment.spec.js --repeat-each=3 --reporter=list`):
  `3 passed (3.6s)`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `6 passed (8.9s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `6 passed (8.6s)`

### Lesson notes for Opus
- **Component vs. Page Object composition:** In large enterprise applications, repeating table parsing or date picker logic inside every page object causes maintenance sprawl. Decomposing shared UI widgets into component objects (e.g., `TableComponent`, `DatePickerComponent`) that are instantiated as properties of a page object (`this.table = new TableComponent(...)`) mirrors real-world design systems.
- **Strict adherence to No-Assertions rule:** All page objects and components strictly hold locators and user actions. Assertions stay in the spec files, ensuring that when an assertion fails, the test failure report clearly identifies the business expectation that failed rather than a generic helper error.
- **Authentication prerequisites on sub-pages:** Meridian Ops automatically redirects unauthenticated visits to `orders.html` and `fulfilment.html` back to `login.html`. Tests navigating to these pages must establish a session (via `loginPage.login(...)` or `storageState`).

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- None. All specs passed against live Meridian Ops.

---

## ch21 — External Test Data (Excel, CSV, JSON) and Role Matrix

### What arrived
- `package.json`: Pinned `exceljs` exactly to `4.4.0` in `devDependencies`.
- `src/lib/excel.js`: Helper module supporting `readExcel` and `writeExcel` using buffer streaming to ensure node/browser compatibility.
- `src/lib/csv.js`: Dependency-free CSV parser and serializer (`readCsv`, `writeCsv`, `parseCsv`, `parseCsvLine`) correctly handling quoted commas and escaped quotes.
- `test-data/users.xlsx`: Data-driven users table (manager, clerk, invalid user).
- `test-data/orders.csv`: Sample orders dataset featuring quoted commas in fields.
- `test-data/products.json`: Catalog products reference dataset.
- `test-data/roles.json`: Role capabilities mapping (manager, clerk, invalid).
- `tests/e2e/role-matrix.spec.js`: Parameterized role matrix test driven by `test-data/users.xlsx` asserting user identities, rejection of invalid credentials, and a live API state check.

### Run
- Repeat new role matrix spec (`npx playwright test tests/e2e/role-matrix.spec.js --repeat-each=3 --reporter=list`):
  `12 passed (13.3s)`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `10 passed (15.8s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `10 passed (15.7s)`

### Lesson notes for Opus
- **ExcelJS ESM vs CJS bundling:** In modern Node ESM (`type: "module"`), importing `exceljs` directly triggers a circular dependency issue in its unbundled transitive dependencies (`traverse`/`is-generator-function`). Importing from `exceljs/dist/exceljs.min.js` and using `xlsx.load(buffer)` / `xlsx.writeBuffer()` with Node's native `fs/promises` completely avoids runtime file-system quirks while preserving clean async APIs.
- **Data-driven test generation:** Top-level `await readExcel(...)` dynamically generates test cases at file evaluation time per [Playwright Parameterized Tests](https://playwright.dev/docs/test-parameterized). This gives each user role its own distinct entry in the test reporter rather than hiding multiple users inside a single loop.
- **Handling quoted commas in CSV without dependencies:** A common interview and practical trap is splitting CSV lines with `.split(',')`. Any field like `"Tata Consultancy, Mumbai"` breaks. Writing a stateful character-by-character tokenizer (`inQuotes`) teaches students how CSV parsers genuinely operate.

### Gaps in Meridian Ops
- **Static mock state isolation:** Meridian Ops running under `?mock=static` serves read-only JSON snapshots. State changes made in the UI (e.g. logging in or submitting an order) are maintained in-memory/localStorage on the client and are not synchronized back to the server API. Querying `/api/session` via `page.request` returns `{ authenticated: false, note: "Auth lives in localStorage, not here." }`.

### Unverified
- None. All specs passed against live Meridian Ops.
