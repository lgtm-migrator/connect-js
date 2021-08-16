import { ManagementCredentials } from "../../index";
import { GetIdentityInput, Identity } from "../types";
import { getIdentities } from "./index";

async function getIdentityAndItsPrimary(
  managementCredentials: ManagementCredentials,
  { userId, identityId }: GetIdentityInput,
): Promise<Identity[]> {
  return getIdentities(managementCredentials, userId).then((identities) => {
    const currentIdentity = identities.find(
      (identity) => identity.id === identityId,
    );
    const primaryIdentityOfTheSameType = identities.find(
      (identity) => identity[currentIdentity.type],
    );

    return [currentIdentity, primaryIdentityOfTheSameType];
  });
}

export { getIdentityAndItsPrimary };
