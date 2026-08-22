import { CheckCircle2, AlertTriangle, Clock, XCircle, Circle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tone = "green" | "rust" | "amber" | "slate" | "brass";

const TONE_ICON: Record<Tone, LucideIcon> = {
  green: CheckCircle2,
  rust: XCircle,
  amber: Clock,
  slate: Circle,
  brass: AlertTriangle,
};

export function Stamp({
  children,
  tone = "slate",
  icon = true,
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: boolean;
}) {
  const Icon = TONE_ICON[tone];
  return (
    <span className={`stamp stamp-${tone}`}>
      {icon && <Icon size={11} strokeWidth={2.5} />}
      {children}
    </span>
  );
}

const STATUS_TONE: Record<string, Tone> = {
  active: "green",
  paid: "green",
  matched: "green",
  settled: "green",
  delivered: "green",
  left: "slate",
  graduated: "brass",
  transferred: "slate",
  exited: "slate",
  "on leave": "amber",
  pending: "amber",
  committed: "amber",
  draft: "slate",
  outstanding: "rust",
  variance: "rust",
  "unmatched — bank": "rust",
  "unmatched — books": "rust",
  failed: "rust",
  void: "rust",
  voided: "rust",
};

export function StatusStamp({ status }: { status: string }) {
  const tone = STATUS_TONE[status.toLowerCase()] ?? "slate";
  return <Stamp tone={tone}>{status}</Stamp>;
}
