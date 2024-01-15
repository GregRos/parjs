# Release stable version

Date: 2024-01-15

## Context

The project version has been on `0.x.x` since its inception. However, the semver.org website states that the major version `0` is intended for "rapid development and fast iteration" only:

> https://semver.org/#how-do-i-know-when-to-release-100
>
> How do I know when to release 1.0.0?
>
> If your software is being used in production, it should probably already be 1.0.0. If you have a stable API on which users have come to depend, you should be 1.0.0. If you’re worrying a lot about backward compatibility, you should probably already be 1.0.0.

This is important because many tools for automatic dependency updates, such as dependabot or renovate, are typically configured to not automatically upgrade major version changes (they should be handled manually instead).

## Decision

We will release version `1.0.0` of the project.

From this point on, we will follow semantic versioning.

## Expected consequences

Users of the project will be able to use automatic dependency updates for the project.

Releasing breaking changes will not cause issues for users who are using automatic dependency updates.
