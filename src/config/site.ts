/**
 * Central site configuration.
 *
 * This is intentionally a plain TypeScript module so the whole site can be
 * driven from one place today, and swapped for Sanity-fetched data later
 * without touching the components (they just import these shapes).
 */

export interface NavLink {
  label: string;
  href: string;
}

export const SITE = {
  name: "ORC Osteopathy & Rehabilitation Center",
  shortName: "ORC",
  tagline: "Move better. Live better.",
  description:
    "Expert physiotherapy and osteopathy at ORC Osteopathy & Rehabilitation Center. Personalised, evidence-based care to relieve pain, restore movement and keep you performing at your best.",
  /** Path is relative to /public. Transparent PNG lockup (wordmark + spine). */
  logo: "/orc-logo.png",
  url: "https://orc-center.example.com",
  email: "hello@orc-center.com",
  phone: "+357 00 000 000",
  phoneHref: "tel:+35700000000",
  address: "123 Wellness Avenue, Nicosia, Cyprus",
  hours: [
    { day: "Mon – Fri", time: "08:00 – 20:00" },
    { day: "Saturday", time: "09:00 – 14:00" },
    { day: "Sunday", time: "Closed" },
  ],
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Bio", href: "/bio" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

/**
 * Fresha booking URL. Falls back to a placeholder if the env var is missing
 * so the build never breaks. Set PUBLIC_FRESHA_BOOKING_URL in your .env /
 * Vercel project settings.
 */
export const FRESHA_BOOKING_URL: string =
  import.meta.env.PUBLIC_FRESHA_BOOKING_URL ||
  "https://www.fresha.com/a/your-orc-handle";

/** Optional endpoint to capture pre-booking leads before redirecting. */
export const LEAD_ENDPOINT: string = import.meta.env.PUBLIC_LEAD_ENDPOINT || "";
