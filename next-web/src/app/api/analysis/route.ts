import { NextResponse } from "next/server";
import OpenAI from "openai";

import { auth0 } from "@/lib/auth0";
import prisma from "@/lib/client";

export async function POST() {
  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ユーザーの最終分析日時を取得し、1日1回の制限を確認
  // const user = await prisma.user.findUnique({
  //   where: { auth0UserId: session.user.sub },
  //   select: { id: true, lastAnalyzedAt: true },
  // });

  // if (!user) {
  //   return NextResponse.json({ error: "User not found" }, { status: 404 });
  // }

  // const now = new Date();
  // const elapsed = user.lastAnalyzedAt
  //   ? now.getTime() - user.lastAnalyzedAt.getTime()
  //   : null;
  // const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  // if (elapsed !== null && elapsed < ONE_DAY_MS) {
  //   const remainingMs = ONE_DAY_MS - elapsed;
  //   const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));
  //   return NextResponse.json(
  //     {
  //       error: "Too many requests",
  //       message: `AI分析は24時間に1回までです。残り約${remainingHours}時間お待ちください。`,
  //     },
  //     { status: 429 },
  //   );
  // }

  // ユーザーの最新結果を取得（シンプル版: 全結果をそのまま取得）
  const results = await prisma.result.findMany({
    where: { user: { auth0UserId: session.user.sub } },
    select: { metric: true, percentile: true, score: true },
  });

  // コンテキストを短く整形
  const filtered = results.filter(
    (r) =>
      r.score !== null &&
      r.score !== undefined &&
      r.percentile !== null &&
      r.percentile !== undefined,
  );
  const summary =
    filtered.length > 0
      ? filtered
          .map((r) => `${r.metric}:${r.score}(${r.percentile}%)`)
          .join(";")
      : "データがありません";

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "あなたはライフスタイルの優しいコーチです。敬語で短く具体的に、各指標ごとに1文で提案してください。出力は各行「指標名: アドバイス」で改行区切り。指標名は日本語で。Markdownや記号（*, -, • など）は使わない。文頭の接続詞や「増やすために」等の定型句は避ける。医療判断はしないでください。",
      },
      {
        role: "user",
        content: `以下の指標をもとに改善提案を箇条書きでお願いします:\n${summary}`,
      },
    ],
  });

  // 実行時刻を更新
  // await prisma.user.update({
  //   where: { id: user.id },
  //   data: { lastAnalyzedAt: now },
  // });

  const text = completion.choices[0]?.message?.content ?? "";
  return NextResponse.json({ text });
}
