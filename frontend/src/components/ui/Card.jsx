export function Card({ className = '', children }) {
  return <div className={`card-premium ${className}`}>{children}</div>;
}
