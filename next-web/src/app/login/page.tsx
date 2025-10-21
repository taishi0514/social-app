import type { Metadata } from "next";
import Link from "next/link";
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

  const loginParams = new URLSearchParams({ returnTo: "/" }).toString();
  const signupParams = new URLSearchParams({
    returnTo: "/",
    screen_hint: "signup",
  }).toString();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <section className="flex w-full max-w-md flex-col gap-8 rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <header className="flex flex-col gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign in to Social App
          </h1>
          <p className="text-sm text-slate-500">
            Select an option below. We will redirect you through Auth0 so you
            can log in safely or create a new account.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          <a
            href={`/auth/login?${loginParams}`}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Log in
          </a>
          <a
            href={`/auth/login?${signupParams}`}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Create account
          </a>
        </div>

        <p className="text-xs text-center text-slate-400">
          Callback URL must be allowed in the Auth0 dashboard:
          <br />
          <span className="font-mono text-slate-500">/auth/callback</span>
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          ← Back to home
        </Link>
      </section>
    </main>
  );
}
