export type Type = "number" | "boolean" | "null" | "return" | "void";

export type RuntimeValue = {
  type: Type;
  value: unknown;
};

export interface NumericValue extends RuntimeValue {
  type: "number";
  value: number;
}

export interface BooleanValue extends RuntimeValue {
  type: "boolean";
  value: boolean;
}

export interface NullValue extends RuntimeValue {
  type: "null";
  value: null;
}

export interface ReturnValue extends RuntimeValue {
  type: "return";
  value: RuntimeValue;
}

export interface VoidValue extends RuntimeValue {
  type: "void";
  value: undefined;
}
