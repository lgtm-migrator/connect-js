import { ManagementCredentials } from "../../index";
import { Identity } from "../types";
import { getIdentities } from "./index";

async function getPrimaryIdentities(
  managementCredentials: ManagementCredentials,
  userId: string,
): Promise<Identity[]> {
  return getIdentities(managementCredentials, userId).then((identities) => {
    return identities.filter((identity) => identity.primary);
  });
}

export { getPrimaryIdentities };
