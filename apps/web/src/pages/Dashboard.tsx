import { BookOpen, CalendarDays, DollarSign, UserCheck, UserX } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { getAnnualSummary, getChaptersSeries, getMembers, getSundaySummary, registerAttendance } from "../lib/api";
import { ChaptersPoint, DashboardSummary, Member, MemberClass, SundaySummary } from "../types";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";

const CLASSES: MemberClass[] = ["Primarios", "Infantil", "Adolescentes", "Jovens", "Adultos"];

function nextSundayIso() {
  const today = new Date();
  const result = new Date(today);
  const day = result.getDay();
  const add = day === 0 ? 0 : 7 - day;
  result.setDate(result.getDate() + add);
  return result.toISOString().slice(0, 10);
}

function formatDateBr(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function Dashboard() {
  const year = new Date().getFullYear();
  const [summary, setSummary] = useState<DashboardSummary>({ totalPresent: 0, totalAbsent: 0, totalOfferings: 0, totalChapters: 0 });
  const [points, setPoints] = useState<ChaptersPoint[]>([]);
  const [selectedSunday, setSelectedSunday] = useState("");
  const [sundaySummary, setSundaySummary] = useState<SundaySummary | null>(null);

  const [attendanceDate, setAttendanceDate] = useState(nextSundayIso());
  const [attendanceClass, setAttendanceClass] = useState<MemberClass>("Adultos");
  const [offeringAmount, setOfferingAmount] = useState(0);
  const [members, setMembers] = useState<Member[]>([]);
  const [attendanceDraft, setAttendanceDraft] = useState<Record<number, { present: boolean; chaptersRead: number }>>({});
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    void refreshDashboard();
  }, []);

  useEffect(() => {
    if (!selectedSunday) {
      setSundaySummary(null);
      return;
    }
    void getSundaySummary(selectedSunday).then(setSundaySummary).catch(() => setSundaySummary(null));
  }, [selectedSunday]);

  useEffect(() => {
    void getMembers(attendanceClass).then((result) => {
      setMembers(result);
      const initial: Record<number, { present: boolean; chaptersRead: number }> = {};
      result.forEach((member) => {
        initial[member.id] = { present: false, chaptersRead: 0 };
      });
      setAttendanceDraft(initial);
    });
  }, [attendanceClass]);

  async function refreshDashboard() {
    const [annualResult, seriesResult] = await Promise.allSettled([getAnnualSummary(year), getChaptersSeries(year)]);
    if (annualResult.status === "fulfilled") setSummary(annualResult.value);
    if (seriesResult.status === "fulfilled") setPoints(seriesResult.value);
  }

  async function handleRegisterAttendance(event: FormEvent) {
    event.preventDefault();
    try {
      await registerAttendance({
        sundayDate: attendanceDate,
        className: attendanceClass,
        offeringAmount,
        records: members.map((member) => ({
          memberId: member.id,
          present: attendanceDraft[member.id]?.present ?? false,
          chaptersRead: attendanceDraft[member.id]?.chaptersRead ?? 0
        }))
      });
      setFeedback("Chamada registrada com sucesso.");
      await refreshDashboard();
      if (selectedSunday === attendanceDate) {
        const sunday = await getSundaySummary(attendanceDate);
        setSundaySummary(sunday);
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erro ao registrar chamada.");
    }
  }

  const chartPolyline = useMemo(() => {
    if (!points.length) return "";
    const width = 640;
    const height = 220;
    const max = Math.max(...points.map((point) => point.chapters), 1);
    const step = points.length === 1 ? 0 : width / (points.length - 1);
    return points
      .map((point, index) => {
        const x = index * step;
        const y = height - (point.chapters / max) * (height - 30) - 15;
        return `${x},${y}`;
      })
      .join(" ");
  }, [points]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Presentes (ano)" value={String(summary.totalPresent)} icon={UserCheck} delta="Registros acumulados" />
        <StatCard title="Faltantes (ano)" value={String(summary.totalAbsent)} icon={UserX} delta="Registros acumulados" positive={false} />
        <StatCard title="Oferta Total" value={`R$ ${summary.totalOfferings.toFixed(2)}`} icon={DollarSign} delta="Soma anual" />
        <StatCard title="Capítulos Lidos" value={String(summary.totalChapters)} icon={BookOpen} delta="Soma anual" />
      </div>

      <Card>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Capítulos por Domingo</h2>
          <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">{year}</span>
        </div>
        <div className="h-72 rounded-xl border border-slate-100 bg-gradient-to-b from-indigo-50/70 to-white p-4">
          {points.length === 0 ? (
            <div className="grid h-full place-content-center text-sm text-slate-500">Sem dados de capítulos para exibir.</div>
          ) : (
            <svg viewBox="0 0 640 220" className="h-full w-full">
            <defs>
              <linearGradient id="salesArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
              </linearGradient>
            </defs>
              <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={chartPolyline} />
              <polyline fill="url(#salesArea)" stroke="none" points={`${chartPolyline} 640,220 0,220`} />
          </svg>
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-slate-700">Panorama por Domingo</span>
            <input className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3" type="date" value={selectedSunday} onChange={(e) => setSelectedSunday(e.target.value)} />
          </label>
          {sundaySummary && (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {formatDateBr(sundaySummary.sundayDate)}: {sundaySummary.totalPresent} presentes, {sundaySummary.totalAbsent} faltantes, {sundaySummary.totalChapters} capítulos
            </p>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="mb-5 text-xl font-semibold text-slate-900">Registrar Chamada Dominical</h2>
        <form className="space-y-4" onSubmit={handleRegisterAttendance}>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">Domingo</span>
              <input className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} required />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">Classe</span>
              <select className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" value={attendanceClass} onChange={(e) => setAttendanceClass(e.target.value as MemberClass)}>
                {CLASSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-slate-700">Oferta</span>
              <input className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" type="number" min="0" step="0.01" value={offeringAmount} onChange={(e) => setOfferingAmount(Number(e.target.value))} />
            </label>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
            {members.length === 0 && <p className="text-sm text-slate-500">Nenhum membro encontrado para esta classe.</p>}
            {members.map((member) => (
              <div key={member.id} className="grid gap-2 rounded-lg bg-white p-3 md:grid-cols-[minmax(0,1fr)_120px_120px] md:items-center">
                <p className="text-sm font-medium text-slate-800">{member.full_name}</p>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={attendanceDraft[member.id]?.present ?? false}
                    onChange={(e) =>
                      setAttendanceDraft((prev) => ({
                        ...prev,
                        [member.id]: { ...prev[member.id], present: e.target.checked }
                      }))
                    }
                  />
                  Presente
                </label>
                <input
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
                  type="number"
                  min="0"
                  value={attendanceDraft[member.id]?.chaptersRead ?? 0}
                  onChange={(e) =>
                    setAttendanceDraft((prev) => ({
                      ...prev,
                      [member.id]: { ...prev[member.id], chaptersRead: Number(e.target.value) || 0 }
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            <CalendarDays size={15} className="mr-2" />
            Registrar Chamada
          </Button>
        </form>
        {feedback && <p className="mt-4 text-sm text-emerald-700">{feedback}</p>}
      </Card>
    </div>
  );
}
