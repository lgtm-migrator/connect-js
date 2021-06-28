import { Server } from "http";

import { updateIdentityFromUser } from "../../src/commands";
import * as addIdentityToUser from "../../src/commands/add-identity-to-user";
import * as markIdentityAsPrimary from "../../src/commands/mark-identity-as-primary";
import * as removeIdentityFromUser from "../../src/commands/remove-identity-from-user";
import * as checkVerificationCode from "../../src/queries/check-verification-code";
import * as getIdentity from "../../src/queries/get-identity";
import {
  nonPrimaryIdentityToUpdate,
  nonPrimaryNewIdentity,
} from "../mocks/identities";
import { app } from "../mocks/server";

describe("Update identity from user", () => {
  let server: Server;

  beforeAll(async () => {
    await new Promise(
      (resolve) => (server = app.listen(3000, resolve as () => void)),
    );
  });

  afterAll(() => {
    server.close();
  });

  test("Happy path", async () => {
    expect.assertions(5);

    const mockedUpdateIdentityManagementCredentials = {
      URI: "http://localhost:3000/update-identity",
      APIKey: "something",
    };

    const spiedOnGetIdentity = jest.spyOn(getIdentity, "getIdentity");
    const spiedOnCheckVerificationCode = jest.spyOn(
      checkVerificationCode,
      "checkVerificationCode",
    );
    const spiedOnAddIdentityToUser = jest.spyOn(
      addIdentityToUser,
      "addIdentityToUser",
    );
    const spiedOnRemoveIdentityFromUser = jest.spyOn(
      removeIdentityFromUser,
      "removeIdentityFromUser",
    );

    const spiedOnMarkIdentityAsPrimary = jest.spyOn(
      markIdentityAsPrimary,
      "markIdentityAsPrimary",
    );

    await updateIdentityFromUser(
      mockedUpdateIdentityManagementCredentials,
      "f3acadc9-4491-44c4-bd78-077a166751af",
      "424242",
      ["eventId1"],
      nonPrimaryNewIdentity.value,
      nonPrimaryIdentityToUpdate.id,
    );

    expect(spiedOnGetIdentity).toHaveBeenCalledWith(
      {
        ...mockedUpdateIdentityManagementCredentials,
      },
      {
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        identityId: nonPrimaryIdentityToUpdate.id,
      },
    );
    expect(spiedOnCheckVerificationCode).toHaveBeenNthCalledWith(
      1,
      {
        ...mockedUpdateIdentityManagementCredentials,
      },
      { code: "424242", eventId: "eventId1" },
    );
    expect(spiedOnAddIdentityToUser).toHaveBeenNthCalledWith(
      1,
      {
        ...mockedUpdateIdentityManagementCredentials,
      },
      "424242",
      ["eventId1"],
      {
        identityType: nonPrimaryNewIdentity.type,
        identityValue: nonPrimaryNewIdentity.value,
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
      },
    );
    expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
      1,
      {
        ...mockedUpdateIdentityManagementCredentials,
      },
      {
        identityType: nonPrimaryIdentityToUpdate.type,
        identityValue: nonPrimaryIdentityToUpdate.value,
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
      },
    );
    expect(spiedOnMarkIdentityAsPrimary).not.toHaveBeenCalled();
  });
});
