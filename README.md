# sort-keys

[![npm version](https://badge.fury.io/js/@y13i%2Fsort-keys.svg)](https://badge.fury.io/js/@y13i%2Fsort-keys)

Sort the keys of an object.

[Live Demo](https://utils.y13i.app/sort-keys)

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

### `object`

Type: `object`

The object to sort keys of.

### `option`

Type: `object`

#### `option.depth`

Type: `number` (1 or greater integer)

Default: `Infinity`

Defines how many times to recursively sort keys in a nested object or an array.

#### `option.prioritize.keys`

Type: `string[]`

If specified, keys in this array will be put at the first.

#### `option.prioritize.primitives`

Type: `boolean`

If true, primitive values (number, string, boolean, null, undefined) will be put at the first.

#### `option.compare`

Type: Function, `(object) => (leftKey: string, rightKey: string) => number`

A higher-order function that returns a [comparator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

## Examples

See [test code](./src/index.test.ts) for examples.

## CLI

See [y13i/sort-keys-cli](https://github.com/y13i/sort-keys-cli).

## Prior art

- [sort-keys](https://www.npmjs.com/package/sort-keys)
- [sort-object-keys](https://www.npmjs.com/package/sort-object-keys)
