import { useState } from "react"
import { Modal } from "@/components/Modal"
import { Button } from "@/components/Button"
import type { Friend } from "@/data/types"

type Props = {
  open: boolean
  onClose: () => void
  company: string
  friends: Friend[]
  onSave: (friendId: string, note: string) => void
}

export function ShareJobModal({ open, onClose, company, friends, onSave }: Props) {
  const [friendId, setFriendId] = useState(friends[0]?.id ?? "")
  const [note, setNote] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!friendId) return
    onSave(friendId, note.trim())
    setNote("")
    onClose()
  }

  return (
    <Modal title={`Save tip about ${company}`} open={open} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="sj-friend" className="text-sm font-medium text-slate-700">
            Friend who mentioned it
          </label>
          <select
            id="sj-friend"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {friends.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sj-note" className="text-sm font-medium text-slate-700">
            Note{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="sj-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder='e.g. "Sponsors visas, great ML team"'
            className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          />
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!friendId}>
            Save tip
          </Button>
        </div>
      </form>
    </Modal>
  )
}
