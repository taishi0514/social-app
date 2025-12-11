export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--mantine-color-gray-0)",
        padding: "48px 16px 80px",
        color: "var(--mantine-color-gray-8)",
        lineHeight: 1.6,
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "16px" }}>
          プライバシーポリシー
        </h1>
        <p style={{ marginBottom: "12px" }}>
          ソーシャルグラフ（以下「本サービス」）は、利用者の個人情報を適切に取り扱うため、以下の方針を定めます。
        </p>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>
          1. 取得する情報
        </h2>
        <p style={{ marginBottom: "12px" }}>
          本サービスは、認証のための識別子（Auth0
          ID、メールアドレス）、プロフィール情報（氏名等）、セルフチェックの入力値・結果等を取得する場合があります。
        </p>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>2. 利用目的</h2>
        <ul style={{ marginLeft: "20px", marginBottom: "12px" }}>
          <li>本サービスの提供・本人確認・ログインのため</li>
          <li>セルフチェック結果の保存・表示・共有リンク生成のため</li>
          <li>不正利用防止、サービス品質改善のための分析</li>
          <li>お問い合わせ対応</li>
        </ul>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>
          3. 第三者提供・共同利用
        </h2>
        <p style={{ marginBottom: "12px" }}>
          法令で認められる場合を除き、利用者の同意なく個人情報を第三者に提供しません。分析・ホスティング等の委託先には適切な管理を求めます。
        </p>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>
          4. セキュリティ
        </h2>
        <p style={{ marginBottom: "12px" }}>
          取得した情報はアクセス制限等の安全管理措置を講じて保護します。共有リンクを発行した場合は、リンク管理（無効化・再発行）を利用者自身でも行ってください。
        </p>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>
          5. 利用者の権利
        </h2>
        <p style={{ marginBottom: "12px" }}>
          利用者は、登録情報の確認・訂正・削除、共有リンクの無効化、退会を求めることができます。お問い合わせからご連絡ください。
        </p>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>
          6. ポリシーの変更
        </h2>
        <p style={{ marginBottom: "12px" }}>
          本ポリシーは必要に応じて改定することがあります。改定後は本ページへの掲載をもって効力を生じます。
        </p>
      </div>
    </main>
  );
}
