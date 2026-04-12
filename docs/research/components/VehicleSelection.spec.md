# Vehicle Selection Specification

## Overview
- **Target file:** `src/components/VehicleSelection.tsx` (New file)
- **Interaction model:** Click-to-select with hover effects.

## DOM Structure
- Section heading (Centered).
- Grid container (3 columns on Desktop, 1 on Mobile).
- Vehicle Cards:
    - Image container (Top).
    - Details container (Bottom).
    - List of features (Icons + Text).
    - Select button ("Jetzt wählen").

## Computed Styles (Estimated for VIP Luxury)
### Grid Container
- display: grid
- gridTemplateColumns: 1fr 1fr 1fr
- gap: 32px
- padding: 64px 24px
- maxWidth: 1200px
- marginInline: auto

### Vehicle Card
- backgroundColor: #0f172a (Dark Blue/Dark color)
- border: 1px solid rgba(197, 160, 89, 0.2) (Lighter Gold)
- borderRadius: 20px
- overflow: hidden
- transition: transform 0.3s ease, box-shadow 0.3s ease
- cursor: pointer

### Vehicle Details
- padding: 24px
- textAlign: left

### Feature Icons
- fontSize: 18px
- color: #c5a059 (Brand Gold)
- marginRight: 8px

### Select Button
- backgroundColor: #c5a059 (Brand Gold)
- color: #020617 (Darker)
- fontWeight: 600
- width: 100%
- padding: 12px
- borderRadius: 8px

## States & Behaviors
### Hover states
- **Vehicle Card:** transform: translateY(-8px), box-shadow: 0 12px 48px rgba(0,0,0,0.5)
- **Select Button:** filter: brightness(110%)

### Selected State
- **Vehicle Card:** border: 2px solid #c5a059 (Brand Gold), backgroundColor: rgba(197, 160, 89, 0.1)

## Assets
- Images: `public/images/peugeot-expert.png`, `public/images/mercedes-vito.png`, `public/images/mercedes-sprinter.png`.
- Icons: Air Conditioning, Payment, Support, WLAN, Child Seat.

## Text Content (verbatim)
- PEUGEOT EXPERT TRAVELLER: Klimaanlage Fahrerzahlung 24/7 Support WLAN Kindersitz
- MERCEDES VITO: Klimaanlage Fahrerzahlung 24/7 Support WLAN Kindersitz
- MERCEDES SPRINTER: Klimaanlage Fahrerzahlung 24/7 Support WLAN Kindersitz
- Jetzt wählen

## Responsive Behavior
- **Desktop (1440px):** 3 columns grid.
- **Mobile (390px):** 1 column stack.
