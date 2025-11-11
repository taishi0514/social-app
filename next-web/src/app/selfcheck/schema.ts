import { z } from "zod";

const optionalIntField = z.preprocess(
  (value) => {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") {
        return undefined;
      }
      const sanitized = trimmed.replace(/[^0-9.-]/g, "");
      if (sanitized === "") {
        return undefined;
      }
      const parsed = Number(sanitized);
      return Number.isFinite(parsed) ? parsed : Number.NaN;
    }

    if (typeof value === "number") {
      return value;
    }

    return Number.NaN;
  },
  z
    .number()
    .int({ message: "整数で入力してください。" })
    .min(0, { message: "0以上の数値を入力してください。" })
    .max(99999999, { message: "99,999,999以下で入力してください。" })
    .optional(),
);

export const selfCheckFormSchema = z.object({
  salary: optionalIntField,
  walking: optionalIntField,
  workOut: optionalIntField,
  readingHabit: optionalIntField,
  cigarettes: optionalIntField,
  alcohol: optionalIntField,
});

export type SelfCheckFormValues = z.infer<typeof selfCheckFormSchema>;
