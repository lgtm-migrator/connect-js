import { Identity } from "../../src/types";
import { getIdentityType } from "../../src/utils/get-identity-type";

const nonPrimaryIdentityToUpdate: Identity = {
  id: "a1c88146-e68d-41a0-b439-cee82427c705",
  primary: false,
  status: "validated",
  type: getIdentityType("EMAIL"),
  value: "some@random.email",
};

const nonPrimaryNewIdentity: Identity = {
  id: "b7e5b7a7-65de-43ae-8ef2-fa9ba758e107",
  primary: false,
  status: "validated",
  type: getIdentityType("EMAIL"),
  value: "some2@random.email",
};

export { nonPrimaryIdentityToUpdate, nonPrimaryNewIdentity };
