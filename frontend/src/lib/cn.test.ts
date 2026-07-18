import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names with spaces", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("supports conditional expressions", () => {
    const active = true;
    const disabled = false;
    expect(cn("base", active && "active", disabled && "disabled")).toBe("base active");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});
