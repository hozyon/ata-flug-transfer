# Hotel Transfers Specification

## Overview
- **Target file:** `src/components/HotelTransfers.tsx` (New file)
- **Interaction model:** Hover-driven.

## DOM Structure
- Section heading (Centered).
- Grid container (4 columns on Desktop, 2 on Mobile).
- Hotel Cards:
    - Image container (Top).
    - Overlay title (Bottom).
    - Price badge (Top-Right or Bottom-Right).

## Computed Styles (Estimated for VIP Luxury)
### Section Wrapper
- padding: 80px 24px
- backgroundColor: #0f172a (Dark Blue/Dark color)
- borderTop: 1px solid rgba(197, 160, 89, 0.1)

### Grid Container
- display: grid
- gridTemplateColumns: 1fr 1fr 1fr 1fr
- gap: 24px
- maxWidth: 1200px
- marginInline: auto

### Hotel Card
- position: relative
- height: 300px
- borderRadius: 16px
- overflow: hidden
- boxShadow: 0 4px 16px rgba(0,0,0,0.3)
- transition: transform 0.3s ease, box-shadow 0.3s ease
- cursor: pointer

### Hotel Image
- width: 100%
- height: 100%
- objectFit: cover
- transition: transform 0.5s ease

### Hotel Overlay
- position: absolute
- inset: 0
- background: linear-gradient(to top, rgba(0,0,0,0.8), transparent)
- display: flex
- alignItems: flex-end
- padding: 20px

### Hotel Title
- color: #ffffff
- fontSize: 18px
- fontWeight: 600
- textShadow: 0 2px 4px rgba(0,0,0,0.5)

### Price Badge
- position: absolute
- top: 16px
- right: 16px
- backgroundColor: #c5a059 (Brand Gold)
- color: #020617 (Darker)
- fontSize: 14px
- fontWeight: 700
- padding: 6px 12px
- borderRadius: 8px

## States & Behaviors
### Hover states
- **Hotel Card:** transform: translateY(-8px), boxShadow: 0 12px 32px rgba(0,0,0,0.5)
- **Hotel Image:** transform: scale(1.1)
- **Hotel Overlay:** background: linear-gradient(to top, rgba(197, 160, 89, 0.4), transparent)

## Assets
- Images: `public/images/hotel-rubi-platinum.webp`, `public/images/hotel-azura-deluxe.webp`, etc.
- Icons: MapPin, Star.

## Text Content (verbatim)
- TOP HOTELTRANSFER
- Rubi Platinum
- Azura Deluxe
- (Other luxury hotel names)
- Ab 45€

## Responsive Behavior
- **Desktop (1440px):** 4 columns grid.
- **Mobile (390px):** 2 columns grid.
