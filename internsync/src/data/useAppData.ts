import { useContext } from "react"
import { DataContext } from "@/data/context"

export function useAppData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider")
  return ctx
}

