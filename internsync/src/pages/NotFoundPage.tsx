import { Link } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { getButtonClassName } from "@/components/buttonStyles"

export function NotFoundPage() {
  return (
    <Layout title="Page not found" subtitle="That route doesn’t exist.">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
        <h2 className="text-base font-semibold text-slate-900">404</h2>
        <p className="mt-2 text-sm text-slate-600">
          Use the navigation to get back on track.
        </p>
        <div className="mt-4">
          <Link to="/" className={getButtonClassName("secondary")}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </Layout>
  )
}

