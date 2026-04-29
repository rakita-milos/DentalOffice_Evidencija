import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

export function StatCard({ icon, label, value, helper, tone = 'blue' }) {
  const helperTone = tone === 'red' ? 'text-rose-600' : tone === 'green' ? 'text-[#4CAF50]' : 'text-[#4CAF50]';
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className="icon-tile grid h-14 w-14 place-items-center rounded-2xl">
          <Icon name={icon} size={26} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-[#53657d]">{label}</p>
          <p className="mt-1 text-2xl font-black tracking-tight text-[#0D2B5C]">{value}</p>
          <p className={`mt-1 text-xs font-semibold ${helperTone}`}>{helper}</p>
        </div>
      </div>
    </Card>
  );
}
