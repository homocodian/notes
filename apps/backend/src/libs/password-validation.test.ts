import { describe, expect, test } from "bun:test";

import { validatePassword } from "./password-validation";

describe("validatePassword", () => {
  test("should return false for passwords shorter than 8 characters", () => {
    expect(validatePassword("A1!a")).toBe(false);
  });

  test("should return false for passwords without digits", () => {
    expect(validatePassword("Abcdefgh!")).toBe(false);
  });

  test("should return false for passwords without special symbols", () => {
    expect(validatePassword("Abcdefgh1")).toBe(false);
  });

  test("should return false for passwords without uppercase letters", () => {
    expect(validatePassword("abcdefgh1!")).toBe(false);
  });

  test("should return false for passwords without lowercase letters", () => {
    expect(validatePassword("ABCDEFGH1!")).toBe(false);
  });

  test("should return false for passwords with whitespace", () => {
    expect(validatePassword("Abc def1!")).toBe(false);
  });

  test("should return true for valid passwords", () => {
    expect(validatePassword("Valid1!a")).toBe(true);
  });
});
