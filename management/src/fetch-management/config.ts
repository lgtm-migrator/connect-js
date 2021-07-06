import { ManagementCredentials } from "../types";

function contextSetter(managementCredentials: ManagementCredentials) {
  return (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `API_KEY ${managementCredentials.APIKey}`,
      },
    };
  };
}

export { contextSetter };
