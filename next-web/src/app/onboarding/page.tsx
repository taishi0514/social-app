import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Alert,
  Button,
  Flex,
  Group,
  Radio,
  RadioGroup,
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

        <form action={completeOnboarding} style={{ width: "100%" }}>
          <Stack gap="md" w="100%" align="center">
            <TextInput
              label="ユーザー名"
              c="dark"
              name="name"
              defaultValue={defaultName}
              required
              placeholder="例: 太郎"
              radius="sm"
              size="md"
              w={{ base: "100%", sm: 420 }}
              autoComplete="name"
              styles={{
                label: { marginBottom: 6, fontWeight: 600, fontSize: 14 },
              }}
            />

            <Stack gap={10} w="100%" align="center">
              <Group
                gap="xs"
                wrap="wrap"
                align="flex-end"
                justify="center"
                w={{ base: "100%", sm: 420 }}
              >
                <TextInput
                  label="生年月日"
                  c="dark"
                  name="birthYear"
                  placeholder="YYYY"
                  defaultValue={defaultBirthYear}
                  radius="sm"
                  size="md"
                  style={{ flex: 1, minWidth: 110 }}
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="bday-year"
                  required
                  styles={{
                    input: { borderRadius: "6px" },
                    label: { marginBottom: 6, fontWeight: 600, fontSize: 14 },
                  }}
                />
                <Text
                  c="dark"
                  style={{
                    fontWeight: 700,
                    transform: "skew(-10deg)",
                    opacity: 0.6,
                    paddingBottom: 6,
                  }}
                >
                  /
                </Text>
                <TextInput
                  name="birthMonth"
                  placeholder="MM"
                  defaultValue={defaultBirthMonth}
                  radius="sm"
                  size="md"
                  style={{ flex: 1, minWidth: 110 }}
                  inputMode="numeric"
                  maxLength={2}
                  autoComplete="bday-month"
                  required
                  styles={{
                    input: { borderRadius: "6px" },
                    label: { marginBottom: 6, fontWeight: 600 },
                  }}
                  label=""
                />
                <Text
                  c="dark"
                  style={{
                    fontWeight: 700,
                    transform: "skew(-10deg)",
                    opacity: 0.6,
                    paddingBottom: 6,
                  }}
                >
                  /
                </Text>
                <TextInput
                  name="birthDay"
                  placeholder="DD"
                  defaultValue={defaultBirthDay}
                  radius="sm"
                  size="md"
                  style={{ flex: 1, minWidth: 110 }}
                  inputMode="numeric"
                  maxLength={2}
                  autoComplete="bday-day"
                  required
                  styles={{
                    input: { borderRadius: "6px" },
                    label: { marginBottom: 6, fontWeight: 600 },
                  }}
                  label=""
                />
              </Group>
              <Text size="xs" c="red" w="100%" ta="left">
                {errorMessage?.includes("生年月日") ? errorMessage : ""}
              </Text>
            </Stack>

            <Stack gap={10} w="100%" align="center">
              <RadioGroup
                label="性別"
                name="gender"
                required
                w={{ base: "100%", sm: 420 }}
                c="dark"
                defaultValue={
                  existingUser?.gender ?? getFirstParam(params.gender) ?? ""
                }
                styles={{
                  label: { marginBottom: 6, fontWeight: 600, fontSize: 14 },
                }}
              >
                <Group gap="sm" justify="center" w="100%">
                  <label
                    style={{
                      position: "relative",
                      border: "1px solid var(--mantine-color-gray-4)",
                      borderRadius: "6px",
                      padding: "12px 14px",
                      width: "100%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "var(--mantine-color-white)",
                    }}
                  >
                    <Radio
                      value="male"
                      mr="md"
                      styles={{
                        root: { margin: 0 },
                        radio: { cursor: "pointer" },
                      }}
                    />
                    <span style={{ cursor: "pointer", width: "100%" }}>
                      男性
                    </span>
                  </label>

                  <label
                    style={{
                      position: "relative",
                      border: "1px solid var(--mantine-color-gray-4)",
                      borderRadius: "6px",
                      padding: "12px 14px",
                      width: "100%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "var(--mantine-color-white)",
                    }}
                  >
                    <Radio
                      value="female"
                      mr="md"
                      styles={{
                        root: { margin: 0 },
                        radio: { cursor: "pointer" },
                      }}
                    />
                    <span style={{ cursor: "pointer", width: "100%" }}>
                      女性
                    </span>
                  </label>
                </Group>
              </RadioGroup>
            </Stack>

            <Button
              type="submit"
              radius="md"
              size="md"
              color="teal"
              maw={360}
              mt="xl"
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
