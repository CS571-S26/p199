import { useState } from "react"
import { Modal } from "@/components/Modal"
import { Button } from "@/components/Button"
import type { CompanyQuestion, QuestionCategory, QuestionRound } from "@/data/types"
import type { Friend } from "@/data/types"

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"

const categoryLabels: Record<QuestionCategory, string> = {
  algorithms: "Algorithms / DS",
  behavioral: "Behavioral",
  system_design: "System Design",
  case: "Case / PM",
  other: "Other",
}

const roundLabels: Record<QuestionRound, string> = {
  OA: "OA",
  "Phone Screen": "Phone Screen",
  Technical: "Technical",
  "Final Round": "Final Round",
  Behavioral: "Behavioral",
}

type FormState = {
  friendId: string
  category: QuestionCategory
  round: QuestionRound
  text: string
}

export function AddQuestionModal({
  open,
  onClose,
  company,
  companyId,
  friends,
  onSave,
}: {
  open: boolean
  onClose: () => void
  company: string
  companyId?: string
  friends: Friend[]
  onSave: (q: Omit<CompanyQuestion, "id" | "timestamp">) => void
}) {
  const [form, setForm] = useState<FormState>({
    friendId: friends[0]?.id ?? "",
    category: "algorithms",
    round: "Technical",
    text: "",
  })

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    if (!form.text.trim() || !form.friendId) return
    onSave({
      company,
      companyId,
      friendId: form.friendId,
      category: form.category,
      round: form.round,
      text: form.text.trim(),
    })
    setForm({ friendId: friends[0]?.id ?? "", category: "algorithms", round: "Technical", text: "" })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={`Add question — ${company}`}>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Reported by</label>
            <select
              className={inputCls}
              value={form.friendId}
              onChange={(e) => set("friendId", e.target.value)}
            >
              {friends.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Round</label>
            <select
              className={inputCls}
              value={form.round}
              onChange={(e) => set("round", e.target.value as QuestionRound)}
            >
              {(Object.keys(roundLabels) as QuestionRound[]).map((r) => (
                <option key={r} value={r}>{roundLabels[r]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-medium text-slate-700">Category</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(categoryLabels) as QuestionCategory[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("category", c)}
                  className={[
                    "rounded-xl border px-3 py-1.5 text-xs font-medium transition",
                    form.category === c
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {categoryLabels[c]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">What was asked? *</label>
          <textarea
            autoFocus
            rows={4}
            className={inputCls + " resize-none"}
            value={form.text}
            onChange={(e) => set("text", e.target.value)}
            placeholder='e.g. "Got a DP problem on interval scheduling. Also asked about trade-offs in the approach."'
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.text.trim() || !form.friendId}>
            Add question
          </Button>
        </div>
      </div>
    </Modal>
  )
}
