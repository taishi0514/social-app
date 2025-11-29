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

  const defaultName = existingUser?.name ?? getFirstParam(searchParams?.name) ?? "";
  const errorMessage = getFirstParam(searchParams?.error);
  const hasProfile = Boolean(existingUser?.name);
  const title = hasProfile ? "プロフィールを編集" : "プロフィールを作成";
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
          <Stack gap="lg" align="center">
            <Stack gap={4} ta="center">
              <Title order={2} c="gray.7">
                {title}
              </Title>
            </Stack>

            {errorMessage ? (
              <Alert color="red" radius="lg" title="入力エラー">
                {errorMessage}
              </Alert>
            ) : null}

            <form action={completeOnboarding}>
              <Stack gap="md" align="center">
                <TextInput
                  label="ユーザー名"
                  name="name"
                  defaultValue={defaultName}
                  required
                  placeholder="例: 太郎"
                  radius="lg"
                  size="md"
                  w={380}
                  c="gray"
                  autoComplete="name"
                />

                <Button
                  type="submit"
                  radius="xl"
                  size="md"
                  color="teal"
                  maw={360}
                >
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
              styles={{ root: { "&:hover": { backgroundColor: "transparent" } } }}
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
