import express from "express";

import { nonPrimaryNewIdentity } from "../../identities";

const addIdentityRouter = express.Router();

addIdentityRouter.post("/", (request, response) => {
  const { variables, operationName } = request.body;

  switch (operationName) {
    case "checkVerificationCodeQuery":
      if (
        variables.eventId === "nonPrimaryEventId" &&
        variables.code === "232323"
      ) {
        return response.status(200).json({
          data: {
            checkVerificationCode: {
              identityType: null,
              identityValue: null,
              nonce: null,
              status: "INVALID",
            },
          },
        });
      } else if (variables.eventId === "nonPrimaryEventId") {
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
      } else {
        return response.status(500).json("Something's wrong");
      }
    case "addIdentityToUser":
      if (variables.value === nonPrimaryNewIdentity.value) {
        return response.status(200).json({
          data: {
            addIdentityToUser: nonPrimaryNewIdentity,
          },
        });
      } else {
        return response.status(500).json("Something's wrong");
      }

    default:
      return response.status(500).json("No corresponding operation name found");
  }
});

export default addIdentityRouter;
