import { createContext } from "react"
import type { Application, Company } from "@/data/types"

export type DataContextValue = {
  applications: Application[]
  addApplication: (app: Application) => void
  companies: Company[]
  favoriteCompanyIds: Set<string>
  toggleFavoriteCompany: (companyId: string) => void
}

export const DataContext = createContext<DataContextValue | null>(null)

