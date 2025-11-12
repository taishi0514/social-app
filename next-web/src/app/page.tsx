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

export default async function Home() {
  const session = await auth0.getSession();
  const user = session?.user;
  const hasProfileName = Boolean(user?.name?.trim());

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
                      alt={user.name ?? "Authenticated user"}
                      size={72}
                      radius="xl"
                    />
                  ) : (
                    <Avatar size={72} radius="xl" color="teal">
                      {user.name?.slice(0, 1)?.toUpperCase() ?? "U"}
                    </Avatar>
                  )}
                  <Stack gap={0} align="center">
                    <Text fw={600}>
                      {user.name ?? user.email ?? "Authenticated user"}
                    </Text>
                  </Stack>
                </Stack>
                {hasProfileName ? (
                  <Group gap="md" justify="center" wrap="wrap">
                    <Button
                      component={Link}
                      href="/onboarding"
                      variant="outline"
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
