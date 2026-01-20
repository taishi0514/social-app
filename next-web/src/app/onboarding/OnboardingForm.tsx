"use client";

import { useState } from "react";
import {
  Button,
  Group,
  Radio,
  RadioGroup,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

type Props = {
  action: (formData: FormData) => void;
  defaultName: string;
  defaultBirthYear: string;
  defaultBirthMonth: string;
  defaultBirthDay: string;
  defaultGender: string;
  birthDateError: string;
  hasProfile: boolean;
};

const toHalfWidth = (val: string) =>
  val.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));

export default function OnboardingForm({
  action,
  defaultName,
  defaultBirthYear,
  defaultBirthMonth,
  defaultBirthDay,
  defaultGender,
  birthDateError,
  hasProfile,
}: Props) {
  const [birthYear, setBirthYear] = useState(defaultBirthYear);
  const [birthMonth, setBirthMonth] = useState(defaultBirthMonth);
  const [birthDay, setBirthDay] = useState(defaultBirthDay);

  return (
    <form action={action} style={{ width: "100%" }}>
      <Stack gap="md" w="100%" align="center">
        <TextInput
          label="ユーザー名"
          c="dark"
          name="name"
          defaultValue={defaultName}
          required
          placeholder="例: 太郎"
          radius="sm"
          size="md"
          w={{ base: "100%", sm: 420 }}
          autoComplete="name"
          styles={{
            label: { marginBottom: 6, fontWeight: 600, fontSize: 14 },
          }}
        />

        <Stack gap={10} w="100%" align="center">
          <Group
            gap="xs"
            wrap="wrap"
            align="flex-end"
            justify="center"
            w={{ base: "100%", sm: 420 }}
          >
            <TextInput
              label="生年月日"
              c="dark"
              name="birthYear"
              placeholder="YYYY"
              value={birthYear}
              onChange={(e) => setBirthYear(toHalfWidth(e.currentTarget.value))}
              radius="sm"
              size="md"
              style={{ flex: 1, minWidth: 110 }}
              inputMode="numeric"
              maxLength={4}
              autoComplete="bday-year"
              required
              styles={{
                input: { borderRadius: "6px" },
                label: { marginBottom: 6, fontWeight: 600, fontSize: 14 },
              }}
            />
            <Text
              c="dark"
              style={{
                fontWeight: 700,
                transform: "skew(-10deg)",
                opacity: 0.6,
                paddingBottom: 6,
              }}
            >
              /
            </Text>
            <TextInput
              name="birthMonth"
              placeholder="MM"
              value={birthMonth}
              onChange={(e) =>
                setBirthMonth(toHalfWidth(e.currentTarget.value))
              }
              radius="sm"
              size="md"
              style={{ flex: 1, minWidth: 110 }}
              inputMode="numeric"
              maxLength={2}
              autoComplete="bday-month"
              required
              styles={{
                input: { borderRadius: "6px" },
                label: { marginBottom: 6, fontWeight: 600 },
              }}
              label=""
            />
            <Text
              c="dark"
              style={{
                fontWeight: 700,
                transform: "skew(-10deg)",
                opacity: 0.6,
                paddingBottom: 6,
              }}
            >
              /
            </Text>
            <TextInput
              name="birthDay"
              placeholder="DD"
              value={birthDay}
              onChange={(e) => setBirthDay(toHalfWidth(e.currentTarget.value))}
              radius="sm"
              size="md"
              style={{ flex: 1, minWidth: 110 }}
              inputMode="numeric"
              maxLength={2}
              autoComplete="bday-day"
              required
              styles={{
                input: { borderRadius: "6px" },
                label: { marginBottom: 6, fontWeight: 600 },
              }}
              label=""
            />
          </Group>
          <Text size="xs" c="red" w="100%" ta="left">
            {birthDateError}
          </Text>
        </Stack>

        <Stack gap={10} w="100%" align="center">
          <RadioGroup
            label="性別"
            name="gender"
            required
            w={{ base: "100%", sm: 420 }}
            c="dark"
            defaultValue={defaultGender}
            styles={{
              label: { marginBottom: 6, fontWeight: 600, fontSize: 14 },
            }}
          >
            <Group gap="sm" justify="center" w="100%">
              <label
                style={{
                  position: "relative",
                  border: "1px solid var(--mantine-color-gray-4)",
                  borderRadius: "6px",
                  padding: "12px 14px",
                  width: "100%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "var(--mantine-color-white)",
                }}
              >
                <Radio
                  value="male"
                  mr="md"
                  styles={{
                    root: { margin: 0 },
                    radio: { cursor: "pointer" },
                  }}
                />
                <span style={{ cursor: "pointer", width: "100%" }}>男性</span>
              </label>

              <label
                style={{
                  position: "relative",
                  border: "1px solid var(--mantine-color-gray-4)",
                  borderRadius: "6px",
                  padding: "12px 14px",
                  width: "100%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "var(--mantine-color-white)",
                }}
              >
                <Radio
                  value="female"
                  mr="md"
                  styles={{
                    root: { margin: 0 },
                    radio: { cursor: "pointer" },
                  }}
                />
                <span style={{ cursor: "pointer", width: "100%" }}>女性</span>
              </label>
            </Group>
          </RadioGroup>
        </Stack>

        <Button
          type="submit"
          radius="md"
          size="md"
          color="teal"
          maw={360}
          mt="xl"
        >
          {hasProfile ? "プロフィールを更新" : "登録する"}
        </Button>
      </Stack>
    </form>
  );
}
