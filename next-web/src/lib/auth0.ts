import { Auth0Client } from "@auth0/nextjs-auth0/server";

const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;
const appBaseUrl = process.env.APP_BASE_URL ?? process.env.AUTH0_BASE_URL;
const secret = process.env.AUTH0_SECRET;

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
