import type { Application } from "@/data/types"
import { StagePill } from "@/components/StagePill"

type Props = {
  application: Application
  onClick?: (id: string) => void
  friendCount?: number
}

export function ApplicationCard({ application, onClick, friendCount = 0 }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(application.id)}
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      aria-label={`Open ${application.company} ${application.role}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-slate-900">
            {application.company}
          </div>
          <div className="truncate text-sm text-slate-600">
            {application.role} • {application.location}
          </div>
        </div>
        <StagePill stage={application.stage} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-xs text-slate-500">Applied: {application.appliedDate}</div>
        {friendCount > 0 ? (
          <div className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
            <span>👥</span>
            <span>{friendCount} friend{friendCount === 1 ? "" : "s"} applied</span>
          </div>
        ) : null}
      </div>
    </button>
  )
}
