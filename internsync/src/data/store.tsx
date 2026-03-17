import React, { useMemo } from "react"
import { applications as seedApplications, companies as seedCompanies } from "@/data/mockData"
import type { Application } from "@/data/types"
import { useLocalStorageState } from "@/hooks/useLocalStorageState"
import { DataContext, type DataContextValue } from "@/data/context"

function safeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [userApplications, setUserApplications] = useLocalStorageState<Application[]>(
    "internsync.applications",
    []
  )
  const [favoriteIds, setFavoriteIds] = useLocalStorageState<string[]>(
    "internsync.favoriteCompanies",
    []
  )

  const applications = useMemo(() => {
    return [...userApplications, ...seedApplications]
  }, [userApplications])

  const companies = useMemo(() => seedCompanies, [])

  const favoriteCompanyIds = useMemo(() => new Set(favoriteIds), [favoriteIds])

  const value: DataContextValue = useMemo(
    () => ({
      applications,
      addApplication: (input) => {
        const app: Application = {
          ...input,
          id: input.id || safeId("app"),
          appliedDate: input.appliedDate || "—",
        }
        setUserApplications((prev) => [app, ...prev])
      },
      companies,
      favoriteCompanyIds,
      toggleFavoriteCompany: (companyId) => {
        setFavoriteIds((prev) => {
          const set = new Set(prev)
          if (set.has(companyId)) set.delete(companyId)
          else set.add(companyId)
          return Array.from(set)
        })
      },
    }),
    [applications, companies, favoriteCompanyIds, setFavoriteIds, setUserApplications]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

