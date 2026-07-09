---
version: alpha

name: Warm Financial Drama

description: A warm, dark finance tracker for tracking mistakes (expenses) and blessings (incomes).

colors:
  background: '#0f0d0b'
  foreground: '#f5f0e8'
  card: '#1a1614'
  card-foreground: '#f5f0e8'
  popover: '#1a1614'
  popover-foreground: '#f5f0e8'
  primary: '#e8ddd0'
  primary-foreground: '#1a1614'
  secondary: '#221e1a'
  secondary-foreground: '#f5f0e8'
  muted: '#221e1a'
  muted-foreground: '#a09888'
  accent: '#221e1a'
  accent-foreground: '#f5f0e8'
  destructive: '#e8504a'
  border: 'rgba(245,240,232,0.08)'
  input: 'rgba(245,240,232,0.12)'
  ring: '#7a7068'
  blessing: '#4cbf8a'
  mistake: '#e8504a'
  warning: '#d4a04a'
  chart-1: '#e8504a'
  chart-2: '#4cbf8a'
  chart-3: '#d4a04a'
  chart-4: '#7a8aa8'
  chart-5: '#c89050'

typography:
  display:
    fontFamily: Inter Variable
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  headline:
    fontFamily: Inter Variable
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: 0
  title:
    fontFamily: Inter Variable
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body:
    fontFamily: Inter Variable
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.429
    letterSpacing: 0
  caption:
    fontFamily: Inter Variable
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  label:
    fontFamily: Inter Variable
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.333
    letterSpacing: 0.1em

rounded:
  none: 0
  sm: 0.375rem
  md: 0.5rem
  lg: 0.625rem
  xl: 0.75rem
  full: 9999px

spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  page-mobile: 16px
  page-tablet: 24px
  bottom-nav-height: 72px

components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.none}'
    padding: 8px 16px
    height: 32px
    typography: '{typography.label}'
  button-primary-lg:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.xl}'
    padding: 16px 24px
    height: 56px
    typography: '{typography.body}'
  button-destructive:
    backgroundColor: '{colors.destructive}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.none}'
    padding: 8px 16px
    height: 32px
  card-default:
    backgroundColor: '{colors.card}'
    textColor: '{colors.card-foreground}'
    rounded: '{rounded.none}'
    padding: 16px
  input-default:
    backgroundColor: '{colors.muted}'
    textColor: '{colors.foreground}'
    borderColor: none
    rounded: '{rounded.xl}'
    padding: 16px 16px 16px 40px
    height: 56px
    typography: '{typography.title}'
  select-default:
    backgroundColor: '{colors.muted}'
    textColor: '{colors.foreground}'
    borderColor: none
    rounded: '{rounded.xl}'
    padding: 16px
    typography: '{typography.body}'
  checkbox:
    backgroundColor: '{colors.muted}'
    checkedBackgroundColor: '{colors.primary}'
    checkedTextColor: '{colors.primary-foreground}'
    size: 20px
    rounded: '{rounded.md}'
  nav-bottom:
    backgroundColor: '{colors.card}'
    height: 72px
  nav-add-button:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    size: 56px
    rounded: '{rounded.full}'
---

## Overview

Warm Financial Drama is a compact finance interface for tracking personal money stories framed as mistakes (expenses) and blessings (incomes). It defaults to light mode — warm off-white backgrounds, pure white cards, and warm dark text — with a dark mode available through the `.dark` class. Restrained borders and a warm neutral palette make balances, recurring obligations, and analytics feel immediate and reflective.

The mood is grounded and slightly emotional — warm brown-toned neutrals replace cold slate, while rich crimson marks genuine regret and vibrant emerald celebrates true fortune. Square edges, dense rows, and subtle interaction states create a pocket ledger for daily financial accountability. Emphasis is carried by typography weight, semantic color, and thin rings rather than decoration.

## Colors

The palette is rooted in warm neutrals with two semantic drivers — mistake and blessing. The app defaults to **light mode** (root element uses `className="light"`). Dark mode is available via the `.dark` class switch.

### Light Mode (Default)

- **Background** `oklch(0.98 0.004 80)` — Warm off-white. Full-screen app surfaces and scrolling route backgrounds.
- **Foreground** `oklch(0.15 0.006 55)` — Warm near-black. Body text, headings, card content.
- **Card** `oklch(1 0 0)` — Pure white. Cards, popovers, navigation, elevated content.
- **Primary** `oklch(0.17 0.008 55)` — Warm dark. Primary action fill and interactive accents.
- **Destructive / Mistake** `oklch(0.60 0.20 25)` — Warm crimson. Expense amounts, validation errors.
- **Blessing** `oklch(0.55 0.15 155)` — Warm emerald. Income amounts, positive cash flow.
- **Warning** `oklch(0.70 0.14 75)` — Warm gold. Overdue items, warning icons.
- **Border** `oklch(0.88 0.006 80)` — Warm light gray. Hairline boundaries.

### Dark Mode

Applied through the `.dark` class. All neutrals shift to warm brown-black tones while the semantic colors stay consistent:

- **Background** `oklch(0.12 0.006 55)` — Warm near-black, like aged leather.
- **Foreground** `oklch(0.96 0.008 80)` — Warm cream.
- **Card** `oklch(0.17 0.008 55)` — Warm dark charcoal.
- **Primary** `oklch(0.90 0.012 80)` — Warm cream.
- **Destructive / Mistake** `oklch(0.60 0.20 25)` — Same warm crimson.
- **Blessing** `oklch(0.72 0.15 155)` — Slightly brighter warm emerald.
- **Warning** `oklch(0.70 0.14 75)` — Same warm gold.
- **Border** `oklch(0.96 0.008 80 / 8%)` — Subtle warm hairline.
- **Input** `rgba(245,240,232,0.12)` — Slightly brighter warm frost for input boundaries.
- **Ring** `#7a7068` — Warm focus ring. One-pixel or soft ring, not a large filled accent.
- **Chart-1** `#e8504a` — Crimson for expense chart series.
- **Chart-2** `#4cbf8a` — Emerald for income chart series.
- **Chart-3** `#d4a04a` — Gold for warning/savings chart series.
- **Chart-4** `#7a8aa8` — Muted steel blue for neutral chart series.
- **Chart-5** `#c89050` — Copper for accent chart series.

## Typography

Inter Variable is used for all text — its neutral, high-x-height character fits small financial labels, dense rows, currency values, and form controls.

- **Display** — 30px / 700 weight / 1.2 line height. Top-level page titles.
- **Headline** — 24px / 700 weight / 1.333 line height. Section and detail page titles.
- **Title** — 18px / 600 weight / 1.4 line height. Card titles and medium headings.
- **Body** — 14px / 500 weight / 1.429 line height. Transaction labels, row content, controls.
- **Caption** — 12px / 400 weight / 1.5 line height. Dates, metadata, supporting text.
- **Label** — 12px / 600 weight / 0.1em letter spacing / uppercase. Section headers, form labels.

Metric values use headline or title weight bold, colored by financial meaning: primary for neutral, destructive for expenses, blessing for income. Letter spacing remains neutral except for uppercase labels.

## Layout

The app is mobile-first. Authenticated pages use full-width route containers with 16px side padding on mobile and 24px on wider screens. Vertical rhythm follows a 4px spacing scale with 24px section gaps, 8–12px list gaps, and 16px card padding.

The home dashboard uses a single vertical stack with 24px gaps, two-column stat grids with 12px gaps, and compact list stacks. Forms center in a max-width content column. Authentication screens use a centered narrow card layout.

Bottom navigation is a fixed 72px bar. Content reserves bottom padding for nav clearance. Whitespace is efficient rather than luxurious — dense financial content stays grouped in short stacks with headings close to their content.

## Elevation & Depth

Depth is achieved through tonal layers rather than shadows. Background uses warm near-black; cards sit on a slightly lighter warm charcoal panel separated by tonal contrast. The login card is the only elevated surface, using a subtle shadow. All other surfaces use hairline borders (`rgba(245,240,232,0.08)`) instead of drop shadows for separation.

## Shapes

Cards and buttons follow a square-edged language (`rounded-none`), while inputs use generous rounding (`rounded-xl`) to feel approachable and touch-friendly. Only the raised bottom-nav add button uses `rounded-full`.

- `none`: 0 — cards, buttons, list rows
- `sm`: 0.375rem — compact controls
- `md`: 0.5rem — subtle rounding where needed
- `lg`: 0.625rem — larger containers
- `xl`: 0.75rem — inputs and form fields
- `full`: 9999px — reserved for the nav add button only

## Components

### Buttons

Two sizes in use. Default buttons are square-edged (`rounded-none`), 32px tall, compact with small label text — used for inline actions, toolbars, and nav. Large buttons (`size="lg"`) are `rounded-xl`, 56px tall, `text-sm font-semibold` — used for primary form submission. Destructive buttons use warm crimson fill. Outline buttons use transparent backgrounds with border token and muted hover fill. Focus states use a `ring-2` focus ring.

### Cards & Financial Containers

Flat warm charcoal panels with no rounding, small text defaults, and a one-pixel hairline ring. Dashboard stat cards use horizontal padding, stacked labels, and bold values. Transaction rows use the same recipe directly: card background, hairline ring, horizontal flex layout, and hover accent.

### Navigation

Fixed mobile bottom bar at 72px tall. Five evenly distributed actions with 24px horizontal padding. Inactive items use muted text and 22px icons; active items switch to primary text. The center add action is a raised 56px circular button with primary fill and primary foreground icon.

### Inputs & Forms

Rounded (`rounded-xl`) with muted background and no border. Money inputs are 56px tall with headline-size text and a `₱` prefix absolutely positioned at `left-4`. Selects match the same pill-style: `rounded-xl`, borderless, `bg-muted`, padding-driven height. Checkboxes are `size-5` with `rounded-md` and a muted background. Standard text inputs and textareas follow the same rounding and borderless style. Labels are `text-xs font-semibold text-muted-foreground` and sit close to controls. On focus, inputs lift to `bg-card` with a `ring-2` focus ring. Validation states use destructive rings.

### Financial Drama Entries

Dense three-column rows: category left, date centered, amount right. Amount uses warm crimson for mistakes and warm emerald for blessings. Recurring items follow the same pattern with metadata. Analytics cards contain compact Recharts visualizations with small axis ticks, muted gridlines, and rounded bar tops.

## Do's and Don'ts

- Do use semantic color only when it communicates financial meaning — crimson for expenses, emerald for income, gold for warnings.
- Do keep radius at zero for cards, buttons, and list rows. Use `rounded-xl` for inputs, selects, textareas, and the date picker trigger. Use `rounded-md` for checkboxes.
- Don't mix warm and cool neutrals in the same view — all surfaces use brown-toned grays.
- Don't use drop shadows in the authenticated app; rely on tonal contrast and hairline borders.
- Don't use `text-green-600`, `text-red-600`, or hardcoded Tailwind greens/reds — always use the `text-blessing`, `text-destructive`, `text-mistake`, or `text-warning` design tokens.
- Do maintain compact spacing: 4px unit rhythm, 16px page margins, 24px section gaps.
- Do prefer Inter Variable at small sizes (12–14px body) with weight carrying hierarchy instead of size.
- Don't add decorative gradients, large illustrations, or spacious marketing layouts.
- Do default to light mode — the root `<html>` element uses `className="light"`. Reserve dark mode for user preference toggles via the `.dark` class.
- Do start new screens from the mobile container pattern: 16px padding, 24px vertical rhythm, bottom nav clearance.
