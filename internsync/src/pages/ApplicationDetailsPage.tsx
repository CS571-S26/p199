import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { StagePill } from "@/components/StagePill"
import { getButtonClassName } from "@/components/buttonStyles"
import { useAppData } from "@/data/useAppData"
import { stages } from "@/data/mockData"
import type { ApplicationStage } from "@/data/types"

function formatDate(dateStr: string | undefined): string {
  if (!dateStr || dateStr === "—") return "—"
  const parts = dateStr.split("-").map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <div className="text-right text-sm text-slate-900">{value}</div>
    </div>
  )
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"

export function ApplicationDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { applications, companies, updateApplication, deleteApplication, friendApplications, friends } =
    useAppData()

  const app = applications.find((a) => a.id === id)
  const company = app?.companyId
    ? companies.find((c) => c.id === app.companyId)
    : companies.find((c) => c.name === app?.company)

  const friendsAtCompany = app
    ? friendApplications
        .filter((fa) => fa.company.toLowerCase() === app.company.toLowerCase())
        .map((fa) => ({
          ...fa,
          friendName: friends.find((f) => f.id === fa.friendId)?.name ?? fa.friendId,
        }))
    : []

  // Edit state — initialised lazily when app loads
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState("")
  const [editingLocation, setEditingLocation] = useState(false)
  const [locationValue, setLocationValue] = useState("")
  const [editingDeadline, setEditingDeadline] = useState(false)
  const [deadlineValue, setDeadlineValue] = useState("")

  if (!app) {
    return (
      <Layout title="Application" subtitle="This application could not be found.">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
          <h2 className="text-base font-semibold text-slate-900">Not found</h2>
          <p className="mt-2 text-sm text-slate-600">
            The application you're looking for doesn't exist (or was removed from local storage).
          </p>
          <div className="mt-4">
            <Link to="/applications" className={getButtonClassName("secondary")}>
              Back to applications
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const sponsorship = app.sponsorship ?? company?.sponsorship ?? "unknown"

  function handleDelete() {
    if (!window.confirm(`Remove ${app!.company} — ${app!.role}? This cannot be undone.`)) return
    deleteApplication(app!.id)
    navigate("/applications")
  }

  function handleStageChange(newStage: ApplicationStage) {
    updateApplication(app!.id, { stage: newStage })
  }

  return (
    <Layout
      title={`${app.company} — ${app.role}`}
      subtitle="Details, notes, and a lightweight timeline."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 shadow-sm hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            Delete
          </button>
          <Link to="/applications" className={getButtonClassName("secondary")}>
            Back
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)] lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-slate-900">{app.company}</h2>
              <p className="mt-1 truncate text-sm text-slate-600">
                {app.role} •{" "}
                {editingLocation ? (
                  <span className="inline-flex items-center gap-1">
                    <input
                      autoFocus
                      value={locationValue}
                      onChange={(e) => setLocationValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateApplication(app.id, { location: locationValue })
                          setEditingLocation(false)
                        }
                        if (e.key === "Escape") setEditingLocation(false)
                      }}
                      className="rounded-lg border border-slate-300 px-2 py-0.5 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
                    />
                    <button
                      onClick={() => {
                        updateApplication(app.id, { location: locationValue })
                        setEditingLocation(false)
                      }}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      Save
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => { setLocationValue(app.location); setEditingLocation(true) }}
                    className="hover:underline focus-visible:outline-none"
                    title="Edit location"
                  >
                    {app.location}
                  </button>
                )}
              </p>
            </div>
            <div className="shrink-0">
              <StagePill stage={app.stage} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
            <InfoRow label="Applied date" value={formatDate(app.appliedDate)} />

            {/* Editable deadline */}
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-medium text-slate-600">Deadline</div>
              {editingDeadline ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="date"
                    value={deadlineValue}
                    onChange={(e) => setDeadlineValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateApplication(app.id, { deadline: deadlineValue || undefined })
                        setEditingDeadline(false)
                      }
                      if (e.key === "Escape") setEditingDeadline(false)
                    }}
                    className="rounded-lg border border-slate-300 px-2 py-0.5 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
                  />
                  <button
                    onClick={() => {
                      updateApplication(app.id, { deadline: deadlineValue || undefined })
                      setEditingDeadline(false)
                    }}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setDeadlineValue(app.deadline ?? ""); setEditingDeadline(true) }}
                  className="text-right text-sm text-slate-900 hover:underline focus-visible:outline-none"
                  title="Edit deadline"
                >
                  {formatDate(app.deadline) || "—"}
                </button>
              )}
            </div>

            <InfoRow
              label="Sponsorship"
              value={sponsorship === "yes" ? "Yes" : sponsorship === "no" ? "No" : "Unknown"}
            />

            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-medium text-slate-600">Stage</div>
              <select
                value={app.stage}
                onChange={(e) => handleStageChange(e.target.value as ApplicationStage)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                {stages.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Editable notes */}
          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
              {!editingNotes && (
                <button
                  onClick={() => { setNotesValue(app.notes ?? ""); setEditingNotes(true) }}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 focus-visible:outline-none"
                >
                  Edit
                </button>
              )}
            </div>
            {editingNotes ? (
              <div className="mt-2 space-y-2">
                <textarea
                  autoFocus
                  rows={4}
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  className={inputCls + " resize-none"}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateApplication(app.id, { notes: notesValue })
                      setEditingNotes(false)
                    }}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingNotes(false)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {app.notes?.trim()
                  ? app.notes
                  : "No notes yet — click Edit to add one."}
              </p>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
            <h2 className="text-sm font-semibold text-slate-900">Timeline</h2>
            <p className="mt-1 text-sm text-slate-600">A simple history of progress.</p>
            <ol className="mt-4 space-y-3">
              {(app.history ?? []).map((h) => (
                <li key={h.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900">{h.label}</div>
                      {h.detail ? (
                        <div className="mt-1 text-sm text-slate-600">{h.detail}</div>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-xs font-medium text-slate-700">
                      {formatDate(h.date)}
                    </div>
                  </div>
                </li>
              ))}
              {(app.history ?? []).length === 0 ? (
                <li className="text-sm text-slate-600">No timeline items yet.</li>
              ) : null}
            </ol>
          </section>

          {company ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
              <h2 className="text-sm font-semibold text-slate-900">Company</h2>
              <p className="mt-1 text-sm text-slate-600">{company.description}</p>
            </section>
          ) : null}

          {friendsAtCompany.length > 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
              <h2 className="text-sm font-semibold text-slate-900">
                Friends at {app.company}
              </h2>
              <p className="mt-1 text-sm text-slate-600">See where your network stands.</p>
              <ul className="mt-4 space-y-2">
                {friendsAtCompany.map((fa, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <span className="text-sm font-medium text-slate-800">{fa.friendName}</span>
                    <span
                      className={[
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                        fa.stage === "Offer"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : fa.stage === "Final Round" || fa.stage === "Interview"
                            ? "border-amber-200 bg-amber-50 text-amber-800"
                            : fa.stage === "Rejected"
                              ? "border-rose-200 bg-rose-50 text-rose-700"
                              : "border-slate-200 bg-slate-50 text-slate-700",
                      ].join(" ")}
                    >
                      {fa.stage}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </Layout>
  )
}
