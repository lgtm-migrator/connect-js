import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import { getProviderApplication } from "../queries/get-provider-application";
import { ProviderApplication, UpdateProviderApplicationInput } from "../types";
import { ManagementCredentials } from "../types";

const UPDATE_APPLICATION_MUTATION = gql`
  mutation updateApplication(
    $id: String!
    $description: String!
    $name: String!
    $redirectUris: [String]!
    $defaultHomePage: String!
  ) {
    updateApplication(
      input: {
        id: $id
        description: $description
        name: $name
        redirectUris: $redirectUris
        defaultHomePage: $defaultHomePage
      }
    ) {
      id
      description
      redirectUris
      name
      defaultHomePage
    }
  }
`;

async function updateProviderApplication(
  managementCredentials: ManagementCredentials,
  {
    id,
    name,
    description,
    defaultHomePage,
    redirectUris,
  }: UpdateProviderApplicationInput,
): Promise<ProviderApplication> {
  const currentData = await getProviderApplication(managementCredentials, id);

  const updatedData = {
    ...currentData,
    name,
    description,
    defaultHomePage,
    redirectUris,
  };

  const operation = {
    query: UPDATE_APPLICATION_MUTATION,
    variables: {
      id: updatedData.id,
      name: updatedData.name,
      description: updatedData.description,
      defaultHomePage: updatedData.defaultHomePage,
      redirectUris: updatedData.redirectUris,
    },
  };

  const { data, errors } = await fetchManagement<{
    updateApplication: ProviderApplication;
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.updateApplication) {
    throw new OutputDataNullError();
  }

  return data.updateApplication;
}

export { updateProviderApplication };
