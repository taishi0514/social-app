import { z } from "zod";

import {
  activityScoreMap,
  alcoholValues,
  metricOptions,
  smokingValues,
} from "./constants";

const activityPresetEnum = z.enum(["low", "medium", "high"]);
const smokingEnum = z.enum(["never", "monthly", "weekly", "daily"]);
const alcoholEnum = z.enum(["never", "monthly", "weekly", "daily"]);

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
    .optional(),
);

export const selfCheckFormSchema = z.object({
  salary: optionalIntField,
  walkingPreset: activityPresetEnum.optional(),
  walkingCustom: optionalIntField,
  workOutPreset: activityPresetEnum.optional(),
  workOutCustom: optionalIntField,
  readingHabitPreset: activityPresetEnum.optional(),
  readingHabitCustom: optionalIntField,
  cigarettesPreset: smokingEnum.optional(),
  cigarettesCustom: optionalIntField,
  alcoholPreset: alcoholEnum.optional(),
  alcoholCustom: optionalIntField,
});

export type SelfCheckFormValues = z.infer<typeof selfCheckFormSchema>;

type MetricValueKey = (typeof metricOptions)[number]["value"];

export type ResolvedInfoValues = {
  salary?: number;
  walking?: number;
  workOut?: number;
  readingHabit?: number;
  cigarettes?: (typeof smokingValues)[number];
  alcohol?: (typeof alcoholValues)[number];
};

const metricLabels: Record<MetricValueKey, string> = metricOptions.reduce<
  Record<MetricValueKey, string>
>((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {} as Record<MetricValueKey, string>);

export function resolveSelfCheckValues(values: SelfCheckFormValues): ResolvedInfoValues {
  const getActivityValue = (
    custom?: number,
    preset?: z.infer<typeof activityPresetEnum>,
  ) => {
    if (typeof custom === "number") {
      return custom;
    }
    if (preset) {
      return activityScoreMap[preset];
    }
    return undefined;
  };

  return {
    salary: values.salary,
    walking: getActivityValue(values.walkingCustom, values.walkingPreset),
    workOut: getActivityValue(values.workOutCustom, values.workOutPreset),
    readingHabit: getActivityValue(
      values.readingHabitCustom,
      values.readingHabitPreset,
    ),
    cigarettes: values.cigarettesPreset,
    alcohol: values.alcoholPreset,
  };
}

export function getMetricLabel(metric: MetricValueKey) {
  return metricLabels[metric] ?? metric;
}
