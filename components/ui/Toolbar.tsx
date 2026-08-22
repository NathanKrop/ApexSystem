import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "./Form";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-line-strong rounded-lg bg-surface">
      <div className="h-11 w-11 rounded-full bg-paper-dim flex items-center justify-center mb-3.5">
        <Icon size={20} className="text-ink-soft" strokeWidth={1.75} />
      </div>
      <h3 className="font-display text-base text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-soft max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

export function Toolbar({
  searchPlaceholder,
  children,
}: {
  searchPlaceholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      {searchPlaceholder && (
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <Input placeholder={searchPlaceholder} className="pl-8" />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto">{children}</div>
    </div>
  );
}
