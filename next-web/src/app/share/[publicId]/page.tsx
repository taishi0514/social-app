import { notFound } from "next/navigation";

import prisma from "@/lib/client";

import {
  MetricDashboard,
  type MetricViewModel,
} from "@/app/dashboard/MetricDashboard";
import {
  METRIC_CONFIG,
  type MetricConfig,
  type MetricKey,
} from "@/constants/metrics";

type SharePageProps = {
  params: Promise<{ publicId: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { publicId } = await params;
  if (!publicId) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { publicId },
    include: { info: true, results: true },
  });

  if (!user) {
    notFound();
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

  const userName = user.name ?? user.email ?? "ユーザー";
  const sharePath = `/share/${user.publicId}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--mantine-color-gray-0)",
        padding: "40px 16px",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <MetricDashboard
          metrics={metrics}
          userName={userName}
          sharePath={sharePath}
          showShareButton={false}
        />
      </div>
    </div>
  );
}
