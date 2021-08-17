import { ManagementCredentials } from "../types";

function contextSetter(managementCredentials: ManagementCredentials) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return (_: unknown, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `API_KEY ${managementCredentials.APIKey}`,
      },
    };
  };
}

export { contextSetter };
