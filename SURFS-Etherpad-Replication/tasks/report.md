# SURFS Etherpad Replication — Methodology Report

## Date
2026-06-30

## Repository
- Upstream: https://github.com/ether/etherpad-lite
- Local clone: `~/etherpad-replication`
- Work branch: `improvements` (off `master` / `origin/master` tag v3.3.2)

---

## Architecture Paragraph

The new `src/node/improvements/` module is a pure TypeScript utility library that
sits at the bottom of Etherpad's existing `src/node/` dependency graph — below all
business logic, handlers, and database modules. It hooks into the architecture at
three points: `src/node/db/API.ts` imports `SYSTEM_AUTHOR_ID` from it instead of
inlining the magic string; `src/node/utils/checkValidRev.ts` becomes a thin
re-export wrapper delegating to `improvements/validators.ts`; and
`src/node/handler/PadMessageHandler.ts` imports `isValidHexColor`,
`safeDecodeURIComponent`, and `SYSTEM_AUTHOR_ID`. No new hook registration, no
plugin system changes, no server lifecycle changes — only internal references
point at the new module, keeping the diff against upstream minimal and fully
reviewable.

---

## What Changed

### 1. New module: `src/node/improvements/`

| File | Purpose |
|------|---------|
| `constants.ts` | `SYSTEM_AUTHOR_ID = 'a.etherpad-system'` — previously inlined in multiple files |
| `validators.ts` | `isInt`, `checkValidRev`, `assertRevInRange`, `isValidHexColor`, `HEX_COLOR_RE` |
| `sanitizers.ts` | `safeDecodeURIComponent` — null-safe URI decoding extracted from PadMessageHandler |
| `index.ts` | Barrel re-export for convenient single-import access |

### 2. Modified files (wiring)

- **`src/node/utils/checkValidRev.ts`**: Replaced ~34-line implementation with a
  2-line re-export shim. All existing `require('../utils/checkValidRev')` call-sites
  continue to work without modification.

- **`src/node/db/API.ts`**: Replaced inline `const SYSTEM_AUTHOR_ID = 'a.etherpad-system'`
  with `import {SYSTEM_AUTHOR_ID} from '../improvements/constants'`.

- **`src/node/handler/PadMessageHandler.ts`**:
  - Cookie URI decode try/catch (8 lines) replaced with `safeDecodeURIComponent(raw)`.
  - Inline hex color regex replaced with `isValidHexColor(colorId)`.
  - Hardcoded `'a.etherpad-system'` literal replaced with `SYSTEM_AUTHOR_ID`.

### 3. New test file

- **`src/tests/backend-new/specs/improvements.test.ts`**: 35 offline unit tests
  covering all exported symbols + backwards-compat shim.

---

## Commit List

```
826b0f3ae test(improvements): add offline unit test suite for new improvements module (35 tests)
1587e3324 refactor(PadMessageHandler): use improvements module for safeDecodeURIComponent, isValidHexColor, SYSTEM_AUTHOR_ID
a2fc94539 refactor(API): import SYSTEM_AUTHOR_ID from improvements/constants (removes inline duplicate)
b7b42b8f4 refactor(checkValidRev): make thin re-export wrapper over improvements/validators
c1ce71254 feat(improvements): add shared utility module (constants, validators, sanitizers)
```

---

## Test Results

```
Test Files  49 passed (49)
     Tests  756 passed (756)
  Start at  10:24:15
  Duration  2.81s
```

Pre-improvements baseline (same suite): 721 tests / 48 files.
The 35 new tests are all in `improvements.test.ts`.

---

## Exact Tool Versions

| Tool | Version |
|------|---------|
| node | v25.1.0 |
| pnpm | 11.1.2 (packageManager pin) / 11.7.0 (host) |
| vitest | ^4.1.9 (resolved 4.1.9) |
| typescript | ^6.0.3 |
| tsx | 4.22.4 (pinned in package.json) |
| git | macOS bundled |

---

## Runtime Environment

- OS: macOS (darwin), Apple Silicon (arm64)
- Node.js >= 24.0.0 required (enforced by `engines` in package.json)
- pnpm >= 11.1.2 required
- All dependencies installed offline via `pnpm install --frozen-lockfile`
- No external services required for offline test suite

---

## git diff master...improvements Summary (our commits only)

```
src/node/db/API.ts                              |   5 +-
src/node/handler/PadMessageHandler.ts           |  21 +-
src/node/improvements/constants.ts             |  23 +   (new)
src/node/improvements/index.ts                 |  22 +   (new)
src/node/improvements/sanitizers.ts            |  32 +   (new)
src/node/improvements/validators.ts            | 107 +   (new)
src/node/utils/checkValidRev.ts                |  48 +-
src/tests/backend-new/specs/improvements.test.ts | 173 + (new)
```

The remaining files in the full `git diff master improvements --stat` output are
`develop`-branch merge commits (localization, docs, CI) that were already in the
upstream repo before this work began.
