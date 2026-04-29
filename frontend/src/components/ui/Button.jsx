export function Button({ variant = 'primary', className = '', children, ...props }) {
  const variants = {
    primary: 'brand-gradient text-white hover:brightness-95 shadow-lg shadow-blue-500/20',
    dark: 'bg-[#0D47A1] text-white hover:bg-[#08377f]',
    light: 'bg-white text-[#0D47A1] border border-[#DCE7F3] hover:bg-[#F5F7FA]',
    success: 'bg-[#4CAF50] text-white hover:bg-[#3f9843]',
    danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
