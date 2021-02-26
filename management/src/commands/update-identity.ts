import { IdentityNotFoundError, InvalidValidationCodeError } from "../errors";
import { checkVerificationCode } from "../queries/check-verification-code";
import { getIdentity } from "../queries/get-identity";
import { ManagementCredentials } from "../types";
import { getIdentityType } from "../utils/get-identity-type";
import { addIdentityToUser } from "./add-identity-to-user";
import { markIdentityAsPrimary } from "./mark-identity-as-primary";
import { removeIdentityFromUser } from "./remove-identity-from-user";

async function updateIdentity(
  managementCredentials: ManagementCredentials,
  userId: string,
  validationCode: string,
  eventId: string,
  identityValue: string,
  identityToUpdateId: string,
): Promise<void> {
  const identityToUpdate = await getIdentity(managementCredentials, {
    userId,
    identityId: identityToUpdateId,
  });

  if (!identityToUpdate) {
    throw new IdentityNotFoundError();
  }

  const { status: verificationStatus } = await checkVerificationCode(
    managementCredentials,
    {
      code: validationCode,
      eventId,
    },
  );

  if (verificationStatus !== "VALID") {
    throw new InvalidValidationCodeError();
  }

  const { id: identityId } = await addIdentityToUser(managementCredentials, {
    userId,
    identityType: getIdentityType(identityToUpdate.type),
    identityValue,
  });

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

    await markIdentityAsPrimary(managementCredentials, identityToUpdateId);

    await removeIdentityFromUser(managementCredentials, identity);

    throw error;
  });
}

export { updateIdentity };
