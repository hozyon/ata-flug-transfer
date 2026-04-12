# Behaviors: Excaviptransfer.com

This document catalogs the interactive behaviors and state transitions discovered on the target site.

## 1. Global Behaviors
- **Sticky Header:** The header stays at the top of the viewport. It likely changes background opacity or adds a shadow when scrolling.
- **Smooth Scroll:** The site uses smooth scrolling for anchor links.
- **Scroll Animations:** Elements (cards, text sections) fade or slide into view as they enter the viewport.

## 2. Multi-Step Booking Form
- **Interaction Model:** Click-driven state machine.
- **Steps:**
    1. Passenger count selection (Dropdown).
    2. "From" location selection (Searchable dropdown/List).
    3. "To" location selection (Searchable dropdown/List).
    4. Date and Time selection (Datepicker/Timepicker).
    5. Transfer type (One-way vs. Round-trip).
- **Transitions:** Smooth transition (fade/slide) between steps. "Zurück" (Back) and "Weiter" (Next) buttons manage state.

## 3. Vehicle Selection
- **Interaction Model:** Click-to-select.
- **Behavior:** Clicking a vehicle card (Peugeot, Mercedes Vito, Mercedes Sprinter) highlights the selection and potentially scrolls to the next section or updates the "Overview" section.
- **Hover:** Subtle scale or shadow increase on vehicle cards.

## 4. Extras Selection
- **Interaction Model:** Input-driven.
- **Behavior:** Quantity selectors (+/-) for drinks and checkable items for child seats. Total price updates dynamically in the "Overview" section.

## 5. Regions Directory
- **Interaction Model:** Click-to-expand.
- **Behavior:** "Mehr anzeigen" (Show more) expands a hidden grid of 30+ region links. "Weniger anzeigen" (Show less) collapses it back to a compact view (likely 1-2 rows).

## 6. Testimonials Carousel
- **Interaction Model:** Time-driven / Swipe-driven.
- **Behavior:** Automatic cycling of customer reviews. Navigation dots or arrows for manual control.

## 7. Responsive Breakpoints
- **Desktop (1440px):** Multi-column layouts for fleet and hotel transfers.
- **Tablet (768px):** Layout shifts, potentially 2 columns for cards.
- **Mobile (390px):** Single column stack for almost all sections. Menu becomes a hamburger icon/mobile overlay.
