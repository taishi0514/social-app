"use client";

import { useState } from "react";
import { Button, Flex, Modal, Stack, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { withdrawal } from "./withdrawal-action";

export function ClientWithdrawal() {
  const [opened, { open, close }] = useDisclosure(false);
  const [reason, setReason] = useState("");

  return (
    <>
      <Flex
        component="main"
        mih="100vh"
        bg="var(--mantine-color-gray-0)"
        justify="flex-start"
        align="center"
        px="md"
        pt={24}
        pb="xl"
      >
        <Stack gap={24} w="100%" maw={540} align="center" mx="auto" mt={-8}>
          <Stack gap="xl" w="100%" align="center">
            <Text fw={600} size="lg" c="gray.8">
              退会手続き
            </Text>
            <Text size="sm" c="dimmed">
              「退会する」を押すと最終確認が表示されます。
            </Text>
          </Stack>

          <Stack gap="md" w="100%" align="center">
            <Textarea
              label="退会理由"
              required
              name="reason"
              placeholder="例: 使わなくなった"
              c="dimmed"
              radius="sm"
              minRows={12}
              autosize={false}
              w={{ base: "100%", sm: 420 }}
              styles={{ input: { minHeight: 200 } }}
              value={reason}
              onChange={(e) => setReason(e.currentTarget.value)}
            />

            <Button
              type="button"
              radius="md"
              size="md"
              color="red"
              maw={360}
              mt="sm"
              onClick={open}
            >
              退会する
            </Button>
          </Stack>
        </Stack>
      </Flex>

      <Modal
        opened={opened}
        onClose={close}
        centered
        title={
          <Text fw={600} c="gray.8">
            退会の確認
          </Text>
        }
      >
        <form action={withdrawal}>
          <Stack gap="md">
            <input type="hidden" name="reason" value={reason} />
            <Text size="sm" c="dimmed">
              退会すると元に戻せません。本当に退会しますか？
            </Text>
            <Stack gap="xs">
              <Button type="submit" color="red">
                退会する
              </Button>
              <Button variant="outline" onClick={close}>
                キャンセル
              </Button>
            </Stack>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
