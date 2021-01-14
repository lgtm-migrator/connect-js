import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { IdentityInput } from "../@types/identity";
import { ManagementCredentials } from "../@types/management";
import type { User } from "../@types/provider-user";
import { fetchManagement } from "../fetch-management";

const CREATE_USER_WITH_IDENTITIES_MUTATION = gql`
  mutation createUserWithIdentities(
    $identities: [IdentityInput]!
    $localeCode: String!
  ) {
    createUserWithIdentities(
      input: { identities: $identities, localeCode: $localeCode }
    ) {
      id
    }
  }
`;

export type CreateUserWithIdentities = Promise<
  FetchResult<{
    createUserWithIdentities: User;
  }>
>;

export type CreateUserWithIdentitiesInput = {
  identities: IdentityInput[];
  localeCode: string;
};

export async function createUserWithIdentities(
  managementCredentials: ManagementCredentials,
  { identities, localeCode }: CreateUserWithIdentitiesInput,
): CreateUserWithIdentities {
  const operation = {
    query: CREATE_USER_WITH_IDENTITIES_MUTATION,
    variables: { identities, localeCode },
  };

  return fetchManagement(
    managementCredentials,
    operation,
  ) as CreateUserWithIdentities;
}
