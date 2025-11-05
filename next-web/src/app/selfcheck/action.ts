"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import prisma from "@/lib/client";
import { auth0 } from "@/lib/auth0";

import {
  resolveSelfCheckValues,
  selfCheckFormSchema,
  SelfCheckFormValues,
  getMetricLabel,
} from "./schema";

const SELF_CHECK_PATH = "/selfcheck";

function parseSelectedMetrics(value: FormDataEntryValue | undefined) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function ensureMetricProvided(
  metricKey: string,
  selectedMetrics: Set<string>,
  predicate: () => boolean,
  message: string,
  issues: string[],
) {
  if (!selectedMetrics.has(metricKey)) {
    return;
  }

  if (!predicate()) {
    issues.push(message);
  }
}

function hasActivityInput(
  custom?: number,
  preset?: SelfCheckFormValues["walkingPreset"],
) {
  return typeof custom === "number" || typeof preset === "string";
}

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
  const selectedMetrics = new Set(
    parseSelectedMetrics(rawEntries.selectedMetrics),
  );

  if (selectedMetrics.size === 0) {
    const params = new URLSearchParams({
      error: "分析したい指標を少なくとも1つ選択してください。",
    });
    redirect(`${SELF_CHECK_PATH}?${params.toString()}`);
  }

  const parseResult = selfCheckFormSchema.safeParse(rawEntries);

  if (!parseResult.success) {
    const message =
      parseResult.error.issues[0]?.message ?? "入力内容を確認してください。";
    const params = new URLSearchParams({ error: message });
    redirect(`${SELF_CHECK_PATH}?${params.toString()}`);
  }

  const formValues = parseResult.data;
  const issues: string[] = [];

  ensureMetricProvided(
    "salary",
    selectedMetrics,
    () => typeof formValues.salary === "number",
    "年収の値を入力してください。",
    issues,
  );

  ensureMetricProvided(
    "walking",
    selectedMetrics,
    () => hasActivityInput(formValues.walkingCustom, formValues.walkingPreset),
    `${getMetricLabel("walking")}の値を入力または選択してください。`,
    issues,
  );

  ensureMetricProvided(
    "workOut",
    selectedMetrics,
    () => hasActivityInput(formValues.workOutCustom, formValues.workOutPreset),
    `${getMetricLabel("workOut")}の値を入力または選択してください。`,
    issues,
  );

  ensureMetricProvided(
    "readingHabit",
    selectedMetrics,
    () =>
      hasActivityInput(
        formValues.readingHabitCustom,
        formValues.readingHabitPreset,
      ),
    `${getMetricLabel("readingHabit")}の値を入力または選択してください。`,
    issues,
  );

  ensureMetricProvided(
    "cigarettes",
    selectedMetrics,
    () =>
      typeof formValues.cigarettesPreset === "string" ||
      typeof formValues.cigarettesCustom === "number",
    `${getMetricLabel("cigarettes")}の値を入力または選択してください。`,
    issues,
  );

  ensureMetricProvided(
    "alcohol",
    selectedMetrics,
    () =>
      typeof formValues.alcoholPreset === "string" ||
      typeof formValues.alcoholCustom === "number",
    `${getMetricLabel("alcohol")}の値を入力または選択してください。`,
    issues,
  );

  if (issues.length > 0) {
    const params = new URLSearchParams({
      error: issues[0] ?? "入力内容を確認してください。",
    });
    redirect(`${SELF_CHECK_PATH}?${params.toString()}`);
  }

  const resolved = resolveSelfCheckValues(formValues);

  const updateData: Prisma.InfoUncheckedUpdateInput = {};
  const createData: Prisma.InfoUncheckedCreateInput = {
    userId: user.id,
  };

  if (resolved.salary !== undefined) {
    updateData.salary = resolved.salary;
    createData.salary = resolved.salary;
  }

  if (resolved.walking !== undefined) {
    updateData.walking = resolved.walking;
    createData.walking = resolved.walking;
  }

  if (resolved.workOut !== undefined) {
    updateData.workOut = resolved.workOut;
    createData.workOut = resolved.workOut;
  }

  if (resolved.readingHabit !== undefined) {
    updateData.readingHabit = resolved.readingHabit;
    createData.readingHabit = resolved.readingHabit;
  }

  if (resolved.cigarettes !== undefined) {
    updateData.cigarettes = resolved.cigarettes;
    createData.cigarettes = resolved.cigarettes;
  }

  if (resolved.alcohol !== undefined) {
    updateData.alcohol = resolved.alcohol;
    createData.alcohol = resolved.alcohol;
  }

  await prisma.info.upsert({
    where: { userId: user.id },
    update: updateData,
    create: createData,
  });

  revalidatePath(SELF_CHECK_PATH);
  redirect(`${SELF_CHECK_PATH}?status=success`);
}
