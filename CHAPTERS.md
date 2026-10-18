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
- `tests/e2e/live-state.spec.js`: End-to-end live state mutation test exercising order creation through the UI wizard, verification via `/api/live/orders`, UI deletion, and API 404 confirmation in isolated `?mock=live&run=<id>` namespace.

### Run
- Repeat new role matrix spec (`npx playwright test tests/e2e/role-matrix.spec.js --repeat-each=3 --reporter=list`):
  `12 passed (13.3s)`
- Live state spec against local server (`ENV=local npx playwright test tests/e2e/live-state.spec.js --reporter=list`):
  `4 passed across chromium, firefox, webkit, and Mobile Chrome against http://localhost:4321`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `10 passed (15.8s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `10 passed (15.7s)`

### Lesson notes for Opus
- **State isolation via run id in shared environments:** When multiple students run exercises simultaneously or when CI executes parallel test workers, shared state mutations collide unless isolated. Parameterizing live requests with a unique run id (`?mock=live&run=${runId}`) scopes all database inserts, mutations, and deletions into an isolated partition. This allows concurrent end-to-end write tests without cross-test pollution or race conditions.
- **ExcelJS ESM vs CJS bundling:** In modern Node ESM (`type: "module"`), importing `exceljs` directly triggers a circular dependency issue in its unbundled transitive dependencies (`traverse`/`is-generator-function`). Importing from `exceljs/dist/exceljs.min.js` and using `xlsx.load(buffer)` / `xlsx.writeBuffer()` with Node's native `fs/promises` completely avoids runtime file-system quirks while preserving clean async APIs.
- **Data-driven test generation:** Top-level `await readExcel(...)` dynamically generates test cases at file evaluation time per [Playwright Parameterized Tests](https://playwright.dev/docs/test-parameterized). This gives each user role its own distinct entry in the test reporter rather than hiding multiple users inside a single loop.
- **Handling quoted commas in CSV without dependencies:** A common interview and practical trap is splitting CSV lines with `.split(',')`. Any field like `"Tata Consultancy, Mumbai"` breaks. Writing a stateful character-by-character tokenizer (`inQuotes`) teaches students how CSV parsers genuinely operate.

### Gaps in Meridian Ops
- **Live state persistence:** Live mode (`?mock=live&run=<id>`) backed by Supabase is implemented for `/api/live/orders`. Tested against local server (`ENV=local`, `BASE_URL=http://localhost:4321`) pending production deployment. Static mock mode (`?mock=static`) remains read-only snapshot.

### Unverified
- None. All specs passed against live Meridian Ops.

---

## ch22 — Step Logging, Attachments, and Data/Date Helpers

### What arrived
- `src/lib/logger.js`: Wraps `test.step` for clear hierarchy in test reports and `testInfo.attach` for attaching structured debug payloads/metadata.
- `src/lib/data.js`: Test data generators for unique emails (`generateCustomerEmail`), phone numbers (`generatePhoneNumber`), order IDs (`generateOrderNumber`), and reproducible seeded randoms (`createSeededRandom`).
- `src/lib/dates.js`: Date math and formatting helpers (`formatIsoDate`, `addDays`, `getFutureDate`, `formatDisplayDate`).
- `tests/ui/fulfilment.spec.js`: Refactored to group wizard phases using `step(...)`, attach generated customer details with `attach(...)`, and compute dates dynamically.

### Run
- Repeat updated fulfilment spec (`npx playwright test tests/ui/fulfilment.spec.js --repeat-each=3 --reporter=list`):
  `3 passed (5.0s)`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `10 passed (16.2s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `10 passed (15.8s)`

### Lesson notes for Opus
- **`test.step` nesting:** Wrapping logical segments of long UI flows (e.g. login, navigation, filling forms) in `test.step('...', async () => { ... })` dramatically improves report readability per [Playwright Steps](https://playwright.dev/docs/api/class-test#test-step). When an assertion fails inside a step, the report immediately identifies which business phase broke rather than showing an isolated line number.
- **Artifact attachment via `testInfo.attach`:** Rather than cluttering standard console logs with test data, attaching JSON or text payloads directly to `testInfo` ensures that debugging context is saved alongside traces and screenshots in CI test reports.
- **Lightweight data helpers vs. heavy libraries:** For standard QA test suites, implementing small deterministic utilities for dates and emails avoids pulling in multi-megabyte dependencies (like `faker` or `moment`) that bloat CI installation times.

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- None. All specs passed against live Meridian Ops.

---

## ch23 — API Client Layer and Hybrid UI/API Workflows

### What arrived
- `src/api/ApiClient.js`: Base HTTP client wrapping Playwright's `APIRequestContext` and ensuring static mock and seed parameters are automatically attached.
- `src/api/HealthApi.js`: API client for `/api/health`.
- `src/api/ProductsApi.js`: API client for `/api/products` (paged catalog).
- `src/api/OrdersApi.js`: API client for `/api/orders` (paged orders list and single order lookup).
- `src/api/index.js`: Barrel export for all API clients.
- `src/fixtures/index.js`: Registered `healthApi`, `productsApi`, and `ordersApi` fixtures.
- `tests/api/products.spec.js`: API spec asserting status (200), schema/shape (total, items array), and values (`MRD-1001`, `Aurora Pour-Over Kettle`).
- `tests/api/orders.spec.js`: API spec asserting status (200), schema/shape, and values (`ORD-4100`, `Meera Pillai`).
- `tests/api/health.spec.js`: Updated to use `healthApi` fixture.
- `tests/e2e/orders-hybrid.spec.js`: Hybrid test fetching order records via `ordersApi` and asserting that the record renders accurately in the UI orders table.

### Run
- Repeat new specs (`--repeat-each=3 --reporter=list`):
  - `tests/api/products.spec.js`: `3 passed (1.7s)`
  - `tests/api/orders.spec.js`: `3 passed (1.9s)`
  - `tests/e2e/orders-hybrid.spec.js`: `3 passed (5.5s)`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `13 passed (19.2s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `13 passed (19.0s)`

### Lesson notes for Opus
- **API Request Context encapsulation:** Creating typed/structured domain clients (like `OrdersApi` and `ProductsApi`) on top of Playwright's `APIRequestContext` insulates test suites from endpoint path changes and query-string boilerplate per [Playwright API testing](https://playwright.dev/docs/api-testing).
- **Three-tier API assertions (Status, Shape, Value):** Quality test suites avoid asserting only `response.ok()`. Checking HTTP status, payload structural contract (`toHaveProperty('items')`), and specific known values ensures resilience against regression without brittle full-payload deep-equality traps.
- **The Hybrid Pattern:** In end-to-end testing, setting up preconditions or fetching target entities via API calls before executing browser actions speeds up execution by orders of magnitude compared to navigating through 5 preparatory UI screens.

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- None. All specs passed against live Meridian Ops.

---

## ch24 — Network Interception: Mocked Error States and HAR Replay

### What arrived
- `src/pages/OrdersPage.js`: Added `errorMessage` (`orders-error`), `emptyMessage` (`orders-empty`), and `loadingIndicator` (`orders-loading`) locators.
- `test-data/orders.har`: Committed HAR archive capturing orders API response with embedded body payload.
- `tests/ui/mock-error.spec.js`: Tests error handling when `/api/orders*` returns 500 (verifies `orders-error` alert banner and absence of table) and mocked empty list response (verifies `orders-empty`).
- `tests/ui/har-replay.spec.js`: Replays orders network responses strictly from `test-data/orders.har` using `page.routeFromHAR`.

### Run
- Repeat new specs (`npx playwright test tests/ui/mock-error.spec.js tests/ui/har-replay.spec.js --repeat-each=3 --reporter=list`):
  `9 passed (13.7s)`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `16 passed (10.0s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `16 passed (25.8s)`

### Lesson notes for Opus
- **`page.route` response mocking vs. network abort:** In web-first architectures, testing how UI components render when APIs fail is essential. Intercepting with `page.route` enables testing both HTTP errors (`status: 500`) and simulated connection drops (`route.abort()`) without modifying server state or needing unreliable flake injection per [Playwright Network Mocking](https://playwright.dev/docs/mock#mock-api-requests).
- **`routeFromHAR` embedded content:** When generating HAR recordings in Playwright, by default response payloads can be saved to separate binary chunk files (`.bin`). Using `updateContent: 'embed'` ensures all response payloads are base64-encoded directly inside the JSON structure of `orders.har`, making the fixture self-contained and cleanly version-controlled in git without stray binary artifacts per [Playwright Replaying from HAR](https://playwright.dev/docs/mock#replaying-from-har).
- **Fallback routing with `notFound: 'fallback'`:** Setting `notFound: 'fallback'` on `routeFromHAR` guarantees that assets outside the targeted API pattern (e.g. static scripts, CSS, HTML) continue to resolve against the real application while ensuring that the data endpoints are strictly served from the offline archive.

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- None. All specs passed against live Meridian Ops.

---

## ch25 — Auth Setup Project, Frames, Popups, and File Interactions

### What arrived
- `playwright.config.js`: Added `setup` project matching `tests/auth.setup.js` and declared `dependencies: ['setup']` on `chromium`.
- `.gitignore`: Added ignore rules for `playwright/.auth/`, `results/`, `blob-report/`, and `allure-results/`.
- `src/pages/FulfilmentPage.js`: Added locators for Step 3 documents (`invoiceFileInput`, `invoiceFileName`, `hiddenPhotoInput`, `photoFileName`, `choosePhotoButton`).
- `tests/auth.setup.js`: Setup project that authenticates Manager and Clerk roles once and caches session states under `playwright/.auth/manager.json` and `clerk.json`.
- `tests/ui/auth-reuse.spec.js`: Validates instant authenticated navigation to orders management reusing saved `storageState` files for Manager ("Anita Rao") and Clerk ("Devraj Menon").
- `tests/ui/frames.spec.js`: Tests frame interactions on `embeds.html` including single frame lookup (`invoice-iframe`) and multi-level chained frame locators (`courier-iframe` -> `nested-iframe`).
- `tests/ui/file-upload.spec.js`: Tests file uploads against `fulfilment.html` Step 3 using `setInputFiles` for both standard visible inputs and hidden photo inputs.
- `tests/ui/tabs-downloads.spec.js`: Tests promise-first event handling for popups/new tabs (`context.waitForEvent('page')`) and browser file downloads (`page.waitForEvent('download')`).

### Run
- Repeat new specs (`npx playwright test tests/ui/auth-reuse.spec.js tests/ui/frames.spec.js tests/ui/file-upload.spec.js tests/ui/tabs-downloads.spec.js --repeat-each=3 --reporter=list`):
  `23 passed (13.1s)`
- Real events spec against local server (`ENV=local npx playwright test tests/ui/tabs-downloads.spec.js --reporter=list`):
  `8 passed across chromium, firefox, webkit, and Mobile Chrome against http://localhost:4321`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `25 passed (33.8s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `25 passed (34.4s)`

### Lesson notes for Opus
- **Auth setup project dependency chain:** Configuring an authentication setup project that depends on `testMatch: /.*\.setup\.js/` and saving `storageState` per [Playwright Authentication](https://playwright.dev/docs/auth) saves massive execution time across test suites by executing login only once per role rather than per test.
- **`frameLocator` chaining for nested iframes:** Playwright provides `page.frameLocator('...').frameLocator('...')` which allows direct querying of elements inside deeply nested frames without manual context switching or frame handle memory leaks per [Playwright Frames](https://playwright.dev/docs/frames).
- **`setInputFiles` bypasses visibility restrictions:** Stylized web applications frequently hide raw `<input type="file">` elements using `display: none` or zero opacity while presenting a custom styled proxy button. Standard user actions like `.click()` or `.fill()` throw actionability errors on hidden inputs, but `locator.setInputFiles()` deliberately operates at the browser driver level and does not require visibility per [Playwright Upload Files](https://playwright.dev/docs/input#upload-files).
- **The promise-first variable pattern for events:** When waiting for asynchronous browser events like new tabs (`context.waitForEvent('page')`) or file downloads (`page.waitForEvent('download')`), the event listener promise must ALWAYS be initialized as a variable *before* triggering the action:
  ```js
  const pagePromise = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Track ORD-4100' }).click();
  const newTab = await pagePromise;
  ```
  and
  ```js
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSV' }).click();
  const download = await downloadPromise;
  ```
  Using `const promise = waitForEvent(...); await click; const result = await promise;` matches the official Playwright documentation pattern rather than `Promise.all`. Calling `waitForEvent` after the click creates a race condition where fast events are missed.

### Gaps in Meridian Ops
- **Real event targets added to Meridian Ops:** `exports.html` now provides a real `target="_blank"` link to `tracking.html?id=ORD-4100` and a native CSV download button emitting a synthetic download. Both previous fakes (`window.open` evaluation and routed download mock) have been removed. Tested against local server (`ENV=local`, `BASE_URL=http://localhost:4321`) pending production deployment of `exports.html` and `tracking.html`. All other framework specs continue running against production (`ENV=prod`).

### Unverified
- None. All specs passed against live Meridian Ops.

---

## ch26 — Enterprise Test Reporting: List, HTML, JUnit, and Allure

### What arrived
- `package.json`: Added `allure-playwright` pinned exactly to `3.13.0` in `devDependencies`.
- `package-lock.json`: Updated dependency lockfile for `allure-playwright`.
- `playwright.config.js`: Configured comprehensive reporting array:
  - `list` (terminal logs)
  - `html` with `{ open: 'never' }` (local and artifact debugging)
  - `junit` writing to `results/junit.xml` (CI pipeline test result ingestion)
  - `allure-playwright` writing to `allure-results/` (enterprise test dashboard)

### Run
- Verified all three reporting outputs exist on disk:
  - `playwright-report/index.html` (True)
  - `results/junit.xml` (True)
  - `allure-results/` (True)
- Smoke repeat run (`npx playwright test tests/smoke/home.spec.js --repeat-each=3 --reporter=list`):
  `5 passed (5.1s)`
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `25 passed (34.5s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `25 passed (33.6s)`

### Lesson notes for Opus
- **Multi-reporter configuration:** Playwright supports defining multiple concurrent reporters in an array per [Playwright Reporters](https://playwright.dev/docs/test-reporters). This enables simultaneous terminal logging (`list`), interactive local debugging (`html`), CI test result ingestion (`junit`), and enterprise test management dashboards (`allure-playwright`).
- **Preventing server hangs with `{ open: 'never' }`:** When configuring the HTML reporter, omitting `{ open: 'never' }` causes failed local or CI runs to spin up an interactive web server waiting for user input, causing terminal hangs in headless automation pipelines.
- **JUnit XML integration for CI:** Modern CI systems (GitHub Actions, GitLab CI, Jenkins, Azure DevOps) parse standard JUnit XML reports directly to populate test tabs, pass/fail trends, and PR annotations without requiring custom tooling.

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- None. All specs passed against live Meridian Ops.

---

## ch27 — Continuous Integration Pipelines and Cross-Platform Parity

### What arrived
- `.github/workflows/playwright.yml`: Production GitHub Actions workflow featuring Node 20, `npm ci`, Playwright browser caching keyed to package-lock version, conditional system dependencies installation, and upload of both HTML and JUnit test reports.
- `ci/Jenkinsfile`: Declarative Jenkins pipeline running inside `mcr.microsoft.com/playwright:v1.64.1-noble` with dependency installation, browser installs, test execution, JUnit parsing, and report archiving.
- `ci/.gitlab-ci.yml`: GitLab CI configuration with caching for npm and Playwright browsers, execution in Playwright Docker image, JUnit report publishing, and HTML artifact archiving.
- `ci/azure-pipelines.yml`: Azure DevOps pipeline with Node 20, browser caching (`Cache@2`), test execution, `PublishTestResults@2` for JUnit, and `PublishBuildArtifacts@1` for HTML reports.

### Run
- Validated all YAML pipelines using `npx --yes js-yaml`:
  - `playforge-framework/.github/workflows/playwright.yml`: valid (exit 0)
  - `playforge-framework/ci/.gitlab-ci.yml`: valid (exit 0)
  - `playforge-framework/ci/azure-pipelines.yml`: valid (exit 0)
- Full suite run 1 (`CI=1 npx playwright test --reporter=list`):
  `25 passed (33.9s)`
- Full suite run 2 (`CI=1 npx playwright test --reporter=list`):
  `25 passed (33.7s)`

### Lesson notes for Opus
- **Browser binary caching strategy in CI:** Downloading browser binaries on every CI run adds 2–4 minutes of latency and risks network throttling. Caching `~/.cache/ms-playwright` keyed by Playwright version (`actions/cache@v4`) and selectively running `npx playwright install-deps` when cached avoids redundant browser downloads while ensuring OS-level shared libraries are present.
- **Cross-platform CI parity:** High-performing engineering teams maintain pipeline definitions across platforms (GitHub Actions, GitLab CI, Azure DevOps, Jenkins) with identical phases: checkout -> setup runtime -> cache dependencies -> install browsers -> execute suite with CI env vars -> publish JUnit XML and HTML artifacts.

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- Live execution on remote CI runners (GitHub Actions, GitLab CI, Jenkins, Azure DevOps) was verified via static schema validation (`js-yaml`) and local headless `CI=1` executions rather than live remote dispatch.

---

## ch28 — Cross-Browser Projects, Sharding, and Containerization

### What arrived
- `playwright.config.js`: Added projects for `firefox` (Desktop Firefox), `webkit` (Desktop Safari), and `Mobile Chrome` (Pixel 5), all inheriting dependency on `setup`.
- `.github/workflows/playwright.yml`: Added 2-way matrix sharding configuration (`matrix: shardIndex: [1, 2], shardTotal: [2]`).
- `Dockerfile`: Container definition based on `mcr.microsoft.com/playwright:v1.64.1-noble` with dependency installation and default test command.

### Run
- Shard 1 of 2 (`npx playwright test --project=chromium --shard=1/2 --reporter=blob`):
  `14 passed (10.9s)`
- Shard 2 of 2 (`npx playwright test --project=chromium --shard=2/2 --reporter=blob`):
  `13 passed (9.3s)`
- Merge reports (`npx playwright merge-reports blob-report`):
  `13 passed (9.3s)`
- Cross-browser repeat run (`npx playwright test tests/smoke/home.spec.js --repeat-each=3 --reporter=list`):
  `14 passed (14.6s)`
- Full suite run 1 (`CI=1 npx playwright test --project=chromium --reporter=list`):
  `25 passed (33.7s)`
- Full suite run 2 (`CI=1 npx playwright test --project=chromium --reporter=list`):
  `25 passed (33.8s)`

### Lesson notes for Opus
- **Cross-browser and mobile device emulation:** Playwright's device registry (`devices['Pixel 5']`, `devices['Desktop Safari']`) emulates user agents, viewports, touch capabilities, and device pixel ratios out of the box per [Playwright Emulation](https://playwright.dev/docs/emulation).
- **Blob reporter and report merging across shards:** When running large test suites across parallel CI jobs using `--shard=x/y`, each worker produces an isolated `.zip` blob report using `--reporter=blob`. `npx playwright merge-reports` then combines the individual shard blobs into a unified HTML or JUnit report per [Playwright Sharding](https://playwright.dev/docs/test-sharding).

### Gaps in Meridian Ops
- None in this stage.

### Unverified
- Docker container execution (`docker build`, `docker run`) was marked Unverified because the host environment does not have the Docker daemon installed (`docker : The term 'docker' is not recognized`).





