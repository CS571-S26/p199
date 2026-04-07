import type { ActivityItem } from "@/data/types"

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
      <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-900">
                  {item.title}
                </div>
                <div className="mt-1 text-sm text-slate-600">{item.detail}</div>
              </div>
              <div className="shrink-0 text-xs text-slate-500">{item.date}</div>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          No recent activity yet. Add or update an application to see activity here.
        </p>
      ) : null}
    </div>
  )
}

