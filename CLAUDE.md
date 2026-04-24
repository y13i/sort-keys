# CLAUDE.md

## Development environment

Use [devbox](https://www.jetify.com/devbox) to set up the environment (`devbox shell`). It provides Node.js.

## Commands

- **Test**: `npm test` (Vitest, single run) / `npm run watch` (watch mode)
- **Build**: `npm run build` — compiles CJS + ESM + type declarations
- **Lint**: `npm run lint` (Biome)

## Build output

The package ships dual CJS and ESM builds. `npm run build` runs three sub-steps sequentially: `build:cjs`, `build:esm`, `build:types`, each using a separate tsconfig.
