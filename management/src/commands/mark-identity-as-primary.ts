import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { Identity } from "../@types/identity";
import { ManagementCredentials } from "../@types/management";
import { fetchManagement } from "../fetch-management";

const MARK_IDENTITY_AS_PRIMARY_MUTATION = gql`
  mutation markIdentityAsPrimary($identityId: String!) {
    markIdentityAsPrimary(input: { identityId: $identityId }) {
      id
      primary
      status
      type
      value
    }
  }
`;

export type MarkIdentityAsPrimary = Promise<
  FetchResult<{
    markIdentityAsPrimary: Identity;
  }>
>;

export async function markIdentityAsPrimary(
  managementCredentials: ManagementCredentials,
  identityId: Identity["id"],
): MarkIdentityAsPrimary {
  const operation = {
    query: MARK_IDENTITY_AS_PRIMARY_MUTATION,
    variables: { identityId },
  };

  return fetchManagement(
    managementCredentials,
    operation,
  ) as MarkIdentityAsPrimary;
}
