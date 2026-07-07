---
name: Financial Drama
colors:
  background: '#090b0c'
  foreground: '#f9fbfb'
  card: '#161b1d'
  card-foreground: '#f9fbfb'
  popover: '#161b1d'
  popover-foreground: '#f9fbfb'
  primary: '#e3e7e8'
  primary-foreground: '#161b1d'
  secondary: '#22292b'
  secondary-foreground: '#f9fbfb'
  muted: '#22292b'
  muted-foreground: '#9ca8ab'
  accent: '#22292b'
  accent-foreground: '#f9fbfb'
  destructive: '#ff6467'
  border: 'rgba(255,255,255,0.10)'
  input: 'rgba(255,255,255,0.15)'
  ring: '#67787c'
  blessing: '#5dc879'
  mistake: '#ff6467'
  warning: '#f59e0b'
  chart-indigo: '#6366f1'
  chart-amber: '#f59e0b'
  chart-green: '#10b981'
  chart-red: '#ef4444'
  chart-blue: '#3b82f6'
  chart-violet: '#8b5cf6'
typography:
  display:
    fontFamily: Inter Variable
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: '0'
  page-title:
    fontFamily: Inter Variable
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: '0'
  section-label:
    fontFamily: Inter Variable
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.10em
    textTransform: uppercase
  body:
    fontFamily: Inter Variable
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: '0'
  caption:
    fontFamily: Inter Variable
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
rounded:
  none: 0
  sm: 0.375rem
  md: 0.5rem
  lg: 0.625rem
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
---

# Design System: Financial Drama

## 1. Visual Theme & Atmosphere

Financial Drama is a compact, dark, ledger-like mobile finance interface. It uses a near-black cool canvas, charcoal panels, pale ink text, and very restrained borders to make balances, expenses, recurring obligations, and analytics feel immediate without becoming visually noisy.

The mood is utilitarian and slightly severe: square component edges, small type, dense rows, and subtle interaction states create the feeling of a pocket control panel for daily financial accountability. The system favors scan speed over decoration, with emphasis carried by typography weight, numeric color, and thin rings rather than large illustrations or spacious marketing compositions.

## 2. Color Palette & Roles

### Primary Foundation

**Ledger Black** `#090b0c` is the active app background because the root document applies the dark theme globally. It should cover full-screen app surfaces and scrolling route backgrounds.

**Charcoal Panel** `#161b1d` is the main card, popover, bottom navigation, and elevated content color. It separates content from the background with tonal contrast rather than bright outlines.

**Deep Slate Fill** `#22292b` is the secondary, muted, and accent surface. Use it for hover states, soft selected states, muted blocks, and inactive controls.

**Hairline White Border** `rgba(255,255,255,0.10)` and **Input Frost** `rgba(255,255,255,0.15)` define the dark theme boundary system. Borders should feel thin and technical.

### Accent & Interactive

**Pale Steel Primary** `#e3e7e8` is the primary action color in dark mode. It inverts the usual bright-brand approach by using a near-white fill against the black interface.

**Ink on Primary** `#161b1d` is used for text/icons inside primary buttons and the raised bottom-nav add button.

**Focus Slate** `#67787c` is the ring and focus color. Use it as a one-pixel or soft ring, not as a large filled accent.

**Route Blue** `#1447e6` appears only in the dark sidebar-primary token and is not prominent in the current mobile shell. Treat it as a reserved navigation accent, not the main brand color.

### Typography & Text Hierarchy

**Primary Text** `#f9fbfb` is used for body text, headings, card content, and high-priority labels.

**Muted Steel Text** `#9ca8ab` carries captions, secondary dates, form placeholders, inactive nav items, and section labels.

**Card Text** `#f9fbfb` stays consistent with foreground, keeping cards crisp against the charcoal background.

### Functional States

**Mistake Red** `#ff6467` is the destructive and expense color in the active dark theme. It marks negative balances, mistakes, validation errors, delete actions, and expense bars.

**Blessing Green** `#5dc879` is the design-token positive cash-flow color. Some routes also use Tailwind greens such as `#10b981` and green-600 for income, savings, and blessings; consolidate these as positive financial states.

**Overdue Amber** `#f59e0b` is used for overdue recurring items and warning icons/borders.

**Chart Palette** uses higher-saturation accents for data differentiation: indigo `#6366f1`, amber `#f59e0b`, green `#10b981`, red `#ef4444`, blue `#3b82f6`, violet `#8b5cf6`, pink `#ec4899`, teal `#14b8a6`, orange `#f97316`, and lime `#a3e635`.

## 3. Typography Rules

### Hierarchy & Weights

The app uses **Inter Variable** for all text through Tailwind's `--font-sans` and `--font-heading` tokens. Its neutral, high-x-height character fits small financial labels, dense rows, currency values, and form controls.

Top-level app headings use `text-2xl` or `text-3xl` with `font-bold`. The home month title reaches `text-3xl`, while detail pages generally use `text-2xl`.

Metric values use `text-xl` to `text-2xl` with `font-bold`, colored by financial meaning: primary for neutral balance, destructive for expenses, and green/blessing for income.

Section headers are small but forceful: `text-xs`, `font-semibold`, uppercase, and `tracking-widest`. This creates a dashboard rhythm where sections can be scanned quickly without large headings.

Rows and controls rely on `text-sm` and `text-xs`. Transaction labels are usually `text-sm font-medium`; dates and supporting metadata use `text-xs text-muted-foreground`.

### Spacing Principles

Letter spacing is mostly neutral, with intentional expansion reserved for uppercase section labels. Body copy and controls do not use decorative tracking.

Line height is compact: controls use `text-xs`, cards use `text-xs/relaxed` by default, and captions use relaxed small text only where readability needs it.

Currency values and percentages should be bold and visually isolated. Use color sparingly and let the number itself carry the emphasis.

## 4. Component Stylings

### Buttons

Buttons are square-edged, compact, and text-small. The default height is `h-8`, large is `h-9`, small is `h-7`, and icon buttons range from `size-6` to `size-9`.

Primary buttons use Pale Steel Primary fill with dark text and an `80%` hover tint. Outline buttons use transparent/dark input backgrounds, a border token, and a muted hover fill. Destructive buttons are deliberately soft, using red-tinted backgrounds with red text rather than a full red block except in confirmation flows.

Focus states use `focus-visible:border-ring` and a thin ring. Active button presses translate down by one pixel, giving tactile feedback without animation-heavy motion.

### Cards & Financial Containers

Cards are flat charcoal panels with `rounded-none`, text-small defaults, and a one-pixel `ring-foreground/10`. Internal spacing is tokenized through `--card-spacing`, usually 16px and 12px for small cards.

Dashboard stat cards use `px-4`, stacked labels, and bold values. Transaction rows often bypass the Card component and use the same visual recipe directly: `bg-card`, `ring-1`, horizontal flex, `px-4 py-3`, and hover `bg-accent/40`.

The login card is the one place with stronger elevation (`shadow-2xl`) and a larger brand mark. In the authenticated app, elevation should stay subdued.

### Navigation

Navigation is a fixed mobile bottom bar: `72px` tall, charcoal background, top border, five evenly distributed actions, and 24px horizontal padding.

Inactive navigation items use muted text and 22px lucide icons. Active items switch to primary text. The center add action is a raised circular `56px` button with primary fill, primary foreground icon, a card-colored ring, and a slight upward translation.

Use lucide icons for navigation and utility actions. Icon-only actions should have compact hit areas but visible hover/opacity feedback.

### Inputs & Forms

Inputs, selects, textareas, checkboxes, and most form controls are square-edged with transparent or dark input backgrounds. Standard inputs are `h-8`, `text-xs`, `px-2.5`, and a one-pixel border.

Labels are `text-xs` with tight leading and sit close to controls. Form sections stack vertically with `gap-2`, while full forms use `gap-5` or `gap-6` to separate fields.

Validation states use destructive borders and rings. Error messages are small red text. The money input preserves the same input styling while formatting numerals for finance-specific entry.

### Financial Drama Components

Mistake and blessing entries are dense three-column rows: category left, date centered, amount right. The amount is the main signal, using destructive red for mistakes and green/blessing for income.

Recurring items use the same compact row pattern with a name, frequency/due date metadata, and a right-aligned amount. Overdue recurring cards add an amber icon and amber-tinted border.

Analytics cards contain compact Recharts visualizations with small axis ticks, muted gridlines, circular legends, and rounded bar tops. Charts should stay contained in flat cards and avoid decorative gradients.

## 5. Layout Principles

### Grid & Structure

The product is mobile-first. Authenticated pages use full-width route containers with `px-4`, `py-6`, `pb-20`, and `h-[calc(100dvh-72px)]` when paired with the bottom nav.

The home dashboard uses a single vertical stack with `gap-6`, two-column stat grids with `gap-3`, and compact list stacks with `gap-2` or `gap-3`.

Forms for creating and editing financial drama are centered in a `max-w-2xl` content column with `px-4` on mobile and `md:px-8` on larger screens.

Authentication screens use a centered `max-w-sm` card layout, keeping sign-in and sign-up intentionally narrow and focused.

### Whitespace Strategy

The spacing scale follows Tailwind's 4px rhythm. Common page margins are 16px on mobile and 24px or 32px on wider screens. Section gaps are usually 24px, list gaps are 8px to 12px, and card padding is usually 16px.

Whitespace is efficient rather than luxurious. Dense financial content should remain grouped in short stacks, with headings close enough to their content to preserve context.

### Alignment & Visual Balance

The app is mostly left-aligned, with numeric values right-aligned when they appear in lists. Stat cards use stacked label/value alignment for fast scanning.

Transaction rows distribute category, date, and amount across equal flex areas. This creates a ledger-like rhythm where dates and amounts can be compared quickly.

Charts use full-width responsive containers inside cards. Axis labels and legends stay small to keep the data shape dominant.

### Responsive Behavior & Touch

The app prioritizes phone screens. Bottom navigation remains fixed, content reserves bottom padding, and major workflows fit into vertical scrolling pages.

Tablet and desktop adjustments are modest: page padding increases, form pages gain a max width, and some sections keep the same one-column rhythm instead of becoming complex desktop dashboards.

Touch targets vary: the central add button is large at 56px, while dense form controls are 32px to 36px tall. When generating new screens, keep primary actions full-width on mobile and reserve compact controls for secondary actions or dense rows.

## 6. Design System Notes for Stitch Generation

### Language to Use

Use language like "compact dark finance dashboard", "square-edged shadcn Base UI", "charcoal panels with hairline rings", "small uppercase section labels", "mobile-first bottom navigation", and "ledger-like transaction rows".

Avoid marketing hero styling, large decorative cards, oversized rounded corners, soft beige palettes, and colorful gradients. This product should feel practical, direct, and easy to scan repeatedly.

### Color References

Use Ledger Black `#090b0c` for app backgrounds, Charcoal Panel `#161b1d` for cards/nav/popovers, Deep Slate Fill `#22292b` for hover and secondary surfaces, Pale Steel Primary `#e3e7e8` for primary actions, Muted Steel Text `#9ca8ab` for secondary text, Mistake Red `#ff6467` for losses/errors, Blessing Green `#5dc879` for positive cash flow, and Overdue Amber `#f59e0b` for warnings.

### Component Prompts

Create a mobile finance dashboard screen with a dark ledger background, compact Inter typography, square charcoal stat cards, uppercase section labels, two-column metric grids, dense transaction rows, red expense amounts, green income amounts, and a fixed bottom navigation with a raised circular add button.

Create a financial-drama entry form using square shadcn-style inputs, compact labels, radio controls for Mistake versus Blessing, a money input, date picker trigger, category select, optional account select, planned checkbox, notes textarea, and a full-width primary submit button.

Create an analytics view with flat charcoal chart cards, tiny muted axis labels, hairline gridlines, red and green bar charts for expenses and income, and a category pie chart using saturated chart accents while keeping the surrounding interface monochrome.

### Incremental Iteration

When adding new screens, start from the mobile route container: 16px side padding, 24px vertical rhythm, bottom padding for the nav, and square charcoal cards. Add color only when it communicates financial meaning, state, or chart grouping.

If a screen feels too decorative, reduce radius to zero, remove heavy shadows, shrink headings to the existing scale, and return emphasis to labels, values, borders, and state colors.
