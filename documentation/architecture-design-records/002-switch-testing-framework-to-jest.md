# Switch testing framework to jest

Date: 2023-11-19

## Context

We have been using jasmine for testing for a couple of years. The tests have been run on precompiled code (typescript compiled to javascript). Running them has been fast.

Recently the project has not received updates to its packages. Updating to newer dependency versions has caused some issues with dependencies that are no longer supported.

## Decision

We will move to jest for testing. Jest is a popular testing framework that is actively maintained. It is also used by the react community.

The new developer / maintainer Mika Vilpas has experience with jest and prefers it over jasmine.

We will add instructions to the developer documentation on how to run the tests.

## Expected consequences

Jest will be easy to use for many developers. It will also be fast to run.

Because of its popularity, Jest will have good support for the foreseeable future.

It will be possible to debug the tests.
