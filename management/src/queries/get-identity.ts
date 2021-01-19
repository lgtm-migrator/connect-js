import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import { Identity, ManagementCredentials } from "../types";

const GET_USER_IDENTITY_QUERY = gql`
  query getUserIdentityQuery($userId: String!, $id: String!) {
    provider {
      user(filters: { userId: $userId }) {
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

export type GetIdentityInput = {
  userId: string;
  identityId: string;
};

export async function getIdentity(
  managementCredentials: ManagementCredentials,
  { userId, identityId }: GetIdentityInput,
): Promise<Identity | null> {
  const operation = {
    query: GET_USER_IDENTITY_QUERY,
    variables: { userId, id: identityId },
  };

  const { data, errors } = await fetchManagement<{
    provider: {
      user: {
        identity: Identity | null;
      };
    };
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.provider) {
    throw new OutputDataNullError();
  }

  return data.provider.user.identity;
}
