"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Flex,
  NumberInput,
  Paper,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import {
  AlcoholFreqLabels,
  AlcoholScoreMap,
  activityPresets,
  activityScoreMap,
  alcoholValues,
  metricOptions,
  smokingValues,
  SmokingLabels,
  SmokingScoreMap,
} from "./constants";
import { submitSelfCheck } from "./action";

type Props = {
  userName?: string;
  errorMessage?: string;
  successMessage?: string;
};

const defaultSelectedMetrics = ["walking", "workOut", "readingHabit"] as const;

export default function SelfCheckForm({
  userName,
  errorMessage,
  successMessage,
}: Props) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    [...defaultSelectedMetrics],
  );

  return (
    <Box
      component="section"
      bg="var(--mantine-color-gray-0)"
      py="xl"
      px={{ base: "md", md: "xl" }}
      mih="100vh"
    >
      <Flex justify="center" align="center" w="100%">
        <form action={submitSelfCheck} style={{ width: "100%", maxWidth: "720px" }}>
          <Paper
            radius="xl"
            shadow="md"
            withBorder
            p={{ base: "lg", md: "xl" }}
            w="100%"
            c="gray"
          >
            <Stack gap="lg">
              {errorMessage ? (
                <Alert color="red" title="入力内容を確認してください">
                  {errorMessage}
                </Alert>
              ) : null}
              {successMessage ? (
                <Alert color="teal" title="保存しました">
                  {successMessage}
                </Alert>
              ) : null}

              <input
                type="hidden"
                name="selectedMetrics"
                value={selectedMetrics.join(",")}
              />

              <Stack gap="xs">
                <Title order={2} ta="center" c="gray">
                  セルフチェック
                </Title>
                <Text ta="center" c="dimmed">
                  {userName ? `${userName} さん` : "ログイン中のユーザー"}の知りたいライフスタイルや習慣を選択しましょう。
                </Text>
              </Stack>

              <Stack gap="xs">
                <Text fw={600} c="gray">
                  分析したい指標を選択
                </Text>
                <Checkbox.Group
                  value={selectedMetrics}
                  onChange={setSelectedMetrics}
                >
                  <Stack gap="xs">
                    {metricOptions.map((option) => (
                      <Paper
                        key={option.value}
                        withBorder
                        radius="lg"
                        p="md"
                        shadow={
                          selectedMetrics.includes(option.value) ? "sm" : "xs"
                        }
                      >
                        <Checkbox
                          value={option.value}
                          label={option.label}
                          description={option.description}
                        />
                      </Paper>
                    ))}
                  </Stack>
                </Checkbox.Group>
              </Stack>

              <Stack gap="xl">
                {selectedMetrics.includes("salary") ? (
                  <Paper withBorder radius="lg" p="lg">
                    <Stack gap="md">
                      <Title order={3} size="h4" c="gray">
                        年収
                      </Title>
                      <Text size="sm" c="dimmed">
                        おおよその年収を入力してください（単位: 万円）。
                      </Text>
                      <NumberInput
                        name="salary"
                        label="年収"
                        suffix=" 万円"
                        min={0}
                        clampBehavior="strict"
                        placeholder="例: 400"
                      />
                    </Stack>
                  </Paper>
                ) : null}

                {renderActivitySection({
                  metricKey: "walking",
                  metricLabel: "1日の歩数",
                  unitHint: "歩/日",
                  selectedMetrics,
                })}

                {renderActivitySection({
                  metricKey: "workOut",
                  metricLabel: "週あたりの運動回数",
                  unitHint: "回/週",
                  selectedMetrics,
                })}

                {renderActivitySection({
                  metricKey: "readingHabit",
                  metricLabel: "月あたりの読書冊数",
                  unitHint: "冊/月",
                  selectedMetrics,
                })}

                {selectedMetrics.includes("cigarettes") ? (
                  <Paper withBorder radius="lg" p="lg">
                    <Stack gap="md">
                      <Title order={3} size="h4" c="gray">
                        喫煙頻度
                      </Title>
                      <Text size="sm" c="dimmed">
                        現在の喫煙状況に近いものを選び、必要であれば任意の数値を入力してください。
                      </Text>
                      <Radio.Group name="cigarettesPreset">
                        <Stack gap="sm">
                          {smokingValues.map((value) => (
                            <Radio
                              key={value}
                              value={value}
                              label={`${SmokingLabels[value]}（スコア: ${SmokingScoreMap[value]}）`}
                            />
                          ))}
                        </Stack>
                      </Radio.Group>
                      <NumberInput
                        name="cigarettesCustom"
                        label="1日あたりのおおよその本数（任意）"
                        placeholder="例: 5"
                        min={0}
                        clampBehavior="strict"
                      />
                    </Stack>
                  </Paper>
                ) : null}

                {selectedMetrics.includes("alcohol") ? (
                  <Paper withBorder radius="lg" p="lg">
                    <Stack gap="md">
                      <Title order={3} size="h4" c="gray">
                        飲酒頻度
                      </Title>
                      <Text size="sm" c="dimmed">
                        最も近い頻度を選択し、必要に応じて1週間あたりの杯数などを入力できます。
                      </Text>
                      <Radio.Group name="alcoholPreset">
                        <Stack gap="sm">
                          {alcoholValues.map((value) => (
                            <Radio
                              key={value}
                              value={value}
                              label={`${AlcoholFreqLabels[value]}（スコア: ${AlcoholScoreMap[value]}）`}
                            />
                          ))}
                        </Stack>
                      </Radio.Group>
                      <NumberInput
                        name="alcoholCustom"
                        label="1週間あたりのおおよその杯数（任意）"
                        placeholder="例: 6"
                        min={0}
                        clampBehavior="strict"
                      />
                    </Stack>
                  </Paper>
                ) : null}
              </Stack>

              <Button type="submit" radius="xl" size="md" color="teal" variant="light">
                スコア算出
              </Button>
            </Stack>
          </Paper>
        </form>
      </Flex>
    </Box>
  );
}

type ActivitySectionProps = {
  metricKey: "walking" | "workOut" | "readingHabit";
  metricLabel: string;
  unitHint: string;
  selectedMetrics: string[];
};

function renderActivitySection({
  metricKey,
  metricLabel,
  unitHint,
  selectedMetrics,
}: ActivitySectionProps) {
  if (!selectedMetrics.includes(metricKey)) {
    return null;
  }

  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="md">
        <Title order={3} size="h4" c="gray">
          {metricLabel}
        </Title>
        <Text size="sm" c="dimmed">
          代表的な頻度から選ぶか、任意の数値（{unitHint}）を入力してください。
        </Text>
        <Radio.Group name={`${metricKey}Preset`}>
          <Stack gap="sm">
            {activityPresets.map((preset) => (
              <Radio
                key={preset.value}
                value={preset.value}
                label={`${preset.label}（スコア: ${activityScoreMap[preset.value]}）`}
              />
            ))}
          </Stack>
        </Radio.Group>
        <NumberInput
          name={`${metricKey}Custom`}
          label={`任意の数値（${unitHint}）`}
          placeholder="例: 3"
          min={0}
          clampBehavior="strict"
        />
        <Text size="xs" c="dimmed">
          選択肢を選ぶと上記のスコアが使われます。任意の数値を入力した場合は、そちらが優先されます。
        </Text>
      </Stack>
    </Paper>
  );
}
