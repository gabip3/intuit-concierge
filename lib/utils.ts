/** Minimal class-name joiner. The main AHC repo uses clsx + tailwind-merge;
 *  this site only ever passes plain strings and conditionals, so a small
 *  helper keeps the dependency list short. */
export type ClassValue = string | false | null | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
