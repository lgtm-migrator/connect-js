import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import { ManagementCredentials } from "../types";

const DELETE_USER_MUTATION = gql`
  mutation deleteUser($userId: String!) {
    deleteUser(input: { userId: $userId }) {
      status
    }
  }
`;

export async function deleteUser(
  managementCredentials: ManagementCredentials,
  userId: string,
): Promise<{ status: string }> {
  const operation = {
    query: DELETE_USER_MUTATION,
    variables: { userId },
  };

  const { data, errors } = await fetchManagement<{
    deleteUser: {
      status: string;
    };
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.deleteUser) {
    throw new OutputDataNullError();
  }

  return data.deleteUser;
}
