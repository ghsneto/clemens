import { FormEvent, useEffect, useState } from "react";
import { RefreshCw, UserPlus } from "lucide-react";
import { createMember, getMembers } from "../lib/api";
import { Member, MemberClass } from "../types";
import { Button } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import { FilterBar } from "../components/ui/FilterBar";
import { Card } from "../components/ui/Card";
import { FieldGroup, FormInput, FormSelect } from "../components/ui/FormInput";

const CLASSES: MemberClass[] = ["Primarios", "Infantil", "Adolescentes", "Jovens", "Adultos"];

export function Users() {
  const [classFilter, setClassFilter] = useState<MemberClass>("Adultos");
  const [members, setMembers] = useState<Member[]>([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    birth_date: "",
    address: "",
    phone: "",
    joined_at: "",
    baptized_at: "",
    class_name: "Adultos" as MemberClass
  });

  async function loadMembers() {
    const data = await getMembers(classFilter);
    setMembers(data);
  }

  useEffect(() => {
    void loadMembers();
  }, [classFilter]);

  async function handleCreateMember(event: FormEvent) {
    event.preventDefault();
    try {
      await createMember(form);
      setMessage("Membro cadastrado com sucesso.");
      setForm({
        full_name: "",
        birth_date: "",
        address: "",
        phone: "",
        joined_at: "",
        baptized_at: "",
        class_name: form.class_name
      });
      await loadMembers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao cadastrar membro.");
    }
  }

  return (
    <div className="space-y-6">
      <FilterBar>
        <select
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value as MemberClass)}
        >
          {CLASSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <Button variant="secondary" onClick={() => void loadMembers()}>
          <RefreshCw size={14} className="mr-2" />
          Atualizar Lista
        </Button>
      </FilterBar>

      <Card>
        <h2 className="mb-5 text-xl font-semibold text-slate-900">Cadastro de Membro</h2>
        <form className="space-y-4" onSubmit={handleCreateMember}>
          <FieldGroup>
            <FormInput label="Nome completo" value={form.full_name} onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))} required />
            <FormInput label="Data de nascimento" type="date" value={form.birth_date} onChange={(e) => setForm((prev) => ({ ...prev, birth_date: e.target.value }))} required />
          </FieldGroup>
          <FieldGroup>
            <FormInput label="Endereço" value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} required />
            <FormInput label="Telefone" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} required />
          </FieldGroup>
          <FieldGroup>
            <FormInput label="Data de adesão" type="date" value={form.joined_at} onChange={(e) => setForm((prev) => ({ ...prev, joined_at: e.target.value }))} required />
            <FormInput label="Data de batismo" type="date" value={form.baptized_at} onChange={(e) => setForm((prev) => ({ ...prev, baptized_at: e.target.value }))} required />
          </FieldGroup>
          <FormSelect
            label="Classe"
            value={form.class_name}
            onChange={(e) => setForm((prev) => ({ ...prev, class_name: e.target.value as MemberClass }))}
            options={CLASSES.map((value) => ({ label: value, value }))}
          />
          <Button type="submit">
            <UserPlus size={14} className="mr-2" />
            Salvar Membro
          </Button>
        </form>
      </Card>

      <DataTable
        title={`Membros da Classe ${classFilter}`}
        rows={members}
        columns={[
          { header: "ID", key: "id" },
          { header: "Nome", key: "full_name" },
          { header: "Nascimento", key: "birth_date" },
          { header: "Telefone", key: "phone" },
          { header: "Classe", key: "class_name", align: "right" }
        ]}
      />

      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
