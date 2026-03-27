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

export interface MeetingMinute {
  id: number;
  meeting_date: string;
  meeting_type: "ordinaria" | "extraordinaria";
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface AgendaEvent {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  recurrence_rule: string | null;
  google_event_id: string | null;
}
