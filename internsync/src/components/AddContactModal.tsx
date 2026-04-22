import { useState } from "react"
import { Modal } from "@/components/Modal"
import { Button } from "@/components/Button"
import type { ContactOutcome, ContactType, NetworkContact } from "@/data/types"

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"

const contactTypeLabels: Record<ContactType, string> = {
  recruiter: "Recruiter",
  engineer: "Engineer / IC",
  referral: "Referral",
  coffee_chat: "Coffee Chat",
  other: "Other",
}

const outcomeLabels: Record<ContactOutcome, string> = {
  referred: "Referred me",
  intro_scheduled: "Intro scheduled",
  no_response: "No response",
  ongoing: "Ongoing",
  closed: "Closed",
}

type FormState = {
  company: string
  name: string
  title: string
  type: ContactType
  date: string
  notes: string
  outcome: ContactOutcome | ""
  linkedIn: string
}

const defaultForm: FormState = {
  company: "",
  name: "",
  title: "",
  type: "recruiter",
  date: new Date().toISOString().split("T")[0],
  notes: "",
  outcome: "",
  linkedIn: "",
}

export function AddContactModal({
  open,
  onClose,
  onSave,
  initialCompany,
}: {
  open: boolean
  onClose: () => void
  onSave: (contact: Omit<NetworkContact, "id">) => void
  initialCompany?: string
}) {
  const [form, setForm] = useState<FormState>({
    ...defaultForm,
    company: initialCompany ?? "",
  })

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    if (!form.company.trim() || !form.name.trim() || !form.title.trim()) return
    onSave({
      company: form.company.trim(),
      name: form.name.trim(),
      title: form.title.trim(),
      type: form.type,
      date: form.date,
      notes: form.notes.trim() || undefined,
      outcome: (form.outcome as ContactOutcome) || undefined,
      linkedIn: form.linkedIn.trim() || undefined,
    })
    setForm({ ...defaultForm, company: initialCompany ?? "" })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Log a contact">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Company *</label>
            <input
              className={inputCls}
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              placeholder="Google"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Contact name *</label>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Sarah Chen"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Their title *</label>
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="University Recruiter"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Type</label>
            <select
              className={inputCls}
              value={form.type}
              onChange={(e) => set("type", e.target.value as ContactType)}
            >
              {(Object.keys(contactTypeLabels) as ContactType[]).map((t) => (
                <option key={t} value={t}>{contactTypeLabels[t]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Date</label>
            <input
              type="date"
              className={inputCls}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Outcome</label>
            <select
              className={inputCls}
              value={form.outcome}
              onChange={(e) => set("outcome", e.target.value as ContactOutcome | "")}
            >
              <option value="">— select —</option>
              {(Object.keys(outcomeLabels) as ContactOutcome[]).map((o) => (
                <option key={o} value={o}>{outcomeLabels[o]}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">LinkedIn URL</label>
          <input
            className={inputCls}
            value={form.linkedIn}
            onChange={(e) => set("linkedIn", e.target.value)}
            placeholder="linkedin.com/in/..."
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Notes</label>
          <textarea
            rows={3}
            className={inputCls + " resize-none"}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="How you met, what you talked about..."
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={!form.company.trim() || !form.name.trim() || !form.title.trim()}
          >
            Save contact
          </Button>
        </div>
      </div>
    </Modal>
  )
}
