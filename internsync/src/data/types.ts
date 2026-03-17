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
}

export type DeadlineItem = {
  id: string
  company: string
  role: string
  dueDate: string
}

