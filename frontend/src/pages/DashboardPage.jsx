import { StatCard } from '../components/dashboard/StatCard';
import { MiniBar } from '../components/dashboard/MiniBar';
import { MonthlyChart } from '../components/dashboard/MonthlyChart';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { formatMoney } from '../utils/money';
import { toInputDate } from '../utils/dates';

export function DashboardPage({ summary, doctorTotals, categoryTotals, monthly, entries = [], onGoToPage }) {
  const maxDoctor = Math.max(...doctorTotals.map((d) => Number(d.revenue || 0)), 1);
  const latestEntries = entries.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="wallet" label="Ukupan promet" value={formatMoney(summary.revenue)} helper="+12% u odnosu na prethodni mesec" tone="green" />
        <StatCard icon="users" label="Ukupno usluga" value={summary.entriesCount || 0} helper="+8% u odnosu na prethodni mesec" tone="green" />
        <StatCard icon="card" label="Ukupno troškova" value={formatMoney(summary.expenses)} helper="-5% u odnosu na prethodni mesec" tone="red" />
        <StatCard icon="check" label="Neto rezultat" value={formatMoney(summary.profit)} helper="+15% u odnosu na prethodni mesec" tone="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
        <Card className="p-6">
          <h3 className="text-lg font-black text-[#0D2B5C]">Promet po lekarima</h3>
          <div className="mt-6 grid grid-cols-4 gap-4">
            {doctorTotals.map((d) => <MiniBar key={d.doctor} label={d.doctor} value={d.revenue} max={maxDoctor} />)}
          </div>
        </Card>
        <MonthlyChart monthly={monthly} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_.65fr_.75fr]">
        <Card>
          <div className="border-b border-[#EAF0F7] p-5">
            <h3 className="text-lg font-black text-[#0D2B5C]">Poslednje unete usluge</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="table-brand w-full text-left text-sm">
              <thead><tr><th>Datum</th><th>Lekar</th><th>Usluga</th><th>Kategorija</th><th>Kol.</th><th>Ukupno</th></tr></thead>
              <tbody>
                {latestEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{toInputDate(entry.entryDate)}</td>
                    <td>{entry.doctor?.name}</td>
                    <td>{entry.service?.name}</td>
                    <td>{entry.category?.name}</td>
                    <td>{entry.quantity}</td>
                    <td className="font-black text-[#0D2B5C]">{formatMoney(Number(entry.quantity) * Number(entry.priceSnapshot))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="light" onClick={() => onGoToPage?.('Unos usluga')} className="mt-4 w-full">Pogledaj sve usluge <Icon name="arrow" size={16} /></Button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg font-black text-[#0D2B5C]">Brzi pristup</h3>
          <div className="mt-5 space-y-3">
            {[
              ['Unos nove usluge', 'plus', 'Unos usluga'],
              ['Unos troška', 'wallet', 'Troškovi'],
              ['Pregled izveštaja', 'chart', 'Izveštaji'],
              ['Upravljanje cenovnikom', 'settings', 'Admin'],
            ].map(([label, icon, page]) => (
              <button key={label} onClick={() => onGoToPage?.(page)} className="flex w-full items-center justify-between rounded-2xl border border-[#E5EDF7] bg-white p-4 text-left text-sm font-bold text-[#0D2B5C] transition hover:border-[#64B5F6] hover:bg-[#F8FBFF]">
                <span className="flex items-center gap-3"><span className="text-[#1E88E5]"><Icon name={icon} size={20} /></span>{label}</span><Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg font-black text-[#0D2B5C]">Notifikacije</h3>
          <div className="mt-5 space-y-3 text-sm">
            <div className="status-success rounded-2xl p-4"><b>Uspešno</b><p>Usluga je uspešno sačuvana.</p></div>
            <div className="status-info rounded-2xl p-4"><b>Informacija</b><p>Izveštaj je uspešno generisan.</p></div>
            <div className="status-warning rounded-2xl p-4"><b>Upozorenje</b><p>Nema podataka za izabrani period.</p></div>
            <div className="status-error rounded-2xl p-4"><b>Greška</b><p>Došlo je do greške. Pokušajte ponovo.</p></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.85fr]">
        <Card className="p-6">
          <h3 className="text-lg font-black text-[#0D2B5C]">Promet po kategorijama</h3>
          <div className="mt-5 space-y-4">
            {categoryTotals.map((category) => {
              const max = Math.max(...categoryTotals.map((c) => Number(c.revenue || 0)), 1);
              const width = Math.max(7, (Number(category.revenue || 0) / max) * 100);
              return (
                <div key={category.category}>
                  <div className="mb-2 flex justify-between text-sm"><b>{category.category}</b><span>{formatMoney(category.revenue)}</span></div>
                  <div className="h-3 rounded-full bg-[#EEF5FC]"><div className="h-3 rounded-full bg-gradient-to-r from-[#1E88E5] to-[#26C6DA]" style={{ width: `${width}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-black text-[#0D2B5C]">Brand feeling</h3>
          <div className="mt-5 grid gap-3 text-sm font-semibold text-[#53657d]">
            {['Clean', 'Clinical but friendly', 'Premium but accessible', 'Trust-driven', 'Calm and reassuring'].map((item) => <div key={item} className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#E3F2FD] text-[#1E88E5]"><Icon name="check" size={16} /></span>{item}</div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
