import { ManagementCredentials } from "../../index";
import { GetPrimaryIdentitiesResult } from "../types";
import { getIdentities } from "./index";

async function getPrimaryIdentities(
  managementCredentials: ManagementCredentials,
  userId: string,
): Promise<GetPrimaryIdentitiesResult> {
  const identities = await getIdentities(managementCredentials, userId);

  return identities.reduce((acc, { id, primary, status, type, value }) => {
    if (primary) {
      return { ...acc, [type]: { id, value, status } };
    }

    return acc;
  }, {} as GetPrimaryIdentitiesResult);
}

export { getPrimaryIdentities };
