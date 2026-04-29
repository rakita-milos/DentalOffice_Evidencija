import { Button } from './Button';

export function ConfirmModal({ open, title, message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0D47A1]/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-[#E5EDF7] bg-white p-6 shadow-2xl shadow-blue-900/20">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">!</div>
        <h3 className="text-xl font-extrabold text-[#0D2B5C]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#6B7280]">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="light" onClick={onCancel}>Odustani</Button>
          <Button variant="danger" onClick={onConfirm}>Potvrdi</Button>
        </div>
      </div>
    </div>
  );
}
