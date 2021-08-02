import { Server } from "http";
import { AddressInfo } from "net";

import { updateIdentityFromUser } from "../../src/commands";
import * as addIdentityToUser from "../../src/commands/add-identity-to-user";
import * as markIdentityAsPrimary from "../../src/commands/mark-identity-as-primary";
import * as removeIdentityFromUser from "../../src/commands/remove-identity-from-user";
import * as fetchManagementConfig from "../../src/fetch-management/config";
import * as checkVerificationCode from "../../src/queries/check-verification-code";
import * as getIdentity from "../../src/queries/get-identity";
import { ManagementCredentials } from "../../src/types";
import {
  nonPrimaryIdentityToUpdate,
  nonPrimaryNewIdentity,
  primaryIdentityToUpdate,
  primaryNewIdentity,
} from "../mocks/identities";
import { app } from "../mocks/test-server/server";

describe("Update identity from user", () => {
  let server: Server;
  let mockedUpdateIdentityManagementCredentials: ManagementCredentials;

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve());
    });

    mockedUpdateIdentityManagementCredentials = {
      URI: `http://localhost:${
        (server.address() as AddressInfo).port
      }/update-identity`,
      APIKey: "APIKey",
    };

    jest.setTimeout(10000);
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

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

  test("happy path with a non primary identity", async () => {
    expect.assertions(5);

    await updateIdentityFromUser(
      mockedUpdateIdentityManagementCredentials,
      "f3acadc9-4491-44c4-bd78-077a166751af",
      "424242",
      ["nonPrimaryEventId"],
      nonPrimaryNewIdentity.value,
      nonPrimaryIdentityToUpdate.id,
    );

    expect(spiedOnGetIdentity).toHaveBeenCalledWith(
      mockedUpdateIdentityManagementCredentials,
      {
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        identityId: nonPrimaryIdentityToUpdate.id,
      },
    );
    expect(spiedOnCheckVerificationCode).toHaveBeenNthCalledWith(
      1,
      mockedUpdateIdentityManagementCredentials,
      { code: "424242", eventId: "nonPrimaryEventId" },
    );
    expect(spiedOnAddIdentityToUser).toHaveBeenNthCalledWith(
      1,
      mockedUpdateIdentityManagementCredentials,
      "424242",
      ["nonPrimaryEventId"],
      {
        identityType: nonPrimaryNewIdentity.type,
        identityValue: nonPrimaryNewIdentity.value,
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
      },
    );
    expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
      1,
      mockedUpdateIdentityManagementCredentials,
      {
        identityType: nonPrimaryIdentityToUpdate.type,
        identityValue: nonPrimaryIdentityToUpdate.value,
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
      },
    );
    expect(spiedOnMarkIdentityAsPrimary).not.toHaveBeenCalled();
  });

  test("happy path with a primary identity", async () => {
    expect.assertions(5);

    await updateIdentityFromUser(
      mockedUpdateIdentityManagementCredentials,
      "f3acadc9-4491-44c4-bd78-077a166751af",
      "424242",
      ["primaryEventId"],
      primaryNewIdentity.value,
      primaryIdentityToUpdate.id,
    );

    expect(spiedOnGetIdentity).toHaveBeenCalledWith(
      mockedUpdateIdentityManagementCredentials,
      {
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        identityId: primaryIdentityToUpdate.id,
      },
    );
    expect(spiedOnCheckVerificationCode).toHaveBeenNthCalledWith(
      1,
      mockedUpdateIdentityManagementCredentials,
      { code: "424242", eventId: "primaryEventId" },
    );
    expect(spiedOnAddIdentityToUser).toHaveBeenNthCalledWith(
      1,
      mockedUpdateIdentityManagementCredentials,
      "424242",
      ["primaryEventId"],
      {
        identityType: primaryNewIdentity.type,
        identityValue: primaryNewIdentity.value,
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
      },
    );
    expect(spiedOnMarkIdentityAsPrimary).toHaveBeenNthCalledWith(
      1,
      mockedUpdateIdentityManagementCredentials,
      primaryNewIdentity.id,
    );
    expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
      1,
      mockedUpdateIdentityManagementCredentials,
      {
        identityType: primaryIdentityToUpdate.type,
        identityValue: primaryIdentityToUpdate.value,
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
      },
    );
  });

  test("should rollback if an error occurs when trying to mark the new identity as primary", async () => {
    expect.assertions(5);

    jest
      .spyOn(fetchManagementConfig, "contextSetter")
      .mockImplementation((managementCredentials: ManagementCredentials) => {
        return (_, { headers }) => {
          return {
            headers: {
              ...headers,
              behaviour: "rollback",
              "targeted-failure": "mark",
              authorization: `API_KEY ${managementCredentials.APIKey}`,
            },
          };
        };
      });

    try {
      await updateIdentityFromUser(
        mockedUpdateIdentityManagementCredentials,
        "f3acadc9-4491-44c4-bd78-077a166751af",
        "424242",
        ["primaryEventId"],
        primaryNewIdentity.value,
        primaryIdentityToUpdate.id,
      );
    } catch (error) {
      expect(spiedOnGetIdentity).toHaveBeenCalledWith(
        mockedUpdateIdentityManagementCredentials,
        {
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
          identityId: primaryIdentityToUpdate.id,
        },
      );
      expect(spiedOnCheckVerificationCode).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        { code: "424242", eventId: "primaryEventId" },
      );
      expect(spiedOnAddIdentityToUser).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        "424242",
        ["primaryEventId"],
        {
          identityType: primaryNewIdentity.type,
          identityValue: primaryNewIdentity.value,
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        },
      );
      expect(spiedOnMarkIdentityAsPrimary).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        primaryNewIdentity.id,
      );
      expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        {
          identityType: primaryNewIdentity.type,
          identityValue: primaryNewIdentity.value,
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        },
      );
    }
  });

  test("should rollback if an error occurs when trying to remove the old primary identity", async () => {
    expect.assertions(7);

    jest
      .spyOn(fetchManagementConfig, "contextSetter")
      .mockImplementation((managementCredentials: ManagementCredentials) => {
        return (_, { headers }) => {
          return {
            headers: {
              ...headers,
              behaviour: "rollback",
              "targeted-failure": "remove",
              authorization: `API_KEY ${managementCredentials.APIKey}`,
            },
          };
        };
      });

    try {
      await updateIdentityFromUser(
        mockedUpdateIdentityManagementCredentials,
        "f3acadc9-4491-44c4-bd78-077a166751af",
        "424242",
        ["primaryEventId"],
        primaryNewIdentity.value,
        primaryIdentityToUpdate.id,
      );
    } catch (error) {
      expect(spiedOnGetIdentity).toHaveBeenCalledWith(
        mockedUpdateIdentityManagementCredentials,
        {
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
          identityId: primaryIdentityToUpdate.id,
        },
      );
      expect(spiedOnCheckVerificationCode).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        { code: "424242", eventId: "primaryEventId" },
      );
      expect(spiedOnAddIdentityToUser).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        "424242",
        ["primaryEventId"],
        {
          identityType: primaryNewIdentity.type,
          identityValue: primaryNewIdentity.value,
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        },
      );
      expect(spiedOnMarkIdentityAsPrimary).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        primaryNewIdentity.id,
      );
      expect(spiedOnMarkIdentityAsPrimary).toHaveBeenNthCalledWith(
        2,
        mockedUpdateIdentityManagementCredentials,
        primaryIdentityToUpdate.id,
      );
      expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        {
          identityType: primaryIdentityToUpdate.type,
          identityValue: primaryIdentityToUpdate.value,
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        },
      );
      expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
        2,
        mockedUpdateIdentityManagementCredentials,
        {
          identityType: primaryNewIdentity.type,
          identityValue: primaryNewIdentity.value,
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        },
      );
    }
  });

  test("should rollback if an error occurs when trying to remove the old non primary identity", async () => {
    expect.assertions(6);

    jest
      .spyOn(fetchManagementConfig, "contextSetter")
      .mockImplementation((managementCredentials: ManagementCredentials) => {
        return (_, { headers }) => {
          return {
            headers: {
              ...headers,
              behaviour: "rollback",
              "targeted-failure": "remove",
              authorization: `API_KEY ${managementCredentials.APIKey}`,
            },
          };
        };
      });

    try {
      await updateIdentityFromUser(
        mockedUpdateIdentityManagementCredentials,
        "f3acadc9-4491-44c4-bd78-077a166751af",
        "424242",
        ["primaryEventId"],
        nonPrimaryNewIdentity.value,
        nonPrimaryIdentityToUpdate.id,
      );
    } catch (error) {
      expect(spiedOnGetIdentity).toHaveBeenCalledWith(
        mockedUpdateIdentityManagementCredentials,
        {
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
          identityId: nonPrimaryIdentityToUpdate.id,
        },
      );
      expect(spiedOnCheckVerificationCode).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        { code: "424242", eventId: "primaryEventId" },
      );
      expect(spiedOnAddIdentityToUser).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        "424242",
        ["primaryEventId"],
        {
          identityType: nonPrimaryNewIdentity.type,
          identityValue: nonPrimaryNewIdentity.value,
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        },
      );

      expect(spiedOnMarkIdentityAsPrimary).not.toHaveBeenCalled();

      expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
        1,
        mockedUpdateIdentityManagementCredentials,
        {
          identityType: nonPrimaryIdentityToUpdate.type,
          identityValue: nonPrimaryIdentityToUpdate.value,
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        },
      );
      expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
        2,
        mockedUpdateIdentityManagementCredentials,
        {
          identityType: nonPrimaryNewIdentity.type,
          identityValue: nonPrimaryNewIdentity.value,
          userId: "f3acadc9-4491-44c4-bd78-077a166751af",
        },
      );
    }
  });

  test("should retry 2 times when marking the new identity fails with server error", async () => {
    expect.assertions(9);

    const maxRetry = 2;

    jest
      .spyOn(fetchManagementConfig, "contextSetter")
      .mockImplementation((managementCredentials: ManagementCredentials) => {
        return (_, { headers }) => {
          return {
            headers: {
              ...headers,
              behaviour: "retry",
              "targeted-failure": "mark",
              "max-retry": maxRetry,
              authorization: `API_KEY ${managementCredentials.APIKey}`,
            },
          };
        };
      });

    await updateIdentityFromUser(
      mockedUpdateIdentityManagementCredentials,
      "f3acadc9-4491-44c4-bd78-077a166751af",
      "424242",
      ["primaryEventId"],
      primaryNewIdentity.value,
      primaryIdentityToUpdate.id,
    );

    expect(spiedOnGetIdentity).toHaveBeenCalledTimes(maxRetry + 1);
    expect(spiedOnAddIdentityToUser).toHaveBeenCalledTimes(maxRetry + 1);
    expect(spiedOnCheckVerificationCode).toHaveBeenCalledTimes(maxRetry + 1);

    expect(spiedOnMarkIdentityAsPrimary).toHaveBeenNthCalledWith(
      1,
      mockedUpdateIdentityManagementCredentials,
      primaryNewIdentity.id,
    );
    expect(spiedOnMarkIdentityAsPrimary).toHaveBeenNthCalledWith(
      2,
      mockedUpdateIdentityManagementCredentials,
      primaryNewIdentity.id,
    );
    expect(spiedOnMarkIdentityAsPrimary).toHaveBeenNthCalledWith(
      3,
      mockedUpdateIdentityManagementCredentials,
      primaryNewIdentity.id,
    );

    expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
      1,
      mockedUpdateIdentityManagementCredentials,
      {
        identityType: primaryNewIdentity.type,
        identityValue: primaryNewIdentity.value,
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
      },
    );
    expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
      2,
      mockedUpdateIdentityManagementCredentials,
      {
        identityType: primaryNewIdentity.type,
        identityValue: primaryNewIdentity.value,
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
      },
    );
    expect(spiedOnRemoveIdentityFromUser).toHaveBeenNthCalledWith(
      3,
      mockedUpdateIdentityManagementCredentials,
      {
        identityType: primaryIdentityToUpdate.type,
        identityValue: primaryIdentityToUpdate.value,
        userId: "f3acadc9-4491-44c4-bd78-077a166751af",
      },
    );
  });

  test("should do 3 retries calls with an increasing delay between calls", async () => {
    expect.assertions(1);
    const maxRetry = 3;

    const overallDelay = (): number => {
      let result = 0;
      for (let i = 1; i <= maxRetry; i++) {
        result = result + Math.pow(i, 2) * 100;
      }
      return result;
    };

    jest
      .spyOn(fetchManagementConfig, "contextSetter")
      .mockImplementation((managementCredentials: ManagementCredentials) => {
        return (_, { headers }) => {
          return {
            headers: {
              ...headers,
              behaviour: "retry",
              "targeted-failure": "mark",
              "max-retry": maxRetry,
              authorization: `API_KEY ${managementCredentials.APIKey}`,
            },
          };
        };
      });

    const startTime = Date.now();

    await updateIdentityFromUser(
      mockedUpdateIdentityManagementCredentials,
      "f3acadc9-4491-44c4-bd78-077a166751af",
      "424242",
      ["primaryEventId"],
      primaryNewIdentity.value,
      primaryIdentityToUpdate.id,
      3,
    ).then(() => {
      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThan(overallDelay());
    });
  });
});
