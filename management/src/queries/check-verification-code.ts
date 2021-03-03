import gql from "graphql-tag";

import { GraphqlErrors, OutputDataNullError } from "../errors";
import { fetchManagement } from "../fetch-management";
import {
  CheckVerificationCodeInput,
  CheckVerificationCodeResult,
  ManagementCredentials,
} from "../types";

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

async function checkVerificationCode(
  managementCredentials: ManagementCredentials,
  { code, eventId }: CheckVerificationCodeInput,
): Promise<CheckVerificationCodeResult> {
  const operation = {
    query: CHECK_VERIFICATION_CODE_QUERY,
    variables: { code, eventId },
  };

  const { data, errors } = await fetchManagement<{
    checkVerificationCode: CheckVerificationCodeResult;
  }>(managementCredentials, operation);

  if (errors) {
    throw new GraphqlErrors(errors);
  }

  if (!data.checkVerificationCode) {
    throw new OutputDataNullError();
  }

  return data.checkVerificationCode;
}

export { checkVerificationCode };
