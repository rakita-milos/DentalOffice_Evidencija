import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';
import { formatMoney } from '../utils/money';
import { toInputDate } from '../utils/dates';

export function ServiceEntryPage({ doctors, categories, entries, onCreate }) {
  const firstCategory = categories[0];
  const firstService = firstCategory?.services?.[0];
  const [form, setForm] = useState({ entryDate: new Date().toISOString().slice(0, 10), doctorId: doctors[0]?.id || '', categoryId: firstCategory?.id || '', serviceId: firstService?.id || '', quantity: 1 });

  useEffect(() => {
    if (!form.doctorId && doctors[0]?.id) setForm((current) => ({ ...current, doctorId: doctors[0].id }));
    if (!form.categoryId && firstCategory?.id) setForm((current) => ({ ...current, categoryId: firstCategory.id, serviceId: firstService?.id || '' }));
  }, [doctors, firstCategory, firstService, form.doctorId, form.categoryId]);

  const selectedCategory = categories.find((c) => c.id === Number(form.categoryId));
  const services = selectedCategory?.services || [];
  const selectedService = services.find((s) => s.id === Number(form.serviceId));

  function update(field, value) {
    const next = { ...form, [field]: value };
    if (field === 'categoryId') next.serviceId = categories.find((c) => c.id === Number(value))?.services?.[0]?.id || '';
    setForm(next);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_.75fr]">
      <Card>
        <div className="flex items-center justify-between border-b border-[#EAF0F7] p-6">
          <div>
            <h3 className="text-xl font-black text-[#0D2B5C]">Evidencija usluga</h3>
            <p className="text-sm text-[#6B7280]">Cena je zaključana kao snapshot pri unosu.</p>
          </div>
          <Button><Icon name="plus" size={17} /> Nova usluga</Button>
        </div>
        <div className="grid gap-3 border-b border-[#EAF0F7] p-4 md:grid-cols-5">
          <Input placeholder="Datum od" />
          <Input placeholder="Datum do" />
          <Select value="Svi lekari" onChange={() => {}}><option>Svi lekari</option>{doctors.map((d) => <option key={d.id}>{d.name}</option>)}</Select>
          <Select value="Sve kategorije" onChange={() => {}}><option>Sve kategorije</option>{categories.map((c) => <option key={c.id}>{c.name}</option>)}</Select>
          <Button>Pretraži</Button>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="table-brand w-full text-left text-sm">
            <thead><tr><th>Datum</th><th>Lekar</th><th>Usluga</th><th>Kategorija</th><th>Količina</th><th>Cena snapshot</th><th>Ukupno</th></tr></thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{toInputDate(entry.entryDate)}</td>
                  <td>{entry.doctor?.name}</td>
                  <td>{entry.service?.name}</td>
                  <td>{entry.category?.name}</td>
                  <td>{entry.quantity}</td>
                  <td>{formatMoney(entry.priceSnapshot)}</td>
                  <td className="font-black text-[#0D2B5C]">{formatMoney(Number(entry.quantity) * Number(entry.priceSnapshot))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="border-b border-[#EAF0F7] p-6">
          <h3 className="text-xl font-black text-[#0D2B5C]">Nova usluga</h3>
          <p className="text-sm text-[#6B7280]">Izaberi lekara, kategoriju i uslugu.</p>
        </div>
        <div className="grid gap-4 p-6">
          <label className="text-xs font-black uppercase text-[#53657d]">Datum</label>
          <Input type="date" value={form.entryDate} onChange={(e) => update('entryDate', e.target.value)} />
          <label className="text-xs font-black uppercase text-[#53657d]">Lekar</label>
          <Select value={form.doctorId} onChange={(v) => update('doctorId', v)}>{doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
          <label className="text-xs font-black uppercase text-[#53657d]">Kategorija</label>
          <Select value={form.categoryId} onChange={(v) => update('categoryId', v)}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
          <label className="text-xs font-black uppercase text-[#53657d]">Usluga</label>
          <Select value={form.serviceId} onChange={(v) => update('serviceId', v)}>{services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-black uppercase text-[#53657d]">Količina</label><Input type="number" min="1" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} className="mt-2 w-full" /></div>
            <div><label className="text-xs font-black uppercase text-[#53657d]">Cena</label><Input readOnly value={formatMoney(selectedService?.currentPrice)} className="mt-2 w-full cursor-not-allowed bg-[#F5F7FA] text-[#6B7280]" /></div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="light">Otkaži</Button>
            <Button onClick={() => onCreate(form)}>Sačuvaj</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
