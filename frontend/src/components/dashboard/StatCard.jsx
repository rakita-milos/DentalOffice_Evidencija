import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
export function StatCard({ icon,label,value,helper }){return <Card><div className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-400">{helper}</p></div><div className="rounded-2xl bg-sky-50 p-3 text-sky-600"><Icon name={icon} size={22}/></div></div></div></Card>;}
