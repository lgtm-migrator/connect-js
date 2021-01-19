import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import { Identity, ManagementCredentials } from "../types";

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

export async function markIdentityAsPrimary(
  managementCredentials: ManagementCredentials,
  identityId: Identity["id"],
): Promise<Identity> {
  const operation = {
    query: MARK_IDENTITY_AS_PRIMARY_MUTATION,
    variables: { identityId },
  };

  const { data, errors } = await fetchManagement<{
    markIdentityAsPrimary: Identity;
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.markIdentityAsPrimary) {
    throw new OutputDataNullError();
  }

  return data.markIdentityAsPrimary;
}
