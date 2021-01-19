import {
  checkVerificationCode,
  getProviderApplication,
  getIdentities,
  getIdentity,
  getProviderName,
  getUserIdFromIdentityValue,
  isUserPasswordSet,
} from "../../src/queries";

describe("Queries", () => {
  test("They should all be exported from 'src/queries/index.ts'", () => {
    expect(checkVerificationCode).toBeInstanceOf(Function);
    expect(getProviderApplication).toBeInstanceOf(Function);
    expect(getIdentities).toBeInstanceOf(Function);
    expect(getIdentity).toBeInstanceOf(Function);
    expect(getProviderName).toBeInstanceOf(Function);
    expect(getUserIdFromIdentityValue).toBeInstanceOf(Function);
    expect(isUserPasswordSet).toBeInstanceOf(Function);
  });
});
