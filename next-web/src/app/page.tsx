import Link from "next/link";

import { auth0 } from "@/lib/auth0";

const appBaseUrl =
  process.env.APP_BASE_URL ?? process.env.AUTH0_BASE_URL ?? "http://localhost:3000";
const logoutReturnTo = encodeURIComponent(new URL("/", appBaseUrl).toString());

export default async function Home() {
  // Fetch the current Auth0 session; undefined when the user has not signed in.
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <section className="flex w-full max-w-xl flex-col gap-8 rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Social App</h1>
          <p className="text-sm text-slate-500">
            {user
              ? "You are signed in. Jump back into your feed or sign out below."
              : "Sign in with Auth0 to catch up with friends and share updates."}
          </p>
        </header>

        {!user ? (
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Log in or sign up
            </Link>
            <p className="text-xs text-slate-400">
              Choose “Log in” or “Create account” on the next screen. We redirect
              you through Auth0 for secure authentication.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-3">
              {user.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.picture}
                  alt={user.name ?? "Authenticated user"}
                  className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                />
              ) : null}
              <div className="text-center">
                <p className="text-sm font-semibold">
                  {user.name ?? user.email ?? "Authenticated user"}
                </p>
                {user.email ? (
                  <p className="text-xs text-slate-400">{user.email}</p>
                ) : null}
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                プロフィール登録へ
              </Link>
              <a
                href={`/auth/logout?returnTo=${logoutReturnTo}`}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Log out
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
