import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import prisma from "@/lib/client";
import { auth0 } from "@/lib/auth0";

import { completeOnboarding } from "./action";

export const metadata: Metadata = {
  title: "アカウント登録",
};

const ONBOARDING_PATH = "/onboarding";

type SearchParams = {
  error?: string | string[];
  name?: string | string[];
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    redirect(`/login?returnTo=${encodeURIComponent(ONBOARDING_PATH)}`);
  }

  const existingUser = await prisma.user.findUnique({
    where: { auth0UserId: session.user.sub },
  });

  if (existingUser) {
    redirect("/");
  }

  const defaultName =
    getFirstParam(searchParams?.name) ??
    session.user.name ??
    session.user.email ??
    "";
  const errorMessage = getFirstParam(searchParams?.error);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <section className="flex w-full max-w-md flex-col gap-8 rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <header className="flex flex-col gap-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            プロフィールを作成
          </h1>
          <p className="text-sm text-slate-500">
            表示名を入力して会員登録を完了してください。
          </p>
        </header>

        <form action={completeOnboarding} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            ユーザー名
            <input
              type="text"
              name="name"
              defaultValue={defaultName}
              required
              placeholder="例: 太郎"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            登録する
          </button>
        </form>

        <Link
          href="/"
          className="inline-flex items-center justify-center text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          ← トップへ戻る
        </Link>
      </section>
    </main>
  );
}

function getFirstParam(value?: string | string[]) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}
