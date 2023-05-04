import "jest";

import { sortKeys } from ".";

test("make sure Object.keys() can be used to test", () => {
  expect(Object.keys({ a: 1, b: 2 })).toEqual(["a", "b"]);
  expect(Object.keys({ b: 1, a: 2 })).toEqual(["b", "a"]);
  expect(["a", "b"]).not.toEqual(["b", "a"]);
});

describe("sortKeys", () => {
  it("should sort keys in ascending order by default", () => {
    expect(Object.keys(sortKeys({ b: 1, a: 2 }))).toEqual(
      Object.keys({ a: 2, b: 1 })
    );
  });

  it("should not mutate the given object", () => {
    const object = { b: 1, a: 2 };
    const objectJson = JSON.stringify(object);
    const result = sortKeys(object);
    expect(object).not.toBe(result);
    expect(JSON.stringify(object)).toEqual(objectJson);
  });
});
