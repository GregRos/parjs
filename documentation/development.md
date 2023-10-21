# Development instructions

This project is using [Yarn](https://yarnpkg.com/) as a package manager. The recommendation is to install the latest version of Yarn globally on your system. The version of yarn used for development is specified in the package.json file. The latest versions of yarn will choose the correct version to use automatically.

Common development commands:

```sh
# use the correct version of node (defined in .nvmrc)
nvm use

# install dependencies
yarn

# build (must be done before testing)
yarn build

# test (remember to build first to make sure the code is up to date)
yarn build && yarn test

# quality checks
yarn lint:check
yarn lint:fix
```
