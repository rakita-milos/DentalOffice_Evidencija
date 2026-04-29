import { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { ReportTable } from '../components/reports/ReportTable';
import { exportRowsToCsv } from '../utils/exportCsv';
import { exportHtmlToPdf } from '../utils/exportPdf';
import { Icon } from '../components/ui/Icon';

export function ReportsPage({ byDoctor, byMonth, byCategory, payroll }) {
  const [type, setType] = useState('doctorPayroll');
  const rows = useMemo(() => {
    if (type === 'byDoctor') return [['Doktor', 'Broj usluga', 'Prihod'], ...byDoctor.map((r) => [r.doctor, r.quantity, r.revenue])];
    if (type === 'byMonth') return [['Mesec', 'Broj usluga', 'Prihod'], ...byMonth.map((r) => [r.month, r.quantity, r.revenue])];
    if (type === 'byCategory') return [['Kategorija', 'Broj usluga', 'Prihod'], ...byCategory.map((r) => [r.category, r.quantity, r.revenue])];
    return [['Doktor', 'Prihod', 'Procenat', 'Plata'], ...payroll.map((r) => [r.doctor, r.revenue, `${r.percent}%`, r.salary])];
  }, [type, byDoctor, byMonth, byCategory, payroll]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_240px_160px_160px]">
          <div>
            <h3 className="text-xl font-black text-[#0D2B5C]">Centar za izveštaje</h3>
            <p className="text-sm text-[#6B7280]">Izveštaji po lekarima, mesecima, kategorijama i obračun plata.</p>
          </div>
          <Select value={type} onChange={setType}>
            <option value="doctorPayroll">Plata po doktoru</option>
            <option value="byDoctor">Po doktorima</option>
            <option value="byMonth">Po mesecima</option>
            <option value="byCategory">Po kategorijama</option>
          </Select>
          <Button variant="success" onClick={() => exportRowsToCsv(`dr-rosa-basic-${type}.csv`, rows)}><Icon name="download" size={17} /> Excel</Button>
          <Button variant="dark" onClick={() => exportHtmlToPdf(`dr Rosa Bašić ${type}`, rows)}><Icon name="download" size={17} /> PDF</Button>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card><ReportTable rows={rows} /></Card>
        <Card className="p-6">
          <h3 className="text-xl font-black text-[#0D2B5C]">Predlozi izveštaja</h3>
          <div className="mt-5 space-y-3 text-sm font-semibold text-[#53657d]">
            <p className="rounded-2xl bg-[#F8FBFF] p-4">Top 10 najtraženijih usluga</p>
            <p className="rounded-2xl bg-[#F8FBFF] p-4">Profitabilnost po kategoriji</p>
            <p className="rounded-2xl bg-[#F8FBFF] p-4">Dnevni promet po ordinaciji</p>
            <p className="rounded-2xl bg-[#F8FBFF] p-4">Mesečno poređenje lekara</p>
            <p className="rounded-2xl bg-[#F8FBFF] p-4">Troškovi po tipu i dobavljaču</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
