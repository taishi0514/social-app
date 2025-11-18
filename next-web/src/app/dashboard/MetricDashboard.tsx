"use client";

import { useState } from "react";
import type { MetricKey } from "@/constants/metrics";

import {
  Badge,
  Button,
  Card,
  Group,
  Paper,
  Progress,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export type MetricViewModel = {
  key: MetricKey;
  label: string;
  value: number;
  unit: string;
  percentile: number;
  hint: string;
};

type Props = {
  metrics: MetricViewModel[];
  userName: string;
};

export function MetricDashboard({ metrics, userName }: Props) {
  const [activeKey, setActiveKey] = useState(metrics[0]?.key ?? "");
  const activeMetric = metrics.find((metric) => metric.key === activeKey);

  return (
    <Stack gap="xl">
      <Paper radius="xl" shadow="md" withBorder p="xl">
        <Stack gap="xs">
          <Title order={2} c="gray.8">
            {userName} さんのダッシュボード
          </Title>
          <Text c="dimmed" size="sm">
            直近のセルフチェック結果をもとに、各指標がコミュニティ内でどの位置にいるかを表示しています。
          </Text>
        </Stack>
      </Paper>

      {metrics.length > 0 ? (
        <Stack gap="lg">
          <Group gap="sm" wrap="wrap">
            {metrics.map((metric) => (
              <Button
                key={metric.key}
                variant={metric.key === activeKey ? "filled" : "light"}
                color="teal"
                radius="xl"
                onClick={() => setActiveKey(metric.key)}
              >
                {metric.label}
              </Button>
            ))}
          </Group>

          {activeMetric ? (
            <Paper radius="xl" shadow="lg" withBorder p="xl">
              <Group justify="space-between" align="center" wrap="wrap" gap="xl">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    現在値
                  </Text>
                  <Group gap={4}>
                    <Text fw={600} size="xl" c="dimmed">
                      {activeMetric.value.toLocaleString()}
                    </Text>
                    <Text c="dimmed">{activeMetric.unit}</Text>
                  </Group>
                  <Badge color="teal" variant="light" size="lg">
                    上位 {activeMetric.percentile} %
                  </Badge>
                  <Text size="sm" c="dimmed">
                    {activeMetric.hint}
                  </Text>
                </Stack>

                <RingProgress
                  size={220}
                  thickness={22}
                  label={
                    <Stack gap={0} align="center">
                      <Text size="md" c="dimmed">
                        上位
                      </Text>
                      <Text fw={700} size="xl" c="dimmed">
                        {activeMetric.percentile}%
                      </Text>
                    </Stack>
                  }
                  sections={[
                    { value: activeMetric.percentile, color: "teal" },
                    { value: 100 - activeMetric.percentile, color: "gray.2" },
                  ]}
                />
              </Group>
            </Paper>
          ) : null}

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {metrics.map((metric) => (
              <Card key={metric.key} withBorder radius="lg" shadow="xs" p="lg">
                <Stack gap="sm">
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2}>
                      <Text size="sm" c="dimmed">
                        {metric.label}
                      </Text>
                      <Group gap={4}>
                        <Text fw={600} size="lg">
                          {metric.value.toLocaleString()}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {metric.unit}
                        </Text>
                      </Group>
                    </Stack>
                    <Badge color="teal" variant="outline">
                      {metric.percentile}%
                    </Badge>
                  </Group>
                  <Progress value={metric.percentile} color="teal" size="lg" radius="xl" animated />
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      ) : (
        <Paper radius="xl" withBorder p="xl" ta="center">
          <Stack gap="xs">
            <Text fw={600}>まだセルフチェックのデータがありません。</Text>
            <Text c="dimmed" size="sm">
              まずはセルフチェックを実施して、結果を保存しましょう。
            </Text>
            <Button component="a" href="/selfcheck" radius="xl" color="teal" variant="light">
              セルフチェックへ
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
