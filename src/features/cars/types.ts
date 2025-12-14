export const ProblemStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
} as const;

export type ProblemStatus = (typeof ProblemStatus)[keyof typeof ProblemStatus];

export const ProblemSeverity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export type ProblemSeverity = (typeof ProblemSeverity)[keyof typeof ProblemSeverity];

export const SeveritySource = {
  AI: "AI",
  USER: "USER",
} as const;

export type SeveritySource = (typeof SeveritySource)[keyof typeof SeveritySource];

export const ExpenseType = {
  PURCHASE: "PURCHASE",
  MAINTENANCE: "MAINTENANCE",
  REPAIR: "REPAIR",
  TUNING: "TUNING",
  TAX_INSURANCE: "TAX_INSURANCE",
  OTHER: "OTHER",
} as const;

export type ExpenseType = (typeof ExpenseType)[keyof typeof ExpenseType];

export interface Problem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  status: ProblemStatus;
  severity: ProblemSeverity;
  aiSeverity: ProblemSeverity | null;
  severitySource: SeveritySource;
  estimatedCost: number | null;
  aiAnalysis: string | null;
  carId: string;
  userId: string;
}

export interface Expense {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  amount: number;
  date: Date;
  type: ExpenseType;
  carId: string;
  userId: string;
}

export interface Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  fileType: string;
  content: string;
  carId: string;
  userId: string;
}

export interface Car {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  make: string;
  model: string;
  year: number;
  vin: string | null;
  purchasePrice: number;
  purchaseDate: Date;
  currentMileage: number;
  nextInspectionDate: Date;
  nextServiceDate: Date | null;
  imageUrl: string | null;
  userId: string;
}

export type CarWithRelations = Car & {
  problems: Problem[];
  expenses: Expense[];
  documents: Document[];
};

export const ProblemStatusLabels: Record<ProblemStatus, string> = {
  OPEN: "Offen",
  IN_PROGRESS: "In Bearbeitung",
  RESOLVED: "Gelöst",
};

export const ProblemSeverityLabels: Record<ProblemSeverity, string> = {
  LOW: "Niedrig",
  MEDIUM: "Mittel",
  HIGH: "Hoch",
  CRITICAL: "Kritisch",
};

export const ExpenseTypeLabels: Record<ExpenseType, string> = {
  PURCHASE: "Fahrzeugkauf",
  MAINTENANCE: "Wartung",
  REPAIR: "Reparatur",
  TUNING: "Tuning/Upgrade",
  TAX_INSURANCE: "Steuer/Versicherung",
  OTHER: "Sonstiges",
};

export type ViewState = "DASHBOARD" | "CARS_LIST" | "CAR_DETAIL" | "SETTINGS";

export const Country = {
  DEUTSCHLAND: "DEUTSCHLAND",
  OESTERREICH: "OESTERREICH",
} as const;

export type Country = (typeof Country)[keyof typeof Country];

export const CountryLabels: Record<Country, string> = {
  DEUTSCHLAND: "Deutschland",
  OESTERREICH: "Österreich",
};

export const CountryInspectionConfig: Record<Country, { label: string; gracePeriodMonths: number }> = {
  DEUTSCHLAND: { label: "TÜV", gracePeriodMonths: 1 },
  OESTERREICH: { label: "Pickerl", gracePeriodMonths: 4 },
};
