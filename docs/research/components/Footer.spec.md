# Footer Specification

## Overview
- **Target file:** `src/components/Footer.tsx` (New file or update existing)
- **Interaction model:** Static.

## DOM Structure
- Main footer wrapper (Dark background).
- Multi-column grid:
    - Column 1: Logo & About description.
    - Column 2: Quick Links (Startseite, Über uns, Feedback, Kontakt).
    - Column 3: Corporate Links (Datenschutzerklärung, Nutzungsbedingungen, Cookie-Richtlinie).
    - Column 4: Contact & Social Media (@excaviptransfer, +90 545 224 9507).
- Bottom bar (Copyright & Site name).

## Computed Styles (Estimated for VIP Luxury)
### Footer Wrapper
- backgroundColor: #020617 (Darker)
- color: #94a3b8 (Lighter gray/blue)
- padding: 64px 24px
- borderTop: 1px solid rgba(197, 160, 89, 0.1)

### Column Heading
- color: #c5a059 (Brand Gold)
- fontSize: 18px
- fontWeight: 600
- marginBottom: 24px
- textTransform: uppercase

### Link Item
- color: #94a3b8
- fontSize: 15px
- paddingBlock: 8px
- transition: color 0.2s ease
- cursor: pointer

### Social Icons
- fontSize: 24px
- color: #c5a059 (Brand Gold)
- marginRight: 16px
- transition: transform 0.2s ease

## States & Behaviors
### Hover states
- **Link Item:** color: #ffffff
- **Social Icons:** transform: scale(1.1), filter: brightness(120%)

## Assets
- Icons: Instagram, Facebook, WhatsApp, Phone, Email.
- Logo: Brand name text "EXCA VIP TRANSFER".

## Text Content (verbatim)
- EXCA VIP TRANSFER: Unser Unternehmen bietet Vip Transferdienste am Flughafen Antalya an und legt besonderen Wert auf komfortable ve güvenli taşımacılık.
- SCHNELLE LINKS: Startseite, Über uns, Feedback, Kontakt
- CARPORATE: Datenschutzerklärung, Nutzungsbedingungen, Cookie-Richtlinie
- KONTAKT: @excaviptransfer, +90 545 224 9507
- © EXCA VIP TRANSFER | Vip Transfer Antalya

## Responsive Behavior
- **Desktop (1440px):** 4 columns grid.
- **Mobile (390px):** 1 column stack, centered alignment.
