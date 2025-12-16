import { z } from "zod";

export const onboardingSchema = z.object({
  name: z.coerce
    .string({
      error: () => "ユーザー名を入力してください。",
    })
    .trim()
    .min(2, { message: "ユーザー名は2文字以上で入力してください。" })
    .max(20, { message: "ユーザー名は20文字以内で入力してください。" }),
  birthYear: z
    .string()
    .trim()
    .regex(/^[0-9]{4}$/, { message: "年は4桁で入力してください。" })
    .transform(Number),
  birthMonth: z
    .string()
    .trim()
    .regex(/^[0-9]{1,2}$/, { message: "月は1〜12で入力してください。" })
    .transform(Number)
    .refine((value) => value >= 1 && value <= 12, {
      message: "月は1〜12で入力してください。",
    }),
  birthDay: z
    .string()
    .trim()
    .regex(/^[0-9]{1,2}$/, { message: "日は1〜31で入力してください。" })
    .transform(Number)
    .refine((value) => value >= 1 && value <= 31, {
      message: "日は1〜31で入力してください。",
    }),
  gender: z
    .union([z.enum(["male", "female"]), z.literal(""), z.null()])
    .refine((v) => v === "male" || v === "female", {
      message: "性別を選択してください。",
    }),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
