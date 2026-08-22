import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "rust" | "green" | "brass";
}) {
  const toneCls = {
    default: "text-ink",
    rust: "text-stamp-rust",
    green: "text-stamp-green",
    brass: "text-brass",
  }[tone];

  return (
    <div className="bg-surface border border-line rounded-lg p-4">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] uppercase tracking-[0.14em] text-ink-soft">{label}</p>
        {Icon && <Icon size={15} className="text-ink-soft" strokeWidth={2} />}
      </div>
      <p className={`figures text-2xl font-medium ${toneCls}`}>{value}</p>
      {hint && <p className="text-xs text-ink-soft mt-1">{hint}</p>}
    </div>
  );
}
