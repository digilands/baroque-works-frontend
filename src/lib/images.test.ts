import { describe, it, expect } from "vitest";
import {
  RANDOM_PERSON_IMAGE,
  isUnoptimizedSrc,
  normalizeImageSrc,
} from "@/lib/images";

describe("isUnoptimizedSrc", () => {
  it("bypasses the optimizer for placeholder hosts", () => {
    expect(
      isUnoptimizedSrc("https://placehold.co/600x400?text=Handyman"),
    ).toBe(true);
  });

  it("bypasses the optimizer for thispersondoesnotexist.com", () => {
    expect(isUnoptimizedSrc("https://thispersondoesnotexist.com")).toBe(true);
    expect(isUnoptimizedSrc(RANDOM_PERSON_IMAGE)).toBe(true);
  });

  it("bypasses the optimizer for blob URLs", () => {
    expect(isUnoptimizedSrc("blob:http://localhost/abc-123")).toBe(true);
  });

  it("optimizes regular remote images", () => {
    expect(
      isUnoptimizedSrc(
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      ),
    ).toBe(false);
    expect(isUnoptimizedSrc("https://res.cloudinary.com/demo/x.jpg")).toBe(
      false,
    );
  });
});

describe("normalizeImageSrc", () => {
  const fallback = "https://placehold.co/100x100?text=BW";

  it("returns the fallback for empty values", () => {
    expect(normalizeImageSrc(undefined, fallback)).toBe(fallback);
    expect(normalizeImageSrc(null, fallback)).toBe(fallback);
    expect(normalizeImageSrc("", fallback)).toBe(fallback);
    expect(normalizeImageSrc("   ", fallback)).toBe(fallback);
  });

  it("rewrites bare thispersondoesnotexist.com URLs to the direct image", () => {
    expect(normalizeImageSrc("https://thispersondoesnotexist.com", fallback)).toBe(
      RANDOM_PERSON_IMAGE,
    );
    expect(
      normalizeImageSrc("https://thispersondoesnotexist.com/", fallback),
    ).toBe(RANDOM_PERSON_IMAGE);
    expect(
      normalizeImageSrc("http://thispersondoesnotexist.com/?x=1", fallback),
    ).toBe(RANDOM_PERSON_IMAGE);
  });

  it("leaves real image URLs untouched", () => {
    expect(normalizeImageSrc(RANDOM_PERSON_IMAGE, fallback)).toBe(
      RANDOM_PERSON_IMAGE,
    );
    const unsplash =
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";
    expect(normalizeImageSrc(unsplash, fallback)).toBe(unsplash);
    expect(normalizeImageSrc(`  ${unsplash}  `, fallback)).toBe(unsplash);
  });
});
