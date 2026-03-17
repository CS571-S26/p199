import type { ApplicationStage } from "@/data/types"

const stageColors: Record<ApplicationStage, string> = {
  Wishlist: "border-slate-200 bg-slate-50 text-slate-700",
  Applied: "border-blue-200 bg-blue-50 text-blue-700",
  OA: "border-violet-200 bg-violet-50 text-violet-700",
  Interview: "border-amber-200 bg-amber-50 text-amber-800",
  "Final Round": "border-orange-200 bg-orange-50 text-orange-800",
  Offer: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
  Withdrawn: "border-slate-200 bg-slate-100 text-slate-700",
}

export function StagePill({ stage }: { stage: ApplicationStage }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        stageColors[stage],
      ].join(" ")}
    >
      {stage}
    </span>
  )
}

