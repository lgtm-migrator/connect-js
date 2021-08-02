import { ConnectUnreachableError } from "../errors";
import { getIdentity } from "../queries/get-identity";
import { ManagementCredentials } from "../types";
import { getIdentityType } from "../utils/get-identity-type";
import { addIdentityToUser } from "./add-identity-to-user";
import { markIdentityAsPrimary } from "./mark-identity-as-primary";
import { removeIdentityFromUser } from "./remove-identity-from-user";

const MAX_DELAY = 1000;

function delay(retryCount: number): Promise<void> {
  const waitTime = Math.min(Math.pow(retryCount, 2) * 100, MAX_DELAY);
  return new Promise((resolve) => setTimeout(resolve, waitTime));
}

async function updateIdentity(
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
      identityValue,
    };

    if (identityToUpdate.primary) {
      await markIdentityAsPrimary(managementCredentials, identityToUpdateId);
    }

    await removeIdentityFromUser(managementCredentials, identity);

    throw error;
  });
}

async function updateIdentityWithRetry(
  managementCredentials: ManagementCredentials,
  userId: string,
  validationCode: string,
  eventIds: string[],
  identityValue: string,
  identityToUpdateId: string,
  maxRetry,
  retryCount = 0,
): Promise<void> {
  return await updateIdentity(
    managementCredentials,
    userId,
    validationCode,
    eventIds,
    identityValue,
    identityToUpdateId,
  ).catch(async (error) => {
    if (error.statusCode >= 500 || error instanceof ConnectUnreachableError) {
      if (retryCount < maxRetry) {
        await delay(retryCount + 1);
        return updateIdentityWithRetry(
          managementCredentials,
          userId,
          validationCode,
          eventIds,
          identityValue,
          identityToUpdateId,
          maxRetry,
          retryCount + 1,
        );
      }
    }

    throw error;
  });
}

async function updateIdentityFromUser(
  managementCredentials: ManagementCredentials,
  userId: string,
  validationCode: string,
  eventIds: string[],
  identityValue: string,
  identityToUpdateId: string,
  maxRetry = 2,
): Promise<void> {
  return await updateIdentityWithRetry(
    managementCredentials,
    userId,
    validationCode,
    eventIds,
    identityValue,
    identityToUpdateId,
    maxRetry,
  );
}

export { updateIdentityFromUser };
