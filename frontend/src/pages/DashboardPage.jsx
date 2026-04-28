import { StatCard } from '../components/dashboard/StatCard';
import { MiniBar } from '../components/dashboard/MiniBar';
import { MonthlyChart } from '../components/dashboard/MonthlyChart';
import { Card } from '../components/ui/Card';
import { formatMoney } from '../utils/money';
export function DashboardPage({ summary, doctorTotals, categoryTotals, monthly }) {
  const maxDoctor = Math.max(...doctorTotals.map((d) => d.revenue), 1);
  const maxCategory = Math.max(...categoryTotals.map((c) => c.revenue), 1);
  return <div className="space-y-6"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard icon="card" label="Prihod" value={formatMoney(summary.revenue)} helper="Ukupan promet" /><StatCard icon="wallet" label="Troškovi" value={formatMoney(summary.expenses)} helper="Ukupni troškovi" /><StatCard icon="chart" label="Profit" value={formatMoney(summary.profit)} helper="Prihod minus troškovi" /><StatCard icon="list" label="Usluge" value={summary.entriesCount || 0} helper="Broj unosa" /></div><div className="grid gap-6 xl:grid-cols-2"><Card><div className="p-6"><h3 className="text-lg font-bold">Prihod po doktoru</h3><div className="mt-5 space-y-5">{doctorTotals.map((d) => <MiniBar key={d.doctor} label={d.doctor} value={d.revenue} max={maxDoctor} />)}</div></div></Card><Card><div className="p-6"><h3 className="text-lg font-bold">Prihod po kategoriji</h3><div className="mt-5 space-y-5">{categoryTotals.map((c) => <MiniBar key={c.category} label={c.category} value={c.revenue} max={maxCategory} />)}</div></div></Card></div><MonthlyChart monthly={monthly} /></div>;
}
