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
import { PRIVATE_METRICS, type MetricKey } from "@/constants/metrics";

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
  const viewer = session?.user?.sub
    ? await prisma.user.findUnique({
        where: { auth0UserId: session.user.sub },
        select: { name: true },
      })
    : null;
  const hasProfileName = Boolean(viewer?.name?.trim());

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
  const maskPrivateInfo = (
    info: {
      salary: number | null;
      walking: number | null;
      workOut: number | null;
      readingHabit: number | null;
      cigarettes: number | null;
      alcohol: number | null;
    } | null,
  ) => {
    if (!info) return null;
    if (isAuthenticated) return info;
    return {
      ...info,
      salary: null,
      cigarettes: null,
      alcohol: null,
    };
  };

  const users: UserInfoCardData[] = dbUsers.map((user) => {
    const baseInfo = user.info
      ? {
          salary: user.info.salary,
          walking: user.info.walking,
          workOut: user.info.workOut,
          readingHabit: user.info.readingHabit,
          cigarettes: user.info.cigarettes,
          alcohol: user.info.alcohol,
        }
      : null;

    const visibleResults = isAuthenticated
      ? user.results
      : user.results.filter(
          (r) => !PRIVATE_METRICS.includes(r.metric as MetricKey),
        );

    return {
      publicId: user.publicId,
      info: maskPrivateInfo(baseInfo),
      results: visibleResults.map((r) => ({
        metric: r.metric,
        percentile: r.percentile,
      })),
    };
  });

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
            <Title order={1} ta="center" c="dark" fw={500}>
              ライフスタイルをもっとオープンに
            </Title>
            <Text size="md" c="dimmed" ta="center">
              {isAuthenticated
                ? "みんなのライフスタイルデータを見てみよう"
                : "※年収データを見るにはログインが必要です"}
            </Text>

            {isAuthenticated && (
              <Group gap="md" justify="center">
                <Button
                  component={Link}
                  href="/onboarding"
                  radius="xl"
                  size="md"
                  variant="light"
                  color="teal"
                >
                  {hasProfileName ? "プロフィール編集へ" : "プロフィール登録へ"}
                </Button>
                <Button
                  component={Link}
                  href="/selfcheck"
                  radius="xl"
                  size="md"
                  variant="light"
                  color="teal"
                >
                  セルフチェック診断
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
