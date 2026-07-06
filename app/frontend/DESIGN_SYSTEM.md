# Frontend Design System

## Applicability

Read this document before changing frontend layout, visual styling, components, charts, report screens, or marketing-facing product labels.

This design system translates the Market Lab identity into practical frontend rules for the PoC UI.

## Brand Direction

Market Lab should feel clear, confident, academic enough for research work, and sharp enough for a startup demo.

Use a direct visual language inspired by the supplied Market Lab reference:

- Large uppercase wordmark energy.
- Strong geometric shapes.
- High contrast between blue, light surface, and dark ink.
- Clean dashboard composition over decorative illustration.
- Minimal gradients and no soft pastel look.

The UI should look like a serious research tool, not a generic SaaS landing page.

## Core Palette

Use these as the primary brand colors:

```css
:root {
  --ml-blue: #3982cb;
  --ml-surface: #f1f1f1;
  --ml-ink: #1b2229;
}
```

Color roles:

- `#3982cb` is the primary action, active navigation, chart highlight, selected state, and brand mark color.
- `#f1f1f1` is the app background, neutral panel fill, page band, and quiet empty-state surface.
- `#1b2229` is primary text, headings, data labels, dark buttons, and high-emphasis borders.
- White is used for cards, tables, inputs, modals, and content surfaces that need focus.

Do not replace the brand blue with purple, cyan, or navy as the dominant identity color.

## Supporting Colors

Use supporting colors sparingly and only for meaning:

```css
:root {
  --ml-blue-strong: #236dad;
  --ml-blue-soft: #dbeafa;
  --ml-ink-muted: #4b5563;
  --ml-border: #d8dde3;
  --ml-success: #21845a;
  --ml-warning: #a45f00;
  --ml-danger: #b42318;
}
```

Rules:

- Prefer tints of blue for selected, hover, and active states.
- Use red, amber, and green only for status, validation, or risk.
- Keep charts readable in grayscale first, then add blue for emphasis.

## Typography

Use a modern sans-serif stack:

```css
font-family: "Be Vietnam Pro", system-ui, sans-serif;
```

Type rules:

- Headings are bold, compact, and confident.
- Use uppercase only for short labels, tabs, badges, and brand moments.
- Body copy should stay calm and scannable.
- Do not use negative letter spacing.
- Do not scale font sizes with viewport width.

Recommended scale:

- Page title: 40px desktop, 30px mobile, 700-800 weight.
- Section title: 24px desktop, 20px mobile, 700 weight.
- Card title: 18px, 700 weight.
- Body: 15px-16px, 400-500 weight.
- Metadata: 13px-14px, 500 weight.
- Badge text: 11px-12px, 700 weight, uppercase.

## Logo And Brand Treatment

When rendering a text-only brand mark:

- Use `MARKET` in blue and `LAB` in ink.
- Keep the words uppercase.
- Prefer heavy weight, tight line height, and no decorative effects.
- If using a small secondary label such as `MARKET UNI`, place it as a compact ink label on a white or light strip.
- Do not add drop shadows, glossy effects, or complex gradients.

Example:

```tsx
<span className="brandMark">
  <span className="brandMarkBlue">MARKET</span>
  <span className="brandMarkInk">LAB</span>
</span>
```

## Layout

The product UI should be dense, structured, and easy to scan.

Layout rules:

- App background uses `#f1f1f1`.
- Main content uses white or very light panels.
- Use full-width page sections, not nested card stacks.
- Cards are for repeated entities such as personas, messages, respondents, studies, or insight snippets.
- Keep card border radius at 8px or less.
- Use strong spacing rhythm: 4, 8, 12, 16, 24, 32, 48.
- Desktop pages should use a constrained content width around 1120px-1280px.
- Mobile pages should keep primary actions visible without horizontal scrolling.

## Components

Buttons:

- Primary button: blue background, white text.
- Secondary button: white background, ink text, ink or border outline.
- Destructive button: danger color only when the action is destructive.
- Icon buttons should use lucide icons when available.

Inputs:

- White background.
- 1px border using `--ml-border`.
- Focus ring uses `#3982cb`.
- Validation messages use semantic colors and concise text.

Cards:

- White background.
- 1px border using `--ml-border`.
- Radius 8px maximum.
- Use blue only for accents, selected states, or key metrics.

Badges:

- Synthetic and assumption badges should be visible but not alarming.
- Use blue-soft background with ink or blue text.
- Risk or validation badges can use warning or danger colors.

Tables:

- Header text should be uppercase or semibold metadata style.
- Use subtle row dividers.
- Highlight selected rows with a soft blue background.

Charts:

- Primary series uses `#3982cb`.
- Labels and axes use `#1b2229` or muted ink.
- Avoid decorative 3D, shadows, or saturated rainbow palettes.

## Product-Specific Rules

Market Lab is synthetic research, so UI must make the simulated nature clear.

- Clearly label synthetic personas, responses, insights, and reports as assumptions requiring human validation.
- Keep insights tied to structured fields where possible.
- Prefer concise research language over marketing copy.
- Do not imply real respondents or validated market truth unless backend data supports it.

## Motion

Motion should be restrained:

- Use 120ms-200ms transitions for hover, focus, tabs, and panel entry.
- Avoid bouncy motion.
- Do not animate charts in ways that make values hard to read.

## Accessibility

- Maintain readable contrast against white and `#f1f1f1`.
- Provide visible focus states.
- Do not communicate status by color alone.
- Keep tap targets at least 40px high on mobile.
- Ensure text wraps cleanly in cards, badges, and buttons.

## Implementation Notes

- Prefer shared CSS variables or Tailwind theme tokens for these colors.
- Keep styling close to existing frontend conventions.
- Do not introduce a separate UI framework only for this design system.
- When adding new components, align their states with the rules above before creating one-off styles.
