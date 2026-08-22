export function Field({
  label,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-ink-soft mb-1.5">
        {label}
        {required && <span className="text-stamp-rust ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-ink-soft mt-1">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:border-spine focus:ring-1 focus:ring-spine transition-colors";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={`${inputCls} ${className}`} {...rest} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", children, ...rest } = props;
  return (
    <select className={`${inputCls} ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea className={`${inputCls} ${className}`} {...rest} />;
}

export function Checkbox({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink cursor-pointer select-none">
      <input type="checkbox" className="h-4 w-4 rounded border-line-strong text-spine accent-[var(--spine)]" {...rest} />
      {label}
    </label>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5 first:pt-0">
      <div className="mb-4">
        <h3 className="font-display text-base text-ink">{title}</h3>
        {description && <p className="text-xs text-ink-soft mt-0.5">{description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
