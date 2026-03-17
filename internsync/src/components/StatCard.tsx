type Props = {
  label: string
  value: string | number
  helper?: string
}

export function StatCard({ label, value, helper }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
      {helper ? (
        <div className="mt-2 text-sm text-slate-500">{helper}</div>
      ) : null}
    </div>
  )
}

