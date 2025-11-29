import Link from "next/link";

import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/client";

import { UserCardList } from "./UserCardList";
import type { UserInfoCardData } from "./UserInfoCard";

const ITEMS_PER_PAGE = 10;

type HomeProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);

  const session = await auth0.getSession();
  const isAuthenticated = Boolean(session?.user);

  // 総件数を取得
  const totalCount = await prisma.user.count({
    where: {
      info: { isNot: null },
    },
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Info登録済みの全ユーザーを取得（ページネーション付き）
  const dbUsers = await prisma.user.findMany({
    where: {
      info: { isNot: null },
    },
    include: {
      info: true,
      results: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  // UserInfoCardData形式に変換
  const users: UserInfoCardData[] = dbUsers.map((user) => ({
    publicId: user.publicId,
    info: user.info
      ? {
          salary: user.info.salary,
          walking: user.info.walking,
          workOut: user.info.workOut,
          readingHabit: user.info.readingHabit,
          cigarettes: user.info.cigarettes,
          alcohol: user.info.alcohol,
        }
      : null,
    results: user.results.map((r) => ({
      metric: r.metric,
      percentile: r.percentile,
    })),
  }));

  return (
    <Box
      component="main"
      mih="100vh"
      bg="var(--mantine-color-gray-0)"
      py="xl"
      px="md"
    >
      <Container size="lg">
        <Stack gap="xl">
          {/* ヘッダーセクション */}
          <Stack gap="md" align="center">
            <Title order={1} ta="center" c="dark">
              ライフスタイルをもっとオープンに
            </Title>
            <Text size="md" c="dimmed" ta="center">
              みんなのライフスタイルデータを見てみよう
            </Text>

            {!isAuthenticated && (
              <Group gap="md" justify="center">
                <Button
                  component="a"
                  href="/auth/login?screen_hint=signup"
                  radius="xl"
                  size="md"
                  color="blue"
                >
                  無料ユーザー登録
                </Button>
                <Button
                  component="a"
                  href="/auth/login"
                  radius="xl"
                  size="md"
                  variant="outline"
                  color="blue"
                >
                  アカウントをお持ちの方はログイン
                </Button>
              </Group>
            )}

            {isAuthenticated && (
              <Group gap="md" justify="center">
                <Button
                  component={Link}
                  href="/dashboard"
                  radius="xl"
                  size="md"
                  variant="light"
                  color="teal"
                >
                  マイダッシュボード
                </Button>
                <Button
                  component={Link}
                  href="/selfcheck"
                  radius="xl"
                  size="md"
                  variant="light"
                  color="teal"
                >
                  セルフチェック
                </Button>
              </Group>
            )}
          </Stack>

          {/* ユーザー一覧 */}
          <UserCardList
            users={users}
            isAuthenticated={isAuthenticated}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
          />
        </Stack>
      </Container>
    </Box>
  );
}
