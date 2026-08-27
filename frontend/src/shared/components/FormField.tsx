interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}

export function FormField({ label, type, value, onChange }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm">
        {label}
        <span className="text-error" aria-hidden="true">
          *
        </span>
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        aria-required="true"
        className="rounded-md bg-bg-surface p-2"
      />
    </label>
  );
}
