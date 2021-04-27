import crypto from "crypto";

import { defaultPayload, defaultSecret } from "../src/utils/defaultObjects";
import { generateJWE } from "../src/utils/generateJWE";

describe("generateJWE", () => {
  test("should generate a JWE from a HS256 JWS", async () => {
    expect.assertions(1);

    const { publicKey: publicKeyForEncryption } = crypto.generateKeyPairSync(
      "rsa",
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      },
    );

    const generatedJWE = await generateJWE(
      defaultPayload,
      publicKeyForEncryption,
      { secretKey: defaultSecret },
    );

    expect(generatedJWE.split(".").length).toEqual(5);
  });

  test("should generate a JWE from a RS256 JWS", async () => {
    expect.assertions(1);

    const { privateKey: privateKeyForSignature } = crypto.generateKeyPairSync(
      "rsa",
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      },
    );

    const { publicKey: publicKeyForEncryption } = crypto.generateKeyPairSync(
      "rsa",
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      },
    );

    const generatedJWE = await generateJWE(
      defaultPayload,
      publicKeyForEncryption,
      { privateKeyForSignature },
    );

    expect(generatedJWE.split(".").length).toEqual(5);
  });

  test("should generate a JWE from a JWT", async () => {
    expect.assertions(1);

    const { publicKey: publicKeyForEncryption } = crypto.generateKeyPairSync(
      "rsa",
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      },
    );

    const generatedJWE = await generateJWE(
      defaultPayload,
      publicKeyForEncryption,
    );

    expect(generatedJWE.split(".").length).toEqual(5);
  });
});
