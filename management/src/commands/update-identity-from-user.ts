import { getIdentity } from "../queries/get-identity";
import { ManagementCredentials } from "../types";
import { getIdentityType } from "../utils/get-identity-type";
import { addIdentityToUser } from "./add-identity-to-user";
import { markIdentityAsPrimary } from "./mark-identity-as-primary";
import { removeIdentityFromUser } from "./remove-identity-from-user";

async function updateIdentityFromUser(
  managementCredentials: ManagementCredentials,
  userId: string,
  validationCode: string,
  eventIds: string[],
  identityValue: string,
  identityToUpdateId: string,
): Promise<void> {
  const identityToUpdate = await getIdentity(managementCredentials, {
    userId,
    identityId: identityToUpdateId,
  });

  const { id: identityId } = await addIdentityToUser(
    managementCredentials,
    validationCode,
    eventIds,
    {
      userId,
      identityType: getIdentityType(identityToUpdate.type),
      identityValue,
    },
  );

  if (identityToUpdate.primary) {
    await markIdentityAsPrimary(managementCredentials, identityId).catch(
      async (error) => {
        const identity = {
          userId,
          identityType: getIdentityType(identityToUpdate.type),
          identityValue,
        };

        await removeIdentityFromUser(managementCredentials, identity);

        throw error;
      },
    );
  }

  await removeIdentityFromUser(managementCredentials, {
    userId,
    identityType: getIdentityType(identityToUpdate.type),
    identityValue: identityToUpdate.value,
  }).catch(async (error) => {
    const identity = {
      userId,
      identityType: getIdentityType(identityToUpdate.type),
      identityValue: identityToUpdate.value,
    };

    if (identityToUpdate.primary) {
      await markIdentityAsPrimary(managementCredentials, identityToUpdateId);
    }

    await removeIdentityFromUser(managementCredentials, identity);

    throw error;
  });
}

export { updateIdentityFromUser };
