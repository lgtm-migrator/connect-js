import { GraphQLError } from "graphql";
import gql from "graphql-tag";

import {
  GraphqlErrors,
  IdentityNotFoundError,
  InvalidIdentityTypeError,
  OutputDataNullError,
} from "../errors";
import { fetchManagement } from "../fetch-management";
import {
  ManagementCredentials,
  SendTwoFAVerificationCodeInput,
  SendTwoFAVerificationCodeResult,
} from "../types";

const SEND_TWO_FA_VERIFICATION_CODE_MUTATION = gql`
  mutation sendTwoFAVerificationCode(
    $callbackUrl: String!
    $identity: IdentityInput!
    $localeCodeOverride: String
    $userId: String
  ) {
    sendPhoneVerificationCode(
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

async function sendTwoFAVerificationCode(
  managementCredentials: ManagementCredentials,
  {
    callbackUrl,
    identity,
    userId,
    localeCodeOverride,
  }: SendTwoFAVerificationCodeInput,
): Promise<SendTwoFAVerificationCodeResult> {
  const operation = {
    query: SEND_TWO_FA_VERIFICATION_CODE_MUTATION,
    variables: {
      callbackUrl,
      identity,
      userId,
      localeCodeOverride,
    },
  };

  const { data, errors } = await fetchManagement<{
    sendPhoneVerificationCode: SendTwoFAVerificationCodeResult;
  }>(managementCredentials, operation);

  if (errors) {
    const invalidIdentityTypeError = errors.find(
      (error) =>
        (error as GraphQLError & {
          code: string;
          errors: Record<string, unknown>;
        }).code === "validation_error",
    );

    if (invalidIdentityTypeError) {
      throw new InvalidIdentityTypeError();
    } else {
      const identityNotFound = errors.find(
        (error) =>
          (error as GraphQLError & { errors: { identity_value: string } })
            .errors.identity_value === "can't be blank",
      );

      if (identityNotFound) {
        throw new IdentityNotFoundError();
      }
    }

    throw new GraphqlErrors(errors);
  }

  if (!data.sendPhoneVerificationCode) {
    throw new OutputDataNullError();
  }

  return data.sendPhoneVerificationCode;
}

export { sendTwoFAVerificationCode };
