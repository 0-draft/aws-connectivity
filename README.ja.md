# on-ramp

[![ci](https://github.com/0-draft/on-ramp/actions/workflows/ci.yml/badge.svg)](https://github.com/0-draft/on-ramp/actions/workflows/ci.yml)

社内ネットワークから AWS に入るすべての道を、道路地図として描いたインタラクティブ解説 (英語 / 日本語)。インターネット、Site-to-Site VPN、Direct Connect、SD-WAN、AWS 側のハブ (仮想プライベートゲートウェイ、Direct Connect ゲートウェイ、Transit Gateway、Cloud WAN)、PrivateLink、ハイブリッド DNS、人のアクセス、Outposts を 1 枚の地図に載せ、それぞれの道を「AWS がどう動くか予想 → 1 ステップずつ理由を確認」しながら走れます。

**サイト:** <https://0-draft.github.io/on-ramp/?lang=ja>

[English README](README.md)

## 中身

| 出口 | セクション | 触れるところ |
| --- | --- | --- |
| — | 地図 | 全経路を 1 枚のインターチェンジ図に。どの道でもパケットを 1 駅ずつ進められる |
| 1 | なぜ難しい? | 「DX があるから閉域で安全」のすき間ラボ、つまずきポイントのランキング (各出口へリンク) |
| 2 | 交通ルール | CIDR スライダー、最長一致の案内標識、BGP、3 つのレイヤー、暗号化がどこに効くか |
| 3 | インターネット | パブリックエンドポイントまでの道のり、S3 バケットポリシーのラボ (`aws:SourceIp` と `aws:SourceVpce`) |
| 4 | VPN | トンネルのフェイルオーバー、VGW / Transit Gateway / Cloud WAN のスループットラボ (ECMP・大容量トンネル) |
| 5 | Direct Connect | 区間ごとの持ち主、VIF の種類、閉域 ≠ 暗号化。詳細は [Direct Connect 深掘りページ](https://0-draft.github.io/on-ramp/direct-connect/?lang=ja) へ |
| 6 | ハブ | 規模ラボ (VPC × リージョン × 拠点を 4 つの設計で比較、クォータつき)、アプライアンスモード |
| 7 | SD-WAN | カプセル化の断面図 (アタッチメントの中の GRE)、Connect の容量ラボ |
| 8 | 経路選択 | 同じ経路でもハブが違えば答えが違う: VGW・Transit Gateway・Cloud WAN の判定はしご |
| 9 | PrivateLink | オンプレから届くエンドポイント・届かないエンドポイントとその理由 |
| 10 | DNS | Route 53 VPC Resolver エンドポイント経由の名前解決をステップ実行 (壊れる例も) |
| 11 | 人の接続 | Client VPN・Verified Access・Session Manager・EC2 Instance Connect Endpoint・WorkSpaces の比較 |
| 12 | エッジ・データ | Outposts のルーティング、Local Zone のヘアピン、大量転送の計算 |
| 13 | MTU | ヘッダーの中身と「高さ制限」のパケットサイズラボ |
| 14 | コスト | 東京リージョンの月額を道ごとに料金所バーで比較 |
| 15 | 設計する | 質問に答えると推奨トポロジーと避けるべきパターン |
| 16–18 | クイズ・年表・用語集 | 誤解か事実かカード、2009–2026 年のリリース、英日用語集 |

すべての数字の根拠は [`docs/`](docs/README.md) (出典つき、英語) にあります。2026-10-10 時点の AWS 公式ドキュメント・What's New・Price List API で確認済み。

## Direct Connect 深掘り

地図は「全部の道」、2 ページ目の **[Direct Connect を深掘り](https://0-draft.github.io/on-ramp/direct-connect/?lang=ja)** はそのうち 1 本を部品ごとにたどります。地図の Direct Connect の出口は要約して、そちらにリンクしています。2026-11-08 までは別サイト [0-draft/cross-connect](https://github.com/0-draft/cross-connect) でした。調査ノートは [`docs/direct-connect/`](docs/direct-connect/README.md) にあり、Direct Connect の料金表はサイト全体でここ 1 つだけです (`src/data/dxPricing.ts`、説明は [`docs/direct-connect/10-pricing.md`](docs/direct-connect/10-pricing.md))。

| セクション | インタラクティブ要素 |
| --- | --- |
| なぜ難しい? | 4 つの根本原因、用語をタップで解説できるレイヤー図、だれが何を持っているか、つまずきポイントと解説先へのリンク |
| 概要 | ルーター、キャリア回線、ケージ、クロスコネクト、DX ルーター、VIF、ゲートウェイをクリックで解説 |
| 接続 | 帯域ラダー、専用 vs ホスト型、LOA-CFA 発注フローのステップ表示 |
| LAG・MACsec | LAG メンバーを切断して最小リンク数の挙動を確認、`should_encrypt` と `must_encrypt` の違い |
| VIF | プライベート / パブリック / トランジットを切り替えて到達先を表示 |
| DX ゲートウェイ | VGW / TGW / Cloud WAN モード、許可プレフィックスラボ、SiteLink の切り替え |
| BGP | 経路選択ラボ: プレフィックス長、`7224:7x00` コミュニティ、AS_PATH プリペンド、ホームリージョン、VPN バックアップ、行きと帰りが食い違うときの非対称ルーティング警告 |
| 冗長性 | Maximum / High / Dev-Test / Classic モデルの障害シミュレーター |
| セキュリティ | MACsec・IPsec・TLS がそれぞれ守る区間 |
| 運用 | はい / いいえで進むトラブルシューティング、アラームを設定すべきメトリクス |
| 料金 | 定価ベースの月額シミュレーター、定額料金の損益分岐 |
| 設計 | 7 つの質問でトポロジーを提案、アンチパターン |
| クイズ | よくある思い込み 10 問の「ほんと? うそ?」 |
| 年表 | 2011〜2026 年のリリース |
| 用語集 | 各用語の英語・日本語の正式名と、混同しやすい用語 |

深掘りページの内容は 2026-10-12 時点の AWS 公式ドキュメントで確認済み。

## 開発

Node.js 24 が必要です。

```bash
npm ci
npm run dev        # http://localhost:5173/on-ramp/ (深掘り: /on-ramp/direct-connect/)
npm run check      # 型チェック・lint・整形・markdownlint・テスト・ビルド
npm run test:e2e   # 実ブラウザでの確認 (要: npx playwright install chromium)
```

ソースは機能単位です。`src/features/<セクション>/` にセクション本体・ラボ・その裏の純粋関数 (隣に Vitest のテスト) があり、共通 UI は `src/components/`、経路データとナビは `src/data/`、言語切り替えは `src/i18n/` にあります。深掘りページは 2 つ目の Vite エントリ (`direct-connect/index.html` → `src/direct-connect.tsx` → `src/app/DirectConnectApp.tsx`) で、セクションは `src/features/direct-connect/` にあります。

## CI

| ワークフロー | 内容 |
| --- | --- |
| `ci.yml` | 型チェック、ESLint、Prettier、markdownlint、ビルド、カバレッジつきテスト、Playwright E2E と axe による WCAG 2.2 AA チェック (デスクトップ・スマホ、英・日、ライト・ダーク)、actionlint、`npm audit`、PR の依存関係レビュー。`main` でチェックが全部通ったら GitHub Pages へデプロイ (`npm audit` は参考扱い) |
| `codeql.yml` | JavaScript/TypeScript と GitHub Actions の CodeQL |
| `freshness.yml` | 料金・クォータ・新機能の再確認 issue を毎月作成 |
| Dependabot | npm と GitHub Actions の週次グループ更新 |

## 免責

AWS とは無関係の非公式解説です。料金やクォータは変わるので、設計・購入前に必ず AWS 公式ドキュメントを確認してください。
