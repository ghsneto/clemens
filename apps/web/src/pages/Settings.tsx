import { FormEvent, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { createMeetingMinute, getMeetingMinutes } from "../lib/api";
import { MeetingMinute } from "../types";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { FormInput, FormSelect } from "../components/ui/FormInput";
import { DataTable } from "../components/ui/DataTable";

export function Settings() {
  const [records, setRecords] = useState<MeetingMinute[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    meeting_date: "",
    meeting_type: "ordinaria" as "ordinaria" | "extraordinaria",
    title: "",
    body: ""
  });

  async function loadRecords() {
    const data = await getMeetingMinutes();
    setRecords(data);
  }

  useEffect(() => {
    void loadRecords();
  }, []);

  async function handleCreateMinute(event: FormEvent) {
    event.preventDefault();
    try {
      await createMeetingMinute(form);
      setMessage("Ata cadastrada com sucesso.");
      setForm({ meeting_date: "", meeting_type: form.meeting_type, title: "", body: "" });
      await loadRecords();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao cadastrar ata.");
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-slate-900">Meeting Minutes</h2>
      <Card className="p-8">
        <div className="mb-6 flex items-center gap-2">
          <FileText size={18} className="text-indigo-500" />
          <h3 className="text-xl font-semibold text-slate-900">Cadastro de Ata</h3>
        </div>

        <form className="space-y-4" onSubmit={handleCreateMinute}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Data da Reunião" type="date" value={form.meeting_date} onChange={(e) => setForm((prev) => ({ ...prev, meeting_date: e.target.value }))} required />
            <FormSelect
              label="Tipo de Reunião"
              value={form.meeting_type}
              onChange={(e) => setForm((prev) => ({ ...prev, meeting_type: e.target.value as "ordinaria" | "extraordinaria" }))}
              options={[
                { label: "Ordinária", value: "ordinaria" },
                { label: "Extraordinária", value: "extraordinaria" }
              ]}
            />
          </div>
          <FormInput label="Título" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Texto da Ata</span>
            <textarea
              className="min-h-40 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              value={form.body}
              onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
              required
            />
          </label>
          <Button type="submit">Salvar Ata</Button>
        </form>
      </Card>

      <DataTable
        title="Atas Cadastradas"
        rows={records}
        columns={[
          { header: "Data", key: "meeting_date" },
          { header: "Tipo", key: "meeting_type" },
          { header: "Título", key: "title" },
          {
            header: "Texto",
            key: "body",
            render: (value) => {
              const text = String(value);
              return <span className="max-w-[420px]">{text.length > 120 ? `${text.slice(0, 120)}...` : text}</span>;
            }
          }
        ]}
      />

      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
