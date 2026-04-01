# Lakshmi Ganapathi Communications

## Current State
Full single-page scrollable web app with: sticky nav bar, hero/banner section, services grid, property calculator, registration fees calculator, contact section, and footer. All sections stack vertically and require scrolling. Banner is 15-25% screen height. Footer is compact.

## Requested Changes (Diff)

### Add
- Tab-based layout so entire app fits in one browser window without full-page scrolling
- Each section (Home/Banner, Calculator, Reg. Fees, Contact) becomes a tab panel
- Internal scroll within each tab panel if content overflows

### Modify
- Replace scrollable single-page layout with a fixed-height viewport layout: compact header (top) + tab nav + scrollable tab content area + compact footer (bottom)
- Header: reduce height, keep logo/branding/contact info but more compact
- Banner: show only in Home tab, keep image, ~20% height or proportional within tab
- Footer: stays pinned at bottom, very compact (one row)
- Navigation: convert from scroll-links to tab switchers

### Remove
- Full-page scroll behavior
- Separate hero section as standalone scroll target (integrate into Home tab)

## Implementation Plan
1. Wrap entire app in `height: 100vh, overflow: hidden` container
2. Header: fixed compact top bar (logo circle + title + contact in one row)
3. Tab bar: Home | Calculator | Reg. Fees | Contact (bilingual labels)
4. Tab content area: `flex-1, overflow-y: auto` — each tab renders its section
5. Footer: fixed bottom bar, single row with address + social icons + location button
6. Home tab: banner image + services cards
7. Calculator tab: full calculator form + results panel side by side
8. Reg. Fees tab: deed type selector + calculation results
9. Contact tab: contact info + map button
10. Password gate stays unchanged
11. Map modal stays unchanged
