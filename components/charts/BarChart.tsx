import { kes } from "@/lib/format";

export function BarChart({
  data,
  height = 180,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, i) => {
        const h = Math.max((d.value / max) * (height - 34), 4);
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
            <span className="figures text-[10px] text-ink-soft mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {kes(d.value)}
            </span>
            <div
              className="w-full rounded-t-[3px] bg-spine group-hover:bg-brass transition-colors"
              style={{ height: h }}
            />
            <span className="figures text-[10px] text-ink-soft mt-1.5">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function HorizontalBar({
  data,
  formatValue = (v: number) => v.toLocaleString(),
}: {
  data: { label: string; value: number }[];
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex flex-col gap-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-ink-soft">{d.label}</span>
            <span className="figures text-xs text-ink font-medium">{formatValue(d.value)}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-paper-dim overflow-hidden">
            <div
              className="h-full rounded-full bg-brass"
              style={{ width: `${Math.max((d.value / max) * 100, 3)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
