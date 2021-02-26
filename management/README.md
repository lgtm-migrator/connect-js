# Fewlines Connect-js Management

**Management** is part of the **Fewlines Connect-js SDK**.

It provides a list of functions to handle all the user data flows related to Connect, and some useful tools regarding Provider Applications.

## Installation

```shell
yarn add @fewlines/connect-management
```

## Usage

Apart from the arguments specific to the query/command needed to fetch **Connect**, you will need to pass your **Management** credentials each time, in the form of an object, called `ManagementCredentials`.

```ts
type ManagementCredentials = {
  URI: string;
  APIKey: string;
}

const managementCredentials: ManagementCredentials = {
  URI: "URI",
  APIKey: "APIKey";
}
```

## Important types

### Identities

**Identities** are one of the building blocks of **Connect-js Management**.

```ts
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

type Identity = {
  id: string;
  primary: boolean;
  status: "validated" | "unvalidated";
  type: IdentityTypes;
  value: string;
};
```

### Provider Application

**Provider Applications** are the entities between the **Connect Provider** and your web application.

```ts
type ProviderApplication = {
  id: string;
  name: string;
  description: string;
  defaultHomePage: string;
  redirectUris: string[];
};
```

## Queries

### checkVerificationCode

Used to verify the verification code input by the user. The function returns an object, composed of:

- The type of the Identity
- The value of the Identity
- The status of the Identity
- The nonce

```ts
import { checkVerificationCode } from "@fewlines/connect-management";

const input = {
  code: "288761",
  eventId: "ec1ee772-3249-4e5a-ad85-2b18d13f6f73",
};

const {
  identityType,
  identityValue,
  nonce,
  status,
} = await checkVerificationCode(managementCredentials, input);
```

### getProviderApplication

Used to get the information from the Connect Application. The function returns the Application data. Refer to the [Provider Application](#Provider) to understand the returned data structure.

```ts
import { getProviderApplication } from "@fewlines/connect-management";

const {
  id,
  defaultHomePage,
  redirectUris,
  name,
  description,
} = await getProviderApplication(
  managementCredentials,
  "a3e64872-6326-4813-948d-db8d8fc81bc8",
);
```

### getIdentities

Used to retrieve all the Identities for a particular user. The function returns a list of Identity. Refer to the [Identity section](#Identities) to understand the returned data structure.

```ts
import { getIdentities } from "@fewlines/connect-management";

const identities = await getIdentities(
  managementCredentials,
  "d96ee314-31b2-4e19-88b7-63734b90d1d4",
);
```

### getIdentity

Used to retrieve an Identity for a particular user using both the user and the Identity `id`. Refer to the [Identity section](#Identities) to understand the returned data structure.

```ts
import { getIdentity } from "@fewlines/connect-management";

const input = {
  userId: "b4e8bec6-3156-43c4-aaa8-9632c1c160b3",
  identityId: "9a60bc4c-82dc-42c5-8bac-8b051340d2ac",
};

const { id, primary, status, type, value } = await getIdentity(
  managementCredentials,
  input,
);
```

### getProviderName

Used to retrieve the name of the current Provider.

```ts
import { getProviderName } from "@fewlines/connect-management";

const providerName = await getProviderName(managementCredentials);
```

### getUserIdFromIdentityValue

Used to retrieve the user `id` by passing an Identity value as input.

```ts
import { getUserIdFromIdentityValue } from "@fewlines/connect-management";

const userID = await getUserIdFromIdentityValue(
  managementCredentials,
  "foo@fewlines.co",
);
```

### isUserPasswordSet

Used to check if the user has already set his password. The function returns a boolean.

```ts
import { isUserPasswordSet } from "@fewlines/connect-management";

const isPasswordSet = await isUserPasswordSet(
  managementCredentials,
  "16071981-1536-4eb2-a33e-892dc84c14a4",
);
```

## Commands

### addIdentityToUser

Used to add a new Identity to the user. The function returns the newly added Identity.

```ts
import { addIdentityToUser } from "@fewlines/connect-management";

const input = {
  userId: "d96ee314-31b2-4e19-88b7-63734b90d1d4",
  type: "EMAIL",
  value: "foo@fewlines.co",
};

await addIdentityToUser(managementCredentials, input);
```

### createOrUpdatePassword

Used to create or update a User password. The function returns the User `id`.

```ts
import { createOrUpdatePassword } from "@fewlines/connect-management";

const input = {
  cleartextPassword: "cleartextPassword",
  userId: "d8959bfd9-aab8-4de2-81bb-cbd9ea1a4191",
};

const isPasswordSet = await createOrUpdatePassword(
  managementCredentials,
  input,
);
```

If the `cleartextPassword` input doesn't meet the Provider defined rules, the function will throw a specific error containing the `rules` waited for the password to be valid. The data structure of the `rules` property is dependent of the Provider settings.

```ts
import {
  createOrUpdatePassword,
  InvalidPasswordInputError,
} from "@fewlines/connect-management";

const input = {
  cleartextPassword: "42",
  userId: "d8959bfd9-aab8-4de2-81bb-cbd9ea1a4191",
};

try {
  await createOrUpdatePassword(managementCredentials, input);
} catch (error) {
  if (error instanceof InvalidPasswordInputError) {
    const { rules } = error;
    // ...
  }
}
```

### createUserWithIdentities

Create a new User with a list of Identities for the current Provider. The list of identities passed as input cannot be empty. The function returns the User `id`.

```ts
import { createUserWithIdentities } from "@fewlines/connect-management";

const input = {
  identities: [
    {
      id: "d4e5e5d5-4fd3-49af-8ee4-7e28c824bb3c",
      type: "EMAIL",
      value: "foo@fewlines.co",
      status: "validated",
      primary: true,
    },
  ],
  localeCode: "en-EN",
};

const userId = await createUserWithIdentities(managementCredentials, input);
```

### deleteUser

Used to delete a User. Return the string `"DISPATCHED"` to signify that the delete event has been sent to all the services.

```ts
import { deleteUser } from "@fewlines/connect-management";

const deleteStatus = await deleteUser(
  managementCredentials,
  "f084749a-2e90-4891-a26f-65e08c4f4e69",
);
```

### markIdentityAsPrimary

Used to mark an Identity as `primary`. Will set the previous primary identity as non primary.
The function returns the Identity. Refer to the [Identity section](#Identities) to understand the returned data structure.

```ts
import { markIdentityAsPrimary } from "@fewlines/connect-management";

const newPrimaryIdentity = await markIdentityAsPrimary(
  managementCredentials,
  "504c741c-f9dd-425c-912a-03fe051b0e6e",
);
```

### removeIdentityFromUser

Used to remove an Identity from a User. The function returns true if the removal worked.

```ts
import { removeIdentityFromUser } from "@fewlines/connect-management";

const input = {
  userId: "4a5324f7-9390-41ab-a94d-2ab3198f1a8c",
  type: "EMAIL",
  value: "foo@fewlines.co",
};

const isIdentityRemove = await removeIdentityFromUser(
  managementCredentials,
  input,
);
```

### sendIdentityValidationCode

Used to send a Validation Code to the User. The function returns an object, composed of:

- The event id, used to verify the Validation Code.
- The callback URL
- The locale code
- The nonce

```ts
import { sendIdentityValidationCode } from "@fewlines/connect-management";

const input = {
  callbackUrl: "/",
  identity: {
    id: "12488dfe-8e46-4391-a8bb-f0db41078942",
    type: "EMAIL",
    value: "foo@fewlines.co",
    status: "validated",
    primary: true,
  },
  userId: "37b21863-3f38-4d20-848d-3108337a0b8b",
};

const {
  callbackUrl,
  localeCode,
  eventId,
  nonce,
} = await sendIdentityValidationCode(managementCredentials, input);
```

If the Identity `value` input is blank or is identical to an already validated Identity for the current Provider, the function will throw specific errors corresponding to each case.

```ts
import {
  sendIdentityValidationCode,
  IdentityAlreadyUsedError,
  IdentityValueCantBeBlankError,
} from "@fewlines/connect-management";

const input = {
  callbackUrl: "/",
  identity: {
    id: "12488dfe-8e46-4391-a8bb-f0db41078942",
    type: "EMAIL",
    value: "",
    status: "validated",
    primary: true,
  },
  userId: "37b21863-3f38-4d20-848d-3108337a0b8b",
};

try {
  const {
    callbackUrl,
    localeCode,
    eventId,
    nonce,
  } = await sendIdentityValidationCode(managementCredentials, input);
} catch (error) {
  if (error instanceof IdentityValueCantBeBlankError) {
    // ...
  }

  if (error instanceof IdentityAlreadyUsedError) {
    // ...
  }
}
```

### updateProviderApplication

Used to update the Provider Application. The function returns the Application data. Refer to the [Provider Application](#Provider) to understand the returned data structure.

```ts
import { updateProviderApplication } from "@fewlines/connect-management";

const input = {
  id: "d1e34015-4ba0-44a3-8171-15ed6979b86d",
  description: "Connect JS Management test environment",
  name: "Connect JS Management",
  redirectUris: [
    "http://localhost:3000/oauth/callback",
    "https://connect-management.local:3001/oauth/callback",
  ],
  defaultHomePage: "https://www.fewlines.co",
};

const {
  id,
  description,
  redirectUris,
  name,
  defaultHomePage,
} = await updateProviderApplication(managementCredentials, input);
```

### updateIdentity

Used to update an Identity. Here are the props needed, in order:

- managementCredentials: URI and API Key of Connect.
- userId: ID or sub of the current user.
- eventId: Event ID generated at the start of the Identity validation flow.
- validationCode: Code input from the User during the Identity validation flow.
- identityValue: Identity value that will replace the current Identity.
- identityToUpdateId: ID of the previous Identity to update.

```ts
import { updateIdentity } from "@fewlines/connect-management";

await updateIdentity(
  managementCredentials,
  userId,
  eventId,
  validationCode,
  identityValue,
  identityToUpdateId,
);
```

The function will do a rollback of any added Identity and primary Identity status in case of a failure.

Here are the expected exception raised in case of a failure:

- ConnectUnreachableError
- GraphqlErrors
- IdentityNotFoundError
- InvalidValidationCodeError
- UnhandledIdentityType
