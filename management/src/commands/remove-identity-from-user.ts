import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import {
  Identity,
  IdentityCommandInput,
  ManagementCredentials,
} from "../types";

const REMOVE_IDENTITY_FROM_USER = gql`
  mutation removeIdentityFromUser(
    $userId: String!
    $type: IdentityTypes!
    $value: String!
  ) {
    removeIdentityFromUser(
      input: { userId: $userId, type: $type, value: $value }
    ) {
      identities {
        value
      }
    }
  }
`;

async function removeIdentityFromUser(
  managementCredentials: ManagementCredentials,
  { userId, identityType, identityValue }: IdentityCommandInput,
): Promise<boolean> {
  const operation = {
    query: REMOVE_IDENTITY_FROM_USER,
    variables: { userId, type: identityType, value: identityValue },
  };

  const { data, errors } = await fetchManagement<{
    removeIdentityFromUser: Record<string, Identity[]>;
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.removeIdentityFromUser) {
    throw new OutputDataNullError();
  }

  return true;
}

export { removeIdentityFromUser };
