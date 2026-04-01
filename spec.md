# Lakshmi Ganapathi Communications

## Current State
The app is a multi-section React single-page app (App.tsx) with a password gate (PasswordGate.tsx). All sections exist but may be rendered sequentially without proper smooth-scroll navigation. The app includes: header, hero/banner, calculator, registration fees, contact section, and footer.

## Requested Changes (Diff)

### Add
- Sticky top navigation bar with anchor links to each section: Home, Calculator, Registration Fees, Contact
- Smooth scrolling behavior (CSS scroll-behavior: smooth or JS scroll)
- Section IDs for anchor navigation: #home, #calculator, #registration, #contact
- Mobile-friendly hamburger menu for nav on small screens

### Modify
- Ensure all sections flow in a single scrollable page (no routing, no tabs)
- Navigation links use anchor href (#section-id) for in-page smooth scrolling
- All sections rendered directly in App.tsx in scroll order: sticky nav → header/hero → calculator → registration fees → contact → footer

### Remove
- Any multi-page routing or tab-based navigation that splits content across pages

## Implementation Plan
1. Add `scroll-behavior: smooth` to global CSS (html element)
2. Add a sticky top navbar with anchor links (#home, #calculator, #registration, #contact)
3. Assign section IDs to each major section wrapper
4. Ensure all sections are rendered inline in App.tsx in correct order
5. Add mobile hamburger menu toggle for the navbar
6. Keep PasswordGate.tsx unchanged
7. Keep all features: bilingual labels, unit conversions, registration fees calculator, social media icons, location button
