import type { Company, CompanyQuestion, QuestionCategory } from "@/data/types"
import { Button } from "@/components/Button"

type SharedNote = {
  friendName: string
  note: string
  timestamp: string
}

const categoryColors: Record<QuestionCategory, string> = {
  algorithms: "border-blue-200 bg-blue-50 text-blue-700",
  behavioral: "border-amber-200 bg-amber-50 text-amber-700",
  system_design: "border-violet-200 bg-violet-50 text-violet-700",
  case: "border-teal-200 bg-teal-50 text-teal-700",
  other: "border-slate-200 bg-slate-50 text-slate-600",
}

const categoryLabels: Record<QuestionCategory, string> = {
  algorithms: "Algo",
  behavioral: "Behavioral",
  system_design: "System Design",
  case: "Case",
  other: "Other",
}

function SponsorshipBadge({ value }: { value: Company["sponsorship"] }) {
  const cls =
    value === "yes"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : value === "no"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-slate-200 bg-slate-50 text-slate-700"

  const label =
    value === "yes" ? "Sponsors visa" : value === "no" ? "No sponsorship" : "Unknown"

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        cls,
      ].join(" ")}
    >
      {label}
    </span>
  )
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function CompanyCard({
  company,
  favorite,
  onToggleFavorite,
  onShare,
  onAddQuestion,
  sharedNotes = [],
  questions = [],
  friendNames = {},
}: {
  company: Company
  favorite: boolean
  onToggleFavorite: () => void
  onShare?: () => void
  onAddQuestion?: () => void
  sharedNotes?: SharedNote[]
  questions?: CompanyQuestion[]
  friendNames?: Record<string, string>
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900">
            {company.name}
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <SponsorshipBadge value={company.sponsorship} />
          {onAddQuestion ? (
            <Button
              variant="ghost"
              className="h-8 px-3 py-1 text-xs"
              onClick={onAddQuestion}
              title="Add interview question"
            >
              + Question
            </Button>
          ) : null}
          {onShare ? (
            <Button
              variant="ghost"
              className="h-8 px-3 py-1 text-xs"
              onClick={onShare}
              aria-label="Save a friend's tip about this company"
              title="Save tip from a friend"
            >
              Friend tip
            </Button>
          ) : null}
          <Button
            variant="ghost"
            className="h-8 px-3 py-1 text-xs"
            onClick={onToggleFavorite}
            aria-pressed={favorite}
            aria-label={favorite ? "Remove bookmark" : "Bookmark company"}
            title={favorite ? "Bookmarked" : "Bookmark"}
          >
            {favorite ? "Bookmarked" : "Bookmark"}
          </Button>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{company.description}</p>

      {questions.length > 0 ? (
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          <div className="text-xs font-medium text-slate-500">Interview questions from friends</div>
          {questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-1.5 py-0.5 text-xs font-medium",
                      categoryColors[q.category],
                    ].join(" ")}
                  >
                    {categoryLabels[q.category]}
                  </span>
                  <span className="text-xs text-slate-500">{q.round}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">
                    {friendNames[q.friendId] ?? "Friend"}
                  </span>
                  <span className="text-xs text-slate-400">{formatTimestamp(q.timestamp)}</span>
                </div>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-slate-700">{q.text}</p>
            </div>
          ))}
        </div>
      ) : null}

      {sharedNotes.length > 0 ? (
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          <div className="text-xs font-medium text-slate-500">Shared by friends</div>
          {sharedNotes.map((n, i) => (
            <div key={i} className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-violet-800">{n.friendName}</span>
                <span className="text-xs text-slate-400">{formatTimestamp(n.timestamp)}</span>
              </div>
              {n.note ? (
                <p className="mt-1 text-xs leading-5 text-slate-600">{n.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
