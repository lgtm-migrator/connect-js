import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { ManagementCredentials } from "../@types/management";
import { SingleIdentityProviderUser } from "../@types/provider-user";
import { fetchManagement } from "../fetch-management";

const GET_USER_IDENTITY_QUERY = gql`
  query getUserIdentityQuery($userId: String!, $id: String!) {
    provider {
      id
      user(filters: { userId: $userId }) {
        id
        identity(filters: { id: $id }) {
          id
          primary
          status
          type
          value
        }
      }
    }
  }
`;

export type GetIdentity = Promise<
  FetchResult<{ provider: SingleIdentityProviderUser }>
>;

export type GetIdentityInput = {
  userId: string;
  identityId: string;
};

export async function getIdentity(
  managementCredentials: ManagementCredentials,
  { userId, identityId }: GetIdentityInput,
): GetIdentity {
  const operation = {
    query: GET_USER_IDENTITY_QUERY,
    variables: { userId, id: identityId },
  };

  return fetchManagement(managementCredentials, operation) as GetIdentity;
}
