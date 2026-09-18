import { describe, it, expect } from "vitest";
import { ApiError, toApiError } from "@/lib/api-errors";

describe("ApiError", () => {
  it("carries status, code, and message", () => {
    const err = new ApiError(404, "NOT_FOUND", "Missing");
    expect(err.status).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
    expect(err.message).toBe("Missing");
    expect(err).toBeInstanceOf(Error);
  });
});

describe("toApiError", () => {
  it("passes ApiError through unchanged", () => {
    const original = new ApiError(500, "X", "boom");
    expect(toApiError(original)).toBe(original);
  });

  it("normalizes an axios-style error", () => {
    const axiosError = {
      response: {
        status: 401,
        data: { message: "Unauthorized", errorCode: "AUTH" },
      },
    };
    const err = toApiError(axiosError);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(401);
    expect(err.code).toBe("AUTH");
    expect(err.message).toBe("Unauthorized");
  });

  it("falls back for unknown errors", () => {
    const err = toApiError(new Error("network down"), "Fallback");
    expect(err.message).toBe("network down");
    expect(err.status).toBe(0);
  });
});
