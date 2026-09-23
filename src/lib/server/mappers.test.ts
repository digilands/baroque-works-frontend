import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatNaira,
  initials,
  mapCategoryToCarouselItem,
  mapHandymanToProCard,
  mapHirerToClient,
  mapJobToDetailBlocks,
  mapJobToListItem,
  mapServiceItemToCard,
  toDateTimeLocalValue,
} from "@/lib/server/mappers";

describe("formatNaira", () => {
  it("formats with Naira sign and grouping", () => {
    expect(formatNaira(17700)).toBe("₦17,700");
    expect(formatNaira(0)).toBe("₦0");
  });
});

describe("formatDate", () => {
  it("formats ISO dates", () => {
    expect(formatDate("2025-10-24T10:00:00Z")).toBe("Oct 24, 2025");
  });

  it("falls back for missing or invalid values", () => {
    expect(formatDate(undefined)).toBe("—");
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("initials", () => {
  it("derives initials", () => {
    expect(initials("Sarah Johnson")).toBe("SJ");
    expect(initials(undefined)).toBe("?");
  });
});

describe("mapCategoryToCarouselItem", () => {
  it("maps display name, image, and subcategory sections", () => {
    const item = mapCategoryToCarouselItem(
      {
        _id: "cat1",
        displayName: "Plumbing",
        image: { url: "https://img", public_id: "x" },
      },
      [{ _id: "s1", displayName: "Bathroom" }],
    );
    expect(item).toEqual({
      name: "Plumbing",
      image: "https://img",
      sections: ["All", "Bathroom"],
      category: "cat1",
    });
  });
});

describe("mapServiceItemToCard", () => {
  it("maps feed items to card props", () => {
    const card = mapServiceItemToCard({
      _id: "svc1",
      description: "Fix sink",
      price: 15000,
      pricingModel: "fixed",
      handyman: { fullname: "Tunde", rating: 4.9, image: [{ url: "pic" }] },
    });
    expect(card.id).toBe("svc1");
    expect(card.rate).toBe("₦15,000");
    expect(card.profile.name).toBe("Tunde");
    expect(card.profile.rating).toBe(4.9);
  });

  it("prefers the service gallery image over the handyman profile photo", () => {
    const card = mapServiceItemToCard({
      _id: "svc2",
      description: "Fix pipe",
      price: 8000,
      image: [{ url: "https://cdn/service.jpg", public_id: "s1" }],
      handyman: { fullname: "Tunde", image: [{ url: "https://cdn/profile.jpg" }] },
    });
    expect(card.image).toBe("https://cdn/service.jpg");
    expect(card.profile.profilePic).toBe("https://cdn/profile.jpg");
  });

  it("falls back to the handyman photo when the service has no image", () => {
    const card = mapServiceItemToCard({
      _id: "svc3",
      description: "No photo",
      image: [],
      handyman: { fullname: "Tunde", image: [{ url: "https://cdn/profile.jpg" }] },
    });
    expect(card.image).toBe("https://cdn/profile.jpg");
  });
});

describe("mapJobToListItem", () => {
  it("normalizes status and budget", () => {
    const item = mapJobToListItem({
      _id: "job1",
      title: "Fix pipe",
      description: "Leaking pipe",
      category: "plumbing",
      location: { type: "Point", coordinates: [3.3792, 6.5244] },
      status: "OPEN",
      urgency: "URGENT",
      budget: { min: 5000, max: 15000 },
      createdAt: "2025-10-24T10:00:00Z",
    });
    expect(item.status).toBe("open");
    expect(item.budget).toBe("₦15,000");
    expect(item.date).toBe("Oct 24, 2025");
  });
});

describe("mapHirerToClient", () => {
  it("builds client card data with fallbacks", () => {
    const client = mapHirerToClient(
      {
        _id: "h1",
        hiringStats: { jobsPosted: 3 },
        trustSignals: { isPaymentVerified: true },
        createdAt: "2023-08-01T00:00:00Z",
      },
      { _id: "u1", fullname: "Sarah Johnson", email: "s@x.com" },
    );
    expect(client.name).toBe("Sarah Johnson");
    expect(client.avatarUrl).toBe("SJ");
    expect(client.isRepeatClient).toBe(true);
    expect(client.isVerified).toBe(true);
  });
});

describe("mapJobToDetailBlocks", () => {
  it("maps budget and coordinates", () => {
    const blocks = mapJobToDetailBlocks({
      _id: "job1",
      title: "Fix pipe",
      description: "Leaking pipe",
      category: "plumbing",
      status: "OPEN",
      urgency: "URGENT",
      budget: { min: 5000, max: 15000 },
      location: { type: "Point", coordinates: [3.3792, 6.5244] },
      createdAt: "2025-10-24T10:00:00Z",
    });
    expect(blocks.financials.total).toBe(15000);
    expect(blocks.location.coordinates).toEqual({ lat: 6.5244, lng: 3.3792 });
    expect(blocks.requestedDate).toBe("Oct 24, 2025");
  });
});

describe("mapHandymanToProCard", () => {
  it("maps handyman search results to pro cards", () => {
    const pro = mapHandymanToProCard({
      _id: "h1",
      user: { _id: "u1", fullname: "Tunde Adebayo", email: "t@x.com" },
      rating: 4.8,
      jobsCompleted: 12,
      distance: 2500,
      categoryId: [{ type: "cat1", experienceLevel: "expert" }],
      location: { type: "Point", coordinates: [3.3792, 6.5244], state: "Lagos", lga: "Ikeja" },
    });
    expect(pro.name).toBe("Tunde Adebayo");
    expect(pro.experience).toBe("Expert");
    expect(pro.distance).toBe("2.5km");
    expect(pro.locationLabel).toBe("Ikeja, Lagos");
    expect(pro.hasCoords).toBe(true);
  });
});

describe("toDateTimeLocalValue", () => {
  it("formats ISO strings for datetime-local inputs", () => {
    expect(toDateTimeLocalValue("2025-02-15T10:00:00.000Z")).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
    );
  });

  it("falls back to empty for missing or invalid values", () => {
    expect(toDateTimeLocalValue(undefined)).toBe("");
    expect(toDateTimeLocalValue("nope")).toBe("");
  });
});
