import React, { useMemo } from "react"
import {
  applications as seedApplications,
  companies as seedCompanies,
  friends as seedFriends,
  friendApplications as seedFriendApplications,
  seedSharedJobs,
  seedActivityFeed,
  seedNetworkContacts,
  seedCompanyQuestions,
  seedWeeklyGoal,
} from "@/data/mockData"
import type {
  ActivityItem,
  Application,
  ApplicationHistoryItem,
  ApplicationStage,
  CompanyQuestion,
  NetworkContact,
  SharedJob,
  WeeklyGoal,
} from "@/data/types"
import { useLocalStorageState } from "@/hooks/useLocalStorageState"
import { DataContext, type DataContextValue } from "@/data/context"

function safeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

function makeActivityItem(title: string, detail: string): ActivityItem {
  const now = new Date()
  return {
    id: safeId("act"),
    title,
    detail,
    timestamp: now.toISOString(),
    date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useLocalStorageState<Application[]>(
    "internsync.applications",
    seedApplications
  )
  const [activityItems, setActivityItems] = useLocalStorageState<ActivityItem[]>(
    "internsync.activity",
    seedActivityFeed
  )
  const [favoriteIds, setFavoriteIds] = useLocalStorageState<string[]>(
    "internsync.favoriteCompanies",
    []
  )
  const [sharedJobsRaw, setSharedJobsRaw] = useLocalStorageState<SharedJob[]>(
    "internsync.sharedJobs",
    seedSharedJobs
  )
  const [networkContactsRaw, setNetworkContactsRaw] = useLocalStorageState<NetworkContact[]>(
    "internsync.networkContacts",
    seedNetworkContacts
  )
  const [companyQuestionsRaw, setCompanyQuestionsRaw] = useLocalStorageState<CompanyQuestion[]>(
    "internsync.companyQuestions",
    seedCompanyQuestions
  )
  const [weeklyGoalRaw, setWeeklyGoalRaw] = useLocalStorageState<WeeklyGoal | null>(
    "internsync.weeklyGoal",
    seedWeeklyGoal
  )

  const [friendsRaw, setFriendsRaw] = useLocalStorageState<typeof seedFriends>(
    "internsync.friends",
    seedFriends
  )

  const companies = useMemo(() => seedCompanies, [])
  const friends = useMemo(() => friendsRaw, [friendsRaw])
  const friendApplications = useMemo(() => seedFriendApplications, [])
  const favoriteCompanyIds = useMemo(() => new Set(favoriteIds), [favoriteIds])
  const activityFeed = useMemo(
    () => [...activityItems].sort((a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? "")),
    [activityItems]
  )
  const sharedJobs = useMemo(
    () => [...sharedJobsRaw].sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [sharedJobsRaw]
  )
  const networkContacts = useMemo(
    () => [...networkContactsRaw].sort((a, b) => b.date.localeCompare(a.date)),
    [networkContactsRaw]
  )
  const companyQuestions = useMemo(
    () => [...companyQuestionsRaw].sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [companyQuestionsRaw]
  )

  function pushActivity(title: string, detail: string) {
    setActivityItems((prev) => [makeActivityItem(title, detail), ...prev].slice(0, 10))
  }

  const value: DataContextValue = useMemo(
    () => ({
      applications,
      addApplication: (input) => {
        const app: Application = {
          ...input,
          id: input.id || safeId("app"),
          appliedDate: input.appliedDate || "—",
        }
        setApplications((prev) => [app, ...prev])
        pushActivity("Application added", `Added ${app.company} — ${app.role}`)
      },
      updateApplication: (id, updates) => {
        const app = applications.find((a) => a.id === id)
        if (!app) return
        let finalUpdates: Partial<Application> = { ...updates }
        if (updates.stage && updates.stage !== app.stage) {
          pushActivity("Stage updated", `${app.company} ${app.role} → ${updates.stage}`)
          const historyItem: ApplicationHistoryItem = {
            id: safeId("h"),
            date: new Date().toISOString().split("T")[0],
            label: updates.stage as ApplicationStage,
          }
          finalUpdates = {
            ...finalUpdates,
            history: [...(app.history ?? []), historyItem],
          }
        }
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, ...finalUpdates } : a))
        )
      },
      deleteApplication: (id) => {
        const app = applications.find((a) => a.id === id)
        if (app) {
          pushActivity("Application removed", `Removed ${app.company} — ${app.role}`)
        }
        setApplications((prev) => prev.filter((a) => a.id !== id))
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
      activityFeed,
      friends,
      addFriend: (name) => {
        const f = { id: safeId("f"), name: name.trim() }
        setFriendsRaw((prev) => [...prev, f])
      },
      deleteFriend: (id) => {
        setFriendsRaw((prev) => prev.filter((f) => f.id !== id))
      },
      friendApplications,
      sharedJobs,
      shareJob: (data) => {
        const job: SharedJob = {
          ...data,
          id: safeId("sj"),
          timestamp: new Date().toISOString(),
        }
        setSharedJobsRaw((prev) => [job, ...prev])
      },
      networkContacts,
      addNetworkContact: (contact) => {
        const nc: NetworkContact = { ...contact, id: safeId("nc") }
        setNetworkContactsRaw((prev) => [nc, ...prev])
        pushActivity("Contact added", `Added ${nc.name} at ${nc.company}`)
      },
      deleteNetworkContact: (id) => {
        setNetworkContactsRaw((prev) => prev.filter((c) => c.id !== id))
      },
      companyQuestions,
      addCompanyQuestion: (q) => {
        const question: CompanyQuestion = {
          ...q,
          id: safeId("cq"),
          timestamp: new Date().toISOString(),
        }
        setCompanyQuestionsRaw((prev) => [question, ...prev])
      },
      weeklyGoal: weeklyGoalRaw,
      setWeeklyGoal: (goal) => setWeeklyGoalRaw(goal),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applications, companies, favoriteCompanyIds, activityFeed, friends, friendApplications, sharedJobs, networkContacts, companyQuestions, weeklyGoalRaw, friendsRaw]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
