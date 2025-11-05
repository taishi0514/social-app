export const metricOptions = [
  {
    value: "salary",
    label: "年収",
    description: "ライフスタイル全体を把握するために年間収入を入力します。",
  },
  {
    value: "walking",
    label: "1日の歩数",
    description: "一日にどれだけ歩くかを知ることで活動量を推定できます。",
  },
  {
    value: "workOut",
    label: "週あたりの運動回数",
    description: "筋トレやスポーツをどのくらい行っているかを確認します。",
  },
  {
    value: "readingHabit",
    label: "月あたりの読書冊数",
    description: "インプットの頻度を知るための指標です。",
  },
  {
    value: "cigarettes",
    label: "喫煙頻度",
    description: "喫煙習慣がライフスタイルに与える影響を把握します。",
  },
  {
    value: "alcohol",
    label: "飲酒頻度",
    description: "飲酒の頻度や量を評価するための指標です。",
  },
] as const;

export const activityPresets = [
  { value: "low", label: "少ない（ほとんどしない）", score: 20 },
  { value: "medium", label: "ふつう（週2〜3回）", score: 50 },
  { value: "high", label: "多い（週4回以上）", score: 80 },
] as const;

export type ActivityPreset = (typeof activityPresets)[number]["value"];

export const activityScoreMap: Record<ActivityPreset, number> = activityPresets.reduce<
  Record<ActivityPreset, number>
>((acc, preset) => {
  acc[preset.value] = preset.score;
  return acc;
}, {} as Record<ActivityPreset, number>);

export const smokingValues = ["never", "monthly", "weekly", "daily"] as const;
export type SmokingOption = (typeof smokingValues)[number];

export const SmokingLabels: Record<SmokingOption, string> = {
  never: "吸わない",
  monthly: "月に数回（たまに吸う）",
  weekly: "週に数回（習慣的に吸う）",
  daily: "毎日吸う",
};

export const SmokingScoreMap: Record<SmokingOption, number> = {
  never: 0,
  monthly: 25,
  weekly: 60,
  daily: 90,
};

export const alcoholValues = ["never", "monthly", "weekly", "daily"] as const;
export type AlcoholFreqOption = (typeof alcoholValues)[number];

export const AlcoholFreqLabels: Record<AlcoholFreqOption, string> = {
  never: "飲まない",
  monthly: "月に数回（たまに）",
  weekly: "週に数回（習慣的に）",
  daily: "毎日飲む",
};

export const AlcoholScoreMap: Record<AlcoholFreqOption, number> = {
  never: 0,
  monthly: 20,
  weekly: 50,
  daily: 90,
};
