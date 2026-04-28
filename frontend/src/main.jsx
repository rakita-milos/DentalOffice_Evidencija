import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, BarChart3, CalendarDays, ClipboardList, Download, Plus, Settings, Stethoscope, Trash2, Wallet } from 'lucide-react';
import { api } from './api';
import './index.css';

const money = (value) => `${new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 0 }).format(Number(value || 0))} RSD`;
const dateOnly = (date) => String(date || '').slice(0, 10);

function Card({ children, className = '' }) {
  return <div className={`rounded-3xl bg-white shadow-sm shadow-slate-200 ${className}`}>{children}</div>;
}

function Button({ children, className = '', ...props }) {
  return <button className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</button>;
}

function Select({ children, className = '', ...props }) {
  return <select className={`h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:ring-4 focus:ring-sky-100 ${className}`} {...props}>{children}</select>;
}

function Input(props) {
  return <input {...props} className={`h-10 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:ring-4 focus:ring-sky-100 ${props.className || ''}`} />;
}

function exportCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPdf(title, rows) {
  const htmlRows = rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell)}</td>`).join('')}</tr>`).join('');
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<html><head><title>${title}</title><style>body{font-family:Arial;padding:24px}table{width:100%;border-collapse:collapse}td{border:1px solid #ddd;padding:8px;font-size:12px}tr:first-child{font-weight:bold;background:#f1f5f9}</style></head><body><h1>${title}</h1><table>${htmlRows}</table></body></html>`);
  w.document.close();
  w.print();
}

function App() {
  const [page, setPage] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ revenue: 0, expenses: 0, profit: 0, entriesCount: 0 });
  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [entries, setEntries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [reportType, setReportType] = useState('doctor');
  const [doctorReportId, setDoctorReportId] = useState('');
  const [reportRows, setReportRows] = useState([]);
  const [payrollPercent, setPayrollPercent] = useState(30);
  const [entryForm, setEntryForm] = useState({ entryDate: new Date().toISOString().slice(0, 10), doctorId: '', categoryId: '', serviceId: '', quantity: 1 });
  const [expenseForm, setExpenseForm] = useState({ expenseDate: new Date().toISOString().slice(0, 10), categoryId: '', vendor: '', amount: 0 });
  const [newCategory, setNewCategory] = useState({ name: '', firstServiceName: '', firstServicePrice: 0 });
  const [newService, setNewService] = useState({});

  const selectedCategory = categories.find((cat) => String(cat.id) === String(entryForm.categoryId));
  const selectedService = selectedCategory?.services?.find((service) => String(service.id) === String(entryForm.serviceId));
  const expenseCategories = useMemo(() => ['Doprinosi', 'Plata', 'Materijal', 'Majstori', 'Komunalije', 'Keramika', 'Proteze', 'Privremene', 'Skelet', 'Atečmeni', 'Implanti', 'Hirurgija', 'Ostalo'], []);

  async function loadAll() {
    setError('');
    try {
      const [nextSummary, nextDoctors, nextCategories, nextEntries, nextExpenses] = await Promise.all([
        api.summary(), api.doctors(), api.categories(), api.entries(), api.expenses(),
      ]);
      setSummary(nextSummary);
      setDoctors(nextDoctors);
      setCategories(nextCategories);
      setEntries(nextEntries);
      setExpenses(nextExpenses);
      setEntryForm((current) => ({
        ...current,
        doctorId: current.doctorId || nextDoctors[0]?.id || '',
        categoryId: current.categoryId || nextCategories[0]?.id || '',
        serviceId: current.serviceId || nextCategories[0]?.services?.[0]?.id || '',
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    async function loadReport() {
      try {
        let rows = [];
        if (reportType === 'doctor') rows = await api.reportByDoctor(doctorReportId);
        if (reportType === 'month') rows = await api.reportByMonth(doctorReportId);
        if (reportType === 'category') rows = await api.reportByCategory(doctorReportId);
        if (reportType === 'service') rows = await api.reportByService(doctorReportId);
        if (reportType === 'payroll') rows = await api.payroll(doctorReportId, payrollPercent);
        setReportRows(rows);
      } catch (err) { setError(err.message); }
    }
    if (page === 'Izveštaji') loadReport();
  }, [page, reportType, doctorReportId, payrollPercent]);

  async function addEntry() {
    await api.addEntry(entryForm);
    await loadAll();
  }

  async function addExpense() {
    const category = expenseCategories.find((name, index) => String(index + 1) === String(expenseForm.categoryId));
    if (!category) return;
    await api.addExpense(expenseForm);
    await loadAll();
  }

  async function addCategory() {
    if (!newCategory.name || !newCategory.firstServiceName) return;
    await api.addCategory(newCategory);
    setNewCategory({ name: '', firstServiceName: '', firstServicePrice: 0 });
    await loadAll();
  }

  async function addService(categoryId) {
    const data = newService[categoryId] || { name: '', currentPrice: 0 };
    if (!data.name) return;
    await api.addService({ categoryId, ...data });
    setNewService((current) => ({ ...current, [categoryId]: { name: '', currentPrice: 0 } }));
    await loadAll();
  }

  async function deleteCategory(id) {
    if (!window.confirm('Da li ste sigurni da želite da obrišete kategoriju?')) return;
    await api.deleteCategory(id);
    await loadAll();
  }

  async function deleteService(id) {
    if (!window.confirm('Da li ste sigurni da želite da obrišete uslugu?')) return;
    await api.deleteService(id);
    await loadAll();
  }

  async function updatePrice(serviceId, price) {
    await api.updateServicePrice(serviceId, price);
    await loadAll();
  }

  function reportAsRows() {
    if (reportType === 'payroll') return [['Doktor', 'Prihod', 'Procenat', 'Plata'], ...reportRows.map((r) => [r.doctor, r.revenue, `${r.percent}%`, r.salary])];
    if (reportType === 'doctor') return [['Doktor', 'Količina', 'Prihod'], ...reportRows.map((r) => [r.doctor, r.quantity, r.revenue])];
    if (reportType === 'month') return [['Mesec', 'Količina', 'Prihod'], ...reportRows.map((r) => [r.month, r.quantity, r.revenue])];
    if (reportType === 'category') return [['Kategorija', 'Količina', 'Prihod'], ...reportRows.map((r) => [r.category, r.quantity, r.revenue])];
    return [['Usluga', 'Količina', 'Prihod'], ...reportRows.map((r) => [r.service, r.quantity, r.revenue])];
  }

  const pages = [
    ['Dashboard', BarChart3], ['Unos usluga', ClipboardList], ['Troškovi', Wallet], ['Izveštaji', CalendarDays], ['Admin', Settings],
  ];

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">Učitavanje aplikacije...</div>;

  return <div className="min-h-screen bg-slate-50 text-slate-950">
    <aside className="fixed left-0 top-0 hidden h-full w-72 border-r bg-white p-5 lg:block">
      <div className="flex items-center gap-3 rounded-3xl bg-slate-950 p-4 text-white"><Stethoscope /><div><p className="text-sm text-slate-300">Dental Office</p><h1 className="text-lg font-bold">Evidencija</h1></div></div>
      <nav className="mt-8 space-y-2">{pages.map(([name, Icon]) => <button key={name} onClick={() => setPage(name)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${page === name ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:bg-slate-50'}`}><Icon size={18} />{name}</button>)}</nav>
    </aside>

    <main className="lg:pl-72">
      <header className="sticky top-0 z-10 border-b bg-slate-50/90 px-5 py-4 backdrop-blur lg:px-8"><h2 className="text-2xl font-bold">{page}</h2>{error && <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}</header>
      <section className="p-5 lg:p-8">
        {page === 'Dashboard' && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card><div className="p-5"><p className="text-sm text-slate-500">Prihod</p><p className="mt-2 text-2xl font-bold">{money(summary.revenue)}</p></div></Card>
          <Card><div className="p-5"><p className="text-sm text-slate-500">Troškovi</p><p className="mt-2 text-2xl font-bold">{money(summary.expenses)}</p></div></Card>
          <Card><div className="p-5"><p className="text-sm text-slate-500">Profit</p><p className="mt-2 text-2xl font-bold">{money(summary.profit)}</p></div></Card>
          <Card><div className="p-5"><p className="text-sm text-slate-500">Broj usluga</p><p className="mt-2 text-2xl font-bold">{summary.entriesCount}</p></div></Card>
        </div>}

        {page === 'Unos usluga' && <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <Card><div className="p-6"><h3 className="text-lg font-bold">Novi unos</h3><div className="mt-5 grid gap-3">
            <Input type="date" value={entryForm.entryDate} onChange={(e) => setEntryForm({ ...entryForm, entryDate: e.target.value })} />
            <Select value={entryForm.doctorId} onChange={(e) => setEntryForm({ ...entryForm, doctorId: e.target.value })}>{doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
            <Select value={entryForm.categoryId} onChange={(e) => { const cat = categories.find(c => String(c.id) === e.target.value); setEntryForm({ ...entryForm, categoryId: e.target.value, serviceId: cat?.services?.[0]?.id || '' }); }}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
            <Select value={entryForm.serviceId} onChange={(e) => setEntryForm({ ...entryForm, serviceId: e.target.value })}>{selectedCategory?.services?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
            <div className="grid grid-cols-2 gap-3"><Input type="number" min="1" value={entryForm.quantity} onChange={(e) => setEntryForm({ ...entryForm, quantity: e.target.value })} /><Input readOnly value={money(selectedService?.currentPrice)} className="bg-slate-50" /></div>
            <Button onClick={addEntry} className="bg-sky-600 text-white"><Plus size={16} className="mr-2" />Dodaj</Button>
          </div></div></Card>
          <Card><div className="overflow-x-auto p-6"><table className="w-full text-left text-sm"><thead><tr className="text-slate-500"><th>Datum</th><th>Doktor</th><th>Kategorija</th><th>Usluga</th><th>Kol.</th><th>Cena snapshot</th><th>Ukupno</th></tr></thead><tbody>{entries.map((e) => <tr key={e.id} className="border-t"><td className="py-3">{dateOnly(e.entryDate)}</td><td>{e.doctor.name}</td><td>{e.category.name}</td><td>{e.service.name}</td><td>{e.quantity}</td><td>{money(e.priceSnapshot)}</td><td className="font-bold">{money(Number(e.quantity) * Number(e.priceSnapshot))}</td></tr>)}</tbody></table></div></Card>
        </div>}

        {page === 'Troškovi' && <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <Card><div className="p-6"><h3 className="text-lg font-bold">Novi trošak</h3><div className="mt-5 grid gap-3"><Input type="date" value={expenseForm.expenseDate} onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })} /><Select value={expenseForm.categoryId} onChange={(e) => setExpenseForm({ ...expenseForm, categoryId: e.target.value })}><option value="">Kategorija</option>{expenseCategories.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}</Select><Input value={expenseForm.vendor} placeholder="Dobavljač" onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })} /><Input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} /><Button onClick={addExpense} className="bg-sky-600 text-white">Dodaj trošak</Button></div></div></Card>
          <Card><div className="overflow-x-auto p-6"><table className="w-full text-left text-sm"><thead><tr className="text-slate-500"><th>Datum</th><th>Kategorija</th><th>Opis</th><th>Iznos</th></tr></thead><tbody>{expenses.map((e) => <tr key={e.id} className="border-t"><td className="py-3">{dateOnly(e.expenseDate)}</td><td>{e.category.name}</td><td>{e.vendor || '-'}</td><td className="font-bold">{money(e.amount)}</td></tr>)}</tbody></table></div></Card>
        </div>}

        {page === 'Izveštaji' && <div className="space-y-6"><Card><div className="grid gap-3 p-6 md:grid-cols-[1fr_180px_180px_130px_130px]"><div><h3 className="font-bold">Centar za izveštaje</h3><p className="text-sm text-slate-500">Filtriraj po doktoru i skini CSV/PDF.</p></div><Select value={reportType} onChange={(e) => setReportType(e.target.value)}><option value="doctor">Po doktorima</option><option value="month">Po mesecima</option><option value="category">Po kategorijama</option><option value="service">Po uslugama</option><option value="payroll">Plata doktora</option></Select><Select value={doctorReportId} onChange={(e) => setDoctorReportId(e.target.value)}><option value="">Svi doktori</option>{doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select><Button onClick={() => exportCsv('dental-izvestaj.csv', reportAsRows())} className="bg-emerald-600 text-white"><Download size={16} className="mr-2" />Excel</Button><Button onClick={() => exportPdf('Dental izveštaj', reportAsRows())} className="bg-slate-950 text-white"><Download size={16} className="mr-2" />PDF</Button></div></Card>{reportType === 'payroll' && <Card><div className="p-6"><label className="text-sm font-semibold text-slate-600">Procenat za platu</label><Input type="number" value={payrollPercent} onChange={(e) => setPayrollPercent(e.target.value)} className="ml-3 w-24 text-right" /></div></Card>}<Card><div className="overflow-x-auto p-6"><table className="w-full text-left text-sm"><tbody>{reportAsRows().map((row, i) => <tr key={i} className={i === 0 ? 'bg-slate-50 font-bold text-slate-500' : 'border-t'}>{row.map((cell, j) => <td key={j} className="px-3 py-3">{typeof cell === 'number' && j > 0 ? money(cell) : cell}</td>)}</tr>)}</tbody></table></div></Card></div>}

        {page === 'Admin' && <div className="grid gap-6 xl:grid-cols-[1fr_420px]"><Card><div className="p-6"><h3 className="font-bold">Dodaj novu kategoriju</h3><div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_120px_120px]"><Input placeholder="Kategorija" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} /><Input placeholder="Prva usluga" value={newCategory.firstServiceName} onChange={(e) => setNewCategory({ ...newCategory, firstServiceName: e.target.value })} /><Input type="number" value={newCategory.firstServicePrice} onChange={(e) => setNewCategory({ ...newCategory, firstServicePrice: e.target.value })} /><Button onClick={addCategory} className="bg-sky-600 text-white">Dodaj</Button></div><div className="mt-6 space-y-5">{categories.map((cat) => <div key={cat.id} className="rounded-3xl bg-slate-50 p-4"><div className="flex items-center justify-between"><h4 className="font-bold">{cat.name}</h4><Button onClick={() => deleteCategory(cat.id)} className="bg-rose-50 text-rose-700"><Trash2 size={15} className="mr-1" />Obriši</Button></div><div className="mt-3 grid gap-2 md:grid-cols-[1fr_120px_90px]"><Input placeholder="Nova usluga" value={newService[cat.id]?.name || ''} onChange={(e) => setNewService((c) => ({ ...c, [cat.id]: { ...(c[cat.id] || {}), name: e.target.value } }))} /><Input type="number" value={newService[cat.id]?.currentPrice || 0} onChange={(e) => setNewService((c) => ({ ...c, [cat.id]: { ...(c[cat.id] || {}), currentPrice: e.target.value } }))} /><Button onClick={() => addService(cat.id)} className="bg-slate-950 text-white">Dodaj</Button></div><div className="mt-3 grid gap-2 md:grid-cols-2">{cat.services.map((s) => <div key={s.id} className="flex items-center justify-between rounded-2xl bg-white p-2"><span className="truncate text-sm">{s.name}</span><div className="flex items-center gap-2"><Input type="number" defaultValue={Number(s.currentPrice)} onBlur={(e) => updatePrice(s.id, e.target.value)} className="h-8 w-24 text-right" /><button onClick={() => deleteService(s.id)} className="text-rose-500"><Trash2 size={16} /></button></div></div>)}</div></div>)}</div></div></Card><Card><div className="p-6"><h3 className="font-bold">Pravila</h3><ul className="mt-3 space-y-2 text-sm text-slate-600"><li>• Cena se menja samo ovde.</li><li>• Istorijski unosi imaju priceSnapshot.</li><li>• Korišćene kategorije/usluge API neće obrisati.</li><li>• Delete ima potvrdu.</li></ul></div></Card></div>}
      </section>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
