import { redirect } from "next/navigation";

import prisma from "@/lib/client";
import { auth0 } from "@/lib/auth0";

// プロフィール未登録のユーザーをガードしてオンボーディングへ誘導する共通ヘルパー
export async function ensureOnboarded(returnTo: string) {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  const profile = await prisma.user.findUnique({
    where: { auth0UserId: session.user.sub },
    select: { name: true },
  });

  if (!profile?.name) {
    redirect(
      `/onboarding?error=${encodeURIComponent("プロフィールを先に登録してください")}&returnTo=${encodeURIComponent(returnTo)}`,
    );
  }

  return session;
}
