import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { FilterBar } from "@/components/FilterBar"
import { ApplicationCard } from "@/components/ApplicationCard"
import { stages } from "@/data/mockData"
import { useAppData } from "@/data/useAppData"
import type { ApplicationStage } from "@/data/types"
import { Button } from "@/components/Button"
import { AddApplicationModal } from "@/components/AddApplicationModal"

export function ApplicationsPage() {
  const [stage, setStage] = useState<ApplicationStage | "All">("All")
  const navigate = useNavigate()
  const { applications, addApplication, friendApplications } = useAppData()
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    if (stage === "All") return applications
    return applications.filter((a) => a.stage === stage)
  }, [applications, stage])

  return (
    <Layout
      title="Applications"
      subtitle="Browse and filter your internship applications (mock data)."
      actions={
        <Button onClick={() => setOpen(true)}>
          Add Application
        </Button>
      }
    >
      <AddApplicationModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(input) => {
          addApplication({
            id: "",
            company: input.company,
            role: input.role,
            location: input.location,
            stage: input.stage,
            appliedDate: input.appliedDate,
            deadline: input.deadline || undefined,
            sponsorship: "unknown",
            notes: "",
            history: [
              {
                id: "created",
                date: input.appliedDate,
                label: "Applied",
              },
            ],
          })
        }}
      />
      <FilterBar stages={stages} value={stage} onChange={setStage} />

      <section className="mt-6" aria-labelledby="apps-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="apps-heading" className="text-sm font-semibold text-slate-900">
            Applications
          </h2>
          <div className="text-sm text-slate-600">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
            <h3 className="text-base font-semibold text-slate-900">
              No applications match this filter
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Try selecting “All” to see everything.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {filtered.map((a) => {
              const friendCount = friendApplications.filter(
                (fa) => fa.company.toLowerCase() === a.company.toLowerCase()
              ).length
              return (
                <ApplicationCard
                  key={a.id}
                  application={a}
                  onClick={(id) => navigate(`/applications/${id}`)}
                  friendCount={friendCount}
                />
              )
            })}
          </div>
        )}
      </section>
    </Layout>
  )
}

