import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ダミーユーザー生成用の名前リスト
const FIRST_NAMES = [
  "太郎",
  "次郎",
  "花子",
  "美咲",
  "健太",
  "翔太",
  "優子",
  "愛",
  "大輔",
  "拓也",
  "由美",
  "真理",
  "隆",
  "誠",
  "麻衣",
  "理恵",
  "浩",
  "直人",
  "恵子",
  "智子",
  "修",
  "裕介",
  "綾",
  "奈々",
  "健",
  "明",
  "さくら",
  "陽子",
  "勇",
  "京子",
];

// ランダムな値を生成する関数
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// パーセンタイル計算関数（簡易版）
function calculatePercentile(value: number, min: number, max: number): number {
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.min(100, Math.max(1, Math.round(normalized)));
}

async function main() {
  console.log("🌱 シードデータの生成を開始します...");

  // 既存のデータをクリア
  console.log("📦 既存データをクリア中...");
  await prisma.result.deleteMany();
  await prisma.info.deleteMany();
  await prisma.user.deleteMany();

  console.log("👥 ダミーユーザーを作成中...");

  // 30件のダミーユーザーを作成
  for (let i = 0; i < 30; i++) {
    const userName = `${FIRST_NAMES[i % FIRST_NAMES.length]}${i + 1}`;
    const email = `user${i + 1}@example.com`;
    const auth0UserId = `auth0|dummy_user_${i + 1}`;
    const birthDate = new Date(1990, 0, 1);
    const gender = "unspecified";

    // ランダムなメトリクス値を生成
    const salary = randomInt(300, 1200); // 300万〜1200万
    const walking = randomInt(3000, 15000); // 3000歩〜15000歩
    const workOut = randomInt(0, 7); // 0〜7日/週
    const readingHabit = randomInt(0, 30); // 0〜30冊/年
    const cigarettes = randomInt(0, 40); // 0〜40本/日
    const alcohol = randomInt(0, 7); // 0〜7日/週

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        name: userName,
        email: email,
        birthDate,
        gender,
        auth0UserId: auth0UserId,
        info: {
          create: {
            salary,
            walking,
            workOut,
            readingHabit,
            cigarettes,
            alcohol,
          },
        },
        results: {
          create: [
            {
              metric: "salary",
              score: salary,
              percentile: calculatePercentile(salary, 300, 1200),
            },
            {
              metric: "walking",
              score: walking,
              percentile: calculatePercentile(walking, 3000, 15000),
            },
            {
              metric: "workOut",
              score: workOut,
              percentile: calculatePercentile(workOut, 0, 7),
            },
            {
              metric: "readingHabit",
              score: readingHabit,
              percentile: calculatePercentile(readingHabit, 0, 30),
            },
            {
              metric: "cigarettes",
              score: cigarettes,
              percentile: calculatePercentile(cigarettes, 0, 40),
            },
            {
              metric: "alcohol",
              score: alcohol,
              percentile: calculatePercentile(alcohol, 0, 7),
            },
          ],
        },
      },
    });

    console.log(`  ✅ ユーザー作成: ${user.name} (${user.email})`);
  }

  console.log("\n🎉 シードデータの生成が完了しました！");
  console.log(`📊 作成されたユーザー数: 30件`);
  console.log(`📄 ページネーション: 3ページ (10件/ページ)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ エラーが発生しました:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
