import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { ManagementCredentials } from "../@types/management";
import { fetchManagement } from "../fetch-management";

const DELETE_USER_MUTATION = gql`
  mutation deleteUser($userId: String!) {
    deleteUser(input: { userId: $userId }) {
      status
    }
  }
`;

export type DeleteUserStatus = {
  status: string;
};

export type DeleteUser = Promise<
  FetchResult<{
    deleteUser: DeleteUserStatus;
  }>
>;

export async function deleteUser(
  managementCredentials: ManagementCredentials,
  userId: string,
): DeleteUser {
  const operation = {
    query: DELETE_USER_MUTATION,
    variables: { userId },
  };

  return fetchManagement(managementCredentials, operation) as DeleteUser;
}
