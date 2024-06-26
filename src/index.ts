type CompareFunctionGenerator = (object: Record<string, unknown>) => (leftKey: string, rightKey: string) => number;

type Option = {
  depth?: number;
  compare?: CompareFunctionGenerator;

  prioritize?: {
    keys?: string[];
    primitives?: boolean;
  };
};

function isPrimitive(value: unknown): boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "undefined" ||
    value === null
  );
}

export function sortKeys<T extends Record<string, unknown>>(object: T, option: Option = {}): T {
  const compare: CompareFunctionGenerator =
    option.compare ??
    ((object2) => (leftKey, rightKey) => {
      if (option.prioritize?.keys) {
        const leftKeyIndex = option.prioritize.keys.indexOf(leftKey);
        const rightKeyIndex = option.prioritize.keys.indexOf(rightKey);

        if (leftKeyIndex !== -1) {
          if (rightKeyIndex !== -1) {
            return leftKeyIndex - rightKeyIndex;
          }

          return -1;
        }

        if (rightKeyIndex !== -1) {
          return 1;
        }
      }

      if (option.prioritize?.primitives) {
        const leftIsPrimitive = isPrimitive(object2[leftKey]);
        const rightIsPrimitive = isPrimitive(object2[rightKey]);

        if (leftIsPrimitive) {
          if (!rightIsPrimitive) {
            return -1;
          }
        } else if (rightIsPrimitive) {
          return 1;
        }
      }

      return leftKey.localeCompare(rightKey);
    });

  function recurse(value: unknown, option2: Option & { depth: number }): unknown {
    if (option2.depth === 0 || isPrimitive(value)) return value;

    const nextRecursionOption = { ...option2, depth: option2.depth - 1 };

    if (Array.isArray(value)) {
      return value.map((element) => recurse(element, nextRecursionOption));
    }

    const object2 = value as Record<string, unknown>;

    const keys = Object.keys(object2);

    keys.sort(compare(object2));

    return Object.fromEntries(
      keys.map((key) => {
        return [key, recurse(object2[key], nextRecursionOption)];
      }),
    );
  }

  return recurse(object, { ...option, depth: option.depth ?? Number.POSITIVE_INFINITY }) as T;
}
