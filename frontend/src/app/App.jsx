import { useCallback, useMemo, useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { ServiceEntryPage } from '../pages/ServiceEntryPage';
import { ExpensesPage } from '../pages/ExpensesPage';
import { ReportsPage } from '../pages/ReportsPage';
import { AdminPage } from '../pages/AdminPage';
import { useApiData } from '../hooks/useApiData';
import { doctorsApi } from '../services/doctorsApi';
import { servicesApi } from '../services/servicesApi';
import { entriesApi } from '../services/entriesApi';
import { expensesApi } from '../services/expensesApi';
import { reportsApi } from '../services/reportsApi';
import { months } from '../constants/months';

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const doctors = useApiData(doctorsApi.list, []);
  const categories = useApiData(servicesApi.categories, []);
  const entries = useApiData(entriesApi.list, []);
  const expenseCategories = useApiData(expensesApi.categories, []);
  const expenses = useApiData(expensesApi.list, []);
  const summary = useApiData(reportsApi.summary, { revenue: 0, expenses: 0, profit: 0, entriesCount: 0 });
  const byDoctor = useApiData(() => reportsApi.byDoctor(), []);
  const byMonth = useApiData(reportsApi.byMonth, []);
  const byCategory = useApiData(reportsApi.byCategory, []);
  const payroll = useApiData(() => reportsApi.payroll({ percent: 30 }), []);

  const refreshAll = useCallback(async () => {
    await Promise.all([categories.refresh(), entries.refresh(), expenses.refresh(), summary.refresh(), byDoctor.refresh(), byMonth.refresh(), byCategory.refresh(), payroll.refresh()]);
  }, [categories, entries, expenses, summary, byDoctor, byMonth, byCategory, payroll]);

  const anyError = [doctors, categories, entries, expenseCategories, expenses, summary].find((x) => x.error)?.error;
  const loading = [doctors, categories, entries, expenseCategories, expenses].some((x) => x.loading);

  const monthly = useMemo(() => months.map((m) => ({ month: m, revenue: byMonth.data.find((x) => x.month?.toLowerCase?.() === m.toLowerCase())?.revenue || 0, expenses: 0 })), [byMonth.data]);

  async function createEntry(payload) { await entriesApi.create(payload); await refreshAll(); }
  async function createExpense(payload) { await expensesApi.create(payload); await refreshAll(); }
  async function createCategory(payload) { await servicesApi.createCategory(payload); await refreshAll(); }
  async function createService(payload) { await servicesApi.createService(payload); await refreshAll(); }
  async function updatePrice(id, price) { await servicesApi.updatePrice(id, price); await refreshAll(); }
  async function deleteCategory(id) { await servicesApi.deleteCategory(id); await refreshAll(); }
  async function deleteService(id) { await servicesApi.deleteService(id); await refreshAll(); }

  function renderPage() {
    if (loading) return <div className="rounded-3xl bg-white p-6 shadow-sm">Učitavanje...</div>;
    if (anyError) return <div className="rounded-3xl bg-rose-50 p-6 text-rose-700">API greška: {anyError}</div>;
    if (activePage === 'Dashboard') return <DashboardPage summary={summary.data} doctorTotals={byDoctor.data} categoryTotals={byCategory.data} monthly={monthly} entries={entries.data} onGoToPage={setActivePage} />;
    if (activePage === 'Unos usluga') return <ServiceEntryPage doctors={doctors.data} categories={categories.data} entries={entries.data} onCreate={createEntry} />;
    if (activePage === 'Troškovi') return <ExpensesPage categories={expenseCategories.data} expenses={expenses.data} onCreate={createExpense} />;
    if (activePage === 'Izveštaji') return <ReportsPage doctors={doctors.data} byDoctor={byDoctor.data} byMonth={byMonth.data} byCategory={byCategory.data} payroll={payroll.data} />;
    return <AdminPage categories={categories.data} onCreateCategory={createCategory} onCreateService={createService} onUpdatePrice={updatePrice} onDeleteCategory={deleteCategory} onDeleteService={deleteService} />;
  }

  return <PageLayout activePage={activePage} setActivePage={setActivePage} onExport={() => setActivePage('Izveštaji')}>{renderPage()}</PageLayout>;
}
