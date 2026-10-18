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
