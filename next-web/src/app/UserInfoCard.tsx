"use client";

import Link from "next/link";

import {
  Anchor,
  Badge,
  Box,
  Button,
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
  const renderMetricRow = (key: MetricKey) => {
    const config = METRIC_CONFIG[key];
    const value = info?.[key] ?? null;
    const percentile = resultByMetric.get(key);

    return (
      <Group key={key} justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          {config.label}
        </Text>
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
          <Badge color="teal" variant="light" size="sm">
            公開中
          </Badge>
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
        <Box pos="relative">
          <Stack gap="xs">
            {PRIVATE_METRICS.map((key) => renderMetricRow(key))}
          </Stack>

          {/* 未認証時のオーバーレイ */}
          {!isAuthenticated && (
            <>
              <Overlay
                color="#fff"
                backgroundOpacity={0.6}
                blur={3}
                radius="sm"
              />
              <Box
                pos="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 201,
                }}
              >
                <Stack gap={4} align="center">
                  <Text size="xs" c="dark" fw={500} ta="center">
                    コンテンツを閲覧するには
                  </Text>
                  <Group gap="xs">
                    <Button
                      component="a"
                      href="/auth/login?screen_hint=signup"
                      size="xs"
                      radius="xl"
                      color="blue"
                    >
                      無料ユーザー登録
                    </Button>
                    <Button
                      component="a"
                      href="/auth/login"
                      size="xs"
                      radius="xl"
                      variant="outline"
                      color="blue"
                    >
                      ログイン
                    </Button>
                  </Group>
                </Stack>
              </Box>
            </>
          )}
        </Box>

        <Divider />

        {/* 詳細リンク */}
        <Box ta="right">
          <Anchor
            component={Link}
            href={`/share/${user.publicId}`}
            size="sm"
            fw={500}
            c="blue"
          >
            詳しいデータを見る →
          </Anchor>
        </Box>
      </Stack>
    </Card>
  );
}
