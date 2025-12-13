import Link from "next/link";

import { Anchor, Group, Stack, Text } from "@mantine/core";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--mantine-color-gray-3)",
        background: "var(--mantine-color-gray-0)",
        padding: "24px 16px",
      }}
    >
      <Stack
        gap="xs"
        style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}
      >
        <Group gap="lg" justify="center" wrap="wrap">
          <Anchor component={Link} href="/terms" c="gray.7" size="sm">
            利用規約
          </Anchor>
          <Anchor component={Link} href="/privacy" c="gray.7" size="sm">
            プライバシーポリシー
          </Anchor>
          <Anchor
            component={Link}
            href="https://docs.google.com/forms/d/e/1FAIpQLSeTKIWMDJng8OOplEbJ1ymYFvKVfhjNGq8DzKv4eCyuabmGhw/viewform?usp=dialog"
            c="gray.7"
            size="sm"
          >
            お問い合わせ
          </Anchor>
        </Group>
        <Text size="sm" c="gray.6">
          © 2025 ソーシャルグラフ
        </Text>
      </Stack>
    </footer>
  );
}
