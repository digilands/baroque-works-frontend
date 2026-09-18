/**
 * Monnify checkout helpers.
 *
 * Flow: the backend creates the payment intent when a booking is made and
 * returns a payment reference (and sometimes a ready checkout URL).
 * The frontend redirects the user to Monnify's hosted checkout to pay.
 */

export const MONNIFY_CHECKOUT_BASE_URL = "https://checkout.monnify.com";

export interface MonnifyTarget {
  /** Full checkout URL to redirect to. */
  checkoutUrl: string;
  /** Raw payment reference, when available. */
  reference?: string;
}

/**
 * Extract a checkout target from a booking-creation response.
 * Tolerates several shapes since the backend may nest the reference
 * inside `booking` or return it top-level alongside `checkoutUrl`.
 */
export function resolveMonnifyTarget(response: unknown): MonnifyTarget | null {
  if (!response || typeof response !== "object") return null;
  const root = response as Record<string, unknown>;
  const booking =
    root.booking && typeof root.booking === "object"
      ? (root.booking as Record<string, unknown>)
      : {};

  const checkoutUrl =
    (typeof root.checkoutUrl === "string" && root.checkoutUrl) ||
    (typeof root.paymentUrl === "string" && root.paymentUrl) ||
    (typeof booking.checkoutUrl === "string" && booking.checkoutUrl) ||
    (typeof booking.paymentUrl === "string" && booking.paymentUrl) ||
    null;
  if (checkoutUrl) {
    const reference =
      (typeof root.paymentReference === "string" && root.paymentReference) ||
      (typeof root.reference === "string" && root.reference) ||
      (typeof booking.paymentReference === "string" && booking.paymentReference) ||
      undefined;
    return { checkoutUrl, reference };
  }

  const reference =
    (typeof root.paymentReference === "string" && root.paymentReference) ||
    (typeof root.reference === "string" && root.reference) ||
    (typeof booking.paymentReference === "string" && booking.paymentReference) ||
    (typeof booking.reference === "string" && booking.reference) ||
    null;
  if (!reference) return null;
  return {
    checkoutUrl: `${MONNIFY_CHECKOUT_BASE_URL}/${reference}`,
    reference,
  };
}

/** Leave the SPA for Monnify's hosted checkout. */
export function redirectToMonnify(target: MonnifyTarget) {
  window.location.href = target.checkoutUrl;
}
