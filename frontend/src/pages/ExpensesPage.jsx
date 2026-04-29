import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';
import { formatMoney } from '../utils/money';
import { toInputDate } from '../utils/dates';

export function ExpensesPage({ categories, expenses, onCreate }) {
  const [form, setForm] = useState({ expenseDate: new Date().toISOString().slice(0, 10), categoryId: categories[0]?.id || '', vendor: '', amount: 0 });
  useEffect(() => { if (!form.categoryId && categories[0]?.id) setForm((current) => ({ ...current, categoryId: categories[0].id })); }, [categories, form.categoryId]);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Card className="p-6">
        <h3 className="text-xl font-black text-[#0D2B5C]">Novi trošak</h3>
        <p className="mt-1 text-sm text-[#6B7280]">Materijal, plate, komunalije i laboratorija.</p>
        <div className="mt-6 grid gap-4">
          <Input type="date" value={form.expenseDate} onChange={(e) => setForm({ ...form, expenseDate: e.target.value })} />
          <Select value={form.categoryId} onChange={(v) => setForm({ ...form, categoryId: v })}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
          <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="Dobavljač / osoba" />
          <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Iznos" />
          <Button onClick={() => onCreate(form)}><Icon name="plus" size={18} /> Dodaj trošak</Button>
        </div>
      </Card>

      <Card>
        <div className="border-b border-[#EAF0F7] p-6"><h3 className="text-xl font-black text-[#0D2B5C]">Lista troškova</h3></div>
        <div className="overflow-x-auto p-4">
          <table className="table-brand w-full text-left text-sm">
            <thead><tr><th>Datum</th><th>Kategorija</th><th>Opis</th><th>Iznos</th></tr></thead>
            <tbody>{expenses.map((item) => <tr key={item.id}><td>{toInputDate(item.expenseDate)}</td><td>{item.category?.name}</td><td>{item.vendor || '-'}</td><td className="font-black text-[#0D2B5C]">{formatMoney(item.amount)}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
