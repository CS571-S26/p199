import { createContext } from "react"
import type {
  ActivityItem,
  Application,
  ApplicationStage,
  Company,
  Friend,
  FriendApplication,
  SharedJob,
} from "@/data/types"

export type DataContextValue = {
  applications: Application[]
  addApplication: (app: Application) => void
  updateApplication: (id: string, updates: Partial<Application> & { stage?: ApplicationStage }) => void
  deleteApplication: (id: string) => void
  companies: Company[]
  favoriteCompanyIds: Set<string>
  toggleFavoriteCompany: (companyId: string) => void
  activityFeed: ActivityItem[]
  friends: Friend[]
  friendApplications: FriendApplication[]
  sharedJobs: SharedJob[]
  shareJob: (data: Omit<SharedJob, "id" | "timestamp">) => void
}

export const DataContext = createContext<DataContextValue | null>(null)
