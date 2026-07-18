import { describe, it, expect } from "vitest";
import { scorePassword } from "./PasswordStrengthMeter";

describe("scorePassword", () => {
  it("rates a short simple password as too weak", () => {
    const r = scorePassword("abc");
    expect(r.score).toBe(0);
    expect(r.label).toBe("Too weak");
  });

  it("gives one point for sufficient length", () => {
    expect(scorePassword("abcdefgh").score).toBe(1);
  });

  it("rewards mixed case and numbers", () => {
    // length + mixed-case + digit = 3 (Strong)
    const r = scorePassword("Abcdefg1");
    expect(r.score).toBe(3);
    expect(r.label).toBe("Strong");
  });

  it("rates a long complex password as excellent", () => {
    const r = scorePassword("Abcdef1!xyz");
    expect(r.score).toBe(4);
    expect(r.label).toBe("Excellent");
  });

  it("always returns a color", () => {
    expect(scorePassword("Test123!").color).toMatch(/^#/);
  });
});
