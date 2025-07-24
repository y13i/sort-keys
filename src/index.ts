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

function recurse(value: unknown, option: Option & { depth: number; compare: CompareFunctionGenerator }): unknown {
  if (option.depth === 0 || isPrimitive(value)) return value;

  const nextRecursionOption = { ...option, depth: option.depth - 1 };

  if (Array.isArray(value)) {
    return value.map((element) => recurse(element, nextRecursionOption));
  }

  const object = value as Record<string, unknown>;

  const keys = Object.keys(object).toSorted(option.compare(object));

  return Object.fromEntries(
    keys.map((key) => {
      return [key, recurse(object[key], nextRecursionOption)];
    }),
  );
}

function getDefaultCompare(option: Option): CompareFunctionGenerator {
  return (object) => (leftKey, rightKey) => {
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
      const leftIsPrimitive = isPrimitive(object[leftKey]);
      const rightIsPrimitive = isPrimitive(object[rightKey]);

      if (leftIsPrimitive) {
        if (!rightIsPrimitive) {
          return -1;
        }
      } else if (rightIsPrimitive) {
        return 1;
      }
    }

    return leftKey.localeCompare(rightKey);
  };
}

export function sortKeys<T extends Record<string, unknown>>(object: T, option: Option = {}): T {
  const compare = option.compare ?? getDefaultCompare(option);

  return recurse(object, { ...option, compare, depth: option.depth ?? Number.POSITIVE_INFINITY }) as T;
}
