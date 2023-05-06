import "jest";
import { dump, load } from "js-yaml";

import { sortKeys } from ".";

test("make sure Object.keys() can be used to test", () => {
  expect(Object.keys({ a: 1, b: 2 })).toEqual(["a", "b"]);
  expect(Object.keys({ b: 1, a: 2 })).toEqual(["b", "a"]);
  expect(["a", "b"]).not.toEqual(["b", "a"]);
});

describe("sortKeys()", () => {
  const original = {
    b: 1,
    d: 2,
    c: [
      { m: 11, n: 12 },
      { e: 3, f: 4, d: 5 },
    ],
    a: {
      g: 6,
      i: 7,
      h: 8,
      j: {
        l: 9,
        k: 10,
      },
    },
  };

  it("should sort keys in ascending order by default", () => {
    expect(Object.keys(sortKeys(original))).toEqual(["a", "b", "c", "d"]);
  });

  it("should not mutate the given object", () => {
    const originalJson = JSON.stringify(original);
    sortKeys(original);
    expect(JSON.stringify(original)).toEqual(originalJson);
  });

  it("should return a new object", () => {
    expect(sortKeys(original)).not.toBe(original);
  });

  it("should maintain the values of the given object", () => {
    expect(sortKeys(original)).toEqual(original);
  });

  it("should sort keys in nested objects recursively by default", () => {
    const result = sortKeys(original);
    expect(Object.keys(result.a.j)).toEqual(["k", "l"]);
  });

  it("should sort keys in objects in an array recursively by default", () => {
    const result = sortKeys(original);
    expect(Object.keys(result.c[1])).toEqual(["d", "e", "f"]);
  });

  describe("option", () => {
    describe("option.depth", () => {
      it("should sort keys in nested objects up to the given depth", () => {
        const result = sortKeys(original, { depth: 1 });
        expect(Object.keys(result.a.j)).toEqual(["l", "k"]);
      });

      it("should sort keys in objects in an array up to the given depth", () => {
        const result = sortKeys(original, { depth: 1 });
        expect(Object.keys(result.c[1])).toEqual(["e", "f", "d"]);
      });
    });

    describe("option.compare", () => {
      it("should accept a compare function generator", () => {
        const result = sortKeys(original, {
          compare: () => () => 0,
        });

        expect(Object.keys(result)).toEqual(["b", "d", "c", "a"]);

        const result2 = sortKeys(original, {
          compare: (object) => (left, right) => {
            // sort by key name, but if the value is 1, put it at the end
            if (object[left] === 1) return 1;
            if (object[right] === 1) return -1;
            return left.localeCompare(right);
          },
        });

        expect(Object.keys(result2)).toEqual(["a", "c", "d", "b"]);
      });

      it("should ignore prioritize option if a custom compare function generator is given", () => {
        const result = sortKeys(original, {
          compare: () => () => 0,
          prioritize: {
            keys: ["d", "c"],
          },
        });

        expect(Object.keys(result)).toEqual(["b", "d", "c", "a"]);
      });
    });

    describe("option.prioritize", () => {
      describe("option.prioritize.keys", () => {
        it("should prioritize keys in the given order", () => {
          const result = sortKeys(original, {
            prioritize: {
              keys: ["d", "c"],
            },
          });

          expect(Object.keys(result)).toEqual(["d", "c", "a", "b"]);
        });
      });

      describe("option.prioritize.primitives", () => {
        it("should prioritize primitives", () => {
          const result = sortKeys(original, {
            prioritize: {
              primitives: true,
            },
          });

          expect(Object.keys(result)).toEqual(["b", "d", "a", "c"]);
        });

        it("should prioritize prioritize.keys even if it's a non-premitive", () => {
          const result = sortKeys(original, {
            prioritize: {
              keys: ["c"],
              primitives: true,
            },
          });

          expect(Object.keys(result)).toEqual(["c", "b", "d", "a"]);
        });
      });
    });
  });
});

test("Kubernetes manifest example", () => {
  const input = `apiVersion: v1
data:
  ca.crt: |
    -----BEGIN CERTIFICATE-----
    snip
    -----END CERTIFICATE-------
kind: ConfigMap
metadata:
  annotations:
    kubernetes.io/description: Contains a CA bundle that can be used to verify the
      kube-apiserver when using internal endpoints such as the internal service IP
      or kubernetes.default.svc. No other usage is guaranteed across distributions
      of Kubernetes clusters.
  creationTimestamp: "2023-01-11T06:17:08Z"
  name: kube-root-ca.crt
  namespace: default
  resourceVersion: "254"
  uid: 5e337512-5239-4e08-88ed-e6003a81786b
`;

  const output = `apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-root-ca.crt
  namespace: default
  annotations:
    kubernetes.io/description: >-
      Contains a CA bundle that can be used to verify the kube-apiserver when
      using internal endpoints such as the internal service IP or
      kubernetes.default.svc. No other usage is guaranteed across distributions
      of Kubernetes clusters.
  creationTimestamp: '2023-01-11T06:17:08Z'
  resourceVersion: '254'
  uid: 5e337512-5239-4e08-88ed-e6003a81786b
data:
  ca.crt: |
    -----BEGIN CERTIFICATE-----
    snip
    -----END CERTIFICATE-------
`;

  const result = dump(
    sortKeys(load(input) as Record<string, unknown>, {
      prioritize: {
        primitives: true,
        keys: [
          "apiVersion",
          "kind",
          "metadata",
          "name",
          "namespace",
          "labels",
          "annotations",
          "spec",
          "data",
          "stringData",
        ],
      },
    })
  );

  expect(result).toEqual(output);
});
