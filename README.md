# sort-keys

[![npm version](https://badge.fury.io/js/@y13i%2Fsort-keys.svg)](https://badge.fury.io/js/@y13i%2Fsort-keys)

Sort the keys of an object.

- [Live Demo](https://utils.y13i.com/sort-keys)
- [Benchmark](https://gist.github.com/y13i/94615a038d591918bc41a004aa65e685)

## Installation

```sh
npm install @y13i/sort-keys
```

## Usage

```js
import { sortKeys } from "@y13i/sort-keys";
```

### `sortKeys(object, option?)`

Returns a new object with sorted keys.

```js
sortKeys({ name: "Alice", age: 30, city: "Tokyo" });
// => { age: 30, city: "Tokyo", name: "Alice" }
```

#### `object`

Type: `object`

The object to sort keys of.

#### `option`

Type: `object`

##### `option.depth`

Type: `number` (1 or greater integer)

Default: `Infinity`

Limits how many levels deep to recursively sort. `1` sorts only the top-level object; the default `Infinity` sorts all nested objects and arrays.

```js
sortKeys(
  { version: 1, author: { name: "Alice", email: "alice@example.com" } },
  { depth: 1 }
);
// => { author: { name: "Alice", email: "alice@example.com" }, version: 1 }
// (nested object left unsorted)
```

##### `option.prioritize.keys`

Type: `string[]`

Keys listed here are moved to the front, in the order given, before the remaining keys are sorted alphabetically.

```js
sortKeys(
  { spec: {}, kind: "Deployment", metadata: {}, apiVersion: "apps/v1" },
  { prioritize: { keys: ["apiVersion", "kind", "metadata"] } }
);
// => { apiVersion: "apps/v1", kind: "Deployment", metadata: {}, spec: {} }
```

##### `option.prioritize.primitives`

Type: `boolean`

When `true`, keys with primitive values (numbers, strings, booleans, `null`, `undefined`) are sorted before keys with object or array values.

```js
sortKeys(
  { scripts: { build: "tsc" }, name: "my-app", version: "1.0.0", dependencies: { react: "^18.0.0" } },
  { prioritize: { primitives: true } }
);
// => { name: "my-app", version: "1.0.0", dependencies: { react: "^18.0.0" }, scripts: { build: "tsc" } }
```

##### `option.compare`

Type: Function, `(object) => (leftKey: string, rightKey: string) => number`

Custom sort logic. The outer function receives the object being sorted; the inner comparator receives two key names and returns a number, following the same convention as [`Array.prototype.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort). When provided, `prioritize` options are ignored.

```js
sortKeys(
  { createdAt: "2024-01-01", id: 1, title: "Hello" },
  {
    compare: () => (left, right) => left.length - right.length || left.localeCompare(right),
  }
);
// => { id: 1, title: "Hello", createdAt: "2024-01-01" }  (sorted by key length)
```

## CLI

See [y13i/sort-keys-cli](https://github.com/y13i/sort-keys-cli).

## Prior art

- [sort-keys](https://www.npmjs.com/package/sort-keys)
- [sort-object-keys](https://www.npmjs.com/package/sort-object-keys)
