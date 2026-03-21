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
  address: string;
  phone: string;
  joined_at: string;
  baptized_at: string;
  class_name: MemberClass;
}

export interface DashboardSummary {
  totalPresent: number;
  totalAbsent: number;
  totalOfferings: number;
  totalChapters: number;
}
