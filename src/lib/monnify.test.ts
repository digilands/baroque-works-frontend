import { describe, it, expect } from "vitest";
import { resolveMonnifyTarget } from "@/lib/monnify";

describe("resolveMonnifyTarget", () => {
  it("prefers an explicit checkout URL", () => {
    expect(
      resolveMonnifyTarget({
        success: true,
        checkoutUrl: "https://checkout.monnify.com/abc",
        booking: { _id: "b1" },
      }),
    ).toEqual({ checkoutUrl: "https://checkout.monnify.com/abc", reference: undefined });
  });

  it("builds the checkout URL from a top-level reference", () => {
    expect(
      resolveMonnifyTarget({ success: true, paymentReference: "REF123" }),
    ).toEqual({
      checkoutUrl: "https://checkout.monnify.com/REF123",
      reference: "REF123",
    });
  });

  it("finds a nested booking reference", () => {
    expect(
      resolveMonnifyTarget({ booking: { reference: "NEST456" } }),
    ).toEqual({
      checkoutUrl: "https://checkout.monnify.com/NEST456",
      reference: "NEST456",
    });
  });

  it("returns null when no payment info is present", () => {
    expect(resolveMonnifyTarget({ success: true, booking: { _id: "b1" } })).toBeNull();
    expect(resolveMonnifyTarget(null)).toBeNull();
  });
});
