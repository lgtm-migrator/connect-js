import { generateRSAKeyPair } from "../src/utils/generateRSAKeyPair";

describe("generateRSAKeyPair", () => {
  test("should return both public and private in PEM format", () => {
    expect.assertions(4);

    const { publicKey, privateKey } = generateRSAKeyPair();

    expect(publicKey.search("-----BEGIN PUBLIC KEY-----")).not.toBe(-1);
    expect(publicKey.search("-----END PUBLIC KEY-----")).not.toBe(-1);
    expect(privateKey.search("-----BEGIN PRIVATE KEY-----")).not.toBe(-1);
    expect(privateKey.search("-----BEGIN PRIVATE KEY-----")).not.toBe(-1);
  });
});
