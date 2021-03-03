import { GraphQLError } from "graphql";
import gql from "graphql-tag";

import {
  GraphqlErrors,
  IdentityAlreadyUsedError,
  IdentityValueCantBeBlankError,
  OutputDataNullError,
} from "../errors";
import { fetchManagement } from "../fetch-management";
import {
  ManagementCredentials,
  SendIdentityValidationCodeResult,
  SendIdentityVerificationCodeInput,
} from "../types";

const SEND_IDENTITY_VALIDATION_CODE_MUTATION = gql`
  mutation sendIdentityValidationCode(
    $callbackUrl: String!
    $identity: IdentityInput!
    $localeCodeOverride: String
    $userId: String
  ) {
    sendIdentityValidationCode(
      input: {
        callbackUrl: $callbackUrl
        identity: $identity
        localeCodeOverride: $localeCodeOverride
        userId: $userId
      }
    ) {
      callbackUrl
      localeCode
      eventId
      nonce
    }
  }
`;

async function sendIdentityValidationCode(
  managementCredentials: ManagementCredentials,
  {
    callbackUrl,
    identity,
    localeCodeOverride,
    userId,
  }: SendIdentityVerificationCodeInput,
): Promise<SendIdentityValidationCodeResult> {
  const operation = {
    query: SEND_IDENTITY_VALIDATION_CODE_MUTATION,
    variables: {
      callbackUrl,
      identity,
      localeCodeOverride,
      userId,
    },
  };

  const { data, errors } = await fetchManagement<{
    sendIdentityValidationCode: SendIdentityValidationCodeResult;
  }>(managementCredentials, operation);

  if (errors) {
    const identityAlreadyUsedError = errors.find(
      (error) =>
        (error as GraphQLError & { code: string }).code ===
        "identity_already_validated",
    );

    if (identityAlreadyUsedError) {
      throw new IdentityAlreadyUsedError();
    } else {
      const identityValueError = errors.find(
        (error) =>
          (error as GraphQLError & { errors: { identity_value: string } })
            .errors.identity_value === "can't be blank",
      );

      if (identityValueError) {
        throw new IdentityValueCantBeBlankError();
      }
    }

    throw new GraphqlErrors(errors);
  }

  if (!data.sendIdentityValidationCode) {
    throw new OutputDataNullError();
  }

  return data.sendIdentityValidationCode;
}

export { sendIdentityValidationCode };
