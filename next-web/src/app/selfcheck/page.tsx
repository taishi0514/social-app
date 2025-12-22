import type { Metadata } from "next";
import prisma from "@/lib/client";
import { ensureOnboarded } from "@/lib/ensureOnboarded";

import SelfCheckForm from "./SelfCheckForm";

export const metadata: Metadata = {
  title: "セルフチェック",
};

const SELF_CHECK_PATH = "/selfcheck";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SelfCheckPage({ searchParams }: PageProps) {
  const session = await ensureOnboarded(SELF_CHECK_PATH);

  const dbUser = await prisma.user.findUnique({
    where: { auth0UserId: session.user.sub },
    select: {
      name: true,
      info: {
        select: {
          salary: true,
          walking: true,
          workOut: true,
          readingHabit: true,
          cigarettes: true,
          alcohol: true,
        },
      },
    },
  });

  const awaitedParams = await searchParams;
  const errorMessage = getFirstParam(awaitedParams.error);
  const statusParam = getFirstParam(awaitedParams.status);
  const successMessage =
    statusParam === "success"
      ? "セルフチェックの内容を保存しました。"
      : undefined;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--mantine-color-gray-0)",
        padding: "40px 16px 80px",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <SelfCheckForm
          userName={dbUser?.name ?? undefined}
          errorMessage={errorMessage}
          successMessage={successMessage}
          initialValues={dbUser?.info ?? undefined}
        />
      </div>
    </div>
  );
}

function getFirstParam(value?: string | string[]) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}
