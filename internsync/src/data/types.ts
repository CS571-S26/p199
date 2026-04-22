export type ApplicationStage =
  | "Wishlist"
  | "Applied"
  | "OA"
  | "Interview"
  | "Final Round"
  | "Offer"
  | "Rejected"
  | "Withdrawn"

export type SponsorshipStatus = "yes" | "no" | "unknown"

export type Company = {
  id: string
  name: string
  sponsorship: SponsorshipStatus
  description: string
}

export type ApplicationHistoryItem = {
  id: string
  date: string
  label: string
  detail?: string
}

export type Application = {
  id: string
  companyId?: string
  company: string
  role: string
  location: string
  stage: ApplicationStage
  appliedDate: string
  deadline?: string
  notes?: string
  sponsorship?: SponsorshipStatus
  history?: ApplicationHistoryItem[]
}

export type ActivityItem = {
  id: string
  title: string
  detail: string
  date: string
  timestamp?: string
}

export type DeadlineItem = {
  id: string
  company: string
  role: string
  dueDate: string
}

export type Friend = {
  id: string
  name: string
}

export type FriendApplication = {
  friendId: string
  company: string
  companyId?: string
  role: string
  stage: ApplicationStage
}

export type SharedJob = {
  id: string
  company: string
  companyId?: string
  fromFriendId: string
  note: string
  timestamp: string
}

export type ContactType = "recruiter" | "engineer" | "referral" | "coffee_chat" | "other"
export type ContactOutcome = "referred" | "intro_scheduled" | "no_response" | "ongoing" | "closed"

export type NetworkContact = {
  id: string
  company: string
  companyId?: string
  name: string
  title: string
  type: ContactType
  date: string
  notes?: string
  outcome?: ContactOutcome
  linkedIn?: string
}

export type QuestionCategory = "algorithms" | "behavioral" | "system_design" | "case" | "other"
export type QuestionRound = "OA" | "Phone Screen" | "Technical" | "Final Round" | "Behavioral"

export type CompanyQuestion = {
  id: string
  company: string
  companyId?: string
  friendId: string
  category: QuestionCategory
  round: QuestionRound
  text: string
  timestamp: string
}

export type WeeklyGoal = {
  target: number
  weekStart: string
}

