# CHANGELOG

All notable changes to this project will be documented in this file.

## [0.4.2] - 2021-04-12

### Changes

- `getTokensFromAuthorizationCode` now throws an `UnreachableError` in case of a `FetchError`.

### Bumps

```sh
  @typescript-eslint/eslint-plugin  dev     ~2mo    4.15.2  →    4.21.0   ~7d
  @typescript-eslint/parser         dev     ~2mo    4.15.2  →    4.21.0   ~7d
  eslint                            dev     ~2mo    7.20.0  →    7.24.0   ~2d
  @types/jest                       dev     ~3mo   26.0.20  →   26.0.22  ~18d
  @types/jsonwebtoken               dev    ~11mo     8.5.0  →     8.5.1  ~27d
  @types/node                       dev     ~2mo  14.14.31  →  14.14.37  ~16d
  @types/node-fetch                 dev     ~3mo     2.5.8  →    2.5.10   ~4d
  ts-jest                           dev     ~2mo    26.5.2  →    26.5.4  ~26d
  typescript                        dev     ~2mo     4.2.2  →     4.2.4   ~5d
```

## [0.4.1] - 2021-02-25

- `UnreachableError` exported.
- Improved documentation.

## [0.4.0] - 2021-02-24

### Changes

- 💥 Added the `Error` suffix to errors names.

### Bumps

```sh
  eslint-config-prettier            dev     ~2mo     7.1.0  →     8.1.0   ⩽1d
  @fewlines/eslint-config           dev     ~7mo     3.0.0  →     3.1.2   ~2d
  @typescript-eslint/eslint-plugin  dev     ~2mo    4.11.0  →    4.15.2   ~3d
  @typescript-eslint/parser         dev     ~2mo    4.11.0  →    4.15.2   ~3d
  eslint                            dev     ~2mo    7.16.0  →    7.20.0  ~13d
  ts-jest                           dev     ~4mo    26.4.4  →    26.5.2   ~2d
  typescript                        dev     ~3mo     4.1.3  →     4.2.2   ~2d
  @types/jest                       dev     ~3mo   26.0.19  →   26.0.20  ~2mo
  @types/node                       dev     ~2mo  14.14.14  →  14.14.31   ~6d
  @types/node-fetch                 dev    ~10mo     2.5.7  →     2.5.8  ~1mo
  eslint-plugin-prettier            dev     ~2mo     3.3.0  →     3.3.1  ~2mo
```

## [0.3.0] - 2021-02-15

- Added retry of JWT verification to handle public key rotation.

## [0.2.5] - 2021-02-09

- Fixing issues with `getOpenIDConfiguration`, `getJWKS` and `verifyJWT`.

## [0.2.4] - 2021-02-08

- Optimising the storage and the fetching of `JWKS` and `openIDConfiguration`.

## [0.2.3] - 2021-02-06

- Fixed the method of calling the Token endpoint by following the RFC (using `application/x-www-form-urlencoded` as Content Type).

## [0.2.2] - 2021-01-28

- Changed back `openIDConfigurationURL` to `providerURL` in the `oauth2Client` constructor.
- Storing `JWKS` in the `oauth2Client` for performances.

## [0.2.1] - 2021-01-14

- Added an optional property (`openIDConfiguration`) to the `oauth2Client` constructor.
- Changed `openIDConfigurationURL` to `providerURL` in the `oauth2Client` constructor.

## [0.2.0] - 2021-01-13

- Added a function to refresh tokens (`refreshTokens`).

## [0.1.0] - 2021-01-11

- Migrated the package from `@fwl/oauth2`, and renamed it as `@fewlines/connect-client`.

## [0.1.8] - 2020-12-14

- Moved all exported objects and functions to `src` to prevent import issues.
- Removed TS path aliases.

## [0.1.7] - 2020-12-14

- Changed export of all objects from version `[0.1.5]` to the default `"@fwl/oauth2"`.

## [0.1.6] - 2020-12-14

- Changed export of all functions from version `[0.1.5]` to the default `"@fwl/oauth2"`.
- Improved documentation

## [0.1.5] - 2020-12-08

### Changes

- Added two new functions to generate JWS:
  - generateHS256JWS
  - generateRS256JWS
- The package now export the following default object to help tests writing:
  - `defaultPayload` - Default JWT payload.
  - `asymmetricAlgoKeyPair` - Default pair of private and public key used for **RS256**.
  - `defaultSecret` - Default secret used for **HS256**

### Bumps

#### Major

```
  @typescript-eslint/eslint-plugin  dev    ~3mo  3.10.1  →  4.9.0   ~7d
  @typescript-eslint/parser         dev    ~3mo  3.10.1  →  4.9.0   ~7d
  eslint-config-prettier            dev    ~1mo  6.15.0  →  7.0.0   ~2d
  ts-node                           dev    ~6mo  8.10.2  →  9.1.1   ⩽1d
  typescript                        dev    ~5mo   3.9.7  →  4.1.2  ~18d
```

#### Minor

```
  @types/node                       dev     ~5mo  14.0.26  →  14.14.10  ~12d
  @typescript-eslint/eslint-plugin  dev     ~5mo    3.7.0  →    3.10.1  ~3mo
  @typescript-eslint/parser         dev     ~5mo    3.7.0  →    3.10.1  ~3mo
  eslint                            dev     ~5mo    7.5.0  →    7.15.0   ~2d
  eslint-config-prettier            dev     ~8mo   6.11.0  →    6.15.0  ~1mo
  eslint-plugin-prettier            dev     ~6mo    3.1.4  →     3.2.0   ~4d
  jest                              dev     ~6mo   26.1.0  →    26.6.3  ~1mo
  prettier                          dev     ~8mo    2.0.5  →     2.2.1  ~10d
  ts-jest                           dev     ~5mo   26.1.3  →    26.4.4  ~29d
  node-fetch                               ~1.6y    2.6.0  →     2.6.1  ~3mo
  @types/jest                       dev     ~5mo   26.0.7  →   26.0.16   ~6d
  eslint-plugin-import              dev     ~5mo   2.22.0  →    2.22.1  ~2mo
```

---

## [0.1.4] - 2020-11-09

- Added function to handle JWE decryption (`decryptJWE`).

## [0.1.3] - 2020-09-03

- Fixed issue regarding encoding of `redirect_uri` and `state` in query string.

## [0.1.2] - 2020-09-03

- Added `node-fetch`.
- Fixed `getTokensFromAuthorizationCode` returned data and type.

## [0.1.1] - 2020-09-03

- Added `state` to authorization_url.

## [0.1.0] - 2020-09-03

- Created the package @fwl/oauth.
