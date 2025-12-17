import Link from "next/link";

import { Anchor, Box, Button, Container, Group, Text } from "@mantine/core";

import { auth0 } from "@/lib/auth0";
import { env } from "@/config";
import { AuthenticatedMenu } from "./AuthenticatedMenu";

const appBaseUrl = env.APP_BASE_URL;
const logoutReturnTo = encodeURIComponent(new URL("/", appBaseUrl).toString());
const loginParams = new URLSearchParams({
  returnTo: "/",
  ui_locales: "ja",
}).toString();
const signupParams = new URLSearchParams({
  returnTo: "/",
  screen_hint: "signup",
  ui_locales: "ja",
}).toString();

export default async function Header() {
  const session = await auth0.getSession();
  const isAuthenticated = Boolean(session?.user);

  return (
    <Box
      component="header"
      bg="var(--mantine-color-body)"
      style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
    >
      <Container size="lg" py="sm">
        <Group justify="space-between" align="center" gap="md">
          <Anchor component={Link} href="/" underline="never">
            <Text
              component="span"
              fw={700}
              size="xl"
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 45 }}
              style={{ letterSpacing: "-0.02em" }}
            >
              ソーシャルグラフ
            </Text>
          </Anchor>

          {isAuthenticated ? (
            <AuthenticatedMenu logoutReturnTo={logoutReturnTo} />
          ) : (
            <Group gap="xs">
              <Button
                component="a"
                href={`/auth/login?${loginParams}`}
                radius="xl"
                size="sm"
                color="teal"
              >
                ログイン
              </Button>
              <Button
                component="a"
                href={`/auth/login?${signupParams}`}
                variant="outline"
                radius="xl"
                size="sm"
                color="teal"
              >
                新規登録
              </Button>
            </Group>
          )}
        </Group>
      </Container>
    </Box>
  );
}
