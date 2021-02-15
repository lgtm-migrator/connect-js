import { execute, makePromise, GraphQLRequest, FetchResult } from "apollo-link";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import fetch from "cross-fetch";
import { FetchError } from "node-fetch";

import { ConnectUnreachableError } from "./errors";
import { ManagementCredentials } from "./types";

export async function fetchManagement<T = unknown>(
  managementCredentials: ManagementCredentials,
  operation: GraphQLRequest,
): Promise<FetchResult<T>> {
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
  try {
    return (await makePromise(
      execute(authLink.concat(httpLink), operation),
    )) as Promise<FetchResult<T>>;
  } catch (error) {
    if (error instanceof FetchError) {
      throw new ConnectUnreachableError(error);
    }

    throw error;
  }
}
