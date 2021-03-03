import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import { ManagementCredentials } from "../types";

const GET_USER_ID_FROM_IDENTITY_VALUE_QUERY = gql`
  query getUser($identities: IdentityInput!) {
    provider {
      user(filters: { identities: $identities }) {
        id
      }
    }
  }
`;

async function getUserIdFromIdentityValue(
  managementCredentials: ManagementCredentials,
  identityValue: string,
): Promise<string> {
  const operation = {
    query: GET_USER_ID_FROM_IDENTITY_VALUE_QUERY,
    variables: { value: identityValue },
  };

  const { data, errors } = await fetchManagement<{
    provider: {
      user: {
        id: string;
      };
    };
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.provider) {
    throw new OutputDataNullError();
  }

  return data.provider.user.id;
}

export { getUserIdFromIdentityValue };
