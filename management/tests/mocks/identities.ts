import { Identity } from "../../src/types";
import { getIdentityType } from "../../src/utils/get-identity-type";

const nonPrimaryIdentityToUpdate: Identity = {
  id: "a1c88146-e68d-41a0-b439-cee82427c705",
  primary: false,
  status: "validated",
  type: getIdentityType("EMAIL"),
  value: "nonprimary_old@random.email",
};

const nonPrimaryNewIdentity: Identity = {
  id: "b7e5b7a7-65de-43ae-8ef2-fa9ba758e107",
  primary: false,
  status: "validated",
  type: getIdentityType("EMAIL"),
  value: "nonprimary_new@random.email",
};

const primaryIdentityToUpdate: Identity = {
  id: "2a64868a-600a-4726-958f-1b5f16c875f3",
  primary: true,
  status: "validated",
  type: getIdentityType("EMAIL"),
  value: "primary_old@random.email",
};

const primaryNewIdentity: Identity = {
  id: "a781a7c4-714b-4fd0-b262-82e1081d2ac6",
  primary: false,
  status: "validated",
  type: getIdentityType("EMAIL"),
  value: "primary_new@random.email",
};

export {
  nonPrimaryIdentityToUpdate,
  nonPrimaryNewIdentity,
  primaryIdentityToUpdate,
  primaryNewIdentity,
};
