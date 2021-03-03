import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import { ManagementCredentials } from "../types";

const GET_PROVIDER_NAME_QUERY = gql`
  query getProviderName {
    provider {
      name
    }
  }
`;

async function getProviderName(
  managementCredentials: ManagementCredentials,
): Promise<string> {
  const operation = {
    query: GET_PROVIDER_NAME_QUERY,
    variables: {},
  };

  const { data, errors } = await fetchManagement<{
    provider: { name: string };
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.provider) {
    throw new OutputDataNullError();
  }

  return data.provider.name;
}

export { getProviderName };
