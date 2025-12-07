"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma, ResultMetric } from "@prisma/client";

import prisma from "@/lib/client";
import { auth0 } from "@/lib/auth0";

import { METRIC_CONFIG, type MetricKey } from "@/constants/metrics";

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

  const metricValues: Partial<Record<MetricKey, number | undefined>> = {
    salary,
    walking,
    workOut,
    readingHabit,
    cigarettes,
    alcohol,
  };

  const metricsToSave = (
    Object.entries(metricValues) as Array<[MetricKey, number | undefined]>
  ).filter(([, value]) => typeof value === "number" && Number.isFinite(value));

  const metricsForRecalc = Array.from(
    new Set(metricsToSave.map(([key]) => key)),
  );

  await prisma.$transaction(
    async (tx) => {
      await tx.info.upsert({
        where: { userId: user.id },
        update: updateData,
        create: createData,
      });

      if (metricsToSave.length > 0) {
        await Promise.all(
          metricsToSave.map(async ([key, value]) => {
            const metric = key as ResultMetric;
            await tx.result.upsert({
              where: { userId_metric: { userId: user.id, metric } },
              update: { score: value },
              create: {
                userId: user.id,
                metric,
                score: value!,
                percentile: 0,
              },
            });
          }),
        );

        await updatePercentilesForMetrics(tx, metricsForRecalc);
      }
    },
    {
      timeout: 10_000,
    },
  );

  revalidatePath(SELF_CHECK_PATH);
  redirect(`/waiting`);
}

// selfcheckで更新のあった指標だけpercentileを再計算して順位を最新に保つ
async function updatePercentilesForMetrics(
  tx: Prisma.TransactionClient,
  metrics: MetricKey[],
) {
  for (const metric of metrics) {
    const sortOrder = isBetterWhenLower(metric) ? "desc" : "asc";
    const results = await tx.result.findMany({
      where: { metric },
      orderBy: { score: sortOrder },
    });

    const total = results.length;
    if (total === 0) continue;

    // 同値は同じpercentileを付与する（midrank方式）
    let index = 0;
    while (index < results.length) {
      const start = index;
      const score = results[index].score;

      while (index < results.length && results[index].score === score) {
        index += 1;
      }

      const end = index;
      const midRank = (start + end) / 2;
      const percentile = clampPercentile(
        Math.floor(((midRank + 1) / total) * 100),
      );

      await Promise.all(
        results.slice(start, end).map((result) =>
          tx.result.update({
            where: { id: result.id },
            data: { percentile },
          }),
        ),
      );
    }
  }
}

// percentileの値を1〜99に収める処理
function clampPercentile(value: number): number {
  return Math.min(99, Math.max(1, value));
}

// 喫煙・飲酒の数字が少ないほど上位判定になる処理
function isBetterWhenLower(metric: string) {
  const config = METRIC_CONFIG[metric as MetricKey];
  return config?.betterWhenHigher === false;
}
