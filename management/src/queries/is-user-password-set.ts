import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import { ManagementCredentials } from "../types";

const IS_USER_PASSWORD_SET_QUERY = gql`
  query isUserPasswordSet($userId: String!) {
    provider {
      user(filters: { userId: $userId }) {
        passwords {
          available
        }
      }
    }
  }
`;

export async function isUserPasswordSet(
  managementCredentials: ManagementCredentials,
  userId: string,
): Promise<boolean> {
  const operation = {
    query: IS_USER_PASSWORD_SET_QUERY,
    variables: { userId },
  };

  const { data, errors } = await fetchManagement<{
    provider: {
      user: {
        passwords: {
          available: boolean;
        };
      };
    };
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.provider) {
    throw new OutputDataNullError();
  }

  return data.provider.user.passwords.available;
}
