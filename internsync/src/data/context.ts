import { createContext } from "react"
import type {
  ActivityItem,
  Application,
  ApplicationStage,
  Company,
  CompanyQuestion,
  Friend,
  FriendApplication,
  NetworkContact,
  SharedJob,
  WeeklyGoal,
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
  addFriend: (name: string) => void
  deleteFriend: (id: string) => void
  friendApplications: FriendApplication[]
  sharedJobs: SharedJob[]
  shareJob: (data: Omit<SharedJob, "id" | "timestamp">) => void
  // Networking
  networkContacts: NetworkContact[]
  addNetworkContact: (contact: Omit<NetworkContact, "id">) => void
  deleteNetworkContact: (id: string) => void
  // Company questions
  companyQuestions: CompanyQuestion[]
  addCompanyQuestion: (q: Omit<CompanyQuestion, "id" | "timestamp">) => void
  // Weekly goal
  weeklyGoal: WeeklyGoal | null
  setWeeklyGoal: (goal: WeeklyGoal) => void
}

export const DataContext = createContext<DataContextValue | null>(null)
