import type { L } from "@/i18n/lang";
import { DX_AS_OF } from "@/data/asOf";

export const UI = {
  clickHint: {
    en: "Tap or click any part of the diagram.",
    ja: "図の各パーツをタップ (クリック) すると解説が出ます。",
  },
  asOf: {
    en: `Facts verified against AWS documentation as of ${DX_AS_OF}.`,
    ja: `記載内容は ${DX_AS_OF} 時点の AWS 公式ドキュメントで確認済み。`,
  },
} satisfies Record<string, L>;
