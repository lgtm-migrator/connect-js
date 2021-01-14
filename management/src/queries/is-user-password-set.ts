import type { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { ManagementCredentials } from "../@types/management";
import { ProviderUserPasswordSet } from "../@types/password";
import { fetchManagement } from "../fetch-management";

const IS_USER_PASSWORD_SET_QUERY = gql`
  query isUserPasswordSet($userId: String!) {
    provider {
      id
      user(filters: { userId: $userId }) {
        id
        passwords {
          available
        }
      }
    }
  }
`;

export type IsUserPasswordSet = Promise<
  FetchResult<{ provider: ProviderUserPasswordSet }>
>;

export async function isUserPasswordSet(
  managementCredentials: ManagementCredentials,
  userId: string,
): IsUserPasswordSet {
  const operation = {
    query: IS_USER_PASSWORD_SET_QUERY,
    variables: { userId },
  };

  return fetchManagement(managementCredentials, operation) as IsUserPasswordSet;
}
