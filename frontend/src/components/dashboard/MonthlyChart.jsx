import { Card } from '../ui/Card';

export function MonthlyChart({ monthly }) {
  const max = Math.max(...monthly.map((m) => Math.max(m.revenue, m.expenses || 0)), 1);
  return (
    <Card className="p-6">
      <h3 className="text-lg font-black text-[#0D2B5C]">Promet po mesecima</h3>
      <div className="mt-6 h-64 rounded-2xl bg-[linear-gradient(to_bottom,#fff,#fff),repeating-linear-gradient(to_bottom,#EAF0F7_0,#EAF0F7_1px,transparent_1px,transparent_48px)] p-4">
        <svg viewBox="0 0 600 210" className="h-full w-full overflow-visible">
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="0" x2="600" y1={i * 48 + 10} y2={i * 48 + 10} stroke="#EAF0F7" />)}
          <polyline
            fill="none"
            stroke="#1E88E5"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={monthly.map((item, index) => {
              const x = (index / Math.max(monthly.length - 1, 1)) * 600;
              const y = 200 - (Number(item.revenue || 0) / max) * 180;
              return `${x},${y}`;
            }).join(' ')}
          />
          {monthly.map((item, index) => {
            const x = (index / Math.max(monthly.length - 1, 1)) * 600;
            const y = 200 - (Number(item.revenue || 0) / max) * 180;
            return <circle key={item.month} cx={x} cy={y} r="5" fill="#1E88E5" stroke="#fff" strokeWidth="3" />;
          })}
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-2 text-center text-xs font-bold text-[#53657d]">
        {monthly.map((item) => <span key={item.month}>{item.month.slice(0, 3)}</span>)}
      </div>
    </Card>
  );
}
