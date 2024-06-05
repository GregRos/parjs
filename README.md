This is the monorepo for [parjs](https://www.npmjs.com/package/parjs), [char-info](https://www.npmjs.com/package/char-info), and any related projects.

To view the readme for those packages, check out:

-   [parjs readme](./packages/parjs/README.md)
-   [char-info readme](./packages/char-info/README.md)

The rest of this is going to be developer documentation.

# This Repository

There are a number of systems to help organize the monorepo, run commands, build, develop, and test things conveniently. Let's look at them.

### VS Code Workspace

Opening the file `parjs.code-workspace` in VS Code lets you work on any and all of the packages inside the repository. This workspace has three **workspace roots:**

-   **parjs** at `/packages/parjs`
-   **char-info** at `/packages/char-info`
-   **root** at `/`, but excluding the packages folder.

Here is how it looks on my highly customized installation:
<img src="https://github.com/GregRos/parjs/assets/1788329/5f205e09-e941-4090-abfd-a56aa45e2ae8" width=300>

### Yarn Workspaces

The yarn root `/package.json` has four [yarn workspaces](https://yarnpkg.com/features/workspaces) with a `package.json` each:

-   `/packages/parjs`
-   `/packages/char-info`
-   `/packages/parjs/examples`
-   `/packages/char-info/examples` ← this is unused

#### Examples Workspaces

I made the examples folders separate workspace so they can import the package by name, instead of using relative imports, but so that within the repo it will still link to the current codebase.

#### Executing commands

Commands can be executed with `yarn` normally by going into a workspace root like `packages/parjs`.

However, you can also use the [workspace](https://classic.yarnpkg.com/lang/en/docs/cli/workspace/) and [workspaces](https://classic.yarnpkg.com/lang/en/docs/cli/workspaces/) action groups to execute commands on multiple packages. For example:

```
yarn workspaces foreach -A run clean
```

To execute a command on a single workspace, you can use, for example:

```
yarn workspace parjs run build
```

#### Adding dependencies

If you run the following in the repo root, you'll add the package to the workspace:

```
yarn add X
```

This means it won't be a dependency of any of the packages inside it, but rather something that comes with this repo.

-   If it's a dev dependency, this is usually what you want right now.
-   If it's not, it's usually **not** what you want.

#### Adding dependencies in child workspaces

One way to run commands or add dependencies is to `cd` into a folder with a `package.json` and run a normal `yarn` command there.

```bash
cd packages/parjs
yarn run build
```

You can also use yarn's CLI. To add a dependency to a specific package:

```
yarn workspace parjs add -D npm-run-all
```

If you instead want to add it to all packages:

```
yarn workspaces foreach -A add -D npm-run-all
```

In this case, it's a dev dependency. It seems to be needed in each package.

### TypeScript Projects

| Symbol | Meaning                                                                                   |
| ------ | ----------------------------------------------------------------------------------------- |
| ⋆      | `tsconfig.json` that compiles and emits JavaScript.                                       |
| ⋄      | `tsconfig.json` that doesn't emit for tests that should be run with `ts-node` or similar. |
| ∘      | `tsconfig.json` that only has references to other projects and no files.                  |

TypeScript project at ∘`/tsconfig.json`, referencing:

-   `/packages/parjs/tsconfig.json`, referencing
    -   ⋆ `/packages/parjs/src/tsconfig.json`
    -   ⋄ `/packages/parjs/spec/tsconfig.json`
    -   ∘ `/packages/parjs/examples/tsconfig.json`, referencing
        -   ⋆ `/packages/parjs/examples/src/tsconfig.json`
        -   ⋄ `/packages/parjs/examples/spec/tsconfig.json`
-   ∘ `/packages/char-info/tsconfig.json`, referencing
    -   ⋆ `/packages/char-info/src/tsconfig.json`
    -   ⋆ `/packages/char-info/spec/tsconfig.json

⋆ and ⋄ tsconfigs extend `/tsconfig.base.json`, which allows it to configure compilation for the whole project. The only other properties in the different `tsconfig`s are project-specific and set `noEmit`, `composite`, `paths`, and so on. There are no meaningful overrides.d

**The whole repo can be watched using a single `tsc -b -w` at the root of the repository.** That is how `yarn run watch` works.

# Megamap

The structure of the entire monorepo.

| Syntax  | Meaning                 |
| ------- | ----------------------- |
| **← X** | extends X               |
| **↓X**  | references X            |
| **→ X** | emits to X              |
| **→ ∅** | no emit                 |
| ⋆       | emitting tsconfig       |
| ⋄       | ts-node tsconfig        |
| ∘       | reference-only tsconfig |

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

###
