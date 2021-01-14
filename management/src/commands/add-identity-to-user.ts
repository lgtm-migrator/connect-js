import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { Identity, IdentityCommandInput } from "../@types/identity";
import { ManagementCredentials } from "../@types/management";
import { fetchManagement } from "../fetch-management";

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

export type AddIdentityToUser = Promise<
  FetchResult<{
    AddIdentityToUser: Identity;
  }>
>;

export async function addIdentityToUser(
  managementCredentials: ManagementCredentials,
  { userId, identityType, identityValue }: IdentityCommandInput,
): AddIdentityToUser {
  const operation = {
    query: ADD_IDENTITY_TO_USER,
    variables: { userId, type: identityType, value: identityValue },
  };

  return fetchManagement(managementCredentials, operation) as AddIdentityToUser;
}
