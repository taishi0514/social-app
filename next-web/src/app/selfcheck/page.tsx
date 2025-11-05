import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";

import SelfCheckForm from "./SelfCheckForm";

export const metadata: Metadata = {
  title: "セルフチェック",
};

const SELF_CHECK_PATH = "/selfcheck";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SelfCheckPage({ searchParams }: PageProps) {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect(`/login?returnTo=${encodeURIComponent(SELF_CHECK_PATH)}`);
  }

  const awaitedParams = await searchParams;
  const errorMessage = getFirstParam(awaitedParams.error);
  const statusParam = getFirstParam(awaitedParams.status);
  const successMessage =
    statusParam === "success" ? "セルフチェックの内容を保存しました。" : undefined;

  return (
    <SelfCheckForm
      userName={session.user.name ?? session.user.email ?? undefined}
      errorMessage={errorMessage}
      successMessage={successMessage}
    />
  );
}

function getFirstParam(value?: string | string[]) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}
