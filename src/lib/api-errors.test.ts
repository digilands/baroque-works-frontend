import { describe, it, expect } from "vitest";
import { ApiError, pickErrorMessage, toApiError } from "@/lib/api-errors";

describe("ApiError", () => {
  it("carries status, code, and message", () => {
    const err = new ApiError(404, "NOT_FOUND", "Missing");
    expect(err.status).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
    expect(err.message).toBe("Missing");
    expect(err).toBeInstanceOf(Error);
  });
});

describe("pickErrorMessage", () => {
  it("prefers a real message over axios status text", () => {
    expect(
      pickErrorMessage({ message: "Validation failed" }, "fallback"),
    ).toBe("Validation failed");
  });

  it("uses Zod errors[] when message is the axios status string", () => {
    expect(
      pickErrorMessage(
        {
          message: "Request failed with status code 400",
          errors: ["expected string, received undefined", "expected string"],
        },
        "fallback",
      ),
    ).toBe(
      "expected string, received undefined · expected string",
    );
  });

  it("uses Zod errors[] when message is missing", () => {
    expect(
      pickErrorMessage({ errors: ["bad field"] }, "fallback"),
    ).toBe("bad field");
  });

  it("falls back when neither message nor errors are useful", () => {
    expect(pickErrorMessage(undefined, "fallback")).toBe("fallback");
    expect(pickErrorMessage({}, "fallback")).toBe("fallback");
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

  it("surfaces Zod errors[] over the axios status message", () => {
    const axiosError = {
      response: {
        status: 400,
        data: {
          message: "Request failed with status code 400",
          errors: ["Invalid input: expected string, received undefined"],
        },
      },
    };
    const err = toApiError(axiosError);
    expect(err.message).toBe(
      "Invalid input: expected string, received undefined",
    );
    expect(err.details).toMatchObject({
      errors: ["Invalid input: expected string, received undefined"],
    });
  });

  it("falls back for unknown errors", () => {
    const err = toApiError(new Error("network down"), "Fallback");
    expect(err.message).toBe("network down");
    expect(err.status).toBe(0);
  });
});
