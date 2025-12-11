export default function TermsPage() {
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
        <h1 style={{ fontSize: "1.6rem", marginBottom: "16px" }}>利用規約</h1>
        <p style={{ marginBottom: "12px" }}>
          本規約はソーシャルグラフ（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用いただく場合、本規約に同意したものとみなします。
        </p>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>1. アカウント</h2>
        <p style={{ marginBottom: "12px" }}>
          利用者は正確な情報で登録し、第三者にアカウントを譲渡・貸与しないものとします。不正利用が判明した場合、アカウント停止等の措置を講じることがあります。
        </p>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>2. 禁止事項</h2>
        <ul style={{ marginLeft: "20px", marginBottom: "12px" }}>
          <li>法令または公序良俗に反する行為</li>
          <li>第三者の権利・プライバシーを侵害する行為</li>
          <li>本サービスの運営を妨害する行為</li>
          <li>不正アクセス・リバースエンジニアリング等の行為</li>
        </ul>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>3. 共有リンク</h2>
        <p style={{ marginBottom: "12px" }}>
          共有リンクの取り扱いは利用者の責任で行ってください。リンクの再発行や無効化が必要な場合は、設定から操作してください。
        </p>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>4. 免責</h2>
        <p style={{ marginBottom: "12px" }}>
          当社は、本サービスの提供、中断、停止、変更により利用者に発生した損害について、当社に故意または重過失がある場合を除き責任を負いません。
        </p>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>5. 規約の変更</h2>
        <p style={{ marginBottom: "12px" }}>
          本規約は随時変更されることがあります。変更後の規約は、本サービス上に掲載した時点で効力を生じます。
        </p>
        <h2 style={{ fontSize: "1.2rem", marginTop: "20px" }}>
          6. 準拠法・管轄
        </h2>
        <p style={{ marginBottom: "12px" }}>
          本規約は日本法に準拠し、本サービスに関して紛争が生じた場合、当社所在地を管轄する裁判所を第一審の専属的合意管轄とします。
        </p>
      </div>
    </main>
  );
}
