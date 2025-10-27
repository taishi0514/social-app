import { z } from "zod";

export const onboardingSchema = z.object({
  name: z.coerce.string({
        error: () => "ユーザー名を入力してください。"
  })
    .trim()
    .min(2, { message: "ユーザー名は2文字以上で入力してください。" })
    .max(20, { message: "ユーザー名は20文字以内で入力してください。" }),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
