import { GraphQLError } from "graphql";

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

export class IdentityDeletionFailedError extends Error {
  readonly message = "Identity Deletion Failed";
}
