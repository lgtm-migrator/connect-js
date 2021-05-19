import { decodeJWTPart } from "../src/utils/decodeJWTPart";
import { defaultPayload } from "../src/utils/defaultObjects";
import { generateHS256JWS, generateRS256JWS } from "../src/utils/generateJWS";
import { generateRSAKeyPair } from "../src/utils/generateRSAKeyPair";

describe("generateJWS", () => {
  const exp = Date.now() - 3600;

  const customPayload = {
    exp,
    scope: "profile",
  };

  describe("HS256", () => {
    test("should generate an HS256 signed JWS if no arguments are provided", () => {
      expect.assertions(3);

      const HS256JWS = generateHS256JWS();
      expect(HS256JWS.split(".").length).toEqual(3);

      const [JWA, payload] = HS256JWS.split(".");

      const decodedPayload = decodeJWTPart(payload);
      expect(decodedPayload).toEqual(expect.objectContaining(defaultPayload));

      const decodedJWA = decodeJWTPart(JWA);
      expect(decodedJWA).toEqual(
        expect.objectContaining({ alg: "HS256", typ: "JWT" }),
      );
    });

    test("should generate an HS256 signed JWS when passing a custom payload and custom secret", () => {
      expect.assertions(2);

      const customSecret = "1e5e7658-49de-4581-b8ee-fa14202d0e2a";

      const HS256JWS = generateHS256JWS(
        { ...defaultPayload, ...customPayload },
        customSecret,
      );

      const [JWA, payload] = HS256JWS.split(".");

      const decodedPayload = decodeJWTPart(payload);
      expect(decodedPayload).toEqual(
        expect.objectContaining({ ...defaultPayload, ...customPayload }),
      );

      const decodedJWA = decodeJWTPart(JWA);
      expect(decodedJWA).toEqual(
        expect.objectContaining({ alg: "HS256", typ: "JWT" }),
      );
    });
  });

  describe("generateRS256JWS", () => {
    test("should generate an RS256 signed JWS if no arguments are provided", () => {
      expect.assertions(3);

      const RS256JWS = generateRS256JWS();
      expect(RS256JWS.split(".").length).toEqual(3);

      const [JWA, payload] = RS256JWS.split(".");

      const decodedPayload = decodeJWTPart(payload);
      expect(decodedPayload).toEqual(expect.objectContaining(defaultPayload));

      const decodedJWA = decodeJWTPart(JWA);
      expect(decodedJWA).toEqual(
        expect.objectContaining({ alg: "RS256", typ: "JWT" }),
      );
    });

    test("should generate a RS256 signed JWS when passing a custom payload and custom privateKey", () => {
      expect.assertions(2);

      const { privateKey } = generateRSAKeyPair();

      const RS256JWS = generateRS256JWS(
        { ...defaultPayload, ...customPayload },
        privateKey,
      );

      const [JWA, payload] = RS256JWS.split(".");

      const decodedPayload = decodeJWTPart(payload);
      expect(decodedPayload).toEqual(
        expect.objectContaining({ ...defaultPayload, ...customPayload }),
      );

      const decodedJWA = decodeJWTPart(JWA);
      expect(decodedJWA).toEqual(
        expect.objectContaining({ alg: "RS256", typ: "JWT" }),
      );
    });
  });
});
