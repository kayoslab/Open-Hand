# Card Deck v2 Project Context

## Project Purpose

Open Hand is a browser-based companion website for a 57-card facilitation deck used in 1:1 meetings, feedback conversations, skip-levels, retrospectives, and growth discussions.

The website must serve two equally important use cases:

1. **Game Mode**  
Users draw random cards and use guided rituals such as:
- Draw Three, Keep One
- Single random pull
- Structured conversation prompts

2. **Library Mode**  
Users browse the entire deck, filter cards, search topics, and inspect categories, tiers, flavour text, and pairings.

The product should feel warm, premium, intelligent, and calm — more like a thoughtful tabletop tool than a spreadsheet or HR portal.

---

## Content Source

Input folder contains:

- `card_deck.csv`
- play guide text/instructions

CSV is the source of truth unless explicitly migrated later.

Expected card fields may include:

- CardNumber
- Title
- Question
- Category
- Tier
- FlavourText
- PairsWith

If field names differ, adapt parser but preserve typed internal model.

---

## Tech Stack

- Language: TypeScript
- Build Tool: Vite
- UI: React
- Styling: CSS Modules or lightweight scoped CSS
- State: React state/hooks only unless complexity requires more
- CSV Parsing: PapaParse or equivalent
- Testing: Vitest
- Browser Smoke Tests: Playwright
- Linting: ESLint
- Deployment Target: Vercel

---

## Repository Conventions

- `src/domain/`
  Pure types, card models, filtering logic, draw logic

- `src/data/`
  CSV loading, parsing, normalization

- `src/features/browse/`
  Browse deck UI

- `src/features/play/`
  Draw modes and game interactions

- `src/features/guide/`
  Play guide content

- `src/ui/`
  Shared components (buttons, cards, layout, chips, modals)

- `tests/`
  Unit and browser tests

---

## UX Requirements

The interface must include:

- Home / landing page
- Browse all cards
- Random draw mode
- Draw Three Keep One mode
- Play Guide page

Cards must visually resemble real deck cards:

- rounded corners
- readable hierarchy
- tier markers
- flavour text treatment
- tactile spacing

Use subtle motion only. No heavy animations.

---

## Tier System

Three card tiers:

- Open (green)
- Working (amber)
- Deep (blue)

Colour must not be sole indicator. Always show text labels or icons.

---

## Functional Rules

### Random Draw

Random draw must use available cards only.

### Draw Three Keep One

- show three unique cards
- user selects one
- selected card remains
- reset starts new round

### Browse Mode

Support:

- category filter
- tier filter
- text search

### Pairings

If a card references another card, allow quick navigation.

---

## Accessibility Requirements

- keyboard usable
- visible focus states
- semantic headings
- labelled buttons
- readable contrast
- mobile responsive

---

## Coding Conventions

- Prefer small pure functions
- Keep filtering logic outside UI components
- Keep draw/randomization logic testable
- Avoid oversized components
- Use strict TypeScript
- No `any` unless justified

---

## Testing Requirements

Run before completing tickets:

- npm run lint
- npm run typecheck
- npm run test

Where practical also run:

- npm run test:e2e

Must unit test:

- CSV parsing
- filtering logic
- tier normalization
- draw logic
- duplicate prevention for Draw Three mode

---

## Constraints Agents Must Respect

- No backend required
- No database required
- Must work as static Vercel deployment
- CSV remains editable by non-developers
- Avoid unnecessary libraries
- Prefer maintainability over novelty
- Do not refactor unrelated code during tickets
- If architecture changes, update this file