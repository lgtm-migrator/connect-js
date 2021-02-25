class MissingJWKSURIError extends Error {}

class InvalidKeyIDRS256Error extends Error {}

class MissingKeyIDHS256Error extends Error {}

class AlgoNotSupportedError extends Error {}

class InvalidAudienceError extends Error {}

class ScopesNotSupportedError extends Error {}

export {
  MissingJWKSURIError,
  InvalidKeyIDRS256Error,
  MissingKeyIDHS256Error,
  AlgoNotSupportedError,
  InvalidAudienceError,
  ScopesNotSupportedError,
};
