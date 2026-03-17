import { Layout } from "@/components/Layout"
import { Button } from "@/components/Button"
import { StatCard } from "@/components/StatCard"
import { ActivityFeed } from "@/components/ActivityFeed"
import { activityFeed, upcomingDeadlines, stages } from "@/data/mockData"
import { useAppData } from "@/data/useAppData"

export function DashboardPage() {
  const { applications } = useAppData()

  const stageCounts = stages.map((s) => ({
    stage: s,
    count: applications.filter((a) => a.stage === s).length,
  }))

  const total = applications.length
  const interviews =
    applications.filter((a) => a.stage === "Interview" || a.stage === "Final Round")
      .length
  const offers = applications.filter((a) => a.stage === "Offer").length

  const topCompanies = Object.entries(
    applications.reduce<Record<string, number>>((acc, a) => {
      acc[a.company] = (acc[a.company] ?? 0) + 1
      return acc
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <Layout
      title="Dashboard"
      subtitle="A quick overview of your internship recruiting progress."
      actions={
        <Button
          onClick={() => {
            window.alert("Add applications from the Applications page in Phase 1.5.")
          }}
        >
          Add Application
        </Button>
      }
    >
      <section aria-labelledby="stats">
        <h2 id="stats" className="sr-only">
          Summary stats
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total applications" value={total} helper="This cycle" />
          <StatCard label="Interviews" value={interviews} helper="Including final rounds" />
          <StatCard label="Offers" value={offers} helper="Congratulations" />
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Snapshot</h2>
              <p className="mt-1 text-sm text-slate-600">
                Quick signals to prioritize your week.
              </p>
            </div>
            <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 sm:inline-flex">
              {offers > 0
                ? "Momentum: strong"
                : interviews > 0
                  ? "Momentum: building"
                  : "Momentum: early"}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium text-slate-500">OA pending</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {applications.filter((a) => a.stage === "OA").length}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium text-slate-500">Wishlist</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {applications.filter((a) => a.stage === "Wishlist").length}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-medium text-slate-500">
                Rejected/Withdrawn
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {
                  applications.filter(
                    (a) => a.stage === "Rejected" || a.stage === "Withdrawn"
                  ).length
                }
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Stage breakdown
              </h3>
              <div className="mt-3 space-y-2">
                {stageCounts
                  .filter((s) => s.count > 0)
                  .slice(0, 6)
                  .map((s) => (
                    <div
                      key={s.stage}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="text-sm text-slate-700">{s.stage}</div>
                      <div className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">
                        {s.count}
                      </div>
                    </div>
                  ))}
                {stageCounts.every((s) => s.count === 0) ? (
                  <div className="text-sm text-slate-600">
                    No applications yet—add your first one.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Top companies
              </h3>
              <div className="mt-3 space-y-2">
                {topCompanies.map(([name, count]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="truncate text-sm text-slate-700">{name}</div>
                    <div className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">
                      {count}
                    </div>
                  </div>
                ))}
                {topCompanies.length === 0 ? (
                  <div className="text-sm text-slate-600">
                    Your top companies will show up here.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
            <h2 className="text-sm font-semibold text-slate-900">
              Upcoming deadlines
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              A few items to keep on your radar.
            </p>
            <ul className="mt-4 space-y-3">
              {upcomingDeadlines.slice(0, 5).map((d) => (
                <li
                  key={d.id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-900">
                        {d.company}
                      </div>
                      <div className="truncate text-sm text-slate-600">{d.role}</div>
                    </div>
                    <div className="shrink-0 text-xs font-medium text-slate-700">
                      {d.dueDate}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <ActivityFeed items={activityFeed} />
        </div>
      </section>
    </Layout>
  )
}

