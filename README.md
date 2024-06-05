This is the monorepo for [parjs](https://www.npmjs.com/package/parjs), [char-info](https://www.npmjs.com/package/char-info), and any related projects.

To view the readme for those packages, check out:
- [parjs readme](./packages/parjs/README.md)
- [char-info readme](./packages/char-info/README.md)

The rest of this is going to be developer documentation and a guide about how to use to monorepo.
## Working with the monorepo
I've set up a number of cool features along with the monorepo structure.
### VS Code Workspace
The monorepo contains the `parjs.code-workspace` file. If you open it with vscode, you'll open the repo as a workspace with multiple roots: **root**, **parjs**, and **char-info**.

Here is how it looks on my highly customize installation:
<img src="https://github.com/GregRos/parjs/assets/1788329/5f205e09-e941-4090-abfd-a56aa45e2ae8" width=300>
### Yarn workspaces
The monorepo uses yarn workspaces which are configured in the root `package.json`. There are technically four **yarn workspaces** which shouldn't be confused with **vscode workspace roots** from earlier:

-   `packages/parjs`
-   `packages/char-info`
-   `packages/parjs/examples`
-   `packages/char-info/examples` ← this is unused

I made the examples folders separate workspace so they can import the package by name, instead of using relative imports, but still link to the current codebase.
### Workspace structure
I’ve changed the folder structure to match a workspace pattern I’ve seen elsewhere.

| Syntax | Meaning                 |
| ------ | ----------------------- |
| **←X** | extends X               |
| **↓X** | references X            |
| **→X** | emits to X              |
| **→∅** | no emit                 |
| ⋆      | emitting tsconfig       |
| ⋄      | ts-node tsconfig        |
| ∘      | reference-only tsconfig |

```
parjs/
├── packages/
│   ├── parjs/
│   │   ├── src/
│   │   │   └── ⋆ tsconfig.json ← /tsconfig.base.json → ../dist
│   │   ├── spec/
│   │   │   └── ⋄ tsconfig.json ← /tsconfig.base.json → ∅
│   │   ├── (dist)/
│   │   │   └── (compiled from ../src)
│   │   ├── examples/
│   │   │   ├── src/
│   │   │   │   └── ⋆ tsconfig.json ← /tsconfig.base.json → ../dist
│   │   │   ├── spec/
│   │   │   │   └── ⋄ tsconfig.json ← /tsconfig.base.json → ∅
│   │   │   ├── (dist)/
│   │   │   │   └── (compiled from src)
│   │   │   └── ∘ tsconfig.json ↓src ↓spec
│   │   ├── ∘ tsconfig.json (↓src ↓spec ↓examples) → ∅
│   │   ├── jest.config.mjs ↓spec ← /jest.root.mjs
│   │   ├── package.json
│   │   └── README.md // parjs readme
│   │
│   └── char-info/
│       ├── src/
│       │   └── ⋆ tsconfig.json ← /tsconfig.base.json → ../dist
│       ├── spec/
│       │   └── ⋆ tsconfig.json ← /tsconfig.base.json → ../dist-spec
│       ├── (dist)/
│       │   └── (compiled from ../src)
│       ├── (dist-spec)/
│       │   └── (compiled from ../spec)
│       ├── examples/ // unused
│       │   └── ...
│       ├── package.json
│       ├── ∘ tsconfig.json ↓spec ↓src
│       └── README.md // char-info readme
│
├── tsconfig.base.json // all emitting tsconfigs extend from this
├── ∘ tsconfig.json ↓packages/{char-info,parjs}/tsconfig.json
├── package.json // workspace package.json file
├── (linting configurations)
├── jest.root.mjs // base jest configuration
├── yarn.lock // workspace yarn.lock file
├── README.md // monorepo readme
├── parjs.code-workspace
└── .git*
```

### TypeScript compilation
There are lots of `tsconfig.json` files. There are three kinds:

1. ⋆ Emitting configs for code that is pre-compiled.
2. ⋄ Non-emitting configs for code that’s executed with a JIT compiler
3. ∘ Reference-only configs that don’t have any files of their own and are just used to group compilation/checking targets.

The whole repo can be watched using a single `tsc -b -w` at the root of the repository. 
## Executing commands
Commands can be executed with `yarn` normally by going into a workspace root like `packages/parjs`.

However, you can also use the [workspace](https://classic.yarnpkg.com/lang/en/docs/cli/workspace/) and [workspaces](https://classic.yarnpkg.com/lang/en/docs/cli/workspaces/) action groups to execute commands on multiple packages. For an example, look at the root `package.json` files, which contains scripts such as:

```
    "prettier:check": "yarn workspaces foreach -A run prettier:check",
    "prettier:fix": "yarn workspaces foreach -A run prettier:fix",
    "eslint:check": "yarn workspaces foreach -A run eslint:check",
    "eslint:fix": "yarn workspaces foreach -A run eslint:fix",
    "lint:check": "run-s eslint:check prettier:check",
    "lint:fix": "run-s eslint:fix prettier:fix"
```

To execute a command on a single workspace, you can use, for example:

```
yarn workspace parjs run build
```