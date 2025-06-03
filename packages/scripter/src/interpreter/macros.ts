import type {
  BooleanValue,
  NullValue,
  NumericValue,
  VoidValue,
} from "./runtime-values";

export function mkNumber(value: number): NumericValue {
  return {
    type: "number",
    value: value,
  } satisfies NumericValue;
}

export function mkBoolean(value: boolean): BooleanValue {
  return {
    type: "boolean",
    value: value,
  } satisfies BooleanValue;
}

export function mkNull(): NullValue {
  return {
    type: "null",
    value: null,
  } satisfies NullValue;
}

export function mkVoid() {
  return {
    type: "void",
    value: undefined,
  } satisfies VoidValue;
}
