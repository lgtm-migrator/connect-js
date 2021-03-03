# CHANGELOG

All notable changes to this project will be documented in this file.

## [0.5.1] - 2021-03-03

- Change of error data structure in `createOrUpdatePassword`.

## [0.5.0] - 2021-03-01

- 💥 `addIdentityToUser` now takes a list of event IDs.
- 💥 Renamed `updateIdentity` to `updateIdentityFromUser`, and it now takes a list of event IDs.

## [0.4.1] - 2021-02-24

- Fixed Identity type in `updateIdentity`.

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
