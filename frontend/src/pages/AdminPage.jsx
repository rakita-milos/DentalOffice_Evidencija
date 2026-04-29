import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Icon } from '../components/ui/Icon';

export function AdminPage({ categories, onCreateCategory, onCreateService, onUpdatePrice, onDeleteCategory, onDeleteService }) {
  const [categoryForm, setCategoryForm] = useState({ name: '', serviceName: '', price: 0 });
  const [serviceForms, setServiceForms] = useState({});
  const [confirm, setConfirm] = useState(null);

  async function handleCreateCategory() {
    await onCreateCategory(categoryForm);
    setCategoryForm({ name: '', serviceName: '', price: 0 });
  }

  async function handleCreateService(categoryId, serviceForm) {
    await onCreateService({ categoryId, ...serviceForm });
    setServiceForms((current) => ({ ...current, [categoryId]: { name: '', price: 0 } }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <Card>
        <div className="border-b border-[#EAF0F7] p-6">
          <h3 className="text-xl font-black text-[#0D2B5C]">Cenovnik, kategorije i usluge</h3>
          <p className="text-sm text-[#6B7280]">Admin menja cene samo za nove unose. Istorija ostaje zaključana.</p>
        </div>
        <div className="p-6">
          <div className="mb-6 rounded-[24px] border border-[#CFE9FF] bg-[#EAF5FF] p-5">
            <h4 className="font-black text-[#0D2B5C]">Dodaj novu kategoriju + prvu uslugu</h4>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_120px_120px]">
              <Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} placeholder="Kategorija" />
              <Input value={categoryForm.serviceName} onChange={(e) => setCategoryForm({ ...categoryForm, serviceName: e.target.value })} placeholder="Prva usluga" />
              <Input type="number" min="0" value={categoryForm.price} onChange={(e) => setCategoryForm({ ...categoryForm, price: e.target.value })} className="text-right" />
              <Button onClick={handleCreateCategory}><Icon name="plus" size={16} /> Dodaj</Button>
            </div>
          </div>

          <div className="grid gap-6">
            {categories.map((category) => {
              const sf = serviceForms[category.id] || { name: '', price: 0 };
              const categoryUsed = Number(category._count?.entries || 0) > 0;

              return (
                <div key={category.id} className="rounded-[24px] border border-[#E5EDF7] bg-[#F8FBFF] p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-black text-[#0D2B5C]">{category.name}</p>
                      <p className="text-xs font-semibold text-[#6B7280]">
                        {category.services.length} usluga • {categoryUsed ? 'korišćena - brisanje zaključano' : 'nije korišćena'}
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      disabled={categoryUsed}
                      onClick={() => setConfirm({
                        title: 'Brisanje kategorije',
                        message: `Da li ste sigurni da želite da obrišete kategoriju ${category.name}?`,
                        action: () => onDeleteCategory(category.id),
                      })}
                    >
                      Obriši
                    </Button>
                  </div>

                  <div className="mb-4 grid gap-2 md:grid-cols-[1fr_110px_100px]">
                    <Input value={sf.name} onChange={(e) => setServiceForms({ ...serviceForms, [category.id]: { ...sf, name: e.target.value } })} placeholder="Nova usluga" className="h-9 rounded-xl" />
                    <Input type="number" min="0" value={sf.price} onChange={(e) => setServiceForms({ ...serviceForms, [category.id]: { ...sf, price: e.target.value } })} className="h-9 rounded-xl text-right" />
                    <Button variant="dark" onClick={() => handleCreateService(category.id, sf)} className="h-9 rounded-xl">Dodaj</Button>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    {category.services.map((service) => {
                      const serviceUsed = Number(service._count?.entries || 0) > 0;
                      return (
                        <div key={service.id} className="flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm shadow-blue-900/5">
                          <span className="min-w-0 flex-1 truncate text-sm font-bold text-[#0D2B5C]" title={service.name}>{service.name}</span>
                          <div className="flex items-center gap-1">
                            <input type="number" min="0" defaultValue={service.currentPrice} onBlur={(e) => onUpdatePrice(service.id, e.target.value)} className="h-8 w-24 rounded-xl border border-[#DCE7F3] px-2 text-right text-sm font-bold text-[#0D2B5C] outline-none focus:border-[#64B5F6]" />
                            <span className="text-[11px] font-black text-[#6B7280]">RSD</span>
                            <button
                              disabled={serviceUsed}
                              onClick={() => setConfirm({
                                title: 'Brisanje usluge',
                                message: `Da li ste sigurni da želite da obrišete uslugu ${service.name}?`,
                                action: () => onDeleteService(service.id),
                              })}
                              className="ml-1 rounded-lg p-1 text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-300"
                              title={serviceUsed ? 'Usluga je korišćena i ne može se obrisati' : 'Obriši uslugu'}
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-black text-[#0D2B5C]">Pravila Admin dela</h3>
          <div className="mt-5 space-y-3 text-sm font-semibold">
            <div className="status-success rounded-2xl p-4"><b>Cena je snapshot</b><p>Nove cene važe samo za nove unose.</p></div>
            <div className="status-info rounded-2xl p-4"><b>Korišćeno se ne briše</b><p>Backend i UI blokiraju kategorije i usluge sa istorijom.</p></div>
            <div className="status-warning rounded-2xl p-4"><b>Svako brisanje ima potvrdu</b><p>Pre delete akcije dobija se popup.</p></div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-black text-[#0D2B5C]">Brand identity</h3>
          <div className="mt-5 grid grid-cols-5 gap-3">
            {['#1E88E5', '#64B5F6', '#0D47A1', '#4CAF50', '#26C6DA'].map((color) => <div key={color}><div className="h-14 rounded-2xl" style={{ background: color }} /><p className="mt-2 text-[11px] font-bold text-[#6B7280]">{color}</p></div>)}
          </div>
        </Card>
      </div>

      <ConfirmModal open={!!confirm} title={confirm?.title} message={confirm?.message} onCancel={() => setConfirm(null)} onConfirm={async () => { await confirm.action(); setConfirm(null); }} />
    </div>
  );
}
