import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import {
  Identity,
  IdentityCommandInput,
  ManagementCredentials,
} from "../types";

const ADD_IDENTITY_TO_USER = gql`
  mutation addIdentityToUser(
    $userId: String!
    $type: IdentityTypes!
    $value: String!
  ) {
    addIdentityToUser(
      input: { userId: $userId, type: $type, value: $value, validated: true }
    ) {
      id
      primary
      status
      type
      value
    }
  }
`;

export async function addIdentityToUser(
  managementCredentials: ManagementCredentials,
  { userId, identityType, identityValue }: IdentityCommandInput,
): Promise<Identity> {
  const operation = {
    query: ADD_IDENTITY_TO_USER,
    variables: { userId, type: identityType, value: identityValue },
  };

  const { data, errors } = await fetchManagement<{
    addIdentityToUser: Identity;
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.addIdentityToUser) {
    throw new OutputDataNullError();
  }

  return data.addIdentityToUser;
}
