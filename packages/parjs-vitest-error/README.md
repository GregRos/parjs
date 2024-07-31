To recreate:

-   `yarn` in the repo root directory to install packages
-   `yarn test` to see test hang forever

The line causing the problem is line 13 in parse.test.ts. Comment it out and restart vitest to see the test pass.
