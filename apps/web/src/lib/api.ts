import { AgendaEvent, ChaptersPoint, DashboardSummary, MeetingMinute, Member, MemberClass, SundaySummary, UserSession } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8787";

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Falha na requisição");
  }
  return response.json() as Promise<T>;
}

export async function login(clientName: string, password: string): Promise<UserSession> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientName, password })
  });
  const data = await parse<{ user: UserSession }>(res);
  return data.user;
}

export async function getMembers(className?: MemberClass): Promise<Member[]> {
  const query = className ? `?className=${encodeURIComponent(className)}` : "";
  const res = await fetch(`${API_BASE_URL}/api/members${query}`);
  const data = await parse<{ members: Member[] }>(res);
  return data.members;
}

export async function createMember(payload: Omit<Member, "id">): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  await parse<{ ok: boolean }>(res);
}

export async function registerAttendance(payload: {
  sundayDate: string;
  className: MemberClass;
  offeringAmount: number;
  records: Array<{ memberId: number; present: boolean; chaptersRead: number }>;
}): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/attendance/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  await parse<{ ok: boolean }>(res);
}

export async function getAnnualSummary(year: number): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/api/reports/annual?year=${year}`);
  return parse<DashboardSummary>(res);
}

export async function getSundaySummary(sundayDate: string): Promise<SundaySummary> {
  const res = await fetch(`${API_BASE_URL}/api/reports/sunday?sundayDate=${encodeURIComponent(sundayDate)}`);
  return parse<SundaySummary>(res);
}

export async function getChaptersSeries(year: number): Promise<ChaptersPoint[]> {
  const res = await fetch(`${API_BASE_URL}/api/reports/chapters-series?year=${year}`);
  if (res.status === 404) {
    return [];
  }
  const data = await parse<{ points: ChaptersPoint[] }>(res);
  return data.points;
}

export async function getMeetingMinutes(): Promise<MeetingMinute[]> {
  const res = await fetch(`${API_BASE_URL}/api/meeting-minutes`);
  const data = await parse<{ records: MeetingMinute[] }>(res);
  return data.records;
}

export async function createMeetingMinute(payload: {
  meeting_date: string;
  meeting_type: "ordinaria" | "extraordinaria";
  title: string;
  body: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/meeting-minutes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  await parse<{ ok: boolean }>(res);
}

export async function getAgendaEvents(): Promise<AgendaEvent[]> {
  const res = await fetch(`${API_BASE_URL}/api/agenda-events`);
  const data = await parse<{ events: AgendaEvent[] }>(res);
  return data.events;
}

export async function createAgendaEvent(payload: {
  title: string;
  description?: string;
  location?: string;
  starts_at: string;
  recurrence_rule?: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/agenda-events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  await parse<{ ok: boolean }>(res);
}
