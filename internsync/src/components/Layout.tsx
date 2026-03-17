import type { PropsWithChildren } from "react"
import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"

type Props = PropsWithChildren<{
  title: string
  subtitle?: string
  actions?: React.ReactNode
}>

export function Layout({ title, subtitle, actions, children }: Props) {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-900">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
              ) : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

