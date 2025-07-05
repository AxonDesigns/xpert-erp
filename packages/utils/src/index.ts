export const capitalize = (str: string) => {
  const words = str.split(" ");
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// utility to make complex object types more readable by restructuring them into a clearer format.
export type Prettify<T> = { [K in keyof T]: T[K]; } & {};

export type ToDiscriminatedUnion<
  T extends Record<string, object>,
  DiscriminantKey extends string = 'type'
> = {
  [K in keyof T]: Prettify<{
    [P in DiscriminantKey]: K;
  } & T[K]>;
}[keyof T];