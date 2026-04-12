# Trust Bar Specification

## Overview
- **Target file:** `src/components/TrustBar.tsx` (New file)
- **Interaction model:** Static.

## DOM Structure
- Horizontal bar wrapper (Dark background).
- Content flexbox (Space-around or Space-between).
- Feature items (Icon + Title + Subtitle).

## Computed Styles (Estimated for VIP Luxury)
### Container
- backgroundColor: #020617 (Darker)
- borderTop: 1px solid rgba(197, 160, 89, 0.1)
- borderBottom: 1px solid rgba(197, 160, 89, 0.1)
- padding: 24px 0
- width: 100%

### Feature Item
- display: flex
- alignItems: center
- justifyContent: center
- padding: 0 32px
- flex: 1

### Feature Icon
- fontSize: 32px
- color: #c5a059 (Brand Gold)
- marginRight: 16px

### Feature Title
- color: #ffffff
- fontSize: 18px
- fontWeight: 600
- marginBottom: 4px

### Feature Subtitle
- color: #94a3b8 (Lighter gray/blue)
- fontSize: 13px
- textTransform: uppercase
- letterSpacing: 1px

## States & Behaviors
### Hover states
- **Feature Item:** transform: scale(1.05), transition: transform 0.2s ease

## Assets
- Icons: 24/7 (Clock/Support), Secure (Shield/Lock), Customer (User/Group), Vehicle (Car/Diamond).

## Text Content (verbatim)
- 24/7 Service: PROFESSIONELLER SUPPORT
- 100% Sicher: SICHERER TRANSFER
- 10K+ Kunden: ZUFRIEDENE KUNDEN
- VIP Fahrzeuge: LUXURIÖSE FLOTTE

## Responsive Behavior
- **Desktop (1440px):** 4 items side-by-side.
- **Mobile (390px):** 2 items per row (grid 2x2) or stacked (1 column).
