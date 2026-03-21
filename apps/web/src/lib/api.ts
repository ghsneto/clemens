import { DashboardSummary, Member, MemberClass, UserSession } from "../types";

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
