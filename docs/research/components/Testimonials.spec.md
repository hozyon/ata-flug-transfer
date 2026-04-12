# Testimonials Specification

## Overview
- **Target file:** `src/components/Testimonials.tsx` (New file)
- **Interaction model:** Time-driven / Swipe-driven carousel.

## DOM Structure
- Section heading (Centered).
- Carousel container:
    - Inner wrapper (For slides).
    - Review Cards:
        - Avatar/Initial (Top-Left or Top-Center).
        - Name & Date (Top).
        - Star Rating (Top).
        - Review text (Center).
        - Platform indicator (Google/Trustindex) (Bottom).
    - Navigation controls (Arrows/Dots) (Bottom).

## Computed Styles (Estimated for VIP Luxury)
### Section Wrapper
- padding: 80px 24px
- backgroundColor: #020617 (Darker)
- borderTop: 1px solid rgba(197, 160, 89, 0.1)

### Review Card
- backgroundColor: #0f172a (Dark Blue/Dark color)
- border: 1px solid rgba(197, 160, 89, 0.1)
- padding: 32px
- borderRadius: 16px
- maxWidth: 400px
- minHeight: 250px
- marginInline: 16px
- flex: 0 0 100% (Mobile) to 33.33% (Desktop)

### Avatar/Initial
- width: 48px
- height: 48px
- borderRadius: 50%
- backgroundColor: #c5a059 (Brand Gold)
- color: #020617 (Darker)
- fontSize: 18px
- fontWeight: 600
- display: flex
- alignItems: center
- justifyContent: center

### Star Rating
- color: #c5a059 (Brand Gold)
- fontSize: 16px
- marginBottom: 12px

### Review Text
- color: #94a3b8 (Lighter gray/blue)
- fontSize: 15px
- fontStyle: italic
- lineHeight: 1.6

### Platform Icon (Google/Trustindex)
- width: 20px
- height: 20px
- marginRight: 8px

## States & Behaviors
### Carousel Cycle
- **Trigger:** Time (5s intervals) or manual interaction (dots/arrows).
- **Action:** Translate wrapper (transform: translateX(-100% * n)).
- **Transition:** transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)

### Hover states
- **Review Card:** border: 1px solid #c5a059, boxShadow: 0 4px 24px rgba(0,0,0,0.4)

## Assets
- Icons: Stars (Full/Half/Empty), Google Logo, Trustindex Logo, Quote icon.

## Text Content (verbatim)
- Perfekter VIP-Transfer, sehr pünktlich! — Lukas
- Alles super organisiert, danke! — Anna
- Sehr freundlicher Fahrer und sauberes Auto. — Jonas
- Top Service, absolut empfehlenswert! — Sophie
- Schnelle Buchung und zuverlässiger Ablauf. — Leon
- (Review text from Jurij Kober, Samet Şimşek, Julia Schander, etc.)

## Responsive Behavior
- **Desktop (1440px):** 3 reviews visible.
- **Mobile (390px):** 1 review visible.
