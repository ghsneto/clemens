import { BookOpenCheck, CalendarDays, ClipboardCheck, FileText, LayoutDashboard, Library, Users } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createMember, getAnnualSummary, getMembers, login, registerAttendance } from "./lib/api";
import { DashboardSummary, Member, MemberClass, UserSession } from "./types";

const CLASSES: MemberClass[] = ["Primarios", "Infantil", "Adolescentes", "Jovens", "Adultos"];

type Tab = "dashboard" | "members" | "attendance" | "minutes" | "agenda" | "library";

interface AttendanceRow {
  memberId: number;
  fullName: string;
  present: boolean;
  chaptersRead: number;
}

const EMPTY_MEMBER_FORM = {
  full_name: "",
  birth_date: "",
  address: "",
  phone: "",
  joined_at: "",
  baptized_at: "",
  class_name: "Adultos" as MemberClass
};

export function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");

  const [summary, setSummary] = useState<DashboardSummary>({
    totalPresent: 0,
    totalAbsent: 0,
    totalOfferings: 0,
    totalChapters: 0
  });

  const [memberForm, setMemberForm] = useState(EMPTY_MEMBER_FORM);
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [memberClassFilter, setMemberClassFilter] = useState<MemberClass>("Adultos");

  const [sundayDate, setSundayDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceClass, setAttendanceClass] = useState<MemberClass>("Adultos");
  const [offeringAmount, setOfferingAmount] = useState(0);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);

  const [loginForm, setLoginForm] = useState({ clientName: "", password: "" });
  const [feedback, setFeedback] = useState<string>("");

  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    if (!session) return;
    refreshSummary();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    void loadMembers(memberClassFilter);
  }, [session, memberClassFilter]);

  useEffect(() => {
    if (!session) return;
    void loadAttendanceClassMembers(attendanceClass);
  }, [session, attendanceClass]);

  async function refreshSummary() {
    const data = await getAnnualSummary(year);
    setSummary(data);
  }

  async function loadMembers(className: MemberClass) {
    const data = await getMembers(className);
    setMemberList(data);
  }

  async function loadAttendanceClassMembers(className: MemberClass) {
    const data = await getMembers(className);
    const rows = data.map((member) => ({
      memberId: member.id,
      fullName: member.full_name,
      present: false,
      chaptersRead: 0
    }));
    setAttendanceRows(rows);
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    try {
      const user = await login(loginForm.clientName, loginForm.password);
      setSession(user);
      setFeedback("");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Falha no login");
    }
  }

  async function handleMemberSubmit(event: FormEvent) {
    event.preventDefault();
    await createMember(memberForm);
    setFeedback("Membro cadastrado com sucesso.");
    setMemberForm(EMPTY_MEMBER_FORM);
    await loadMembers(memberClassFilter);
  }

  async function handleAttendanceSubmit(event: FormEvent) {
    event.preventDefault();
    await registerAttendance({
      sundayDate,
      className: attendanceClass,
      offeringAmount,
      records: attendanceRows.map((row) => ({
        memberId: row.memberId,
        present: row.present,
        chaptersRead: row.chaptersRead
      }))
    });
    setFeedback("Chamada registrada com sucesso.");
    await refreshSummary();
  }

  if (!session) {
    return (
      <main className="app-shell flex items-center justify-center">
        <form onSubmit={handleLogin} className="glass-panel w-full max-w-sm rounded-2xl p-6">
          <h1 className="mb-1 text-2xl font-black text-slate-900">Clemens EBD</h1>
          <p className="mb-5 text-sm text-slate-700">Acesso do secretário por Nome do Cliente e Senha</p>

          <label className="mb-2 block text-sm font-semibold text-slate-700">Nome do Cliente</label>
          <input
            className="field mb-4"
            value={loginForm.clientName}
            onChange={(e) => setLoginForm((prev) => ({ ...prev, clientName: e.target.value }))}
            required
          />

          <label className="mb-2 block text-sm font-semibold text-slate-700">Senha</label>
          <input
            className="field mb-6"
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />

          <button className="btn-primary w-full" type="submit">
            Entrar
          </button>

          {feedback && <p className="mt-4 text-sm text-rose-700">{feedback}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="glass-panel mb-4 rounded-2xl p-4">
        <p className="text-xs uppercase tracking-wide text-slate-600">Olá, {session.fullName}</p>
        <h1 className="text-xl font-extrabold text-slate-900">Secretaria da Escola Bíblica Dominical</h1>
      </header>

      {tab === "dashboard" && (
        <section className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard label="Presentes" value={summary.totalPresent} icon={<ClipboardCheck size={18} />} />
            <SummaryCard label="Faltantes" value={summary.totalAbsent} icon={<Users size={18} />} />
            <SummaryCard label="Oferta Total" value={`R$ ${summary.totalOfferings.toFixed(2)}`} icon={<BookOpenCheck size={18} />} />
            <SummaryCard label="Capítulos Lidos" value={summary.totalChapters} icon={<Library size={18} />} />
          </div>
        </section>
      )}

      {tab === "members" && (
        <section className="space-y-4">
          <form className="glass-panel rounded-2xl p-4" onSubmit={handleMemberSubmit}>
            <h2 className="mb-3 text-lg font-bold">Cadastro de Membros</h2>
            <div className="space-y-3">
              <input className="field" placeholder="Nome completo" required value={memberForm.full_name} onChange={(e) => setMemberForm((p) => ({ ...p, full_name: e.target.value }))} />
              <input className="field" type="date" required value={memberForm.birth_date} onChange={(e) => setMemberForm((p) => ({ ...p, birth_date: e.target.value }))} />
              <input className="field" placeholder="Endereço" required value={memberForm.address} onChange={(e) => setMemberForm((p) => ({ ...p, address: e.target.value }))} />
              <input className="field" placeholder="Telefone" required value={memberForm.phone} onChange={(e) => setMemberForm((p) => ({ ...p, phone: e.target.value }))} />
              <label className="text-sm font-semibold text-slate-700">Data de Adesão</label>
              <input className="field" type="date" required value={memberForm.joined_at} onChange={(e) => setMemberForm((p) => ({ ...p, joined_at: e.target.value }))} />
              <label className="text-sm font-semibold text-slate-700">Data de Batismo</label>
              <input className="field" type="date" required value={memberForm.baptized_at} onChange={(e) => setMemberForm((p) => ({ ...p, baptized_at: e.target.value }))} />
              <select className="field" value={memberForm.class_name} onChange={(e) => setMemberForm((p) => ({ ...p, class_name: e.target.value as MemberClass }))}>
                {CLASSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-primary mt-4 w-full" type="submit">
              Salvar Membro
            </button>
          </form>

          <div className="glass-panel rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">Membros da Classe</h3>
              <select className="field w-40" value={memberClassFilter} onChange={(e) => setMemberClassFilter(e.target.value as MemberClass)}>
                {CLASSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              {memberList.map((member) => (
                <article key={member.id} className="rounded-xl border border-white/20 bg-white/60 p-3">
                  <p className="font-semibold text-slate-800">{member.full_name}</p>
                  <p className="text-xs text-slate-600">{member.phone}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "attendance" && (
        <section>
          <form className="glass-panel rounded-2xl p-4" onSubmit={handleAttendanceSubmit}>
            <h2 className="mb-3 text-lg font-bold">Chamada Dominical</h2>
            <div className="mb-4 grid grid-cols-1 gap-3">
              <div>
                <label className="mb-1 block text-sm font-semibold">Selecionar Domingo</label>
                <input className="field" type="date" value={sundayDate} onChange={(e) => setSundayDate(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Selecionar Classe</label>
                <select className="field" value={attendanceClass} onChange={(e) => setAttendanceClass(e.target.value as MemberClass)}>
                  {CLASSES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Valor da Oferta</label>
                <input className="field" type="number" step="0.01" min="0" value={offeringAmount} onChange={(e) => setOfferingAmount(Number(e.target.value))} />
              </div>
            </div>

            <div className="space-y-2">
              {attendanceRows.map((row, index) => (
                <article key={row.memberId} className="rounded-xl border border-white/20 bg-white/60 p-3">
                  <p className="font-semibold">{row.fullName}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={row.present}
                        onChange={(e) =>
                          setAttendanceRows((prev) => {
                            const copy = [...prev];
                            copy[index] = { ...copy[index], present: e.target.checked };
                            return copy;
                          })
                        }
                      />
                      Presença
                    </label>
                    <input
                      className="field w-32"
                      type="number"
                      min="0"
                      placeholder="Capítulos"
                      value={row.chaptersRead}
                      onChange={(e) =>
                        setAttendanceRows((prev) => {
                          const copy = [...prev];
                          copy[index] = { ...copy[index], chaptersRead: Number(e.target.value) || 0 };
                          return copy;
                        })
                      }
                    />
                  </div>
                </article>
              ))}
            </div>

            <button className="btn-primary mt-4 w-full" type="submit">
              Registrar Chamada
            </button>
          </form>
        </section>
      )}

      {tab === "minutes" && <Placeholder title="Módulo de Atas" description="Cadastro de texto longo para sessões ordinárias e extraordinárias (2º domingo do mês)." icon={<FileText size={18} />} />}
      {tab === "agenda" && <Placeholder title="Agenda" description="Eventos com título, descrição, local e recorrência com integração lógica ao Google Agenda." icon={<CalendarDays size={18} />} />}
      {tab === "library" && <Placeholder title="Biblioteca" description="Upload e listagem de PDFs em Cloudflare R2." icon={<Library size={18} />} />}

      {feedback && <p className="mt-4 rounded-xl bg-white/70 p-3 text-sm text-emerald-800">{feedback}</p>}

      <nav className="glass-panel fixed bottom-3 left-1/2 z-50 flex w-[calc(100%-24px)] max-w-md -translate-x-1/2 items-center justify-between rounded-2xl p-2">
        <NavButton label="Início" active={tab === "dashboard"} onClick={() => setTab("dashboard")} icon={<LayoutDashboard size={18} />} />
        <NavButton label="Membros" active={tab === "members"} onClick={() => setTab("members")} icon={<Users size={18} />} />
        <NavButton label="Chamada" active={tab === "attendance"} onClick={() => setTab("attendance")} icon={<ClipboardCheck size={18} />} />
        <NavButton label="Atas" active={tab === "minutes"} onClick={() => setTab("minutes")} icon={<FileText size={18} />} />
      </nav>
    </main>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <article className="glass-panel rounded-2xl p-4">
      <div className="mb-2 inline-flex rounded-xl bg-white/60 p-2 text-brand-ocean">{icon}</div>
      <p className="text-xs uppercase tracking-wide text-slate-600">{label}</p>
      <p className="text-xl font-black text-slate-900">{value}</p>
    </article>
  );
}

function NavButton({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-16 flex-col items-center rounded-xl px-2 py-1 text-xs font-semibold ${active ? "bg-brand-ocean text-white" : "text-slate-700"}`}
    >
      {icon}
      {label}
    </button>
  );
}

function Placeholder({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <section className="glass-panel rounded-2xl p-4">
      <div className="mb-2 inline-flex rounded-xl bg-white/60 p-2 text-brand-ocean">{icon}</div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-slate-700">{description}</p>
    </section>
  );
}
