export type JobPosting = {
  id: string;
  title: string;
  datePosted: string;
  timeline: string;
  applicants: number;
  progress: number;
  risk: boolean;
};

export type ApplicantDocKind = "resume" | "cover" | "portfolio" | "other";

export type ApplicantDocument = {
  id: string;
  name: string;
  kind: ApplicantDocKind;
  /** ISO date string for sorting */
  dateAdded: string;
};

export type Applicant = {
  id: string;
  jobId: string;
  name: string;
  photo: string;
  statusLabel: string;
  matchScore: number;
  matchBlurb: string;
  notes: number;
  comments: number;
  email: string;
  phone: string;
  summary: string;
  /** Furthest pipeline stage reached: 0 Screening … 3 Hired (for UI stepper). */
  pipelineStep: number;
  /** Short AI-style match line for the candidate header. */
  aiMatchSummary: string;
  documents: ApplicantDocument[];
};

export const JOB_POSTINGS: JobPosting[] = [
  {
    id: "1",
    title: "Front of House (FOH) Staff",
    datePosted: "01/03/2026",
    timeline: "On-track to meet March 1st Deadline",
    applicants: 15,
    progress: 0.78,
    risk: false,
  },
  {
    id: "2",
    title: "Culinary Lead",
    datePosted: "02/10/2026",
    timeline: "At-Risk, Missed 48hr contact goal",
    applicants: 4,
    progress: 0.38,
    risk: true,
  },
];

const FACES = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=face",
] as const;

const STATUSES = [
  "Interview In-Progress",
  "Screening complete",
  "Phone screen scheduled",
  "Awaiting response",
  "Second interview",
] as const;

const BLURBS = [
  "Strong hospitality background with POS experience and weekend availability that matches this shift pattern.",
  "Prior FOH lead at a high-volume café; references highlight calm service under pressure.",
  "Certified in food safety; flexible schedule and bilingual support for peak lunch service.",
  "Early-career candidate with coachable energy and solid customer scores from a seasonal role.",
  "Deep wine and beverage knowledge plus catering experience aligned to private events.",
] as const;

const AI_MATCH_LINES = [
  "Matches all core competencies and 5/5 required skills. Exceeds experience requirements.",
  "Strong alignment on required skills; minor gap in one optional tool, easily trainable.",
  "Meets every listed requirement with solid references and schedule fit for posted shifts.",
  "Above-average match on culture and soft skills; technical checklist fully satisfied.",
] as const;

const DOC_BASE_NAMES = [
  { kind: "resume" as const, name: "Resume — updated.pdf" },
  { kind: "cover" as const, name: "Cover letter — role fit.docx" },
  { kind: "portfolio" as const, name: "Work samples — hospitality.pdf" },
  { kind: "other" as const, name: "Reference list.pdf" },
];

const NAMES = [
  "Olivia Thompson",
  "Jessica Smith",
  "Gabriel Brown",
  "Marcus Lee",
  "Priya Patel",
  "Noah Fernandez",
  "Elena Varga",
  "Jordan Blake",
  "Aisha Grant",
  "Tom Kim",
  "Sofia Nguyen",
  "Devon Wright",
  "Renee Porter",
  "Carlos Rivera",
  "Maria Lopez",
] as const;

function buildDocumentsForApplicant(jobId: string, applicantIndex: number): ApplicantDocument[] {
  const n = 1 + (applicantIndex % 4);
  const docs: ApplicantDocument[] = [];
  for (let d = 0; d < n; d++) {
    const spec = DOC_BASE_NAMES[(applicantIndex + d) % DOC_BASE_NAMES.length]!;
    const month = String(((applicantIndex + d) % 12) + 1).padStart(2, "0");
    const day = String(((applicantIndex * 3 + d) % 27) + 1).padStart(2, "0");
    docs.push({
      id: `d-${jobId}-${applicantIndex}-${d}`,
      name: spec.name,
      kind: spec.kind,
      dateAdded: `2026-${month}-${day}`,
    });
  }
  return docs;
}

function buildApplicantsForJob(jobId: string, jobTitle: string, count: number): Applicant[] {
  const list: Applicant[] = [];
  for (let i = 0; i < count; i++) {
    const name = NAMES[i % NAMES.length]!;
    const id = `a${jobId}-${i + 1}`;
    list.push({
      id,
      jobId,
      name: i < NAMES.length ? name : `${name} (${i + 1})`,
      photo: FACES[i % FACES.length]!,
      statusLabel: STATUSES[i % STATUSES.length]!,
      matchScore: 72 + ((i * 3) % 24),
      matchBlurb: BLURBS[i % BLURBS.length]!,
      notes: 1 + (i % 5),
      comments: (i % 4) + (i % 3),
      email: `${name.split(/\s+/)[0]!.toLowerCase()}@example.com`,
      phone: `+1 (412) 555-${String(1000 + (i * 17) % 9000).padStart(4, "0")}`,
      summary: `Candidate for ${jobTitle}. Review highlights, notes, and next steps before advancing this applicant.`,
      pipelineStep: Math.min(3, ((i + 1) % 4)),
      aiMatchSummary: AI_MATCH_LINES[i % AI_MATCH_LINES.length]!,
      documents: buildDocumentsForApplicant(jobId, i),
    });
  }
  return list;
}

const APPLICANTS_BY_JOB: Record<string, Applicant[]> = {};

for (const job of JOB_POSTINGS) {
  APPLICANTS_BY_JOB[job.id] = buildApplicantsForJob(job.id, job.title, job.applicants);
}

export function getJobPosting(id: string): JobPosting | undefined {
  return JOB_POSTINGS.find((j) => j.id === id);
}

export function getApplicantsForJob(jobId: string): Applicant[] {
  return APPLICANTS_BY_JOB[jobId] ?? [];
}

export function getApplicant(jobId: string, applicantId: string): Applicant | undefined {
  return getApplicantsForJob(jobId).find((a) => a.id === applicantId);
}

export function candidateSubtitle(jobTitle: string) {
  return `${jobTitle} Candidate`;
}
