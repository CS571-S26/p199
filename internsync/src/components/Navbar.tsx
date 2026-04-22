import { NavLink } from "react-router-dom"

const linkBase =
  "rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <span className="text-sm font-semibold">IS</span>
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-semibold text-slate-900">InternSync</div>
            <div className="text-xs text-slate-500">Internship tracker</div>
          </div>
        </div>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-1">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  [
                    linkBase,
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")
                }
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/applications"
                className={({ isActive }) =>
                  [
                    linkBase,
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")
                }
              >
                Applications
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/companies"
                className={({ isActive }) =>
                  [
                    linkBase,
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")
                }
              >
                Companies
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/networking"
                className={({ isActive }) =>
                  [
                    linkBase,
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")
                }
              >
                Networking
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

