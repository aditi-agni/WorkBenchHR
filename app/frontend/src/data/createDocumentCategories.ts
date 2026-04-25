import { assetPath } from "../lib/assetPath";

export type CreateDocCategoryId =
  | "company"
  | "performance"
  | "payroll"
  | "legal"
  | "hiring"
  | "employment";

export type CreateDocFilterTag = "Policy" | "Template" | "Form" | "Compliance" | "General";

export type CreateDocFilter = "All" | CreateDocFilterTag;

export const CREATE_DOC_FILTER_CHIPS: CreateDocFilter[] = [
  "All",
  "Policy",
  "Template",
  "Form",
  "Compliance",
  "General",
];

export type CreateDocCategoryRow = {
  id: CreateDocCategoryId;
  title: string;
  description: string;
  iconSrc: string;
  tags: CreateDocFilterTag[];
};

export const CREATE_DOC_CATEGORIES: CreateDocCategoryRow[] = [
  {
    id: "company",
    title: "Company Documents",
    description: "Offer letters, contracts, NDAs",
    iconSrc: assetPath("/create-document/dt1.png"),
    tags: ["Policy", "Template", "General"],
  },
  {
    id: "performance",
    title: "Performance Management",
    description: "Reviews, feedback forms, KPIs",
    iconSrc: assetPath("/create-document/dt2.png"),
    tags: ["Template", "Form"],
  },
  {
    id: "payroll",
    title: "Payroll & Compensation",
    description: "Salary, benefits, bonuses",
    iconSrc: assetPath("/create-document/dt3.png"),
    tags: ["Policy", "Compliance"],
  },
  {
    id: "legal",
    title: "Legal & Policy Documents",
    description: "Handbooks, compliance policies",
    iconSrc: assetPath("/create-document/dt4.png"),
    tags: ["Policy", "Compliance"],
  },
  {
    id: "hiring",
    title: "Hiring Documents",
    description: "Job postings, interview guides",
    iconSrc: assetPath("/create-document/dt5.png"),
    tags: ["Template", "Form", "General"],
  },
  {
    id: "employment",
    title: "Changes in Employment",
    description: "Promotions, transfers, terminations",
    iconSrc: assetPath("/create-document/dt6.png"),
    tags: ["Policy", "Form", "Compliance"],
  },
];

export type CreateDocTemplateFile = {
  name: string;
  /** Total pages for preview pager (sample data). */
  pageCount: number;
};

export type CreateDocTemplateSection = {
  sectionTitle: string;
  files: CreateDocTemplateFile[];
};

function tf(name: string, pageCount: number): CreateDocTemplateFile {
  return { name, pageCount: Math.max(1, Math.min(99, pageCount)) };
}

export const CREATE_DOC_TEMPLATE_SECTIONS: Record<CreateDocCategoryId, CreateDocTemplateSection[]> = {
  company: [
    {
      sectionTitle: "Offers & agreements",
      files: [
        tf("Standard_Full_Time_Offer_Letter_US.pdf", 4),
        tf("Executive_Compensation_Offer_Summary.pdf", 6),
        tf("Independent_Contractor_Master_Services_Agreement.pdf", 12),
        tf("Intern_Offer_Letter_Summer_2026.pdf", 3),
      ],
    },
    {
      sectionTitle: "NDAs & confidentiality",
      files: [
        tf("Mutual_Nondisclosure_Agreement_2026.pdf", 8),
        tf("Employee_Confidentiality_and_IP_Assignment.pdf", 5),
        tf("Visitor_NDA_Short_Form.pdf", 2),
      ],
    },
    {
      sectionTitle: "Policies & acknowledgments",
      files: [
        tf("Remote_Work_Policy_Addendum.pdf", 4),
        tf("Code_of_Conduct_Acknowledgment.pdf", 3),
        tf("Equipment_Use_Agreement.pdf", 2),
      ],
    },
  ],
  performance: [
    {
      sectionTitle: "Reviews & cycles",
      files: [
        tf("Annual_Performance_Review_Manager_Worksheet.pdf", 7),
        tf("Mid_Year_Check_In_Template.pdf", 4),
        tf("Probationary_Review_30_60_90.pdf", 5),
      ],
    },
    {
      sectionTitle: "Goals & KPIs",
      files: [
        tf("OKR_Planning_Sheet_Q2.pdf", 6),
        tf("SMART_Goals_Worksheet_Role_Based.pdf", 3),
        tf("Sales_Quota_Attainment_Summary.pdf", 4),
      ],
    },
    {
      sectionTitle: "Feedback & calibration",
      files: [
        tf("360_Feedback_Request_Email_Pack.pdf", 9),
        tf("Calibration_Notes_Manager_Guide.pdf", 6),
        tf("Peer_Feedback_Form.pdf", 2),
      ],
    },
  ],
  payroll: [
    {
      sectionTitle: "Compensation structure",
      files: [
        tf("Salary_Bands_by_Level_2026.pdf", 14),
        tf("Bonus_Eligibility_Matrix.pdf", 5),
        tf("Overtime_and_Rounding_Policy_CA.pdf", 10),
      ],
    },
    {
      sectionTitle: "Benefits & leave",
      files: [
        tf("Open_Enrollment_Summary_One_Pager.pdf", 2),
        tf("HSA_and_FSA_Eligibility_Notice.pdf", 4),
        tf("Parental_Leave_Overview.pdf", 6),
      ],
    },
    {
      sectionTitle: "Payroll operations",
      files: [
        tf("Direct_Deposit_Authorization_Form.pdf", 2),
        tf("Payroll_Correction_Request.pdf", 3),
        tf("Garnishment_Notice_Response_Checklist.pdf", 4),
      ],
    },
  ],
  legal: [
    {
      sectionTitle: "Handbook & policies",
      files: [
        tf("Employee_Handbook_Master_2026.pdf", 48),
        tf("State_Labor_Law_Addendum_California.pdf", 18),
        tf("Social_Media_and_Device_Policy.pdf", 6),
      ],
    },
    {
      sectionTitle: "Compliance programs",
      files: [
        tf("Anti_Harassment_and_Retaliation_Policy.pdf", 11),
        tf("Whistleblower_Reporting_Procedures.pdf", 7),
        tf("Records_Retention_Schedule_HR.pdf", 9),
      ],
    },
    {
      sectionTitle: "Privacy & data",
      files: [
        tf("Employee_Privacy_Notice_US.pdf", 5),
        tf("Background_Check_Consent_Form.pdf", 3),
        tf("Vendor_DPA_HR_Systems_Checklist.pdf", 8),
      ],
    },
  ],
  hiring: [
    {
      sectionTitle: "Job postings & descriptions",
      files: [
        tf("Job_Posting_Customer_Success_Manager.pdf", 3),
        tf("Barista_Role_Description_Final.pdf", 2),
        tf("Senior_PM_Job_Description_Engineering.pdf", 4),
      ],
    },
    {
      sectionTitle: "Interview & assessment",
      files: [
        tf("Structured_Interview_Scorecard_Template.pdf", 4),
        tf("Panel_Interview_Guide_Hiring_Manager.pdf", 8),
        tf("Take_Home_Assignment_Data_Analyst.pdf", 5),
      ],
    },
    {
      sectionTitle: "Offers & pre-boarding",
      files: [
        tf("Contingent_Offer_Checklist.pdf", 2),
        tf("Pre_Boarding_Document_Request_List.pdf", 3),
        tf("Reference_Check_Summary_Form.pdf", 2),
      ],
    },
  ],
  employment: [
    {
      sectionTitle: "Promotions & transfers",
      files: [
        tf("Internal_Promotion_Notification_Letter.pdf", 2),
        tf("Transfer_Checklist_Department_to_Department.pdf", 4),
        tf("Comp_Change_Notice_Template.pdf", 3),
      ],
    },
    {
      sectionTitle: "Discipline & performance improvement",
      files: [
        tf("Written_Warning_Template.pdf", 3),
        tf("PIP_Plan_30_Day.pdf", 6),
        tf("Final_Warning_Meeting_Agenda.pdf", 2),
      ],
    },
    {
      sectionTitle: "Separations & offboarding",
      files: [
        tf("Voluntary_Resignation_Acceptance_Letter.pdf", 2),
        tf("RIF_Notification_Script_Manager.pdf", 5),
        tf("COBRA_Election_Notice_Package.pdf", 7),
      ],
    },
  ],
};

const CATEGORY_IDS: CreateDocCategoryId[] = [
  "company",
  "performance",
  "payroll",
  "legal",
  "hiring",
  "employment",
];

export function isCreateDocCategoryId(id: string | undefined): id is CreateDocCategoryId {
  return id !== undefined && (CATEGORY_IDS as string[]).includes(id);
}

export function getCreateDocCategoryTitle(id: CreateDocCategoryId): string {
  return CREATE_DOC_CATEGORIES.find((c) => c.id === id)?.title ?? "Templates";
}
