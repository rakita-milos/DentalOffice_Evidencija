import { formatMoney } from '../../utils/money';

export function MiniBar({ label, value, max }) {
  const height = max ? Math.max(12, Math.round((Number(value) / max) * 100)) : 0;
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <div className="flex h-40 w-full items-end justify-center rounded-2xl bg-[#F8FBFF] px-4 py-3">
        <div className="w-10 rounded-t-lg bg-gradient-to-t from-[#1E88E5] to-[#64B5F6] shadow-lg shadow-blue-500/20" style={{ height: `${height}%` }} />
      </div>
      <div className="text-center">
        <p className="max-w-24 truncate text-xs font-bold text-[#0D2B5C]">{label}</p>
        <p className="text-[11px] font-semibold text-[#6B7280]">{formatMoney(value)}</p>
      </div>
    </div>
  );
}
