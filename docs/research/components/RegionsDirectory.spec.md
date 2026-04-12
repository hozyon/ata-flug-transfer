# Regions Directory Specification

## Overview
- **Target file:** `src/components/RegionsDirectory.tsx` (New file)
- **Interaction model:** Click-to-expand toggle.

## DOM Structure
- Section heading (Centered).
- Grid container (Initially 3 columns on Desktop, 1 on Mobile).
- Region links (Card or list style).
- Expand/Collapse button ("Mehr anzeigen" / "Weniger anzeigen").

## Computed Styles (Estimated for VIP Luxury)
### Container
- padding: 64px 24px
- backgroundColor: #0f172a (Dark Blue/Dark color)
- borderTop: 1px solid rgba(197, 160, 89, 0.1)

### Grid
- display: grid
- gridTemplateColumns: 1fr 1fr 1fr (Desktop)
- gap: 16px 32px
- transition: height 0.5s ease
- overflow: hidden

### Region Link
- color: #94a3b8 (Lighter gray/blue)
- fontSize: 16px
- padding: 8px 16px
- border: 1px solid rgba(197, 160, 89, 0.1)
- borderRadius: 8px
- transition: all 0.2s ease
- cursor: pointer

### Expand Button
- backgroundColor: transparent
- color: #c5a059 (Brand Gold)
- border: 1px solid #c5a059
- padding: 12px 24px
- borderRadius: 8px
- marginTop: 32px
- marginInline: auto
- cursor: pointer

## States & Behaviors
### Expand/Collapse
- **Trigger:** Click on toggle button.
- **Action:** Toggle grid height (max-height: 200px -> 2000px) and button text ("Mehr anzeigen" <-> "Weniger anzeigen").
- **Transition:** transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1)

### Hover states
- **Region Link:** color: #ffffff, border: 1px solid #c5a059, backgroundColor: rgba(197, 160, 89, 0.05)
- **Expand Button:** backgroundColor: #c5a059, color: #020617

## Assets
- Icons: MapPin, ChevronDown, ChevronUp.

## Text Content (verbatim)
- TOP HOTELTRANSFER
- Mehr anzeigen
- Weniger anzeigen
- (30+ region names like Alanya, Belek, Side, Kemer, etc.)

## Responsive Behavior
- **Desktop (1440px):** 3 columns grid.
- **Mobile (390px):** 1 column stack, centered alignment.
