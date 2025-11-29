import { env } from "@/config";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

const domain = env.AUTH0_DOMAIN;
const clientId = env.AUTH0_CLIENT_ID;
const clientSecret = env.AUTH0_CLIENT_SECRET;
const appBaseUrl = env.APP_BASE_URL;
const secret = env.AUTH0_SECRET;

if (!domain || !clientId || !clientSecret || !appBaseUrl || !secret) {
  throw new Error("Missing Auth0 environment variables");
}

export const auth0 = new Auth0Client({
  domain,
  clientId,
  clientSecret,
  appBaseUrl,
  secret,
});
