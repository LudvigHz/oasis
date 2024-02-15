import { JWTVerifyResult, jwtVerify } from "jose";
import { SupportedRequestType, Token } from "../index";
import { cachedRemoteJWKSet } from "../utils/cachedRemoteJWKSet";
import { getTokenFromHeader } from "../utils/getTokenFromHeader";

const idportenJWKSet = () =>
  cachedRemoteJWKSet(process.env.IDPORTEN_JWKS_URI as string);

async function verify(token: string): Promise<JWTVerifyResult> {
  return jwtVerify(token, idportenJWKSet(), {
    issuer: process.env.IDPORTEN_ISSUER,
    audience: process.env.IDPORTEN_AUDIENCE,
  });
}

export default async function idporten(token: string): Promise<Token | null>;

export default async function idporten(
  req: SupportedRequestType,
): Promise<Token | null>;

export default async function idporten(
  reqOrToken: SupportedRequestType | string,
): Promise<Token | null> {
  const token =
    typeof reqOrToken === "string"
      ? reqOrToken
      : getTokenFromHeader(reqOrToken.headers);

  if (!token) return null;
  await verify(token);
  return token;
}
