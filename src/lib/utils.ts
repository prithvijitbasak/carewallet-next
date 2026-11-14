/**
 * ============================================================================
 * CLASSNAMES UTILITY (`cn`)
 * ============================================================================
 * 
 * Why do we need `cn()`?
 * When writing React components with Tailwind CSS:
 * 1. Conditional styling often produces arrays or falsy values: `isActive && 'bg-blue-500'`
 *    -> `clsx` flattens objects, arrays, and filters out falsy values (null, undefined, false).
 * 2. Conflicting Tailwind classes can clash: `cn("px-2 py-1", "p-4")`
 *    -> `twMerge` intelligently resolves conflicts so the later class (`p-4`) overrides earlier ones.
 * 
 * @example
 * ```tsx
 * <button className={cn("base-btn", isActive ? "bg-green-600" : "bg-gray-400", className)} />
 * ```
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
