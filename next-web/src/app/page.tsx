import Link from "next/link";

import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <section className="flex w-full max-w-xl flex-col gap-8 rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">

        {!user ? (
          <div className="flex flex-col items-center gap-6">
            <p className="text-sm text-slate-500 text-center">
              会員限定コンテンツ公開中。ログインまたは、会員登録して確認してみよう！
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
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
