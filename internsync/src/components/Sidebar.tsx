import { NavLink } from "react-router-dom"

const itemBase =
  "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"

export function Sidebar() {
  return (
    <aside className="hidden lg:block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]">
        <h2 className="text-sm font-semibold text-slate-900">Navigation</h2>
        <p className="mt-1 text-sm text-slate-600">
          Jump between the core MVP pages.
        </p>
        <div className="mt-4 space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [
                itemBase,
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100",
              ].join(" ")
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/applications"
            className={({ isActive }) =>
              [
                itemBase,
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100",
              ].join(" ")
            }
          >
            Applications
          </NavLink>
          <NavLink
            to="/companies"
            className={({ isActive }) =>
              [
                itemBase,
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100",
              ].join(" ")
            }
          >
            Companies
          </NavLink>
        </div>
      </div>
    </aside>
  )
}

