import type { PropsWithChildren } from "react"
import { useEffect, useRef } from "react"

type Props = PropsWithChildren<{
  title: string
  open: boolean
  onClose: () => void
}>

export function Modal({ title, open, onClose, children }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const el = panelRef.current
    if (!el) return
    const first =
      (el.querySelector(
        'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement | null) ?? null
    first?.focus?.()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose, open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 grid place-items-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        ref={panelRef}
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">{title}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

