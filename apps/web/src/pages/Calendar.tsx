import { Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { createAgendaEvent, getAgendaEvents } from "../lib/api";
import { AgendaEvent } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { CalendarView } from "../components/ui/CalendarView";
import { FormInput } from "../components/ui/FormInput";

export function Calendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const [events, setEvents] = useState<AgendaEvent[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    starts_at: "",
    recurrence_rule: ""
  });

  async function loadEvents() {
    const data = await getAgendaEvents();
    setEvents(data);
  }

  useEffect(() => {
    void loadEvents();
  }, []);

  async function handleCreateEvent(event: FormEvent) {
    event.preventDefault();
    try {
      await createAgendaEvent({
        title: form.title,
        description: form.description,
        location: form.location,
        starts_at: form.starts_at,
        recurrence_rule: form.recurrence_rule
      });
      setMessage("Evento salvo com sucesso.");
      setForm({ title: "", description: "", location: "", starts_at: "", recurrence_rule: "" });
      await loadEvents();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao salvar evento.");
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-slate-900">Calendar</h2>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="space-y-6">
          <Button className="w-full" onClick={() => void 0}>
            <Plus size={14} className="mr-1" />
            Add New Event
          </Button>

          <form className="space-y-3" onSubmit={handleCreateEvent}>
            <FormInput label="Título" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
            <FormInput label="Data/Hora" type="datetime-local" value={form.starts_at} onChange={(e) => setForm((prev) => ({ ...prev, starts_at: e.target.value }))} required />
            <FormInput label="Local" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
            <FormInput label="Recorrência" placeholder="Ex: FREQ=MONTHLY" value={form.recurrence_rule} onChange={(e) => setForm((prev) => ({ ...prev, recurrence_rule: e.target.value }))} />
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Descrição</span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </label>
            <Button type="submit" className="w-full">
              Salvar Evento
            </Button>
          </form>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h3 className="text-lg font-semibold text-slate-800">Eventos salvos</h3>
            {events.map((event) => (
              <article key={event.id} className="rounded-xl border border-slate-100 p-3">
                <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(event.starts_at).toLocaleString("pt-BR")}</p>
                {event.location && <p className="mt-2 text-xs text-slate-400">{event.location}</p>}
              </article>
            ))}
            {events.length === 0 && <p className="text-sm text-slate-500">Nenhum evento cadastrado.</p>}
          </div>
        </Card>

        <Card className="p-4">
          <CalendarView year={year} month={month} />
        </Card>
      </div>

      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
