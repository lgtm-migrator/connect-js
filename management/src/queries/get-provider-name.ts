import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { ManagementCredentials } from "../@types/management";
import { fetchManagement } from "../fetch-management";

const GET_PROVIDER_NAME_QUERY = gql`
  query getProviderName {
    provider {
      name
    }
  }
`;

export type GetProviderName = Promise<
  FetchResult<{ provider: { name: string } }>
>;

export async function getProviderName(
  managementCredentials: ManagementCredentials,
): GetProviderName {
  const operation = {
    query: GET_PROVIDER_NAME_QUERY,
    variables: {},
  };

  return fetchManagement(managementCredentials, operation) as GetProviderName;
}
