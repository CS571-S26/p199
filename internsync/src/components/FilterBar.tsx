import type { ApplicationStage } from "@/data/types"

type Props = {
  stages: ApplicationStage[]
  value: ApplicationStage | "All"
  onChange: (value: ApplicationStage | "All") => void
}

export function FilterBar({ stages, value, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Filter applications
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Choose a stage to narrow the list.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="stage" className="text-sm font-medium text-slate-700">
            Stage
          </label>
          <select
            id="stage"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            value={value}
            onChange={(e) => onChange(e.target.value as ApplicationStage | "All")}
          >
            <option value="All">All</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

