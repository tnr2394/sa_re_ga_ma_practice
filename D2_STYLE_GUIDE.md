# D2 Style Guide: Practice Coach

## 1. Purpose

This document defines the visual system for the `Practice Coach` direction selected in `DESIGN_STRATEGY.md`.

It is implementation-ready and should be used as the design source of truth before additional UI coding.

## 2. Brand Personality

- Calm
- Supportive
- Focused
- Lightly playful

Visual rule:

- The app should feel like a singing coach, not a dashboard.

## 3. Color System

### 3.1 Core Tokens

- `--bg-warm-1`: `#FFF5E4`
- `--bg-cool-1`: `#EFF7FF`
- `--bg-cool-2`: `#EAF3FF`
- `--surface`: `#FFFFFF`
- `--surface-soft`: `#F7FAFF`
- `--text-primary`: `#1F2C44`
- `--text-secondary`: `#5A6785`
- `--border-soft`: `#D7E0EF`
- `--primary-1`: `#1382C4`
- `--primary-2`: `#1CB3C7`
- `--success`: `#21AE67`
- `--warning`: `#D99638`
- `--error`: `#DA6648`

### 3.2 Usage Rules

- Main CTA uses `primary` gradient.
- Positive states use `success`, warnings use `warning`, off-target errors use `error`.
- Keep neutrals dominant; accents should highlight status, not fill entire screen.
- Avoid introducing new saturated colors without a token update.

## 4. Typography

### 4.1 Font Stack

- Display/headline: `"Trebuchet MS", "Avenir Next", "Candara", sans-serif`
- Body: same as display for consistency in v1

### 4.2 Type Scale

- `H1`: 30-34px, 800 weight, uppercase tracking
- `Section Label`: 12-13px, 700 weight, uppercase
- `Primary Value (Swara)`: 56-68px, 900 weight
- `Body`: 15-16px, 600-700 weight
- `Helper`: 13-14px, 500-600 weight

### 4.3 Text Rules

- One-line status whenever possible.
- Coach tip max 1 sentence.
- Avoid dense multi-line text blocks in active practice states.

## 5. Spacing and Radius

### 5.1 Spacing Scale

- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `2xl`: 24px

Use only these intervals for paddings/gaps/margins unless there is a specific reason.

### 5.2 Radius Scale

- Small controls: `10-11px`
- Cards/panels: `14-16px`
- Main shell: `24-26px`
- Pills/labels: `999px`

## 6. Elevation and Depth

### 6.1 Shadows

- `surface-shadow`: subtle card depth
- `cta-shadow`: stronger for primary buttons
- `focus-shadow`: soft glow for active pitch/on-hold states

### 6.2 Rules

- Use one depth level for standard panels.
- Reserve stronger shadows for primary CTA and pitch reward effects.
- Avoid stacking multiple heavy shadows in one viewport.

## 7. Components

## 7.1 Primary Button

- Gradient fill (`primary-1` to `primary-2`)
- Bold text, high contrast
- Hover/press states with subtle brightness shift
- One primary button per state

## 7.2 Secondary Button

- White/soft background
- Medium contrast border
- No gradient unless selected/active

## 7.3 Mode Segmented Control

- Three equal items (`Free`, `Drill`, `60s`)
- Active item = primary style
- Inactive items = neutral style

## 7.4 Status Line

- Compact rounded pill
- Neutral background and border
- Clear short text

## 7.5 Swara Display

- Neutral placeholder style for `-`
- Gradient highlight only when actual note is detected
- Must remain dominant focal text

## 7.6 Pitch Meter

- Vertical form with center target zone
- Indicator color changes by state:
  - success = on pitch
  - warning = high/low
  - error = off target
- Stability glow only after hold threshold

## 7.7 Drill/Challenge Panel

- Light panel with title, meta line, progress bar, primary action
- Progress bars are visually consistent across drill/challenge

## 7.8 Stats Pills

- Small rounded pills in row on medium+ widths
- Stack only on small screens
- Keep labels concise (`Stars`, `Streak`, `Time`)

## 8. Motion Guidelines

- Duration range: `100ms-300ms` for micro interactions
- Entrance animation: single short rise/fade
- Reward animation:
  - meter glow on stable hold
  - gentle progress fill
- No constant pulsing animations during singing

## 9. Responsive Rules

- Mobile-first, but preserve horizontal groups until ~520px.
- Do not collapse everything to single column too early.
- Keep pitch meter and primary CTA visible above fold where feasible.
- Minimum tap target: 44px.

## 10. Accessibility Baseline

- Maintain readable contrast for all key text and controls.
- Color is never sole carrier of meaning.
- Buttons and inputs must remain keyboard reachable.
- Status and guidance text should be readable at arm's length.

## 11. Content Density Rules

- Maximum 1-2 helper lines on active screen.
- Hide non-essential cards while challenge is running.
- Summary card should auto-dismiss or collapse to reduce clutter.

## 12. Implementation Notes

- Keep visual tokens centralized (single source in CSS variables).
- Apply component classes consistently across modes.
- Validate layout at:
  - `360x800`
  - `390x844`
  - `768x1024`
  - `1366x768`

## 13. Acceptance Criteria for D2

- Every component used in D1 has styling tokens and behavior states.
- Designers/developers can implement without inventing ad-hoc styles.
- System supports calm clarity while keeping motivation cues.
