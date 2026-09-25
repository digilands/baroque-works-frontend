import { describe, it, expect } from "vitest";
import {
  MIN_PASSWORD_LENGTH,
  evaluatePassword,
  isPasswordValid,
} from "@/lib/password";

describe("evaluatePassword", () => {
  it("marks every rule unmet for an empty password", () => {
    expect(evaluatePassword("")).toEqual({
      length: false,
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      hasSpecial: false,
    });
  });

  it("tracks each rule independently", () => {
    expect(evaluatePassword("abcdefgh").length).toBe(true);
    expect(evaluatePassword("abcdefg").length).toBe(false);

    expect(evaluatePassword("Abc").hasUpper).toBe(true);
    expect(evaluatePassword("abc").hasUpper).toBe(false);

    expect(evaluatePassword("aBC").hasLower).toBe(true);
    expect(evaluatePassword("ABC").hasLower).toBe(false);

    expect(evaluatePassword("a1").hasNumber).toBe(true);
    expect(evaluatePassword("ab").hasNumber).toBe(false);

    expect(evaluatePassword("a!").hasSpecial).toBe(true);
    expect(evaluatePassword("a@").hasSpecial).toBe(true);
    expect(evaluatePassword("ab").hasSpecial).toBe(false);
  });

  it("enforces the 8-character minimum", () => {
    expect(MIN_PASSWORD_LENGTH).toBe(8);
    expect(evaluatePassword("Aa1!567").length).toBe(false);
    expect(evaluatePassword("Aa1!5678").length).toBe(true);
  });

  it("accepts the full special-character set", () => {
    for (const ch of "!@#$%^&*(),.?\":{}|<>".split("")) {
      expect(evaluatePassword(`Aa1${ch}bcde`).hasSpecial).toBe(true);
    }
  });
});

describe("isPasswordValid", () => {
  it("passes only when all five rules are met", () => {
    expect(isPasswordValid("Str0ng!Pass")).toBe(true);
    expect(isPasswordValid("Short1!")).toBe(false);
    expect(isPasswordValid("nouppercase1!")).toBe(false);
    expect(isPasswordValid("NOLOWERCASE1!")).toBe(false);
    expect(isPasswordValid("NoNumberHere!")).toBe(false);
    expect(isPasswordValid("NoSpecial123")).toBe(false);
    expect(isPasswordValid("")).toBe(false);
  });
});
