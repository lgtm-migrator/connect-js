import { GraphQLError } from "graphql";

import { PasswordRules } from "./types";

export class GraphqlError extends Error {
  parentError: GraphqlErrors;

  constructor(message: string, error: GraphqlErrors) {
    super(message);
    this.parentError = error;
  }
}

export class GraphqlErrors extends Error {
  constructor(errors: readonly GraphQLError[]) {
    const message = errors.map(({ message }) => message).join("\n");
    super(message);
  }
}

export class OutputDataNullError extends Error {
  readonly message = "Output Data Null";
}

export class InvalidPasswordInputError extends Error {
  readonly rules: PasswordRules;

  constructor(rules: PasswordRules) {
    super("Invalid Password Input");
    this.rules = rules;
  }
}

export class IdentityAlreadyUsedError extends Error {
  readonly message = "Identity already used";
}

export class IdentityValueCantBeBlankError extends Error {
  readonly message = "Identity value can't be Blank";
}
