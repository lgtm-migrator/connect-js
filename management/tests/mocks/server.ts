import express from "express";

import {
  nonPrimaryIdentityToUpdate,
  nonPrimaryNewIdentity,
} from "./identities";

const app = express();

app.use(express.json());

app.post("/update-identity", (request, response) => {
  switch (request.body.operationName) {
    case "getUserIdentityQuery":
      return response.status(200).json({
        data: {
          provider: {
            user: {
              identity: {
                ...nonPrimaryIdentityToUpdate,
              },
            },
          },
        },
      });
    case "checkVerificationCodeQuery":
      return response.status(200).json({
        data: {
          checkVerificationCode: {
            identityType: nonPrimaryNewIdentity.type,
            identityValue: nonPrimaryNewIdentity.value,
            nonce: "nonce",
            status: "VALID",
          },
        },
      });
    case "addIdentityToUser":
      return response.status(200).json({
        data: {
          addIdentityToUser: {
            ...nonPrimaryNewIdentity,
          },
        },
      });
    case "removeIdentityFromUser":
      return response.status(200).json({
        data: {
          removeIdentityFromUser: {
            identity: {
              value: nonPrimaryIdentityToUpdate.value,
            },
          },
        },
      });
    default:
      return response.status(500).json("BOOM");
  }
});

export { app };
