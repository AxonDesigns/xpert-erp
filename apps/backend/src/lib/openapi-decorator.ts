import { z } from "zod";
import "zod-openapi/extend";

export type OpenApiFieldDoc = {
  description?: string;
  example?: unknown;
  examples?: unknown[];
  deprecated?: boolean;
};

export function docsDecorator<
  T extends z.ZodRawShape,
  S extends z.ZodObject<T>,
  D extends Partial<Record<keyof T, OpenApiFieldDoc>>,
>(object: S, docs: D) {
  const shape = object.shape;
  const next: Partial<Record<keyof T, z.ZodTypeAny>> = { ...shape };

  for (const key of Object.keys(docs)) {
    const field = shape[key];
    const doc = docs[key];
    if (doc && field) {
      // @ts-ignore
      next[key] = field.openapi(doc);
    }
  }

  return z.object(next as T) as unknown as S;
}

export function openapiDecorator<
  T extends z.ZodRawShape,
  S extends z.ZodObject<T>,
  D extends Partial<Record<keyof T, OpenApiFieldDoc>>,
>(object: S, docs: D) {
  const shape = object.shape;
  const next: Partial<Record<keyof T, z.ZodTypeAny>> = { ...shape };

  for (const key of Object.keys(docs)) {
    const field = shape[key];
    const doc = docs[key];
    if (doc && field) {
      // @ts-ignore
      next[key] = field.openapi(doc);
    }
  }

  return z.object(next as T) as unknown as S;
}
