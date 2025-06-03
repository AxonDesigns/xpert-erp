import type { FieldApi } from "@tanstack/react-form";

export type FieldProp<T> = FieldApi<
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  // biome-ignore lint/suspicious/noExplicitAny:
  any,
  T
>;

// biome-ignore lint/complexity/noUselessTypeConstraint:
export function getZodFormFieldErrors<T extends unknown>(field: FieldProp<T>) {
  const errors = field.state.meta.errors as { message: string }[];
  const combined = errors.map((e) => e.message).join(", ");

  return field.state.meta.errors.length > 0 ? combined : undefined;
}
