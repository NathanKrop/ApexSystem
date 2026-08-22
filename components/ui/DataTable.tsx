export type Column<T> = {
  header: string;
  align?: "left" | "right" | "center";
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  keyField,
  dense = false,
  emptyLabel = "No records to show.",
}: {
  columns: Column<T>[];
  rows: T[];
  keyField: (row: T) => string;
  dense?: boolean;
  emptyLabel?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-paper-dim border-b border-line">
            {columns.map((c, i) => (
              <th
                key={i}
                className={`text-[10.5px] uppercase tracking-[0.1em] text-ink-soft font-semibold px-3.5 ${dense ? "py-2" : "py-2.5"} ${
                  c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                } ${c.className ?? ""}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-3.5 py-10 text-center text-sm text-ink-soft">
                {emptyLabel}
              </td>
            </tr>
          )}
          {rows.map((row, ri) => (
            <tr
              key={keyField(row)}
              className="border-b border-line last:border-0 bg-surface hover:bg-paper-dim/60 transition-colors"
            >
              {columns.map((c, ci) => (
                <td
                  key={ci}
                  className={`px-3.5 ${dense ? "py-2" : "py-3"} text-ink align-middle ${
                    c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                  } ${c.className ?? ""}`}
                >
                  {c.render(row, ri)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
