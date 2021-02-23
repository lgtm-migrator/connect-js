# CHANGELOG

All notable changes to this project will be documented in this file.

## [0.4.0] - 2021-02-22

- Refactored `updateIdentity` props (cf. documentation).

## [0.3.0] - 2021-02-18

- New function called `updateIdentity`, that handles the rollback of the process in case of an exception raised.

## [0.2.1] - 2021-02-12

- `fetchManagement` now throws a `ConnectUnreachableError` error, derived from `FetchError` (`@types/node-fetch`).

## [0.2.0] - 2021-01-26

- Minor fixes.
- Improved error handling.
- Improved documentation.

## [0.1.0] - 2021-01-11

- Initialization of the package.
