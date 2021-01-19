import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
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

export async function sendIdentityValidationCode(
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
    throw new GraphqlErrors(errors);
  }

  if (!data.sendIdentityValidationCode) {
    throw new OutputDataNullError();
  }

  return data.sendIdentityValidationCode;
}
