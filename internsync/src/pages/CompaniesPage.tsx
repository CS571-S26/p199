import { useMemo, useState } from "react"
import { Layout } from "@/components/Layout"
import { CompanyCard } from "@/components/CompanyCard"
import { ShareJobModal } from "@/components/ShareJobModal"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { useAppData } from "@/data/useAppData"

export function CompaniesPage() {
  const [query, setQuery] = useState("")
  const debounced = useDebouncedValue(query, 150)
  const { companies, favoriteCompanyIds, toggleFavoriteCompany, sharedJobs, friends, shareJob } =
    useAppData()

  const [shareTarget, setShareTarget] = useState<{ company: string; companyId: string } | null>(
    null
  )

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return companies
    return companies.filter((c) => c.name.toLowerCase().includes(q))
  }, [companies, debounced])

  const sharedNotesByCompany = useMemo(() => {
    const map: Record<string, { friendName: string; note: string; timestamp: string }[]> = {}
    for (const job of sharedJobs) {
      if (!job.companyId) continue
      const friendName = friends.find((f) => f.id === job.fromFriendId)?.name ?? "Friend"
      if (!map[job.companyId]) map[job.companyId] = []
      map[job.companyId].push({ friendName, note: job.note, timestamp: job.timestamp })
    }
    return map
  }, [sharedJobs, friends])

  return (
    <Layout
      title="Companies"
      subtitle="Explore companies with sponsorship signals."
    >
      {shareTarget ? (
        <ShareJobModal
          open
          onClose={() => setShareTarget(null)}
          company={shareTarget.company}
          friends={friends}
          onSave={(friendId, note) => {
            shareJob({
              company: shareTarget.company,
              companyId: shareTarget.companyId,
              fromFriendId: friendId,
              note,
            })
            setShareTarget(null)
          }}
        />
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Search companies
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Filter by name to find companies quickly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="company-search"
              className="text-sm font-medium text-slate-700"
            >
              Search
            </label>
            <input
              id="company-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Google"
              className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            />
          </div>
        </div>
      </div>

      <section className="mt-6" aria-labelledby="companies-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="companies-heading" className="text-sm font-semibold text-slate-900">
            Companies
          </h2>
          <div className="text-sm text-slate-600">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
            <h3 className="text-base font-semibold text-slate-900">
              No matches
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {filtered.map((c) => (
              <CompanyCard
                key={c.id}
                company={c}
                favorite={favoriteCompanyIds.has(c.id)}
                onToggleFavorite={() => toggleFavoriteCompany(c.id)}
                onShare={() => setShareTarget({ company: c.name, companyId: c.id })}
                sharedNotes={sharedNotesByCompany[c.id] ?? []}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}
