export type DocumentType =
  | 'offer_letter'
  | 'employment_contract'
  | 'onboarding_checklist'
  | 'performance_review'
  | 'termination_letter'

export interface Employee {
  id: string
  name: string
  role: string
  department: string
  email: string
  startDate: string
  status: 'active' | 'inactive'
  salary: number
}

export interface Document {
  id: string
  title: string
  type: DocumentType
  employeeId: string
  employeeName: string
  status: 'pending' | 'complete' | 'needs_review'
  createdAt: string
  content?: string
}

export interface Applicant {
  id: string
  name: string
  email: string
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired'
  appliedAt: string
}

export interface JobListing {
  id: string
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract'
  status: 'active' | 'closed'
  postedAt: string
  applicants: Applicant[]
}

export interface Notification {
  id: string
  type: 'document_due' | 'review_needed' | 'offer_expiring' | 'onboarding'
  title: string
  description: string
  dueDate?: string
  priority: 'high' | 'medium' | 'low'
  actionLabel: string
  actionHref: string
}
