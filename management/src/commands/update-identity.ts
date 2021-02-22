import { IdentityNotFoundError, InvalidValidationCodeError } from "../errors";
import { checkVerificationCode } from "../queries/check-verification-code";
import { getIdentity } from "../queries/get-identity";
import { IdentityTypes, ManagementCredentials } from "../types";
import { addIdentityToUser } from "./add-identity-to-user";
import { markIdentityAsPrimary } from "./mark-identity-as-primary";
import { removeIdentityFromUser } from "./remove-identity-from-user";

type VerifyValidationCodeData = {
  validationCode: string;
  eventId: string;
};

type NewIdentityData = {
  value: string;
  type: IdentityTypes;
};

async function updateIdentity(
  managementCredentials: ManagementCredentials,
  userId: string,
  verifyValidationCode: VerifyValidationCodeData,
  newIdentity: NewIdentityData,
  identityToUpdateId: string,
): Promise<void> {
  const { validationCode, eventId } = verifyValidationCode;
  const { value, type } = newIdentity;

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
    identityType: type,
    identityValue: value,
  });

  if (identityToUpdate.primary) {
    await markIdentityAsPrimary(managementCredentials, identityId).catch(
      async (error) => {
        const identity = {
          userId,
          identityType: type,
          identityValue: value,
        };

        await removeIdentityFromUser(managementCredentials, identity);

        throw error;
      },
    );
  }

  await removeIdentityFromUser(managementCredentials, {
    userId,
    identityType: type,
    identityValue: identityToUpdate.value,
  }).catch(async (error) => {
    const identity = {
      userId,
      identityType: type,
      identityValue: identityToUpdate.value,
    };

    await markIdentityAsPrimary(managementCredentials, identityToUpdateId);

    await removeIdentityFromUser(managementCredentials, identity);

    throw error;
  });
}

export { updateIdentity };
