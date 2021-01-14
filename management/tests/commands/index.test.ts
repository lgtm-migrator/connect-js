import {
  addIdentityToUser,
  createOrUpdatePassword,
  createUserWithIdentities,
  deleteUser,
  markIdentityAsPrimary,
  removeIdentityFromUser,
  sendIdentityValidationCode,
  updateConnectApplication,
} from "../../index";

describe("Commands", () => {
  test("They should all be exported from 'src/commands/index.ts'", () => {
    expect(addIdentityToUser).toBeInstanceOf(Function);
    expect(createOrUpdatePassword).toBeInstanceOf(Function);
    expect(createUserWithIdentities).toBeInstanceOf(Function);
    expect(deleteUser).toBeInstanceOf(Function);
    expect(markIdentityAsPrimary).toBeInstanceOf(Function);
    expect(removeIdentityFromUser).toBeInstanceOf(Function);
    expect(sendIdentityValidationCode).toBeInstanceOf(Function);
    expect(updateConnectApplication).toBeInstanceOf(Function);
  });
});
