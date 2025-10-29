"use server";

import { redirect } from "next/navigation";

import prisma from "@/lib/client";
import { auth0 } from "@/lib/auth0";

import { onboardingSchema } from "./schema";

const ONBOARDING_PATH = "/onboarding";

export async function completeOnboarding(formData: FormData) {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect(`/login?returnTo=${encodeURIComponent(ONBOARDING_PATH)}`);
  }

  const auth0UserId = session.user.sub;
  const email = session.user.email;

  if (!auth0UserId || !email) {
    const params = new URLSearchParams({
      error: "Auth0から取得したユーザー情報が不足しています。",
    });
    redirect(`${ONBOARDING_PATH}?${params.toString()}`);
  }

  const parseResult = onboardingSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parseResult.success) {
    const params = new URLSearchParams({
      error: parseResult.error.issues[0]?.message ?? "入力内容を確認してください。",
    });

    const nameValue = formData.get("name");
    if (typeof nameValue === "string") {
      params.set("name", nameValue);
    }

    redirect(`${ONBOARDING_PATH}?${params.toString()}`);
  }

  const ensuredAuth0UserId: string = auth0UserId;
  const ensuredEmail: string = email;
  const name = parseResult.data.name;

  await prisma.user.upsert({
    where: { auth0UserId: ensuredAuth0UserId },
    update: {
      name,
      email: ensuredEmail,
    },
    create: {
      auth0UserId: ensuredAuth0UserId,
      email: ensuredEmail,
      name,
    },
  });

  redirect("/");
}
