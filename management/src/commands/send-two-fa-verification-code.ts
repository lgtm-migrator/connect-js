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

type TwoFAFunction = (
  managementCredentials: ManagementCredentials,
  {
    callbackUrl,
    identity,
    userId,
    localeCodeOverride,
  }: SendTwoFAVerificationCodeInput,
) => Promise<SendTwoFAVerificationCodeResult>;

function handleErrors(errors: readonly GraphQLError[]): void {
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
        (error as GraphQLError & { errors: { identity_value: string } }).errors
          .identity_value === "can't be blank",
    );

    if (identityNotFound) {
      throw new IdentityNotFoundError();
    }
  }

  throw new GraphqlErrors(errors);
}

const SEND_EMAIL_TWO_FA_VERIFICATION_CODE_MUTATION = gql`
  mutation sendEmailTwoFAVerificationCode(
    $callbackUrl: String!
    $identity: IdentityInput!
    $localeCodeOverride: String
    $userId: String!
  ) {
    sendEmailVerificationCode(
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

const sendEmailTwoFAVerificationCode: TwoFAFunction = async (
  managementCredentials,
  { callbackUrl, identity, userId, localeCodeOverride },
) => {
  const operation = {
    query: SEND_EMAIL_TWO_FA_VERIFICATION_CODE_MUTATION,
    variables: {
      callbackUrl,
      identity,
      userId,
      localeCodeOverride,
    },
  };

  const { data, errors } = await fetchManagement<{
    sendEmailVerificationCode: SendTwoFAVerificationCodeResult;
  }>(managementCredentials, operation);

  if (errors) {
    handleErrors(errors);
  }

  if (!data.sendEmailVerificationCode) {
    throw new OutputDataNullError();
  }
  return data.sendEmailVerificationCode;
};

const SEND_PHONE_TWO_FA_VERIFICATION_CODE_MUTATION = gql`
  mutation sendPhoneTwoFAVerificationCode(
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

const sendPhoneTwoFAVerificationCode: TwoFAFunction = async (
  managementCredentials,
  { callbackUrl, identity, userId, localeCodeOverride },
) => {
  const operation = {
    query: SEND_PHONE_TWO_FA_VERIFICATION_CODE_MUTATION,
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
    handleErrors(errors);
  }

  if (!data.sendPhoneVerificationCode) {
    throw new OutputDataNullError();
  }
  return data.sendPhoneVerificationCode;
};

async function sendTwoFAVerificationCode(
  managementCredentials: ManagementCredentials,
  {
    callbackUrl,
    identity,
    userId,
    localeCodeOverride,
  }: SendTwoFAVerificationCodeInput,
): Promise<SendTwoFAVerificationCodeResult> {
  const twoFAfunction = ((): TwoFAFunction => {
    switch (identity.type.toLocaleLowerCase()) {
      case "phone":
        return sendPhoneTwoFAVerificationCode;
      case "email":
        return sendEmailTwoFAVerificationCode;
      default:
        throw new InvalidIdentityTypeError();
    }
  })();

  const twoFAVerificationCodeResult = await twoFAfunction(
    managementCredentials,
    {
      callbackUrl,
      identity,
      userId,
      localeCodeOverride,
    },
  );

  if (twoFAVerificationCodeResult) {
    return twoFAVerificationCodeResult;
  }

  throw new OutputDataNullError();
}

export { sendTwoFAVerificationCode };
