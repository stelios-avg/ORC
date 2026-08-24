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
  /** Production URL. */
  url: "https://orcosteopathy.com",
  email: "orcosteopathy@hotmail.com",
  phone: "+357 96 322622",
  phoneHref: "tel:+35796322622",
  /** Used for the Google Maps embed/query; display strings live in i18n. */
  address: "Perikleous 63, Strovolos 2021, Cyprus",
  social: {
    instagram: "https://www.instagram.com/orc_ostheopathy/",
    facebook: "https://www.facebook.com/profile.php?id=61575872120846",
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
  "https://www.fresha.com/a/orc-til-96322622-osteopathitikos-haralampos-neokleoys-strovolos-aitolon-aitolon-bnk279fh";

/** Optional endpoint to capture pre-booking leads before redirecting. */
export const LEAD_ENDPOINT: string = import.meta.env.PUBLIC_LEAD_ENDPOINT || "";

/**
 * Web3Forms access key — when set, each pre-booking submission is emailed
 * to the address the key was issued for. Set PUBLIC_LEAD_ACCESS_KEY in
 * .env locally and in the Vercel project settings.
 */
export const LEAD_ACCESS_KEY: string = import.meta.env.PUBLIC_LEAD_ACCESS_KEY || "";
