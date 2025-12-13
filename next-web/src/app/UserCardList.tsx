"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { SimpleGrid, Text, Stack, Box, Pagination, Group } from "@mantine/core";

import { UserInfoCard, type UserInfoCardData } from "./UserInfoCard";

type UserCardListProps = {
  users: UserInfoCardData[];
  isAuthenticated: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
};

export function UserCardList({
  users,
  isAuthenticated,
  currentPage,
  totalPages,
  totalCount,
}: UserCardListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
  };

  if (users.length === 0 && currentPage === 1) {
    return (
      <Box py="xl">
        <Text ta="center" c="dimmed">
          まだユーザー情報が登録されていません。
        </Text>
      </Box>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          全 {totalCount.toLocaleString()} 件
        </Text>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: "md", sm: "lg" }}>
        {users.map((user, index) => (
          <UserInfoCard
            key={user.publicId}
            user={user}
            isAuthenticated={isAuthenticated}
            index={(currentPage - 1) * 10 + index}
          />
        ))}
      </SimpleGrid>

      {totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={handlePageChange}
            size="md"
            radius="md"
            withEdges
          />
        </Group>
      )}
    </Stack>
  );
}
