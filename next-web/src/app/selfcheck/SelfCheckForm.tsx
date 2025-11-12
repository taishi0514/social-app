"use client";

import {
  Alert,
  Box,
  Button,
  Flex,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { submitSelfCheck } from "./action";

type Props = {
  userName?: string;
  errorMessage?: string;
  successMessage?: string;
};

type NumericFieldName =
  | "salary"
  | "walking"
  | "workOut"
  | "readingHabit"
  | "cigarettes"
  | "alcohol";

type NumericFieldConfig = {
  name: NumericFieldName;
  title: string;
  description: string;
  placeholder: string;
  suffix?: string;
};

const numericFields: NumericFieldConfig[] = [
  {
    name: "salary",
    title: "年収",
    description: "おおよその年収を入力してください（単位: 万円）。",
    placeholder: "例: 400",
    suffix: " 万円",
  },
  {
    name: "walking",
    title: "1日の歩数",
    description: "1日あたりの平均歩数を入力してください。",
    placeholder: "例: 8000",
    suffix: " 歩",
  },
  {
    name: "workOut",
    title: "週あたりの運動回数",
    description: "週に行う運動（ジムやスポーツなど）の回数を入力してください。",
    placeholder: "例: 3",
    suffix: " 回",
  },
  {
    name: "readingHabit",
    title: "月あたりの読書冊数",
    description: "1か月で読むおおよその冊数を入力してください。",
    placeholder: "例: 2",
    suffix: " 冊",
  },
  {
    name: "cigarettes",
    title: "1日あたりの喫煙本数",
    description: "喫煙している場合は1日平均の本数を入力してください。",
    placeholder: "例: 5",
    suffix: " 本",
  },
  {
    name: "alcohol",
    title: "1週間あたりの飲酒杯数",
    description: "飲酒する場合は1週間で飲む杯数を入力してください。",
    placeholder: "例: 6",
    suffix: " 杯",
  },
];

export default function SelfCheckForm({
  userName,
  errorMessage,
  successMessage,
}: Props) {
  return (
    <Box
      component="section"
      bg="var(--mantine-color-gray-0)"
      py="xl"
      px={{ base: "md", md: "xl" }}
      mih="100vh"
    >
      <Flex justify="center" align="center" w="100%">
        <form
          action={submitSelfCheck}
          style={{ width: "100%", maxWidth: "720px" }}
        >
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

              <Stack gap="xs">
                <Title order={2} ta="center" c="gray">
                  セルフチェック
                </Title>
                <Text ta="center" c="dimmed">
                  {userName ? `${userName} さん` : "ログイン中のユーザー"}
                  のライフスタイル情報を入力しましょう。
                </Text>
              </Stack>

              <Stack gap="xl">
                {numericFields.map((field) => (
                  <NumericField key={field.name} {...field} />
                ))}
              </Stack>

              <Button
                type="submit"
                radius="xl"
                size="md"
                color="teal"
                variant="light"
              >
                スコア算出
              </Button>
            </Stack>
          </Paper>
        </form>
      </Flex>
    </Box>
  );
}

function NumericField({
  name,
  title,
  description,
  placeholder,
  suffix,
}: NumericFieldConfig) {
  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="md">
        <Title order={3} size="h4" c="gray">
          {title}
        </Title>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
        <NumberInput
          name={name}
          label={title}
          placeholder={placeholder}
          suffix={suffix}
          min={0}
          clampBehavior="strict"
        />
      </Stack>
    </Paper>
  );
}
