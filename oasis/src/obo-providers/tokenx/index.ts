import { Client, GrantBody } from "openid-client";
import { tokenExchange } from "../tokenExchange";
import { getAdditionalClaims, getClient } from "./client";
import { OboProvider } from "../..";

function getGrantBody(subject_token: string, audience: string): GrantBody {
  return {
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    audience,
    subject_token,
  };
}

let _cached: Client;

function cachedClient() {
  if (!_cached) {
    _cached = getClient();
  }
  return _cached;
}

const tokenX: OboProvider = async (token, audience) =>
  tokenExchange(
    cachedClient(),
    getGrantBody(token, audience),
    getAdditionalClaims(),
  );

export default tokenX;
