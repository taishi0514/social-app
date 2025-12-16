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
    birthYear: formData.get("birthYear"),
    birthMonth: formData.get("birthMonth"),
    birthDay: formData.get("birthDay"),
    gender: formData.get("gender"),
  });

  if (!parseResult.success) {
    const params = new URLSearchParams({
      error:
        parseResult.error.issues[0]?.message ?? "入力内容を確認してください。",
    });

    const nameValue = formData.get("name");
    if (typeof nameValue === "string") {
      params.set("name", nameValue);
    }
    const birthYearValue = formData.get("birthYear");
    const birthMonthValue = formData.get("birthMonth");
    const birthDayValue = formData.get("birthDay");
    const genderValue = formData.get("gender");
    if (typeof birthYearValue === "string")
      params.set("birthYear", birthYearValue);
    if (typeof birthMonthValue === "string")
      params.set("birthMonth", birthMonthValue);
    if (typeof birthDayValue === "string")
      params.set("birthDay", birthDayValue);
    if (typeof genderValue === "string") params.set("gender", genderValue);

    redirect(`${ONBOARDING_PATH}?${params.toString()}`);
  }

  const ensuredAuth0UserId: string = auth0UserId;
  const ensuredEmail: string = email;
  const { name, birthYear, birthMonth, birthDay, gender } = parseResult.data;

  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

  await prisma.user.upsert({
    where: { auth0UserId: ensuredAuth0UserId },
    update: {
      name,
      email: ensuredEmail,
      birthDate,
      gender: gender ?? undefined,
    },
    create: {
      auth0UserId: ensuredAuth0UserId,
      email: ensuredEmail,
      name,
      birthDate,
      gender: gender ?? "unspecified",
    },
  });

  redirect("/");
}
