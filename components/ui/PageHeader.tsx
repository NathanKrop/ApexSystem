export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-5 mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="figures text-[11px] uppercase tracking-[0.2em] text-brass mb-1.5">{eyebrow}</p>
        )}
        <h1 className="font-display text-[1.65rem] leading-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-soft max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}
