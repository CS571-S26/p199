import type { Application } from "@/data/types"
import { StagePill } from "@/components/StagePill"

type Props = {
  application: Application
  onClick?: (id: string) => void
}

export function ApplicationCard({ application, onClick }: Props) {
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
      <div className="mt-3 text-xs text-slate-500">
        Applied: {application.appliedDate}
      </div>
    </button>
  )
}

