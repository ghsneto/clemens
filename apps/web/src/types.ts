export type MemberClass = "Primarios" | "Infantil" | "Adolescentes" | "Jovens" | "Adultos";

export interface UserSession {
  id: number;
  fullName: string;
  clientName: string;
}

export interface Member {
  id: number;
  full_name: string;
  birth_date: string;
  address: string | null;
  phone: string;
  joined_at: string | null;
  baptized_at: string | null;
  class_name: MemberClass;
}

export interface DashboardSummary {
  totalPresent: number;
  totalAbsent: number;
  totalOfferings: number;
  totalChapters: number;
}

export interface SundaySummary extends DashboardSummary {
  sundayDate: string;
  className: MemberClass | null;
}

export interface ChaptersPoint {
  sundayDate: string;
  chapters: number;
}
