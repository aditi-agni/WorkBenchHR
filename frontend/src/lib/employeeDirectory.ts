export type RoleTag = "headChef" | "cashier" | "kitchen" | "cleaning";
export type ContractTag = "intern" | "fullTime" | "partTime";
export type TeamId = "chefs" | "cashiers";

export type Employee = {
  id: string;
  teamId: TeamId;
  name: string;
  title: string;
  departmentLabel: "Kitchen" | "Cashier";
  contract: ContractTag;
  swatch: string;
  roleTags: RoleTag[];
  joined: string;
};

export const TEAM_META: Record<TeamId, { name: string; pill: (n: number) => string }> = {
  chefs: { name: "Chefs", pill: (n) => `${n} members` },
  cashiers: { name: "Cashiers", pill: (n) => `${n} members` },
};

export const CONTRACT_LABEL: Record<ContractTag, string> = {
  fullTime: "Full-time",
  partTime: "Part-time",
  intern: "Intern",
};

/** 21 placeholder people — 14 full-time, 5 part-time, 2 intern. */
export const EMPLOYEES: Employee[] = [
  {
    id: "e1",
    teamId: "chefs",
    name: "Jessica Christie",
    title: "Head chef",
    departmentLabel: "Kitchen",
    contract: "fullTime",
    swatch: "#f97316",
    roleTags: ["headChef", "kitchen"],
    joined: "2024-02-01",
  },
  {
    id: "e2",
    teamId: "chefs",
    name: "Jordan Blake",
    title: "Head chef",
    departmentLabel: "Kitchen",
    contract: "fullTime",
    swatch: "#a855f7",
    roleTags: ["headChef", "kitchen"],
    joined: "2023-11-18",
  },
  {
    id: "e3",
    teamId: "chefs",
    name: "Rosa Mendez",
    title: "Sous chef",
    departmentLabel: "Kitchen",
    contract: "fullTime",
    swatch: "#22c55e",
    roleTags: ["kitchen"],
    joined: "2024-06-12",
  },
  {
    id: "e4",
    teamId: "chefs",
    name: "James Okoye",
    title: "Prep chef",
    departmentLabel: "Kitchen",
    contract: "fullTime",
    swatch: "#14b8a6",
    roleTags: ["kitchen"],
    joined: "2025-01-08",
  },
  {
    id: "e5",
    teamId: "chefs",
    name: "Priya Shah",
    title: "Line cook",
    departmentLabel: "Kitchen",
    contract: "partTime",
    swatch: "#eab308",
    roleTags: ["kitchen"],
    joined: "2024-09-22",
  },
  {
    id: "e6",
    teamId: "chefs",
    name: "Morgan Ellis",
    title: "Line cook",
    departmentLabel: "Kitchen",
    contract: "fullTime",
    swatch: "#6366f1",
    roleTags: ["kitchen"],
    joined: "2023-08-30",
  },
  {
    id: "e7",
    teamId: "chefs",
    name: "Elena Varga",
    title: "Pastry lead",
    departmentLabel: "Kitchen",
    contract: "intern",
    swatch: "#ec4899",
    roleTags: ["kitchen"],
    joined: "2026-01-15",
  },
  {
    id: "e8",
    teamId: "chefs",
    name: "Noah Fernandez",
    title: "Kitchen assistant",
    departmentLabel: "Kitchen",
    contract: "partTime",
    swatch: "#0ea5e9",
    roleTags: ["kitchen"],
    joined: "2025-03-01",
  },
  {
    id: "e9",
    teamId: "cashiers",
    name: "Carlos Rivera",
    title: "Lead cashier",
    departmentLabel: "Cashier",
    contract: "fullTime",
    swatch: "#3b82f6",
    roleTags: ["cashier"],
    joined: "2022-05-20",
  },
  {
    id: "e10",
    teamId: "cashiers",
    name: "Maria Lopez",
    title: "Cashier",
    departmentLabel: "Cashier",
    contract: "fullTime",
    swatch: "#f472b6",
    roleTags: ["cashier"],
    joined: "2024-04-02",
  },
  {
    id: "e11",
    teamId: "cashiers",
    name: "Tom Kim",
    title: "Cashier",
    departmentLabel: "Cashier",
    contract: "fullTime",
    swatch: "#92400e",
    roleTags: ["cashier"],
    joined: "2023-12-10",
  },
  {
    id: "e12",
    teamId: "cashiers",
    name: "Aisha Grant",
    title: "Cashier",
    departmentLabel: "Cashier",
    contract: "partTime",
    swatch: "#10b981",
    roleTags: ["cashier"],
    joined: "2025-06-18",
  },
  {
    id: "e13",
    teamId: "cashiers",
    name: "Luis Ortega",
    title: "Cashier",
    departmentLabel: "Cashier",
    contract: "fullTime",
    swatch: "#c084fc",
    roleTags: ["cashier"],
    joined: "2024-01-29",
  },
  {
    id: "e14",
    teamId: "cashiers",
    name: "Hannah Brooks",
    title: "Shift lead",
    departmentLabel: "Cashier",
    contract: "fullTime",
    swatch: "#fb923c",
    roleTags: ["cashier"],
    joined: "2021-10-05",
  },
  {
    id: "e15",
    teamId: "chefs",
    name: "Devon Wright",
    title: "Dish lead",
    departmentLabel: "Kitchen",
    contract: "fullTime",
    swatch: "#64748b",
    roleTags: ["kitchen", "cleaning"],
    joined: "2023-03-14",
  },
  {
    id: "e16",
    teamId: "chefs",
    name: "Sofia Nguyen",
    title: "Prep cook",
    departmentLabel: "Kitchen",
    contract: "fullTime",
    swatch: "#d946ef",
    roleTags: ["kitchen"],
    joined: "2024-07-07",
  },
  {
    id: "e17",
    teamId: "cashiers",
    name: "Marcus Webb",
    title: "Cashier",
    departmentLabel: "Cashier",
    contract: "intern",
    swatch: "#38bdf8",
    roleTags: ["cashier"],
    joined: "2026-02-01",
  },
  {
    id: "e18",
    teamId: "chefs",
    name: "Tessa Romano",
    title: "Expeditor",
    departmentLabel: "Kitchen",
    contract: "partTime",
    swatch: "#f43f5e",
    roleTags: ["kitchen"],
    joined: "2025-09-12",
  },
  {
    id: "e19",
    teamId: "cashiers",
    name: "Yuki Tanaka",
    title: "Cashier",
    departmentLabel: "Cashier",
    contract: "partTime",
    swatch: "#84cc16",
    roleTags: ["cashier"],
    joined: "2024-11-03",
  },
  {
    id: "e20",
    teamId: "chefs",
    name: "Omar Haddad",
    title: "Night cook",
    departmentLabel: "Kitchen",
    contract: "fullTime",
    swatch: "#f59e0b",
    roleTags: ["kitchen"],
    joined: "2022-12-19",
  },
  {
    id: "e21",
    teamId: "cashiers",
    name: "Renee Porter",
    title: "Floater",
    departmentLabel: "Cashier",
    contract: "fullTime",
    swatch: "#06b6d4",
    roleTags: ["cashier", "kitchen"],
    joined: "2023-05-25",
  },
];

const PORTRAIT_POOL = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop&crop=face",
] as const;

function emailFromName(name: string) {
  const local = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  return `${local || "team"}@eatunique.com`;
}

export function getEmployeeById(id: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.id === id);
}

export function getEmployeePortrait(emp: Employee) {
  const n = Number.parseInt(emp.id.replace(/\D/g, ""), 10) || 0;
  return PORTRAIT_POOL[n % PORTRAIT_POOL.length]!;
}

export function getEmployeeEmail(emp: Employee) {
  if (emp.id === "e1") return "jessica@eatunique.com";
  return emailFromName(emp.name);
}

export function getEmployeePhone(emp: Employee) {
  const suffix = 190 + ((Number.parseInt(emp.id.replace(/\D/g, ""), 10) || 0) % 90);
  return `+1 (412) 555-${String(suffix).padStart(4, "0")}`;
}
