import Link from "next/link";

import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

export default function NotFound() {
  return (
    <Box
      component="main"
      bg="var(--mantine-color-gray-0)"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
      px="md"
      py="xl"
    >
      <Container size="sm">
        <Paper
          radius="xl"
          shadow="md"
          withBorder
          p={{ base: "lg", md: "xl" }}
          bg="white"
        >
          <Stack gap="sm" align="center" ta="center">
            <Title order={2} c="gray.8" fw={600}>
              404 - Not Found
            </Title>
            <Text c="gray.6" lh={1.6}>
              お探しのページは削除されたか、URLが間違っている可能性があります。
            </Text>
            <Button
              component={Link}
              href="/"
              radius="xl"
              size="md"
              color="teal"
              variant="filled"
              mt="sm"
            >
              トップに戻る
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
