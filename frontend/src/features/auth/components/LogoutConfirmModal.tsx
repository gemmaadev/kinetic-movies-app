interface LogoutConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-bg-surface p-6">
        <h2 className="text-lg font-bold">¿Cerrar sesión?</h2>
        <p className="text-secondary-text">
          Tendrás que iniciar sesión de nuevo para acceder a tu cuenta.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-secondary-text hover:bg-bg-surface"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-error px-4 py-2 font-bold text-white hover:opacity-90"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
