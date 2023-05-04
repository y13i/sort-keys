type Option<T> = {
  recurse?: boolean;

  compare?: (
    leftKey: keyof T,
    rightKey: keyof T,
    object?: Record<keyof T, unknown>
  ) => number;

  prioritize?: {
    keys?: (keyof T)[];
    primitives?: boolean;
  };
};

export function sortKeys<T extends object>(obj: T, option: Option<T> = {}): T {
  const keys = Object.keys(obj) as Array<keyof T>;

  const compareFunction =
    option.compare ||
    ((leftKey, rightKey) =>
      (leftKey as string).localeCompare(rightKey as string));

  keys.sort(compareFunction);

  return keys.reduce((acc, key) => {
    const value = obj[key];

    return { ...acc, [key]: value };
  }, {} as T);
}
