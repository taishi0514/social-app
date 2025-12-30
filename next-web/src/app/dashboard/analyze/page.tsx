import { redirect } from "next/navigation";

import prisma from "@/lib/client";
import { ensureOnboarded } from "@/lib/ensureOnboarded";
import {
  METRIC_CONFIG,
  type MetricConfig,
  type MetricKey,
} from "@/constants/metrics";

import { AnalysisPanel } from "../AnalysisPanel";
import type { MetricViewModel } from "../MetricDashboard";

const ANALYZE_PATH = "/dashboard/analyze";

export default async function AnalyzePage() {
  const session = await ensureOnboarded(ANALYZE_PATH);

  const user = await prisma.user.findUnique({
    where: { auth0UserId: session.user.sub },
    include: { info: true, results: true },
  });

  if (!user) {
    redirect("/onboarding");
  }

  const info = user.info;

  const infoMetrics: Record<MetricKey, number | null | undefined> = {
    salary: info?.salary,
    walking: info?.walking,
    workOut: info?.workOut,
    readingHabit: info?.readingHabit,
    cigarettes: info?.cigarettes,
    alcohol: info?.alcohol,
  };

  const userResultByKey = new Map(
    user.results?.map((result) => [result.metric as MetricKey, result]) ?? [],
  );

  const metrics: MetricViewModel[] = (
    Object.entries(METRIC_CONFIG) as Array<[MetricKey, MetricConfig]>
  )
    .map(([key, config]) => {
      const rawValue = infoMetrics[key];
      const result = userResultByKey.get(key);

      if (typeof rawValue !== "number" || !result) {
        return null;
      }
      return {
        key,
        label: config.label,
        value: rawValue,
        unit: config.unit,
        hint: config.hint,
        percentile: result.percentile,
      };
    })
    .filter((item): item is MetricViewModel => Boolean(item));

  const userName = user.name ?? session.user.name ?? "あなた";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--mantine-color-gray-0)",
        padding: "40px 16px 130px",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <AnalysisPanel metrics={metrics} userName={userName} />
      </div>
    </div>
  );
}
