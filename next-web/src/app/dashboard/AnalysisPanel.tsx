"use client";

import { useCallback, useState } from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import type { MetricViewModel } from "./MetricDashboard";

type AnalysisPanelProps = {
  metrics: MetricViewModel[];
  userName: string;
};

export function AnalysisPanel({ metrics, userName }: AnalysisPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    setResultText("");

    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          typeof data?.message === "string"
            ? data.message
            : "分析に失敗しました。時間をおいて再度お試しください。",
        );
        return;
      }

      setResultText(typeof data?.text === "string" ? data.text : "");
    } catch (error) {
      console.error(error);
      setErrorMessage("ネットワークエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResultText("");
    setErrorMessage("");
  }, []);

  return (
    <Stack gap="xl">
      <Paper withBorder radius="xl" p="xl" shadow="md">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Stack gap={4}>
            <Title order={2} c="gray.8">
              AI分析
            </Title>
            <Text size="sm" c="dimmed">
              最新のセルフチェック結果をもとに、AIが端的にアドバイスをします。
            </Text>
          </Stack>
          <Group gap="xs" wrap="wrap">
            <Button
              color="dark"
              radius="xl"
              onClick={handleAnalyze}
              loading={isLoading}
            >
              AI分析を実行
            </Button>
            <Button
              variant="light"
              color="gray"
              radius="xl"
              onClick={handleReset}
              disabled={isLoading}
            >
              結果をリセット
            </Button>
          </Group>
        </Group>
      </Paper>

      <Paper withBorder radius="xl" p="lg" shadow="sm">
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            {userName} さんの最近の指標
          </Text>
          {metrics.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {metrics.map((metric) => (
                <Card
                  key={metric.key}
                  withBorder
                  radius="lg"
                  shadow="xs"
                  padding="md"
                >
                  <Stack gap={6}>
                    <Text size="sm" c="dimmed">
                      {metric.label}
                    </Text>
                    <Group gap={6} align="center">
                      <Text fw={600} size="lg">
                        {metric.value.toLocaleString()}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {metric.unit}
                      </Text>
                    </Group>
                    <Badge
                      color="teal"
                      variant="light"
                      size="sm"
                      w="fit-content"
                    >
                      上位 {metric.percentile} %
                    </Badge>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Text size="sm" c="dimmed">
              指標データがまだありません。
            </Text>
          )}
        </Stack>
      </Paper>

      <Paper withBorder radius="xl" p="lg" shadow="sm">
        <Stack gap="sm">
          <Text fw={600} c="grey">
            AI分析結果
          </Text>
          <Box
            style={{
              minHeight: 160,
              background: "var(--mantine-color-gray-0)",
              borderRadius: 12,
              padding: 16,
              border: "1px dashed var(--mantine-color-gray-3)",
            }}
          >
            {isLoading ? (
              <Group gap="xs">
                <Loader size="sm" color="dark" />
                <Text size="sm" c="dimmed">
                  分析中です...
                </Text>
              </Group>
            ) : errorMessage ? (
              <Text size="sm" c="red">
                {errorMessage}
              </Text>
            ) : resultText ? (
              <Text
                size="sm"
                c="black"
                fw={500}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {resultText}
              </Text>
            ) : (
              <Text size="sm" c="dimmed">
                分析結果はここに表示されます。
              </Text>
            )}
          </Box>
          <Text size="xs" c="dimmed">
            ※ 医療判断ではありません。生活改善のヒントとしてご活用ください。
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
}
