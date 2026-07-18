/**
 * Tiny className combiner. Filters out falsy values and joins with spaces.
 * Keeps the design-system components dependency-free (no clsx/tailwind-merge).
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
