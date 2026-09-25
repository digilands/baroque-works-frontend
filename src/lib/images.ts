/** Hosts that must bypass the Next.js image optimizer. */
const UNOPTIMIZED_HOSTS = ["placehold.co", "thispersondoesnotexist.com"];

/**
 * Direct image endpoint for thispersondoesnotexist.com (verified to return
 * image/jpeg). The bare domain does not reliably resolve to image bytes —
 * server-side fetches observe HTML/empty responses — so bare URLs are
 * rewritten here before rendering.
 */
export const RANDOM_PERSON_IMAGE =
  "https://thispersondoesnotexist.com/random-person.jpeg";

/**
 * True when `src` must skip the Next.js optimizer: SVG placeholders,
 * bot-gated hosts whose upstream fetch fails validation, and local blobs.
 */
export function isUnoptimizedSrc(src: string): boolean {
  return (
    src.startsWith("blob:") ||
    UNOPTIMIZED_HOSTS.some((host) => src.includes(host))
  );
}

const BARE_THIS_PERSON_PATTERN =
  /^https?:\/\/thispersondoesnotexist\.com\/?(?:[?#].*)?$/i;

/**
 * Normalize backend-supplied image URLs. Empty values fall back; bare
 * thispersondoesnotexist.com URLs (no image path) are rewritten to the
 * verified direct image endpoint so `<img>` always requests image bytes.
 */
export function normalizeImageSrc(
  src: string | undefined | null,
  fallback = "",
): string {
  const trimmed = (src ?? "").trim();
  if (!trimmed) return fallback;
  if (BARE_THIS_PERSON_PATTERN.test(trimmed)) return RANDOM_PERSON_IMAGE;
  return trimmed;
}
