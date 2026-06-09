/**
 * Sanity client stub — ready to wire up later.
 *
 * When you're ready to connect a Headless CMS:
 *   1. npm install @sanity/client
 *   2. Fill PUBLIC_SANITY_PROJECT_ID / PUBLIC_SANITY_DATASET in .env
 *   3. Uncomment the createClient block below and start querying.
 *
 * Components already read content shapes from src/config/site.ts, so you can
 * migrate page-by-page: fetch from Sanity here, then pass the data down.
 */

export const sanityConfig = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || "",
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION || "2024-01-01",
  // CDN is fine for public, published content.
  useCdn: true,
};

export const isSanityConfigured = Boolean(sanityConfig.projectId);

/*
// Uncomment after `npm install @sanity/client`:

import { createClient, type SanityClient } from "@sanity/client";

export const sanityClient: SanityClient = createClient(sanityConfig);

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return sanityClient.fetch<T>(query, params);
}

// Example query you'd use on /services:
// export const servicesQuery = `*[_type == "service"] | order(order asc){
//   title, "slug": slug.current, description, points
// }`;
*/
