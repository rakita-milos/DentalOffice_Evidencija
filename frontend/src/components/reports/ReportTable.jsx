import { formatMoney } from '../../utils/money';

export function ReportTable({ rows }) {
  return (
    <div className="overflow-x-auto p-4">
      <table className="table-brand w-full text-left text-sm">
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={index === 0 ? 'font-black' : 'hover:bg-[#F8FBFF]'}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{typeof cell === 'number' && cellIndex > 0 ? formatMoney(cell) : cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
