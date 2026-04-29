export function Select({ value, onChange, children, className = '' }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`input-brand ${className}`}>
      {children}
    </select>
  );
}
