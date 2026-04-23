import { useMemo, useState } from "react"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/Button"
import { AddContactModal } from "@/components/AddContactModal"
import { useAppData } from "@/data/useAppData"
import type { ContactOutcome, ContactType } from "@/data/types"

const contactTypeLabels: Record<ContactType, string> = {
  recruiter: "Recruiter",
  engineer: "Engineer",
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

const outcomeColors: Record<ContactOutcome, string> = {
  referred: "border-emerald-200 bg-emerald-50 text-emerald-700",
  intro_scheduled: "border-violet-200 bg-violet-50 text-violet-700",
  no_response: "border-slate-200 bg-slate-50 text-slate-600",
  ongoing: "border-amber-200 bg-amber-50 text-amber-700",
  closed: "border-rose-200 bg-rose-50 text-rose-700",
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-").map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function NetworkingPage() {
  const { networkContacts, addNetworkContact, deleteNetworkContact, friends, addFriend, deleteFriend } = useAppData()
  const [open, setOpen] = useState(false)
  const [filterCompany, setFilterCompany] = useState("")
  const [newFriendName, setNewFriendName] = useState("")

  const companies = useMemo(
    () => Array.from(new Set(networkContacts.map((c) => c.company))).sort(),
    [networkContacts]
  )

  const filtered = useMemo(() => {
    if (!filterCompany) return networkContacts
    return networkContacts.filter((c) => c.company === filterCompany)
  }, [networkContacts, filterCompany])

  // Group by company
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const contact of filtered) {
      if (!map.has(contact.company)) map.set(contact.company, [])
      map.get(contact.company)!.push(contact)
    }
    return Array.from(map.entries())
  }, [filtered])

  function handleDelete(id: string, name: string, company: string) {
    if (!window.confirm(`Remove ${name} at ${company}?`)) return
    deleteNetworkContact(id)
  }

  return (
    <Layout
      title="Networking"
      subtitle="Track contacts, coffee chats, and referrals per company."
      actions={<Button onClick={() => setOpen(true)}>Log contact</Button>}
    >
      <AddContactModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(contact) => addNetworkContact(contact)}
      />

      {/* Friends */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
        <h2 className="text-sm font-semibold text-slate-900">Your friends</h2>
        <p className="mt-1 text-sm text-slate-600">Add friends to track alongside your applications.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {friends.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5"
            >
              <span className="text-sm font-medium text-slate-800">{f.name}</span>
              <button
                onClick={() => {
                  if (!window.confirm(`Remove ${f.name} from your friends?`)) return
                  deleteFriend(f.id)
                }}
                className="text-slate-400 hover:text-rose-500"
                title="Remove friend"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!newFriendName.trim()) return
            addFriend(newFriendName)
            setNewFriendName("")
          }}
        >
          <input
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            placeholder="Friend's name"
            className="w-48 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          />
          <Button type="submit" disabled={!newFriendName.trim()}>Add friend</Button>
        </form>
      </div>

      {/* Stats row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
          <div className="text-xs font-medium text-slate-500">Total contacts</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{networkContacts.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
          <div className="text-xs font-medium text-slate-500">Referrals secured</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">
            {networkContacts.filter((c) => c.outcome === "referred").length}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
          <div className="text-xs font-medium text-slate-500">Companies covered</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{companies.length}</div>
        </div>
      </div>

      {/* Filter */}
      {companies.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCompany("")}
            className={[
              "rounded-xl border px-3 py-1.5 text-sm font-medium transition",
              !filterCompany
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            All
          </button>
          {companies.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCompany(c === filterCompany ? "" : c)}
              className={[
                "rounded-xl border px-3 py-1.5 text-sm font-medium transition",
                filterCompany === c
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Contacts list */}
      <section className="mt-6 space-y-6">
        {grouped.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
            <h3 className="text-base font-semibold text-slate-900">No contacts yet</h3>
            <p className="mt-1 text-sm text-slate-600">
              Log your first contact — recruiters, coffee chats, referrals — to track your network.
            </p>
            <div className="mt-4">
              <Button onClick={() => setOpen(true)}>Log contact</Button>
            </div>
          </div>
        ) : (
          grouped.map(([company, contacts]) => (
            <div key={company}>
              <h2 className="mb-3 text-sm font-semibold text-slate-900">{company}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">{contact.name}</div>
                        <div className="text-xs text-slate-500">{contact.title}</div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {contactTypeLabels[contact.type]}
                        </span>
                        {contact.outcome ? (
                          <span
                            className={[
                              "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                              outcomeColors[contact.outcome],
                            ].join(" ")}
                          >
                            {outcomeLabels[contact.outcome]}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {contact.notes ? (
                      <p className="mt-3 text-sm leading-5 text-slate-600">{contact.notes}</p>
                    ) : null}

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{formatDate(contact.date)}</span>
                        {contact.linkedIn ? (
                          <a
                            href={`https://${contact.linkedIn.replace(/^https?:\/\//, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-violet-600 hover:underline"
                          >
                            LinkedIn
                          </a>
                        ) : null}
                      </div>
                      <button
                        onClick={() => handleDelete(contact.id, contact.name, contact.company)}
                        className="text-xs text-slate-400 hover:text-rose-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </Layout>
  )
}
