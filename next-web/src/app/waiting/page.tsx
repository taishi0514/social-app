import Link from "next/link";

import { Box, Button, Container, Paper, Stack, Title } from "@mantine/core";
import ScrollToTop from "@/components/ScrollToTop";
import { ensureOnboarded } from "@/lib/ensureOnboarded";

export default async function WaitingPage() {
  await ensureOnboarded("/");

  return (
    <Box
      component="section"
      bg="var(--mantine-color-gray-0)"
      py="xl"
      px="md"
      mih="100vh"
    >
      <ScrollToTop behavior="instant" />
      <Container size="sm" h="100%">
        <Box
          component="div"
          h="100%"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "200px",
          }}
        >
          <Paper
            radius="xl"
            shadow="md"
            withBorder
            p={{ base: "xl", sm: "2xl" }}
            w="100%"
          >
            <Stack gap="lg" align="center" ta="center">
              <Title order={2} c="gray" size="lg">
                スコアの算出が完了しました。
              </Title>
              <Button
                component={Link}
                href="/dashboard"
                radius="xl"
                size="md"
                color="teal"
                variant="light"
              >
                結果を確認
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
