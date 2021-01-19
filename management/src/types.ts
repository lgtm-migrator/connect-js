export type ManagementCredentials = {
  URI: string;
  APIKey: string;
};

export type ProviderApplication = {
  id: string;
  name: string;
  description: string;
  defaultHomePage: string;
  redirectUris: string[];
};

export type UpdateProviderApplicationInput = {
  id: string;
  name?: string;
  description?: string;
  defaultHomePage?: string;
  redirectUris?: string[];
};

export type CreateUserWithIdentitiesInput = {
  identities: IdentityInput[];
  localeCode: string;
};

export enum IdentityTypes {
  APPLE = "APPLE",
  DECATHLON = "DECATHLON",
  EMAIL = "EMAIL",
  FACEBOOK = "FACEBOOK",
  GITHUB = "GITHUB",
  GOOGLE = "GOOGLE",
  KAKAO_TALK = "KAKAO_TALK",
  LINE = "LINE",
  MICROSOFT = "MICROSOFT",
  NAVER = "NAVER",
  PAYPAL = "PAYPAL",
  PHONE = "PHONE",
  PROVIDER = "PROVIDER",
  STRAVA = "STRAVA",
  VKONTAKTE = "VKONTAKTE",
}

export enum IdentityStatus {
  UNVALIDATED = "UNVALIDATED",
  VALIDATED = "VALIDATED",
}

export type IdentityInput = {
  status?: IdentityStatus;
  type: IdentityTypes;
  value: string;
};

export type Identity = {
  id: string;
  primary: boolean;
  status: "validated" | "unvalidated";
  type: IdentityTypes;
  value: string;
};

export type IdentityCommandInput = {
  userId: string;
  identityType: IdentityTypes;
  identityValue: string;
};

export type SetPasswordErrorRules = {
  min_digits: {
    error: boolean;
    minimum: number;
  };
  min_non_digits: {
    error: boolean;
    minimum: number;
  };
  min_total_characters: {
    error: boolean;
    minimum: number;
  };
};

export type CreateOrUpdatePasswordInput = {
  cleartextPassword: string;
  userId: string;
};

export type SetPasswordError = {
  code: string;
  locations: [
    {
      column: number;
      line: number;
    },
  ];
  message: string;
  path: string[];
  rules: SetPasswordErrorRules;
};

export type SendIdentityVerificationCodeInput = {
  callbackUrl: string;
  identity: IdentityInput;
  localeCodeOverride?: string;
  userId?: string;
};

export type SendIdentityValidationCodeResult = {
  callbackUrl: string;
  eventId: string;
  localeCode: string;
  nonce: string;
};

export type CheckVerificationCodeInput = {
  code: string;
  eventId: string;
};

export enum CheckVerificationCodeStatus {
  EXPIRED = "EXPIRED",
  INVALID = "INVALID",
  NOT_FOUND = "NOT_FOUND",
  VALID = "VALID",
}

export type CheckVerificationCodeResult = {
  identityType: IdentityTypes;
  identityValue: string;
  nonce: string;
  status: CheckVerificationCodeStatus;
};
