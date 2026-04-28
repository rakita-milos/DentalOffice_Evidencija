import { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { ReportTable } from '../components/reports/ReportTable';
import { exportRowsToCsv } from '../utils/exportCsv';
import { exportHtmlToPdf } from '../utils/exportPdf';
export function ReportsPage({ byDoctor, byMonth, byCategory, payroll }) {
  const [type, setType] = useState('doctorPayroll');
  const rows = useMemo(() => {
    if (type === 'byDoctor') return [['Doktor','Broj usluga','Prihod'], ...byDoctor.map((r) => [r.doctor, r.quantity, r.revenue])];
    if (type === 'byMonth') return [['Mesec','Broj usluga','Prihod'], ...byMonth.map((r) => [r.month, r.quantity, r.revenue])];
    if (type === 'byCategory') return [['Kategorija','Broj usluga','Prihod'], ...byCategory.map((r) => [r.category, r.quantity, r.revenue])];
    return [['Doktor','Prihod','Procenat','Plata'], ...payroll.map((r) => [r.doctor, r.revenue, `${r.percent}%`, r.salary])];
  }, [type, byDoctor, byMonth, byCategory, payroll]);
  return <div className="space-y-6"><Card><div className="grid gap-4 p-6 xl:grid-cols-[1fr_220px_160px_160px]"><div><h3 className="text-lg font-bold">Centar za izveštaje</h3><p className="text-sm text-slate-500">Excel/CSV i PDF export.</p></div><Select value={type} onChange={setType}><option value="doctorPayroll">Plata po doktoru</option><option value="byDoctor">Po doktorima</option><option value="byMonth">Po mesecima</option><option value="byCategory">Po kategorijama</option></Select><Button onClick={() => exportRowsToCsv(`dental-${type}.csv`, rows)} className="h-11 rounded-2xl bg-emerald-600 text-white">Excel</Button><Button onClick={() => exportHtmlToPdf(`Dental ${type}`, rows)} className="h-11 rounded-2xl bg-slate-950 text-white">PDF</Button></div></Card><Card><ReportTable rows={rows} /></Card></div>;
}
