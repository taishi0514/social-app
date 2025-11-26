import Link from "next/link";

import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";

import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/client";

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;
  const dbUser = user?.sub
    ? await prisma.user.findUnique({
        where: { auth0UserId: user.sub },
      })
    : null;

  // 名前がなければメールは表示しない（初期値は "Authenticated user"）
  // 名前未登録の場合はメールを出さず空にする（Auth0のnameも使わない）
  const displayName = dbUser?.name ?? "";
  const hasProfileName = Boolean(dbUser?.name?.trim());

  return (
    <Flex
      mih="100vh"
      justify="center"
      align="center"
      bg="var(--mantine-color-gray-0)"
    >
      <Box
        component="main"
        bg="var(--mantine-color-gray-0)"
        py="xl"
        px="md"
        miw={320}
      >
        <Container size="sm">
          <Paper radius="xl" shadow="lg" p="xl" withBorder>
            {!user ? (
              <Stack align="center" gap="lg">
                <Text size="sm" c="dimmed" ta="center">
                  会員限定コンテンツ公開中。ログインまたは、会員登録して確認してみよう！
                </Text>
              </Stack>
            ) : (
              <Stack align="center" gap="lg">
                <Stack align="center" gap="xs">
                  {user.picture ? (
                    <Avatar
                      src={user.picture}
                      alt={displayName || "Authenticated user"}
                      size={72}
                      radius="xl"
                    />
                  ) : (
                    <Avatar size={72} radius="xl" color="teal">
                      {(displayName || "U").slice(0, 1)?.toUpperCase()}
                    </Avatar>
                  )}
                  <Stack gap={0} align="center">
                    <Text fw={600} c="gray">{displayName}</Text>
                  </Stack>
                </Stack>
                {hasProfileName ? (
                  <Group gap="md" justify="center" wrap="wrap">
                    <Button
                      component={Link}
                      href="/onboarding"
                      variant="light"
                      radius="xl"
                      size="sm"
                      color="teal"
                    >
                      プロフィール編集へ
                    </Button>
                    <Button
                      component={Link}
                      href="/selfcheck"
                      radius="xl"
                      size="sm"
                      color="teal"
                      variant="light"
                    >
                      セルフチェックへ
                    </Button>
                  </Group>
                ) : (
                  <Button
                    component={Link}
                    href="/onboarding"
                    variant="outline"
                    radius="xl"
                    size="sm"
                    color="teal"
                  >
                    プロフィール登録へ
                  </Button>
                )}
              </Stack>
            )}
          </Paper>
        </Container>
      </Box>
    </Flex>
  );
}
