# Lakshmi Ganapathi Communications

## Current State
Single-window app with tabbed navigation (Home, Calculator, Reg. Fees, Contact tabs). Header ~62px, footer ~62px. Password gate (English only, fixed password 2469). Bilingual labels throughout. Banner image in Home tab only.

## Requested Changes (Diff)

### Add
- Three external link buttons below the banner: "E.C Search" (https://registration.ec.ap.gov.in/ecSearch), "Market Value" (https://registration.ap.gov.in/igrs/newPropertyvalue), "Prohibited Property" (https://registration.ap.gov.in/igrs/ppProperty) — each opens in new tab
- Contact details in the footer (address, phone, email alongside social icons and location button)

### Modify
- Remove tab navigation entirely
- Layout: header (~22-27% vh) + footer (~22-27% vh) = ~45-55% total, middle content area fills remaining ~45-55%
- Header expanded to show branding, contact info, AND banner image + 3 external buttons stacked
- Middle area: Calculator (left) and Registration Fees (right) side-by-side in a compact grid, no scrolling
- Footer: larger, contains address, phone, email, social icons, location button, proprietary name

### Remove
- Tab navigation (Home tab, Calculator tab, Reg Fees tab, Contact tab buttons)
- Home tab content (services grid, unit reference table) — moved inline or removed

## Implementation Plan
1. Restructure App.tsx into fixed-height sections: header block (includes logo+branding+banner+3 buttons), main content (calculator + reg fees side by side), footer block (contact details + social + location)
2. Header height: ~25vh, contains: logo row + banner image + 3 external link buttons
3. Main content: calc(50vh - header_offset), flex row with calculator left and reg fees right, overflow hidden
4. Footer: ~22vh, contains full contact info: prop name, address, phone, email, social icons, location button
5. Remove all tab-switching logic and HomeTab/ContactTab components
6. Keep all calculation logic, unit conversions, registration fees, password gate, map modal unchanged
7. Keep bilingual labels on all calculator and reg fees fields
