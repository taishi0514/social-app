import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Flex,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import prisma from "@/lib/client";
import { auth0 } from "@/lib/auth0";

import { completeOnboarding } from "./action";

export const metadata: Metadata = {
  title: "アカウント登録",
};

const ONBOARDING_PATH = "/onboarding";

type SearchParams = {
  error?: string | string[];
  name?: string | string[];
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    redirect(`/login?returnTo=${encodeURIComponent(ONBOARDING_PATH)}`);
  }

  const existingUser = await prisma.user.findUnique({
    where: { auth0UserId: session.user.sub },
  });

  const defaultName =
    existingUser?.name ??
    getFirstParam(searchParams?.name) ??
    session.user.name ??
    session.user.email ??
    "";
  const errorMessage = getFirstParam(searchParams?.error);
  const hasProfile = Boolean(existingUser?.name);
  const title = hasProfile ? "プロフィールを編集" : "プロフィールを作成";
  const description = hasProfile
    ? "表示名を更新してプロフィールを整えましょう。"
    : "表示名を入力して会員登録を完了してください。";

  return (
    <Flex
      component="main"
      mih="100vh"
      bg="var(--mantine-color-gray-0)"
      justify="center"
      align="center"
      px="md"
      py="xl"
    >
      <Box w="100%" maw={640}>
        <Paper radius="xl" shadow="lg" withBorder p={{ base: "lg", md: "xl" }}>
          <Stack gap="lg">
            <Stack gap={4} ta="center">
              <Title order={1}>{title}</Title>
              <Text c="dimmed">{description}</Text>
            </Stack>

            {errorMessage ? (
              <Alert color="red" radius="lg" title="入力エラー">
                {errorMessage}
              </Alert>
            ) : null}

            <form action={completeOnboarding}>
              <Stack gap="md">
                <TextInput
                  label="ユーザー名"
                  name="name"
                  defaultValue={defaultName}
                  required
                  placeholder="例: 太郎"
                  radius="lg"
                  size="md"
                  autoComplete="name"
                />

                <Button type="submit" radius="xl" size="md" color="teal">
                  {hasProfile ? "プロフィールを更新" : "登録する"}
                </Button>
              </Stack>
            </form>

            <Button
              component={Link}
              href="/"
              variant="subtle"
              color="gray"
              radius="xl"
              size="sm"
            >
              ← トップへ戻る
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Flex>
  );
}

function getFirstParam(value?: string | string[]) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}
