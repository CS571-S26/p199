import type { Company } from "@/data/types"
import { Button } from "@/components/Button"

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

export function CompanyCard({
  company,
  favorite,
  onToggleFavorite,
}: {
  company: Company
  favorite: boolean
  onToggleFavorite: () => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900">
            {company.name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <SponsorshipBadge value={company.sponsorship} />
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
    </div>
  )
}

