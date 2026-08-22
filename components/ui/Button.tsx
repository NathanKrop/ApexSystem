import type { LucideIcon } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md";

const VARIANT_CLS: Record<Variant, string> = {
  primary: "bg-spine text-paper hover:bg-spine-soft border border-spine",
  secondary: "bg-brass text-white hover:bg-brass-soft border border-brass",
  outline: "bg-surface text-ink border border-line-strong hover:border-spine hover:text-spine",
  ghost: "bg-transparent text-ink-soft hover:text-ink hover:bg-paper-dim border border-transparent",
  danger: "bg-surface text-stamp-rust border border-stamp-rust hover:bg-stamp-rust-dim",
};

const SIZE_CLS: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-xs gap-1.5",
  md: "px-3.5 py-2 text-sm gap-2",
};

export function Button({
  children,
  variant = "outline",
  size = "md",
  icon: Icon,
  className = "",
  type = "button",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-md transition-colors disabled:opacity-45 disabled:cursor-not-allowed ${VARIANT_CLS[variant]} ${SIZE_CLS[size]} ${className}`}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} strokeWidth={2.25} />}
      {children}
    </button>
  );
}
