# Development instructions

This project is using [Yarn](https://yarnpkg.com/) as a package manager. The recommendation is to install the latest version of Yarn globally on your system. The version of yarn used for development is specified in the package.json file. The latest versions of yarn will choose the correct version to use automatically.

Common development commands:

```sh
# use the correct version of node (defined in .nvmrc)
nvm use

# install yarn if not installed
# https://yarnpkg.com/getting-started/install

# install dependencies
yarn

# typecheck and build
yarn build

# test
yarn test

# quality checks
yarn lint:check
yarn lint
yarn lint:fix
```

## Testing and debugging

This section is meant for developers who are working on the project and want a workflow for testing and debugging.

### On the CLI

```sh
# run tests in watch mode (reruns the tests when files change)
yarn test --watch

# run tests once
yarn test
```

To limit the tests that are run, you can configure the watcher to only run tests that match a pattern.

You can also make changes to the code to only run tests you want, or to ignore tests you don't want to run.

```ts
// to only run some tests:
describe.only("...", () => {}); // or fdescribe
it.only("...", () => {}); // or fit

// to ignore some tests:
describe.skip("...", () => {}); // or xdescribe
it.skip("...", () => {}); // or xit
```

### In VSCode

The recommended way to run tests in VSCode is to use the <https://github.com/jest-community/vscode-jest>. It will automatically run tests when you save a file. It will also show you the test results in the editor.

The extension will allow you to run and debug a single test or a group of tests. You can also run all tests.
