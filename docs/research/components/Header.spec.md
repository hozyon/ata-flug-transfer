# Header Specification

## Overview
- **Target file:** `src/components/Navbar.tsx` (Existing file to be updated)
- **Interaction model:** Static (Sticky) with dropdowns for language and navigation.

## DOM Structure
- A fixed/sticky container wrapping a content wrapper.
- Logo/Brand name (Left).
- Navigation links (Center-Right on Desktop).
- Language switcher (Right).
- Login button (Right).
- Hamburger menu button (Mobile only).

## Computed Styles (Estimated for VIP Luxury)
### Container
- display: flex
- alignItems: center
- justifyContent: space-between
- position: sticky
- top: 0
- height: 80px
- paddingInline: 24px
- backgroundColor: rgba(15, 23, 42, 0.9) (Dark Blue/Darker color from globals.css)
- backdropFilter: blur(8px)
- zIndex: 100

### Logo/Brand
- color: #c5a059 (Brand Gold)
- fontSize: 24px
- fontWeight: 700
- fontFamily: 'Playfair Display', serif

### Nav Links
- color: #ffffff
- fontSize: 16px
- fontWeight: 500
- paddingInline: 16px
- transition: color 0.2s ease

## States & Behaviors
### Sticky Transition
- **Trigger:** Scroll position > 20px
- **State A (Top):** Transparent background or lighter border.
- **State B (Scrolled):** Dark background with shadow.
- **Transition:** transition: background-color 0.3s ease, box-shadow 0.3s ease

### Hover states
- **Nav Links:** color: #c5a059 (Brand Gold)

### Mobile Menu
- **Trigger:** Click on hamburger icon.
- **Action:** Open overlay menu with slide-in animation from the right or fade-in from top.

## Assets
- Logo: Brand name text "EXCA VIP TRANSFER" (May also use a stylized 'E' SVG).
- Icons: Menu (Hamburger), Globe (Language), User (Login).

## Text Content (verbatim)
- Startseite
- Über Uns
- Kontakt
- Login
- REZERVASYON

## Responsive Behavior
- **Desktop (1440px):** Full navigation visible.
- **Mobile (390px):** Hamburger menu replaces navigation links. Logo remains left, Login/Language may move to mobile menu.
