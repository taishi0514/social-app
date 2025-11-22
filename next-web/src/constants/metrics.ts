export type MetricKey =
  | "salary"
  | "walking"
  | "workOut"
  | "readingHabit"
  | "cigarettes"
  | "alcohol";

 export type MetricConfig = {
  label: string;
  unit: string;
  hint: string;
  baseline: number;
  betterWhenHigher?: boolean;
  lowerIsBetterRangeMultiplier?: number;
};

export const METRIC_CONFIG: Record<MetricKey, MetricConfig> = {
  salary: {
    label: "年収",
    unit: "万円",
    hint: "日本人の平均年収は約480万円です。",
    baseline: 500,
  },
  walking: {
    label: "1日の歩数",
    unit: "歩",
    hint: "8,000歩付近が平均的な歩数です。",
    baseline: 8000,
  },
  workOut: {
    label: "週あたりの運動回数",
    unit: "回/週",
    hint: "週3回程度運動している人が多い傾向です。",
    baseline: 3,
  },
  readingHabit: {
    label: "月あたりの読書冊数",
    unit: "冊/月",
    hint: "月2冊程度が平均値とされています。",
    baseline: 2,
  },
  cigarettes: {
    label: "1日あたりの喫煙本数",
    unit: "本/日",
    hint: "喫煙本数が少ないほど上位判定になります。",
    baseline: 5,
    betterWhenHigher: false,
    lowerIsBetterRangeMultiplier: 4,
  },
  alcohol: {
    label: "1週間あたりの飲酒杯数",
    unit: "杯/週",
    hint: "飲酒量が少ないほど上位判定になります",
    baseline: 7,
    betterWhenHigher: false,
  },
};
