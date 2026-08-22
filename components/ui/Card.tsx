export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`bg-surface border border-line rounded-lg shadow-[0_1px_0_rgba(28,35,31,0.04)] ${padded ? "p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  actions,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        {eyebrow && <p className="figures text-[10px] uppercase tracking-[0.16em] text-ink-soft mb-1">{eyebrow}</p>}
        <h2 className="font-display text-lg text-ink">{title}</h2>
        {subtitle && <p className="text-xs text-ink-soft mt-0.5">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
