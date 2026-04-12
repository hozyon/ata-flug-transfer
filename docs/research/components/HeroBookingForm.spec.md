# Hero Booking Form Specification

## Overview
- **Target file:** `src/components/BookingForm.tsx` (Existing file to be updated)
- **Screenshot:** `docs/design-references/hero-booking.png`
- **Interaction model:** Multi-step click-driven form.

## DOM Structure
- A container with background overlay (Hero image).
- Centered or Left-aligned heading/subheading.
- Booking form wrapper (Card-style).
- Multi-step flow:
    - Step 1: Passenger count.
    - Step 2: From/To locations.
    - Step 3: Date/Time & Type.

## Computed Styles (Estimated for VIP Luxury)
### Hero Container
- position: relative
- height: 80vh (Mobile) to 600px (Desktop)
- display: flex
- alignItems: center
- justifyContent: center
- backgroundImage: url('/bg1.webp')
- backgroundSize: cover
- backgroundPosition: center

### Form Card
- backgroundColor: rgba(15, 23, 42, 0.9) (Dark Blue/Darker color)
- padding: 32px
- borderRadius: 16px
- boxShadow: 0 8px 32px rgba(0,0,0,0.4)
- maxWidth: 600px
- width: 90% (Mobile)

### Form Inputs
- backgroundColor: rgba(255, 255, 255, 0.1)
- border: 1px solid rgba(255, 255, 255, 0.2)
- color: #ffffff
- fontSize: 16px
- padding: 12px 16px
- borderRadius: 8px

### Action Button (ZURÜCKBUCHEN/WEITER)
- backgroundColor: #c5a059 (Brand Gold)
- color: #020617 (Darker)
- fontWeight: 600
- textTransform: uppercase
- padding: 16px 24px
- borderRadius: 8px
- transition: filter 0.2s ease

## States & Behaviors
### Form Step Transition
- **Trigger:** Click on "WEITER" (Next) or step indicators.
- **Action:** Animate opacity (0 -> 1) and slide-x (-20px -> 0px).
- **Transition:** transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1)

### Hover states
- **Form Inputs:** border: 1px solid #c5a059 (Brand Gold)
- **Action Button:** filter: brightness(110%)

## Per-State Content (if applicable)
### Step 1: Personen
- Title: "Wie viele Personen?"
- Options: 1-16 (Dropdown)

### Step 2: Ort
- Title: "Wohin geht es?"
- From: Antalya Flughafen/Türkei
- To: Belek, Side, Alanya, etc.

## Assets
- Hero Backgrounds: `/bg1.webp`, `/bg2.webp`, `/bg3.webp` (Existing assets).
- Icons: Person, MapPin, Calendar, Clock.

## Text Content (verbatim)
- ANTALYA FLUGHAFEN TRANSFER
- Personen: -wählen- 1 Person ... 16 Personen
- Von: -wählen- (List of locations starting with Antalya Flughafen/Türkei)
- Nach: -wählen- (List of locations)
- Transfer-Typ: -wählen- hinhin und zurück
- ZURÜCKBUCHEN

## Responsive Behavior
- **Desktop (1440px):** Form centered or left-aligned with text on right/left.
- **Mobile (390px):** Stacked heading above form, form full width.
