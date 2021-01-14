import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { ConnectApplication } from "../@types/connect-application";
import { ManagementCredentials } from "../@types/management";
import { fetchManagement } from "../fetch-management";

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

export type UpdateConnectApplication = Promise<
  FetchResult<{
    updateApplication: UpdateConnectApplication;
  }>
>;

export async function updateConnectApplication(
  managementCredentials: ManagementCredentials,
  { id, name, description, defaultHomePage, redirectUris }: ConnectApplication,
): UpdateConnectApplication {
  const operation = {
    query: UPDATE_APPLICATION_MUTATION,
    variables: { id, name, description, defaultHomePage, redirectUris },
  };

  return fetchManagement(
    managementCredentials,
    operation,
  ) as UpdateConnectApplication;
}
