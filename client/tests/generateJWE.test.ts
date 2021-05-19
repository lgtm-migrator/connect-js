import { generateRSAKeyPair } from "../index";
import { defaultPayload, defaultSecret } from "../src/utils/defaultObjects";
import { generateJWE } from "../src/utils/generateJWE";

describe("generateJWE", () => {
  test("should generate a JWE from a HS256 JWS", async () => {
    expect.assertions(1);

    const { publicKey: publicKeyForEncryption } = generateRSAKeyPair();

    const generatedJWE = await generateJWE(
      defaultPayload,
      publicKeyForEncryption,
      { secretKey: defaultSecret },
    );

    expect(generatedJWE.split(".").length).toEqual(5);
  });

  test("should generate a JWE from a RS256 JWS", async () => {
    expect.assertions(1);

    const { privateKey: privateKeyForSignature } = generateRSAKeyPair();

    const { publicKey: publicKeyForEncryption } = generateRSAKeyPair();

    const generatedJWE = await generateJWE(
      defaultPayload,
      publicKeyForEncryption,
      { privateKeyForSignature },
    );

    expect(generatedJWE.split(".").length).toEqual(5);
  });

  test("should generate a JWE from a JWT", async () => {
    expect.assertions(1);

    const { publicKey: publicKeyForEncryption } = generateRSAKeyPair();

    const generatedJWE = await generateJWE(
      defaultPayload,
      publicKeyForEncryption,
    );

    expect(generatedJWE.split(".").length).toEqual(5);
  });
});
