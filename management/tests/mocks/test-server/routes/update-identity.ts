import express from "express";

import {
  nonPrimaryIdentityToUpdate,
  nonPrimaryNewIdentity,
  primaryIdentityToUpdate,
  primaryNewIdentity,
} from "../../identities";

const updateIdentityRouter = express.Router();

let COUNTER = 0;

updateIdentityRouter.post("/", (request, response) => {
  const { variables, operationName } = request.body;
  const { headers } = request;

  switch (operationName) {
    case "getUserIdentityQuery":
      if (variables.id === nonPrimaryIdentityToUpdate.id) {
        return response.status(200).json({
          data: {
            provider: {
              user: {
                identity: nonPrimaryIdentityToUpdate,
              },
            },
          },
        });
      } else if (variables.id === primaryIdentityToUpdate.id) {
        return response.status(200).json({
          data: {
            provider: {
              user: {
                identity: primaryIdentityToUpdate,
              },
            },
          },
        });
      } else {
        return response.status(500).json("Something's wrong");
      }
    case "checkVerificationCodeQuery":
      if (variables.eventId === "nonPrimaryEventId") {
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
      } else if (variables.eventId === "primaryEventId") {
        return response.status(200).json({
          data: {
            checkVerificationCode: {
              identityType: primaryNewIdentity.type,
              identityValue: primaryNewIdentity.value,
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
      } else if (variables.value === primaryNewIdentity.value) {
        return response.status(200).json({
          data: {
            addIdentityToUser: primaryNewIdentity,
          },
        });
      } else {
        return response.status(500).json("Something's wrong");
      }
    case "removeIdentityFromUser":
      if (
        headers.behaviour === "rollback" &&
        headers["targeted-failure"] === "remove" &&
        (variables.value === primaryIdentityToUpdate.value ||
          variables.value === nonPrimaryIdentityToUpdate.value)
      ) {
        return response.status(200).json({
          data: {},
          errors: [{ message: "Internal server error" }],
        });
      } else if (variables.value === nonPrimaryIdentityToUpdate.value) {
        return response.status(200).json({
          data: {
            removeIdentityFromUser: {
              identity: {
                value: nonPrimaryIdentityToUpdate.value,
              },
            },
          },
        });
      } else if (variables.value === primaryIdentityToUpdate.value) {
        return response.status(200).json({
          data: {
            removeIdentityFromUser: {
              identity: {
                value: primaryIdentityToUpdate.value,
              },
            },
          },
        });
      } else if (variables.value === primaryNewIdentity.value) {
        return response.status(200).json({
          data: {
            removeIdentityFromUser: {
              identity: {
                value: primaryNewIdentity.value,
              },
            },
          },
        });
      } else if (variables.value === nonPrimaryNewIdentity.value) {
        return response.status(200).json({
          data: {
            removeIdentityFromUser: {
              identity: {
                value: nonPrimaryNewIdentity.value,
              },
            },
          },
        });
      } else {
        return response.status(500).json("Something's wrong");
      }
    case "markIdentityAsPrimary":
      if (
        headers.behaviour === "rollback" &&
        headers["targeted-failure"] === "mark"
      ) {
        return response.status(200).json({
          data: {},
          errors: [{ message: "Internal server error" }],
        });
      } else if (
        headers.behaviour === "retry" &&
        headers["targeted-failure"] === "mark"
      ) {
        if (COUNTER < Number(headers["max-retry"])) {
          COUNTER = COUNTER + 1;
          return response.status(500).json("Internal server error");
        } else {
          COUNTER = 0;
          return response.status(200).json({
            data: {
              markIdentityAsPrimary: {
                ...primaryNewIdentity,
                primary: true,
              },
            },
          });
        }
      } else if (variables.identityId === primaryNewIdentity.id) {
        return response.status(200).json({
          data: {
            markIdentityAsPrimary: {
              ...primaryNewIdentity,
              primary: true,
            },
          },
        });
      } else if (variables.identityId === primaryIdentityToUpdate.id) {
        return response.status(200).json({
          data: {
            markIdentityAsPrimary: primaryIdentityToUpdate,
          },
        });
      } else {
        return response.status(500).json("Something's wrong");
      }
    default:
      return response.status(500).json("No corresponding operation name found");
  }
});

export default updateIdentityRouter;
