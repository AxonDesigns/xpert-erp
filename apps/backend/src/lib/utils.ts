/**
 * Omit the given keys from an object (runtime + compile-time safe).
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const toOmit = new Set<PropertyKey>(keys as readonly PropertyKey[]);
  const out = {} as Record<PropertyKey, unknown>;

  for (const [k, v] of Object.entries(obj)) {
    if (!toOmit.has(k)) out[k] = v;
  }

  return out as Omit<T, K>;
}
