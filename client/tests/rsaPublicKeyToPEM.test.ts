import { rsaPublicKeyToPEM } from "../src/utils/rsaPublicKeyToPEM";

describe("rsaPublicKeyToPEM", () => {
  test("it should create valid rsa public key modulus and exponent", () => {
    const validKey = {
      e: "AQAB",
      kty: "RSA",
      kid: "d6512f53-9774-4a58-830c-981886c8bb43",
      n: "y3M7JqY49JeL/ornP7ZY2QlO76akS36Rj1iKVSIlFH754NnqmtGwMrCVZzCWrc882trbGuDhml2psOmCIBjKBpnghNLBZALGNRelCqfV7Cy+EMrQvQ+UWbogT7xfPoL+VYjCZKTeXosfzMNMZFum/Vnk/vYBKilXZfQH1t4sohU=",
      alg: "RS256",
    };

    const { e, n } = validKey;
    const publicKey = rsaPublicKeyToPEM(n, e);

    expect(publicKey).toMatch(process.env.PEM_RSA_PUBLIC_KEY);
  });
});
