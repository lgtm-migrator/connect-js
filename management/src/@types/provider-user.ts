import { Identity } from "./identity";

export type ProviderUser = {
  id: string;
  name: string;
  user: {
    id: string;
    identities: Identity[];
  };
};

export type SingleIdentityProviderUser = {
  id: string;
  name: string;
  user: {
    id: string;
    identity: Identity | null;
  };
};

export type ProviderUserId = {
  user: {
    id: string;
  };
};

export type User = {
  id: string;
};
