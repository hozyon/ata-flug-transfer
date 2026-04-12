# Page Topology: Excaviptransfer.com (Cloned for Ata Flug Transfer)

This document maps out the distinct sections of the homepage from top to bottom.

## 1. Header & Navigation
- **Role:** Sticky/Fixed navigation.
- **Component:** `src/components/Navbar.tsx` (Existing)
- **Design:** Dark background with Gold accents.

## 2. Hero & Multi-Step Booking Engine
- **Role:** Primary conversion point.
- **Component:** `src/components/BookingForm.tsx` (Existing, to be styled as a card)
- **Background:** `public/bg1.webp` (Existing slider)

## 3. Trust Bar / Key Features
- **Role:** Quick value propositions.
- **Component:** `src/components/TrustBar.tsx` (New)
- **Features:** 24/7 Service, 100% Secure, 10K+ Satisfied Customers, VIP Vehicles.

## 4. Vehicle Selection (Fleet)
- **Role:** Display available options.
- **Component:** `src/components/VehicleSelection.tsx` (New)
- **Vehicles:** Peugeot Expert, Mercedes Vito, Mercedes Sprinter.

## 5. Popular Destinations (Hotel Transfers)
- **Role:** Highlighting key routes.
- **Component:** `src/components/HotelTransfers.tsx` (New)
- **Images:** `public/images/regions/*.png` (Existing)

## 6. Testimonials Carousel
- **Role:** Trust building.
- **Component:** `src/components/Testimonials.tsx` (New)
- **Data:** Dynamic from Supabase reviews.

## 7. Regions Directory
- **Role:** SEO and comprehensive service list.
- **Component:** `src/components/RegionsDirectory.tsx` (New)
- **Interaction:** Expandable list.

## 8. Informational / SEO Content
- **Role:** Detailed explanation of services.
- **Component:** Inline in `src/components/HomePage.tsx`.

## 9. Footer
- **Role:** Corporate info and secondary links.
- **Component:** `src/components/Footer.tsx` (New)
