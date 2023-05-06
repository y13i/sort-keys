# sort-keys

Sort the keys of an object.

## API

### Installation

```sh
npm install @y13i/sort-keys
```

```js
import { sortKeys } from "@y13i/sort-keys";
```

### Usage

#### `sortKeys(object, option?)`

Returns a new object with sorted keys.

#### `object`

**Type: object**

The object to sort keys of.

#### `option`

**Type: object**

##### `option.depth`

**Type: number** (1 or greater integer)

**Default: Infinity**

Defines how many times to recursively sort keys in a nested object or an array.

##### `option.prioritize.keys`

**Type: string[]**

If specified, keys in this array will be put at the first.

##### `option.prioritize.primitives`

**Type: boolean**

If true, primitive values (number, string, boolean, null, undefined) will be put at the first.

### Examples

See [test code](./core/src/index.test.ts) for examples.

## CLI

### Installation

```sh
npm install @y13i/sort-keys-cli
```

## Prior art

- [sort-keys](https://www.npmjs.com/package/sort-keys)
- [sort-object-keys](https://www.npmjs.com/package/sort-object-keys)
