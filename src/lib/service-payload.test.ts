import { describe, it, expect } from "vitest";
import { buildServicePayload, formatTime12 } from "@/lib/service-payload";

const base = {
  isEdit: false,
  handymanId: "h1",
  categoryId: "cat1",
  subCategory: "sub1",
  description: "Professional electrical wiring for residential homes",
  price: "15000",
  pricingModel: "hourly" as const,
  date: "2026-02-15T10:00",
  estimatedTime: "",
  estimatedDuration: "",
  materialsIncluded: false,
};

describe("formatTime12", () => {
  it("converts 24h picker values to swagger format", () => {
    expect(formatTime12("09:00")).toBe("09:00 AM");
    expect(formatTime12("12:00")).toBe("12:00 PM");
    expect(formatTime12("17:30")).toBe("05:30 PM");
  });
});

describe("buildServicePayload", () => {
  it("sends all required strings on create", () => {
    const payload = buildServicePayload(base);
    expect(payload.category).toBe("cat1");
    expect(payload.subCategory).toBe("sub1");
    expect(payload.description).toContain("Professional");
    expect(payload.price).toBe(15000);
    expect(payload.pricingModel).toBe("hourly");
    expect(payload.date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(payload.handyman_id).toBe("h1");
    expect(payload.materials_included).toBe(false);
  });

  it("omits handyman_id on edit", () => {
    const payload = buildServicePayload({ ...base, isEdit: true });
    expect(payload.handyman_id).toBeUndefined();
    expect("handyman_id" in payload).toBe(false);
  });

  it("omits handyman_id when missing so JSON never sends undefined", () => {
    const payload = buildServicePayload({ ...base, handymanId: undefined });
    expect("handyman_id" in payload).toBe(false);
  });

  it("omits schedule when neither time nor duration is set", () => {
    const payload = buildServicePayload(base);
    expect(payload.schedule).toBeUndefined();
  });

  it("omits partial schedule (only one of time/duration)", () => {
    expect(
      buildServicePayload({ ...base, estimatedTime: "09:00" }).schedule,
    ).toBeUndefined();
    expect(
      buildServicePayload({ ...base, estimatedDuration: "4 hours" }).schedule,
    ).toBeUndefined();
  });

  it("sends both schedule fields when both are set", () => {
    const payload = buildServicePayload({
      ...base,
      estimatedTime: "09:00",
      estimatedDuration: "4 hours",
    });
    expect(payload.schedule).toEqual({
      estimatedTime: "09:00 AM",
      estimatedDuration: "4 hours",
    });
  });

  it("keeps already-formatted times as-is", () => {
    const payload = buildServicePayload({
      ...base,
      estimatedTime: "09:00 AM",
      estimatedDuration: "4 hours",
    });
    expect(payload.schedule?.estimatedTime).toBe("09:00 AM");
  });

  it("drops image entries missing url or public_id", () => {
    const payload = buildServicePayload({
      ...base,
      existingImages: [
        { url: "https://cdn/x.jpg", public_id: "ok" },
        { url: "", public_id: "bad" },
        { url: "https://cdn/y.jpg", public_id: "" },
      ],
      images: [
        {
          publicId: "new1",
          url: "https://cdn/n.jpg",
          secureUrl: "https://cdn/n-secure.jpg",
        },
        // Incomplete upload result — must not reach the API.
        {
          publicId: "",
          url: "",
          secureUrl: "",
        } as never,
      ],
    });
    expect(payload.image).toEqual([
      { url: "https://cdn/x.jpg", public_id: "ok" },
      { url: "https://cdn/n-secure.jpg", public_id: "new1" },
    ]);
  });

  it("omits image key entirely when no valid images on create", () => {
    const payload = buildServicePayload(base);
    expect(payload.image).toBeUndefined();
  });

  it("sends empty image array on edit so clearing all photos persists", () => {
    const payload = buildServicePayload({ ...base, isEdit: true });
    expect(payload.image).toEqual([]);
  });

  it("JSON-serializes without undefined values in nested objects", () => {
    const payload = buildServicePayload({
      ...base,
      estimatedTime: "09:00",
      images: [{ publicId: "", url: "", secureUrl: "" } as never],
    });
    const json = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
    expect(JSON.stringify(payload)).not.toContain("undefined");
    if (json.schedule) {
      const schedule = json.schedule as Record<string, unknown>;
      expect(Object.values(schedule).every((v) => typeof v === "string")).toBe(true);
    }
    if (Array.isArray(json.image)) {
      for (const item of json.image as Record<string, unknown>[]) {
        expect(typeof item.url).toBe("string");
        expect(typeof item.public_id).toBe("string");
      }
    }
  });
});
