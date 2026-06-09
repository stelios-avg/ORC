# ORC Osteopathy & Rehabilitation Center

Marketing website for **ORC Osteopathy & Rehabilitation Center**, built with
[Astro](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com),
ready for a [Sanity](https://www.sanity.io) Headless CMS and optimized for
[Vercel](https://vercel.com) deployment.

## Features

- Sticky, responsive navbar + footer (logo used in both)
- Full-screen autoplay/muted/loop **video hero** with dark overlay
- **Gated Fresha booking**: a required pre-booking form (Full Name, Email,
  Physical Address, Phone) that only redirects/reveals Fresha on valid submit
- Pages: Home, Bio, Services, Gallery, Contact
- Brand palette extracted from the logo (charcoal text + deep spine-blue accents)
- Sanity-ready structure (`src/lib/sanity.ts`, env vars) and Vercel adapter

## Getting started

```bash
npm install
cp .env.example .env   # then fill in PUBLIC_FRESHA_BOOKING_URL
npm run dev            # http://localhost:4321
```

Build & preview:

```bash
npm run build
npm run preview
```

## Required assets

Drop these into `/public` (the logo name must match exactly):

| File | Used for |
| --- | --- |
| `public/orc-logo.png` | Logo (navbar, footer, favicon, OG) — included |
| `public/videos/hero.mp4` and/or `public/videos/hero.webm` | Hero background video |
| `public/images/hero-poster.jpg` | Hero poster (shown while video loads) |
| `public/images/practitioner.jpg` | Bio page portrait |
| `public/images/gallery/1.jpg … 9.jpg` | Gallery images |

Missing images degrade gracefully (placeholders / hidden), so the site builds
and runs before you add the real assets.

## Booking flow (Fresha gate)

1. Any element with `data-book-trigger` opens the pre-booking modal
   (`src/components/BookingModal.astro`).
2. The user must pass client-side validation for all four required fields.
3. On success the user is redirected to `PUBLIC_FRESHA_BOOKING_URL`.
   - Prefer an embedded widget instead? Set `data-reveal-mode="iframe"` on the
     `#booking-modal` root element to reveal an inline Fresha iframe rather than
     redirecting.
   - Set `PUBLIC_LEAD_ENDPOINT` to also capture the lead (POST JSON) before the
     handoff. Capture failures never block the booking.

## Configuration

Most content (nav, contact details, hours, Fresha URL) lives in
`src/config/site.ts`. This is intentionally one place so it's easy to migrate to
Sanity later without touching components.

## Deploy to Vercel

The `@astrojs/vercel` adapter is already configured. Either:

```bash
npx vercel        # preview
npx vercel --prod # production
```

…or connect the Git repo in the Vercel dashboard. Set the environment variables
from `.env.example` in **Project Settings → Environment Variables**.

## Tech

- Astro 5 · Tailwind CSS 4 (`@tailwindcss/vite`) · TypeScript
- `@astrojs/vercel` adapter · Sanity-ready (`@sanity/client` to be added)
