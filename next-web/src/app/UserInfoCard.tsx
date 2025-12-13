"use client";

import {
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Overlay,
  Stack,
  Text,
} from "@mantine/core";

import {
  METRIC_CONFIG,
  PRIVATE_METRICS,
  PUBLIC_METRICS,
  type MetricKey,
} from "@/constants/metrics";

export type UserInfoCardData = {
  publicId: string;
  info: {
    salary: number | null;
    walking: number | null;
    workOut: number | null;
    readingHabit: number | null;
    cigarettes: number | null;
    alcohol: number | null;
  } | null;
  results: Array<{
    metric: string;
    percentile: number;
  }>;
};

type UserInfoCardProps = {
  user: UserInfoCardData;
  isAuthenticated: boolean;
  index: number;
};

export function UserInfoCard({
  user,
  isAuthenticated,
  index,
}: UserInfoCardProps) {
  const info = user.info;
  const resultByMetric = new Map(
    user.results.map((r) => [r.metric as MetricKey, r.percentile]),
  );

  const formatValue = (key: MetricKey, value: number | null): string => {
    if (value === null) return "-";
    return value.toLocaleString();
  };

  // メトリクス行のレンダリング
  const renderMetricRow = (key: MetricKey, shouldMask: boolean = false) => {
    const config = METRIC_CONFIG[key];
    const value = info?.[key] ?? null;
    const percentile = resultByMetric.get(key);

    return (
      <Group key={key} justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          {config.label}
        </Text>
        <Box pos="relative">
          <Group gap="xs">
            <Text size="sm" fw={500}>
              {formatValue(key, value)} {config.unit}
            </Text>
            {percentile !== undefined && (
              <Badge size="xs" color="blue" variant="light">
                上位{percentile}%
              </Badge>
            )}
          </Group>
          {shouldMask && (
            <Overlay
              color="#fff"
              backgroundOpacity={0.75}
              blur={4}
              radius="sm"
            />
          )}
        </Box>
      </Group>
    );
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="sm">
        {/* ヘッダー */}
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            ユーザー #{index + 1}
          </Text>
        </Group>

        <Text fw={600} size="lg">
          ライフスタイル情報
        </Text>

        <Divider />

        {/* 公開メトリクス（認証不要） */}
        <Stack gap="xs">
          {PUBLIC_METRICS.map((key) => renderMetricRow(key))}
        </Stack>

        {/* 非公開メトリクス（認証が必要、マスク対象） */}
        <Stack gap="xs">
          {PRIVATE_METRICS.map((key) => renderMetricRow(key, !isAuthenticated))}
        </Stack>
      </Stack>
    </Card>
  );
}
