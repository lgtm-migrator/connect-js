# CHANGELOG

All notable changes to this project will be documented in this file.

## [0.8.0] - 2021-07-27

- `updateIdentityFromUser` has now a retry logic by default in case of server exception raised during the function flow, with increasing delay between the attempts.
- Bumped dependencies.

## [0.7.0] - 2021-07-07

- Fixed an issue with rollback case in `updateIdentityFromUser`.
- 💥 Removed an identity from `IdentityTypes` enum.
- Updated documentation.

## [0.6.6] - 2021-06-28

- Fixed an issue with `updateIdentityFromUser`.

## [0.6.5] - 2021-05-10

- Bumped dependencies.

```sh
  @types/node                       dev     ~5mo  14.14.14  →   15.0.2   ~6d
  eslint-config-prettier            dev     ~5mo     7.1.0  →    8.3.0  ~16d
  cross-fetch                               ~8mo     3.0.6  →    3.1.4  ~1mo
  graphql                                   ~7mo    15.4.0  →   15.5.0  ~3mo
  graphql-tag                              ~10mo    2.11.0  →   2.12.4  ~11d
  @typescript-eslint/eslint-plugin  dev     ~5mo    4.11.0  →   4.22.1   ~6d
  @typescript-eslint/parser         dev     ~5mo    4.11.0  →   4.22.1   ~6d
  eslint                            dev     ~5mo    7.16.0  →   7.26.0   ~2d
  eslint-plugin-prettier            dev     ~5mo     3.3.0  →    3.4.0  ~25d
  prettier                          dev     ~5mo     2.2.1  →    2.3.0   ⩽1d
  ts-jest                           dev     ~6mo    26.4.4  →   26.5.6   ~5d
  typescript                        dev     ~5mo     4.1.3  →    4.2.4  ~1mo
  @types/jest                       dev     ~4mo   26.0.20  →  26.0.23  ~14d
  @types/node-fetch                 dev     ~4mo     2.5.8  →   2.5.10  ~1mo
```

## [0.6.4] - 2021-05-03

- `sendTwoFAVerificationCode` can now be used with identity types `EMAIL` and `PHONE` rather than throwing an `invalid identity type` with `EMAIL`.

## [0.6.3] - 2021-04-09

- `getIdentity` now throws `IdentityNotFoundError` if no Identity is found.

## [0.6.2] - 2021-03-24

- Fixed `getUserIdFromIdentityValue`.

## [0.6.1] - 2021-03-15

- 💥 Changed the naming of `send2FaVerificationCode` function to `sendTwoFAVerificationCode`.

## [0.6.0] - 2021-03-09

- New function called `send2FaVerificationCode`, that can be used to send a verification code to a User.
- Changed the naming of `SendIdentityVerificationCodeInput` type to `SendIdentityValidationCodeInput`.

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
