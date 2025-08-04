export const capitalize = (str: string) => {
  const words = str.split(" ");
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// utility to make complex object types more readable by restructuring them into a clearer format.
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type ToDiscriminatedUnion<
  T extends Record<string, object>,
  DiscriminantKey extends string = "type",
> = {
  [K in keyof T]: Prettify<
    {
      [P in DiscriminantKey]: K;
    } & T[K]
  >;
}[keyof T];

export function invLerp(a: number, b: number, v: number, shouldClamp = false) {
  const t = (v - a) / (b - a);
  return shouldClamp ? clamp(0, 1, t) : t;
}

export function lerp(a: number, b: number, t: number, shouldClamp = false) {
  const v = a + (b - a) * t;
  return shouldClamp ? clamp(a, b, v) : v;
}

export function rubberBand(over: number, dim: number, power = 1.0) {
  return (
    (1 - 1 / ((Math.abs(over) * 1.0) / dim + 1) ** power) *
    dim *
    Math.sign(over)
  );
}

export function remap(
  iMin: number,
  iMax: number,
  oMin: number,
  oMax: number,
  v: number,
  shouldClamp = false,
) {
  return lerp(oMin, oMax, invLerp(iMin, iMax, v), shouldClamp);
}
export function clamp(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}
