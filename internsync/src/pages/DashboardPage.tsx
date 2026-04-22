import { useMemo, useState } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/Button"
import { StatCard } from "@/components/StatCard"
import { ActivityFeed } from "@/components/ActivityFeed"
import { AddApplicationModal } from "@/components/AddApplicationModal"
import { stages, friendStreaks } from "@/data/mockData"
import { useAppData } from "@/data/useAppData"

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-").map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getWeekStart(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split("T")[0]
}

function getCurrentStreak(applications: { stage: string; appliedDate: string }[]): number {
  const appliedDates = new Set(
    applications
      .filter((a) => a.stage !== "Wishlist" && a.appliedDate && a.appliedDate !== "—")
      .map((a) => a.appliedDate)
  )
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const current = new Date(today)
  while (true) {
    const dateStr = current.toISOString().split("T")[0]
    if (appliedDates.has(dateStr)) {
      streak++
      current.setDate(current.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export function DashboardPage() {
  const { applications, addApplication, activityFeed, friendApplications, friends, sharedJobs, weeklyGoal, setWeeklyGoal } =
    useAppData()

  const [open, setOpen] = useState(false)
  const [prefillCompany, setPrefillCompany] = useState<string | undefined>()

  function openAddModal(company?: string) {
    setPrefillCompany(company)
    setOpen(true)
  }

  const stageCounts = stages.map((s) => ({
    stage: s,
    count: applications.filter((a) => a.stage === s).length,
  }))

  const total = applications.length
  const interviews =
    applications.filter((a) => a.stage === "Interview" || a.stage === "Final Round").length
  const offers = applications.filter((a) => a.stage === "Offer").length

  const topCompanies = Object.entries(
    applications.reduce<Record<string, number>>((acc, a) => {
      acc[a.company] = (acc[a.company] ?? 0) + 1
      return acc
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const upcomingDeadlines = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return applications
      .filter((a) => {
        if (!a.deadline || a.deadline === "—") return false
        const parts = a.deadline.split("-").map(Number)
        if (parts.length !== 3 || parts.some(isNaN)) return false
        const d = new Date(parts[0], parts[1] - 1, parts[2])
        return d >= today
      })
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5)
  }, [applications])

  const friendOpportunities = useMemo(() => {
    const userCompanies = new Set(applications.map((a) => a.company.toLowerCase()))
    const map = new Map<string, { company: string; friendIds: Set<string> }>()
    for (const fa of friendApplications) {
      const key = fa.company.toLowerCase()
      if (userCompanies.has(key)) continue
      if (!map.has(key)) map.set(key, { company: fa.company, friendIds: new Set() })
      map.get(key)!.friendIds.add(fa.friendId)
    }
    return Array.from(map.values())
      .sort((a, b) => b.friendIds.size - a.friendIds.size)
      .slice(0, 5)
      .map((entry) => ({
        company: entry.company,
        friendCount: entry.friendIds.size,
        friendNames: Array.from(entry.friendIds)
          .map((fid) => friends.find((f) => f.id === fid)?.name ?? "")
          .filter(Boolean),
      }))
  }, [applications, friendApplications, friends])

  const sharedWithYou = useMemo(
    () =>
      sharedJobs.slice(0, 5).map((job) => ({
        ...job,
        friendName: friends.find((f) => f.id === job.fromFriendId)?.name ?? "Friend",
      })),
    [sharedJobs, friends]
  )

  const currentStreak = useMemo(() => getCurrentStreak(applications), [applications])

  const weekStart = getWeekStart(new Date())
  const appsThisWeek = useMemo(() => {
    return applications.filter((a) => {
      if (!a.appliedDate || a.appliedDate === "—" || a.stage === "Wishlist") return false
      return a.appliedDate >= weekStart
    }).length
  }, [applications, weekStart])

  const goalTarget = weeklyGoal?.target ?? 0
  const goalProgress = goalTarget > 0 ? Math.min(appsThisWeek / goalTarget, 1) : 0

  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState("")

  const friendStreakList = useMemo(
    () =>
      friendStreaks.map((fs) => ({
        ...fs,
        name: friends.find((f) => f.id === fs.friendId)?.name ?? "Friend",
      })),
    [friends]
  )

  return (
    <Layout
      title="Dashboard"
      subtitle="A quick overview of your internship recruiting progress."
      actions={<Button onClick={() => openAddModal()}>Add Application</Button>}
    >
      <AddApplicationModal
        open={open}
        onClose={() => setOpen(false)}
        initialValues={prefillCompany ? { company: prefillCompany } : undefined}
        onSave={(input) => {
          addApplication({
            id: "",
            company: input.company,
            role: input.role,
            location: input.location,
            stage: input.stage,
            appliedDate: input.appliedDate,
            deadline: input.deadline || undefined,
            sponsorship: "unknown",
            notes: "",
            history: [
              {
                id: "created",
                date: input.appliedDate,
                label: "Applied",
              },
            ],
          })
        }}
      />

      {/* Stats */}
      <section aria-labelledby="stats">
        <h2 id="stats" className="sr-only">Summary stats</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total applications" value={total} helper="This cycle" />
          <StatCard label="Interviews" value={interviews} helper="Including final rounds" />
          <StatCard label="Offers" value={offers} helper="Congratulations" />
        </div>
      </section>

      {/* Streaks + Weekly Goal */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Weekly goal */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Weekly goal</h2>
              <p className="mt-1 text-sm text-slate-600">
                {goalTarget > 0
                  ? `${appsThisWeek} of ${goalTarget} applications this week`
                  : "Set a target for this week."}
              </p>
            </div>
            <button
              onClick={() => { setGoalInput(goalTarget > 0 ? String(goalTarget) : ""); setEditingGoal(true) }}
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              {goalTarget > 0 ? "Edit" : "Set goal"}
            </button>
          </div>
          {editingGoal ? (
            <div className="mt-4 flex items-center gap-2">
              <input
                autoFocus
                type="number"
                min={1}
                max={50}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const n = parseInt(goalInput)
                    if (n > 0) setWeeklyGoal({ target: n, weekStart })
                    setEditingGoal(false)
                  }
                  if (e.key === "Escape") setEditingGoal(false)
                }}
                className="w-24 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
                placeholder="5"
              />
              <button
                onClick={() => {
                  const n = parseInt(goalInput)
                  if (n > 0) setWeeklyGoal({ target: n, weekStart })
                  setEditingGoal(false)
                }}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                Save
              </button>
              <button
                onClick={() => setEditingGoal(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          ) : goalTarget > 0 ? (
            <div className="mt-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={[
                    "h-full rounded-full transition-all",
                    goalProgress >= 1 ? "bg-emerald-500" : "bg-slate-900",
                  ].join(" ")}
                  style={{ width: `${goalProgress * 100}%` }}
                />
              </div>
              {goalProgress >= 1 && (
                <p className="mt-2 text-xs font-medium text-emerald-600">Goal reached this week!</p>
              )}
            </div>
          ) : null}
        </div>

        {/* Streaks */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
          <h2 className="text-sm font-semibold text-slate-900">Application streaks</h2>
          <p className="mt-1 text-sm text-slate-600">Days in a row applying — keep the momentum.</p>
          <div className="mt-4 space-y-2">
            {/* Your streak */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">You</span>
                {currentStreak >= 3 && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    on fire
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-slate-900">{currentStreak}</span>
                <span className="text-xs text-slate-500">day{currentStreak !== 1 ? "s" : ""}</span>
              </div>
            </div>
            {/* Friends' streaks */}
            {friendStreakList.map((fs) => (
              <div
                key={fs.friendId}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-700">{fs.name}</span>
                  {fs.streak >= 5 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      on fire
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-slate-600">{fs.streak}</span>
                  <span className="text-xs text-slate-500">day{fs.streak !== 1 ? "s" : ""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Snapshot + Deadlines/Activity */}
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
              <div className="text-xs font-medium text-slate-500">Rejected/Withdrawn</div>
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
              <h3 className="text-sm font-semibold text-slate-900">Stage breakdown</h3>
              <div className="mt-3 space-y-2">
                {stageCounts
                  .filter((s) => s.count > 0)
                  .slice(0, 6)
                  .map((s) => (
                    <div key={s.stage} className="flex items-center justify-between gap-3">
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
              <h3 className="text-sm font-semibold text-slate-900">Top companies</h3>
              <div className="mt-3 space-y-2">
                {topCompanies.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between gap-3">
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
            <h2 className="text-sm font-semibold text-slate-900">Upcoming deadlines</h2>
            <p className="mt-1 text-sm text-slate-600">
              Applications with approaching deadlines.
            </p>
            {upcomingDeadlines.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                No upcoming deadlines. Add a deadline when creating an application.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {upcomingDeadlines.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-slate-900">
                          {a.company}
                        </div>
                        <div className="truncate text-sm text-slate-600">{a.role}</div>
                      </div>
                      <div className="shrink-0 text-xs font-medium text-slate-700">
                        {formatDate(a.deadline!)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ActivityFeed items={activityFeed} />
        </div>
      </section>

      {/* Opportunities from Friends + Shared with You */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Opportunities from Friends */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Opportunities from friends</h2>
            <p className="mt-1 text-sm text-slate-600">
              Companies your friends applied to that you haven't yet.
            </p>
          </div>
          {friendOpportunities.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              You've already applied everywhere your friends have. Nice work!
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {friendOpportunities.map((opp) => (
                <li
                  key={opp.company}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">
                      {opp.company}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {opp.friendNames.join(", ")} applied
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="h-8 shrink-0 px-3 py-1 text-xs"
                    onClick={() => openAddModal(opp.company)}
                  >
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Shared with You */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Shared with you</h2>
            <p className="mt-1 text-sm text-slate-600">
              Tips your friends saved about companies.
            </p>
          </div>
          {sharedWithYou.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              No tips yet. Save a friend's tip from the Companies page.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {sharedWithYou.map((job) => (
                <li
                  key={job.id}
                  className="rounded-xl border border-violet-100 bg-violet-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900">
                        <span className="text-violet-700">{job.friendName}</span>
                        {" shared "}
                        <span>{job.company}</span>
                      </div>
                      {job.note ? (
                        <p className="mt-1 text-xs leading-5 text-slate-600">"{job.note}"</p>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-xs text-slate-400">
                      {formatTimestamp(job.timestamp)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </Layout>
  )
}
