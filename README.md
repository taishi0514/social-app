# Social Graph

## 【サービス概要】

ユーザーデータをもとに、社会的な位置を可視化するサービスです。日々のライフスタイルや習慣の項目を入力することで確認することができます。<br>

ライフスタイルや習慣を数値化して比較することに興味があり、自身の生活習慣データを入力することで、順位を可視化し、改善点を具体的に把握できる仕組みを実現したいという思いから「[Social Graph](https://social-app-phi-jet.vercel.app/)」を作成いたしました。

## 【技術スタック】

- **Backend/Frontend**: Next.js, TypeScript
- **UI**: Mantine, Tailwind CSS
- **Authentication**: Auth0
- **Validation/Env**: Zod, @t3-oss/env-nextjs
- **Database/ORM**: MySQL, Prisma
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions (lint, migrate)
- **AI**: OpenAI

## 【サイトURL】
URLは[こちら](https://social-app-phi-jet.vercel.app)

## 【ゲストユーザーアカウント情報】
  - ゲストユーザー１<br>
  Email : guest123@gmail.com<br>
  Password : Password123
  - ゲストユーザー２<br>
  Email : guest456@gmail.com<br>
  Password : Password456

## 【改善予定の箇所・機能】
- 追加機能
	- 目標設定: 週/月の目標で達成バッジを付与
	- セルフチェックの推移グラフ/達成率で継続促進
	- リマインダー: 定期的に通知を送ることでセルフチェックを継続させ、推移（成長率）を可視化して改善につなげる
- パフォーマンス改善
  
## 【データベーススキーマ】

```mermaid
erDiagram
	users ||--|| info : "１人のユーザーは１つの情報をもつ"
	users ||--O{ result : "１人のユーザーは複数の結果をもつ"
	users ||--|| user_withdrawals : "１人のユーザーは１つの退会情報をもつ"
	users {
		id integer PK "ユーザーID"
		public_id string "公開ID"
		auth0_user_id string "Auth0ユーザーID"
		name string "ユーザー名"
		email string "メールアドレス"
		birth_date date "誕生日"
		gender string "性別"
		created_at string "作成日"
		updated_at string "更新日"
		archived_at string "アーカイブ日時"
		last_analyzed_at string "最終分析日時"
	}
	info {
	  id integer PK "ID"
	  user_id integer FK "ユーザーID"
		salary integer "給料"
		walking integer "散歩"
		work_out integer "筋トレ"
		reading_habit integer "読書習慣"
		cigarettes integer "タバコ"
		alcohol integer "お酒"
		created_at string "作成日"
		updated_at string "更新日"
	}
	result {
		id integer PK "ID"
		user_id integer FK "ユーザーID"
		metric string "項目"
		score integer "スコア"
		percentile integer "パーセンタイル"
	}
	user_withdrawals {
		id integer PK "ID"
		user_id integer FK "ユーザーID"
		reason string "退会理由"
	}
```

## 【ユーザーフロー】

1. 会員登録
2. 個人情報の入力・更新
3. スコア算出とグラフ表示
4. SNS共有
5. AI分析

## 【入力項目】
- ユーザー登録
	- ユーザー名
	- 生年月日
	- 性別
- セルフチェック診断
	- 年収
	- 散歩
	- 筋トレ
	- 飲酒
	- 喫煙
	- 読書習慣
- 退会処理
	- 理由

## 【画面構成】

- 会員登録画面
- セルフチェック画面
- 待機画面
- ダッシュボード画面
- AI分析画面
- 退会画面

## 【必要な環境】

- docker
- mise

プロジェクトのルートディレクトリで以下のコマンドを実行することによって必要なツールをインストールすることができます。

```bash
brew install mise

mise install
```
