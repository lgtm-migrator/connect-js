import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import { Identity, ManagementCredentials } from "../types";

const GET_USER_IDENTITIES_QUERY = gql`
  query getUserIdentitiesQuery($userId: String!) {
    provider {
      user(filters: { userId: $userId }) {
        identities {
          id
          type
          value
          primary
          status
        }
      }
    }
  }
`;

async function getIdentities(
  managementCredentials: ManagementCredentials,
  userId: string,
): Promise<Identity[]> {
  const operation = {
    query: GET_USER_IDENTITIES_QUERY,
    variables: { userId },
  };

  const { data, errors } = await fetchManagement<{
    provider: {
      user: {
        identities: Identity[];
      };
    };
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.provider) {
    throw new OutputDataNullError();
  }

  return data.provider.user.identities;
}

export { getIdentities };
