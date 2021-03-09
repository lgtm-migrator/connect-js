type ManagementCredentials = {
  URI: string;
  APIKey: string;
};

type ProviderApplication = {
  id: string;
  name: string;
  description: string;
  defaultHomePage: string;
  redirectUris: string[];
};

type UpdateProviderApplicationInput = {
  id: string;
  name?: string;
  description?: string;
  defaultHomePage?: string;
  redirectUris?: string[];
};

type CreateUserWithIdentitiesInput = {
  identities: IdentityInput[];
  localeCode: string;
};

enum IdentityTypes {
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

enum IdentityStatus {
  UNVALIDATED = "UNVALIDATED",
  VALIDATED = "VALIDATED",
}

type IdentityInput = {
  status?: IdentityStatus;
  type: IdentityTypes;
  value: string;
};

type Identity = {
  id: string;
  primary: boolean;
  status: "validated" | "unvalidated";
  type: IdentityTypes;
  value: string;
};

type IdentityCommandInput = {
  userId: string;
  identityType: IdentityTypes;
  identityValue: string;
};

type PasswordRules = {
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

type CreateOrUpdatePasswordInput = {
  cleartextPassword: string;
  userId: string;
};

type SendIdentityValidationCodeInput = {
  callbackUrl: string;
  identity: IdentityInput;
  localeCodeOverride?: string;
  userId?: string;
};

type SendIdentityValidationCodeResult = {
  callbackUrl: string;
  eventId: string;
  localeCode: string;
  nonce: string;
};

type CheckVerificationCodeInput = {
  code: string;
  eventId: string;
};

enum CheckVerificationCodeStatus {
  EXPIRED = "EXPIRED",
  INVALID = "INVALID",
  NOT_FOUND = "NOT_FOUND",
  VALID = "VALID",
}

type CheckVerificationCodeResult = {
  identityType: IdentityTypes;
  identityValue: string;
  nonce: string;
  status: CheckVerificationCodeStatus;
};

type Send2FaVerificationCodeInput = {
  callbackUrl: string;
  identity: IdentityInput;
  userId: string;
  localeCodeOverride?: string;
};

type Send2FaVerificationCodeResult = {
  callbackUrl: string;
  eventId: string;
  localeCode: string;
  nonce: string;
};

export type {
  ManagementCredentials,
  ProviderApplication,
  UpdateProviderApplicationInput,
  CreateUserWithIdentitiesInput,
  IdentityInput,
  Identity,
  IdentityCommandInput,
  PasswordRules,
  CreateOrUpdatePasswordInput,
  SendIdentityValidationCodeInput,
  SendIdentityValidationCodeResult,
  CheckVerificationCodeInput,
  CheckVerificationCodeResult,
  Send2FaVerificationCodeResult,
  Send2FaVerificationCodeInput,
};

export { IdentityTypes, IdentityStatus, CheckVerificationCodeStatus };
