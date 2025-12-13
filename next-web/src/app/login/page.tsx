import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const session = await auth0.getSession();

  if (session) {
    redirect("/");
  }

  const loginParams = new URLSearchParams({
    returnTo: "/",
    ui_locales: "ja",
  }).toString();

  redirect(`/auth/login?${loginParams}`);
}
