import { describe, it, expect, vi } from "vitest";
import { asArray } from "@/lib/server/queries";

vi.mock("server-only", () => ({}));

describe("asArray envelope normalization", () => {
  const rows = [{ _id: "1" }, { _id: "2" }];

  it("reads the primary key", () => {
    expect(asArray(rows, "categories")).toEqual(rows);
  });

  it("passes bare arrays through", () => {
    expect(asArray(rows, "categories", "items")).toEqual(rows);
  });

  it("falls back to items (backend categories shape)", () => {
    expect(asArray({ success: true, items: rows }, "categories", "items", "data")).toEqual(rows);
  });

  it("falls back to data", () => {
    expect(asArray({ data: rows }, "categories", "items", "data")).toEqual(rows);
  });

  it("returns [] when no key matches", () => {
    expect(asArray({ success: true }, "categories", "items", "data")).toEqual([]);
    expect(asArray(null, "categories")).toEqual([]);
  });
});
