import { execute, makePromise, GraphQLRequest, FetchResult } from "apollo-link";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import fetch from "cross-fetch";

import { ManagementCredentials } from "./@types/management";

export function fetchManagement(
  managementCredentials: ManagementCredentials,
  operation: GraphQLRequest,
): Promise<FetchResult> {
  const httpLink = new HttpLink({
    uri: managementCredentials.URI,
    fetch,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `API_KEY ${managementCredentials.APIKey}`,
      },
    };
  });

  return makePromise(execute(authLink.concat(httpLink), operation));
}
