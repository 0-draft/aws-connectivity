import type { L } from "@/i18n/lang";
import { DX_AS_OF } from "@/data/asOf";

export const UI = {
  clickHint: {
    en: "Tap or click any part of the diagram.",
    ja: "図の各パーツをタップ (クリック) すると解説が出ます。",
  },
  asOf: {
    en: `Prices, quotas, locations, the SLA and launches checked against AWS documentation as of ${DX_AS_OF}; each research note gives its own verification date.`,
    ja: `料金・クォータ・ロケーション・SLA・新発表は ${DX_AS_OF} 時点の AWS 公式ドキュメントで確認済み (各調査ノートに個別の確認日あり)。`,
  },
} satisfies Record<string, L>;
