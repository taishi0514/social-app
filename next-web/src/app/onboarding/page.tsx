import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Alert, Button, Flex, Stack, Title } from "@mantine/core";

import prisma from "@/lib/client";
import { auth0 } from "@/lib/auth0";

import { completeOnboarding } from "./action";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = {
  title: "アカウント登録",
};

const ONBOARDING_PATH = "/onboarding";

type SearchParams = {
  error?: string | string[];
  name?: string | string[];
  birthYear?: string | string[];
  birthMonth?: string | string[];
  birthDay?: string | string[];
  gender?: string | string[];
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth0.getSession();

  if (!session?.user?.sub) {
    redirect(`/login?returnTo=${encodeURIComponent(ONBOARDING_PATH)}`);
  }

  const existingUser = await prisma.user.findUnique({
    where: { auth0UserId: session.user.sub },
  });

  const params = await searchParams;
  const defaultName = existingUser?.name ?? getFirstParam(params.name) ?? "";
  const defaultBirthYear =
    existingUser?.birthDate?.getFullYear().toString() ??
    getFirstParam(params.birthYear) ??
    "";
  const defaultBirthMonth = existingUser?.birthDate
    ? padZero(existingUser.birthDate.getMonth() + 1)
    : (getFirstParam(params.birthMonth) ?? "");
  const defaultBirthDay = existingUser?.birthDate
    ? padZero(existingUser.birthDate.getDate())
    : (getFirstParam(params.birthDay) ?? "");
  const errorMessage = getFirstParam(params.error);
  const errorTitle = errorMessage?.includes("プロフィール")
    ? "お知らせ"
    : "入力エラー";
  const errorColor = errorMessage?.includes("プロフィール") ? "blue" : "red";
  const birthDateError = errorMessage?.includes("生年月日") ? errorMessage : "";
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
      <Stack gap="lg" w="100%" maw={640} align="center">
        <Stack gap={4} ta="center" w="100%">
          <Title order={3} c="gray.7" fw={600}>
            {title}
          </Title>
        </Stack>

        {errorMessage ? (
          <Alert
            color={errorColor}
            radius="lg"
            title={errorTitle}
            w={{ base: "100%", sm: 420 }}
          >
            {errorMessage}
          </Alert>
        ) : null}

        <OnboardingForm
          action={completeOnboarding}
          defaultName={defaultName}
          defaultBirthYear={defaultBirthYear}
          defaultBirthMonth={defaultBirthMonth}
          defaultBirthDay={defaultBirthDay}
          defaultGender={
            existingUser?.gender ?? getFirstParam(params.gender) ?? ""
          }
          birthDateError={birthDateError}
          hasProfile={hasProfile}
        />

        <Button
          component={Link}
          href="/"
          variant="subtle"
          color="gray"
          radius="xl"
          size="sm"
          styles={{
            root: { "&:hover": { backgroundColor: "transparent" } },
          }}
        >
          ← トップへ戻る
        </Button>
      </Stack>
    </Flex>
  );
}

function getFirstParam(value?: string | string[]) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function padZero(value: number) {
  return value.toString().padStart(2, "0");
}
