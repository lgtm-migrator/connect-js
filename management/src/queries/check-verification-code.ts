import { FetchResult } from "apollo-link";
import gql from "graphql-tag";

import { ManagementCredentials } from "../@types/management";
import {
  CheckVerificationCodeInput,
  CheckVerificationCodeResult,
} from "../@types/verification-code";
import { fetchManagement } from "../fetch-management";

const CHECK_VERIFICATION_CODE_QUERY = gql`
  query checkVerificationCodeQuery($code: String!, $eventId: String!) {
    checkVerificationCode(input: { code: $code, eventId: $eventId }) {
      identityType
      identityValue
      nonce
      status
    }
  }
`;

export type CheckVerificationCode = Promise<
  FetchResult<{
    checkVerificationCode: CheckVerificationCodeResult;
  }>
>;

export async function checkVerificationCode(
  managementCredentials: ManagementCredentials,
  { code, eventId }: CheckVerificationCodeInput,
): CheckVerificationCode {
  const operation = {
    query: CHECK_VERIFICATION_CODE_QUERY,
    variables: { code, eventId },
  };

  return fetchManagement(
    managementCredentials,
    operation,
  ) as CheckVerificationCode;
}
