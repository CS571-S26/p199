import { useMemo, useState } from "react"
import { Modal } from "@/components/Modal"
import { Button } from "@/components/Button"
import { stages } from "@/data/mockData"
import type { ApplicationStage } from "@/data/types"

type FormState = {
  company: string
  role: string
  location: string
  stage: ApplicationStage
  appliedDate: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSave: (input: FormState) => void
}

export function AddApplicationModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormState>({
    company: "",
    role: "",
    location: "",
    stage: "Applied",
    appliedDate: "",
  })

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.company.trim()) e.company = "Company is required."
    if (!form.role.trim()) e.role = "Role is required."
    if (!form.location.trim()) e.location = "Location is required."
    if (!form.appliedDate.trim()) e.appliedDate = "Applied date is required."
    return e
  }, [form])

  const canSubmit = Object.keys(errors).length === 0

  return (
    <Modal title="Add application" open={open} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!canSubmit) return
          onSave(form)
          onClose()
          setForm({
            company: "",
            role: "",
            location: "",
            stage: "Applied",
            appliedDate: "",
          })
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="company" className="text-sm font-medium text-slate-700">
              Company
            </label>
            <input
              id="company"
              value={form.company}
              onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
              placeholder="e.g. Stripe"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            />
            {errors.company ? (
              <div className="mt-1 text-xs text-rose-600">{errors.company}</div>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="role" className="text-sm font-medium text-slate-700">
              Role
            </label>
            <input
              id="role"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              placeholder="e.g. SWE Intern"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            />
            {errors.role ? (
              <div className="mt-1 text-xs text-rose-600">{errors.role}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="location" className="text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              id="location"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              placeholder="e.g. New York, NY"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            />
            {errors.location ? (
              <div className="mt-1 text-xs text-rose-600">{errors.location}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="stage" className="text-sm font-medium text-slate-700">
              Stage
            </label>
            <select
              id="stage"
              value={form.stage}
              onChange={(e) =>
                setForm((p) => ({ ...p, stage: e.target.value as ApplicationStage }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="appliedDate"
              className="text-sm font-medium text-slate-700"
            >
              Applied date
            </label>
            <input
              id="appliedDate"
              type="date"
              value={form.appliedDate}
              onChange={(e) => setForm((p) => ({ ...p, appliedDate: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            />
            {errors.appliedDate ? (
              <div className="mt-1 text-xs text-rose-600">{errors.appliedDate}</div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            Save application
          </Button>
        </div>
      </form>
    </Modal>
  )
}

