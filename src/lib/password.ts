/**
 * Shared password-strength rules. Single source of truth for the
 * `PasswordChecklist` UI and the Yup schemas on signup / password-change
 * forms — keep the regexes here in sync with those schemas.
 */

export interface PasswordCriteria {
  length: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export type PasswordCriterionKey = keyof PasswordCriteria;

const UPPERCASE_PATTERN = /[A-Z]/;
const LOWERCASE_PATTERN = /[a-z]/;
const NUMBER_PATTERN = /[0-9]/;
const SPECIAL_PATTERN = /[!@#$%^&*(),.?":{}|<>]/;

export const MIN_PASSWORD_LENGTH = 8;

/** Human-readable labels, in display order. */
export const PASSWORD_CRITERIA_LABELS: {
  key: PasswordCriterionKey;
  label: string;
}[] = [
  { key: "length", label: "At least 8 characters long" },
  { key: "hasUpper", label: "Contains an uppercase letter (A–Z)" },
  { key: "hasLower", label: "Contains a lowercase letter (a–z)" },
  { key: "hasNumber", label: "Contains a number (0–9)" },
  { key: "hasSpecial", label: "Contains a special character (!@#$…)" },
];

/** Evaluate each rule independently against the current input. */
export function evaluatePassword(password: string): PasswordCriteria {
  const value = password ?? "";
  return {
    length: value.length >= MIN_PASSWORD_LENGTH,
    hasUpper: UPPERCASE_PATTERN.test(value),
    hasLower: LOWERCASE_PATTERN.test(value),
    hasNumber: NUMBER_PATTERN.test(value),
    hasSpecial: SPECIAL_PATTERN.test(value),
  };
}

/** True only when every rule passes. */
export function isPasswordValid(password: string): boolean {
  return Object.values(evaluatePassword(password)).every(Boolean);
}
