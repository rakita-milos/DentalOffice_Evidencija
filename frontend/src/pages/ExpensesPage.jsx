import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { formatMoney } from '../utils/money';
import { toInputDate } from '../utils/dates';
export function ExpensesPage({ categories, expenses, onCreate }) {
  const [form, setForm] = useState({ expenseDate: new Date().toISOString().slice(0,10), categoryId: categories[0]?.id || '', vendor: '', amount: 0 });
  return <div className="grid gap-6 xl:grid-cols-[420px_1fr]"><Card><div className="p-6"><h3 className="text-lg font-bold">Novi trošak</h3><div className="mt-6 grid gap-4"><input type="date" value={form.expenseDate} onChange={(e) => setForm({ ...form, expenseDate: e.target.value })} className="h-11 rounded-2xl border border-slate-200 px-4" /><Select value={form.categoryId} onChange={(v) => setForm({ ...form, categoryId: v })}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select><input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="Dobavljač / osoba" className="h-11 rounded-2xl border border-slate-200 px-4" /><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="h-11 rounded-2xl border border-slate-200 px-4" /><Button onClick={() => onCreate(form)} className="h-11 rounded-2xl bg-sky-600 text-white">Dodaj trošak</Button></div></div></Card><Card><div className="border-b border-slate-100 p-6"><h3 className="text-lg font-bold">Lista troškova</h3></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><tbody className="divide-y divide-slate-100">{expenses.map((e) => <tr key={e.id}><td className="px-6 py-4">{toInputDate(e.expenseDate)}</td><td>{e.category?.name}</td><td>{e.vendor || '-'}</td><td className="font-bold">{formatMoney(e.amount)}</td></tr>)}</tbody></table></div></Card></div>;
}
