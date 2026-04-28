# Open Hand

A browser-based companion website for a 57-card facilitation deck designed for 1:1 meetings, feedback conversations, skip-levels, retrospectives, and growth discussions.

## Features

**Game Mode** -- Draw cards and use guided rituals:
- **Random Draw** -- Pull a single random card from the deck
- **Draw Three, Keep One** -- See three unique cards, choose the one that fits
- **Structured Prompts** -- Guided conversation starters

**Library Mode** -- Browse and explore the full deck:
- Filter by category or tier
- Full-text search across titles, questions, and flavour text
- Card pairing navigation

### Card Tiers

Cards are organized into three tiers that reflect conversational depth:

- **Open** -- Warm-up and rapport-building questions
- **Working** -- Day-to-day collaboration and feedback
- **Deep** -- Growth, trust, and candid reflection

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm

### Installation

```bash
git clone https://github.com/kayoslab/Open-Hand.git
cd Open-Hand
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
npm run preview
```

## Testing

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript type checking
npm run test        # Vitest unit tests
npm run test:e2e    # Playwright browser tests
```

## Tech Stack

- **TypeScript** + **React** with **Vite**
- **PapaParse** for CSV parsing
- **Vitest** for unit tests, **Playwright** for E2E tests
- Deployed as a static site on **Vercel**

## Project Structure

```
src/
  domain/       Pure types, card models, filtering and draw logic
  data/         CSV loading, parsing, normalization
  features/
    browse/     Browse deck UI
    play/       Draw modes and game interactions
    guide/      Play guide content
  ui/           Shared components (buttons, cards, layout, chips, modals)
tests/          Unit and browser tests
Input/          Source CSV and play guide content
```

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.
