# CLAUDE.md

Personal website for evanoconnor.ie — an Astro static site with React interactive playgrounds.

## Tech Stack

- **Astro 6** — static site generator, pages in `src/pages/`
- **React 18** — used only for interactive components (games, playgrounds)
- **TypeScript** — strict mode throughout
- **SCSS** — styles in `src/styles/`, global mixins in `_mixins.scss`
- **Vitest** — unit tests; **Playwright** — e2e tests

## Commands

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Production build
npm run preview      # Preview production build
npm run test:unit    # Unit tests (Vitest)
npm run test:e2e     # E2e tests (Playwright, requires dev server)
npm run clean        # Remove build artifacts
```

## Project Structure

```
src/
  pages/          # Astro routes (index, cv, playground/*)
  components/
    common/       # PageLayout, Header, shared UI
    cv/           # CV page components
    wordle/       # Wordle game (React)
    go/           # Go board game (React)
    index/        # Homepage components
  services/       # Game state managers (wordle, go)
  utils/          # Shared utilities (dates, theme, DOM, game logic)
  types/          # TypeScript definitions
  styles/         # Global SCSS (_mixins, _breakpoints)
  constants/      # Game constants
static/           # Static assets (wordle word lists, etc.)
tests/
  unit/           # Game logic & utility unit tests
  e2e/            # Playwright browser tests
```

## Path Aliases (tsconfig)

- `#/*` → `src/*`
- `#static/*` → `static/*`
- `#tests/*` → `tests/*`

## Patterns

- Astro pages (`.astro`) handle routing and layout; React components handle interactivity
- Game logic lives in `src/utils/` (pure functions) and `src/services/` (stateful managers)
- Theme support (light/dark) via SCSS mixins — use existing mixins from `_mixins.scss` for new styles
- Unit-test pure game logic in `tests/unit/`; e2e-test user flows in `tests/e2e/`

## Coding Guidelines

### Naming
- Files: kebab-case (`wordle-app.tsx`, `go-game-service.ts`)
- Components & types: PascalCase (`WordleApp`, `AppState`)
- Functions & variables: camelCase; constants: `UPPER_SNAKE_CASE`
- CSS classes: BEM-style kebab-case (`go-board__container`, `keyboard-key`)
- Props type is always named `Props` and marked `Readonly<{ ... }>`

### Imports
- Use path aliases (`#/`, `#static/`, `#tests/`) — never relative paths that could use an alias
- Use `import type` for type-only imports
- Order. Split into 3 sections: (1) third-party imports, (2) auto-generated or synthetic imports, (3) local/editable code 

### TypeScript
- Strict throughout — explicit return types on functions
- No use of `any` or `unknown`
- Discriminated unions with `never` for mutually exclusive fields (see `GoGamePlaceStoneReturnType`)
- Type guard functions use the `is` keyword: `function isCharacter(c: string): c is Character`
- Derive types from constant objects: `type Key = (typeof keys)[keyof typeof keys]`

### React Components
- Wrap exported components in `<StrictMode>` — put actual logic in an inner `Internal` component
- State: Context + `useReducer` for complex/shared state; `useState` for local UI state
- Always clean up event listeners in `useEffect` return functions

### SCSS
- Component styles colocated with the component file
- `@use "mixins"` at the top of every style block; use the provided mixins (`reset`, `theme-vars`, `global-style`)
- All colours via CSS custom properties (`var(--font-colour)`) — never hardcode colours
- Light/dark theme handled via `data-theme` attribute and `prefers-color-scheme`

### Services & Utilities
- Pure functions go in `src/utils/`; stateful managers go in `src/services/`
- Classes extend `TypedEventEmitter<EventMap>` for type-safe custom events
- Annotate event-dispatching methods with `/** @fires event-name */`
- Separate public API from private methods with `// Public API` / `// Private Methods` comments

### Tests
- Unit tests: `tests/unit/`, one `describe` per function/class, nested for sub-cases
- E2E tests: `tests/e2e/`, page-level `test.describe`, common setup in `beforeEach`
- Prefer role-based queries (`getByRole`) over selectors in both unit and e2e tests

## Workflow

1. `npm install` — install dependencies (only necessary if dependencies have been changed or if doing a fresh setup)
2. `npm run build` to build for production, or `npm run dev` — to start dev server
3. Implement the feature, fix, or change
4. Verify changes with `npm run build`, `npm run test:unit`, and `npm run test:e2e`
