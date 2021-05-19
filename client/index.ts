import jwt from "jsonwebtoken";
import nodeFetch, { FetchError } from "node-fetch";
import jose from "node-jose";

import {
  MissingJWKSURIError,
  InvalidKeyIDRS256Error,
  MissingKeyIDHS256Error,
  AlgoNotSupportedError,
  InvalidAudienceError,
  ScopesNotSupportedError,
  UnreachableError,
} from "./src/errors";
import {
  OpenIDConfiguration,
  OAuth2ClientConstructor,
  JWKSDT,
  OAuth2Tokens,
  JWTPayload,
  CustomPayload,
  RefreshTokenResponse,
} from "./src/types";
import { decodeJWTPart } from "./src/utils/decodeJWTPart";
import {
  defaultAsymmetricAlgoKeyPair,
  defaultPayload,
  defaultSecret,
} from "./src/utils/defaultObjects";
import { generateJWE } from "./src/utils/generateJWE";
import { generateHS256JWS, generateRS256JWS } from "./src/utils/generateJWS";
import { generateRSAKeyPair } from "./src/utils/generateRSAKeyPair";
import { rsaPublicKeyToPEM } from "./src/utils/rsaPublicKeyToPEM";

class OAuth2Client {
  readonly openIDConfigurationURL: string;
  readonly clientID: string;
  readonly clientSecret: string;
  readonly redirectURI: string;
  readonly audience: string;
  readonly scopes: string[];
  private fetch: any;
  openIDConfiguration?: OpenIDConfiguration;
  jwks?: JWKSDT;

  constructor({
    openIDConfigurationURL,
    clientID,
    clientSecret,
    redirectURI,
    audience,
    scopes,
    fetch,
    openIDConfiguration,
  }: OAuth2ClientConstructor) {
    this.openIDConfigurationURL = openIDConfigurationURL;
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.redirectURI = redirectURI;
    this.audience = audience;
    this.scopes = scopes;
    this.fetch = fetch ? fetch : nodeFetch;
    this.openIDConfiguration = openIDConfiguration
      ? openIDConfiguration
      : undefined;
  }

  private async getOpenIDConfiguration(): Promise<OpenIDConfiguration> {
    if (this.openIDConfiguration) {
      return Promise.resolve(this.openIDConfiguration);
    } else {
      return await this.fetch(this.openIDConfigurationURL)
        .then((response) => response.json())
        .then((openIDConfiguration) => {
          this.openIDConfiguration = openIDConfiguration;
          return openIDConfiguration;
        })
        .catch((error) => {
          if (error instanceof FetchError) {
            throw new UnreachableError(error);
          }

          throw error;
        });
    }
  }

  private async getJWKS(): Promise<JWKSDT> {
    return this.jwks ? this.jwks : this.fetchJWKS();
  }

  private async fetchJWKS(): Promise<JWKSDT> {
    const openIDConfiguration = await this.getOpenIDConfiguration();

    if (!openIDConfiguration.jwks_uri) {
      throw new MissingJWKSURIError("Missing JWKS URI for RS256 encoded JWT");
    }

    return await this.fetch(openIDConfiguration.jwks_uri)
      .then((response) => response.json())
      .then((jwks) => {
        this.jwks = jwks;
        return jwks;
      })
      .catch((error) => {
        if (error instanceof FetchError) {
          throw new UnreachableError(error);
        }

        throw error;
      });
  }

  private async getPublicKey(jwks: JWKSDT, kid: string): Promise<string> {
    let validKey = jwks.keys.find((keyObject) => keyObject.kid === kid);

    if (!validKey) {
      const updatedJwks = await this.fetchJWKS();
      validKey = updatedJwks.keys.find((keyObject) => keyObject.kid === kid);
    }

    if (validKey) {
      const { e, n } = validKey;
      const publicKey = rsaPublicKeyToPEM(n, e);
      return publicKey;
    } else {
      throw new InvalidKeyIDRS256Error(
        "Invalid key ID (kid) for RS256 encoded JWT",
      );
    }
  }

  private async verifyHS256<T = unknown>(
    accessToken: string,
    clientSecret: string,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      return jwt.verify(
        accessToken,
        clientSecret,
        {
          algorithms: ["HS256"],
        },
        (error: jwt.VerifyErrors | null, decoded: unknown) => {
          return error ? reject(error) : resolve(decoded as T);
        },
      );
    });
  }

  private async verifyRS256<T = unknown>(
    accessToken: string,
    publicKey: string,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      return jwt.verify(
        accessToken,
        publicKey,
        {
          algorithms: ["RS256"],
        },
        (error: jwt.VerifyErrors | null, decoded: unknown) => {
          return error ? reject(error) : resolve(decoded as T);
        },
      );
    });
  }

  async getAuthorizationURL(state?: string): Promise<URL> {
    const openIDConfiguration = await this.getOpenIDConfiguration();

    const { authorization_endpoint, scopes_supported } = openIDConfiguration;

    const areScopesSupported = this.scopes.every((scope) =>
      scopes_supported.includes(scope),
    );

    if (!areScopesSupported) {
      throw new ScopesNotSupportedError("Scopes are not supported");
    }

    const authorizeURL = new URL(authorization_endpoint);

    authorizeURL.searchParams.append("client_id", this.clientID);
    authorizeURL.searchParams.append("response_type", "code");
    authorizeURL.searchParams.append(
      "redirect_uri",
      decodeURIComponent(this.redirectURI),
    );
    authorizeURL.searchParams.append("scope", this.scopes.join(" "));

    if (state) {
      authorizeURL.searchParams.append("state", decodeURIComponent(state));
    }

    return authorizeURL;
  }

  async getTokensFromAuthorizationCode(
    authorizationCode: string,
  ): Promise<OAuth2Tokens> {
    const openIDConfiguration = await this.getOpenIDConfiguration();

    const callback = {
      client_id: this.clientID,
      client_secret: this.clientSecret,
      code: authorizationCode,
      grant_type: "authorization_code",
      redirect_uri: this.redirectURI,
    };

    const tokenEndpointResponse = await this.fetch(
      openIDConfiguration.token_endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(callback),
      },
    )
      .then((response) => response.json())
      .catch((error) => {
        if (error instanceof FetchError) {
          throw new UnreachableError(error);
        }

        throw error;
      });

    const { access_token, refresh_token, id_token } = tokenEndpointResponse;

    const tokens: OAuth2Tokens = { access_token, refresh_token };

    if (id_token) {
      tokens.id_token = id_token;
    }

    return tokens;
  }

  async verifyJWT<T = unknown>(accessToken: string, algo: string): Promise<T> {
    const [header, payload] = accessToken.split(".");

    const { alg, kid } = decodeJWTPart<{ alg: string; kid: string }>(header);
    const { aud } = decodeJWTPart<{ aud: string }>(payload);

    const jwks = kid && (await this.getJWKS());

    if (
      (typeof aud === "string" && aud !== this.audience) ||
      (Array.isArray(aud) && !aud.includes(this.audience))
    ) {
      throw new InvalidAudienceError("Invalid audience");
    }

    if (alg === "HS256" && algo === "HS256") {
      return this.verifyHS256(accessToken, this.clientSecret);
    } else if (alg === "RS256" && algo === "RS256") {
      if (kid) {
        const publicKey = await this.getPublicKey(jwks, kid);

        return await this.verifyRS256(accessToken, publicKey);
      } else {
        throw new MissingKeyIDHS256Error(
          "Missing key ID (kid) for RS256 encoded JWT",
        );
      }
    } else {
      throw new AlgoNotSupportedError("Encoding algo not supported");
    }
  }

  async decryptJWE<T = unknown>(
    JWE: string,
    privateKey: string,
    isSigned: boolean,
  ): Promise<T> {
    const formattedJosePrivateKey = await jose.JWK.asKey(privateKey, "pem");

    const decryptedJWEToken = await jose.JWE.createDecrypt(
      formattedJosePrivateKey,
    ).decrypt(JWE);

    const { payload } = decryptedJWEToken;

    if (isSigned) {
      return payload.toString() as unknown as T;
    } else {
      return JSON.parse(payload.toString()) as T;
    }
  }

  async refreshTokens(refresh_token: string): Promise<RefreshTokenResponse> {
    const openIDConfiguration = await this.getOpenIDConfiguration();

    const payload = {
      client_id: this.clientID,
      client_secret: this.clientSecret,
      refresh_token,
      grant_type: "refresh_token",
      scope: this.scopes.join(" "),
    };

    return this.fetch(openIDConfiguration.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(payload),
    })
      .then((response) => response.json())
      .catch((error) => {
        if (error instanceof FetchError) {
          throw new UnreachableError(error);
        }

        throw error;
      });
  }

  async getUserInfo<T = Record<string, unknown>>(
    accessToken: string,
  ): Promise<T> {
    const openIDConfiguration = await this.getOpenIDConfiguration();

    return await this.fetch(openIDConfiguration.userinfo_endpoint, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        if (error instanceof FetchError) {
          throw new UnreachableError(error);
        }

        throw error;
      });
  }
}

export default OAuth2Client;

export {
  OpenIDConfiguration,
  OAuth2ClientConstructor,
  decodeJWTPart,
  rsaPublicKeyToPEM,
  MissingJWKSURIError,
  InvalidKeyIDRS256Error,
  MissingKeyIDHS256Error,
  AlgoNotSupportedError,
  InvalidAudienceError,
  ScopesNotSupportedError,
  UnreachableError,
  OAuth2Tokens,
  JWTPayload,
  CustomPayload,
  generateJWE,
  generateHS256JWS,
  generateRS256JWS,
  defaultPayload,
  defaultAsymmetricAlgoKeyPair,
  defaultSecret,
  generateRSAKeyPair,
};
