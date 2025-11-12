"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import prisma from "@/lib/client";
import { auth0 } from "@/lib/auth0";

import { selfCheckFormSchema } from "./schema";

const SELF_CHECK_PATH = "/selfcheck";

export async function submitSelfCheck(formData: FormData) {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    redirect(`/login?returnTo=${encodeURIComponent(SELF_CHECK_PATH)}`);
  }

  const auth0UserId = session.user.sub;

  const user = await prisma.user.findUnique({
    where: { auth0UserId },
    select: { id: true },
  });

  if (!user) {
    redirect("/onboarding");
  }

  const rawEntries = Object.fromEntries(formData.entries());
  const parseResult = selfCheckFormSchema.safeParse(rawEntries);

  if (!parseResult.success) {
    const message =
      parseResult.error.issues[0]?.message ?? "入力内容を確認してください。";
    const params = new URLSearchParams({ error: message });
    redirect(`${SELF_CHECK_PATH}?${params.toString()}`);
  }

  const { salary, walking, workOut, readingHabit, cigarettes, alcohol } =
    parseResult.data;

  const updateData: Prisma.InfoUncheckedUpdateInput = {};
  const createData: Prisma.InfoUncheckedCreateInput = {
    userId: user.id,
  };

  if (salary !== undefined) {
    updateData.salary = salary;
    createData.salary = salary;
  }

  if (walking !== undefined) {
    updateData.walking = walking;
    createData.walking = walking;
  }

  if (workOut !== undefined) {
    updateData.workOut = workOut;
    createData.workOut = workOut;
  }

  if (readingHabit !== undefined) {
    updateData.readingHabit = readingHabit;
    createData.readingHabit = readingHabit;
  }

  if (cigarettes !== undefined) {
    updateData.cigarettes = cigarettes;
    createData.cigarettes = cigarettes;
  }

  if (alcohol !== undefined) {
    updateData.alcohol = alcohol;
    createData.alcohol = alcohol;
  }

  await prisma.info.upsert({
    where: { userId: user.id },
    update: updateData,
    create: createData,
  });

  revalidatePath(SELF_CHECK_PATH);
  redirect(`${SELF_CHECK_PATH}?status=success`);
}
