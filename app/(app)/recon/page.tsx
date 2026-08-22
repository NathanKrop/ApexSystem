import { UploadCloud, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { StatusStamp } from "@/components/ui/Stamp";
import { kes } from "@/lib/format";
import { RECON_RECORDS } from "@/lib/mock-data";

export default function ReconPage() {
  const matched = RECON_RECORDS.filter((r) => r.status === "Matched").length;
  const variance = RECON_RECORDS.reduce((s, r) => s + (r.bankAmount - r.bookAmount), 0);

  return (
    <div>
      <PageHeader
        eyebrow="Recon. Statements · 05"
        title="Bank Reconciliation"
        subtitle="Upload the bank statement and match it line-by-line against recorded transactions. Unmatched entries are flagged on both sides."
      />

      <Card className="mb-5">
        <CardHeader eyebrow="Step 1" title="Upload bank statement" />
        <div className="border-2 border-dashed border-line-strong rounded-lg py-8 flex flex-col items-center justify-center text-center bg-paper-dim/40">
          <UploadCloud size={24} className="text-ink-soft mb-2.5" strokeWidth={1.5} />
          <p className="text-sm text-ink mb-1">Drop the bank statement (.csv or .xlsx)</p>
          <p className="text-xs text-ink-soft mb-4">Equity Bank — Fees Account · May 2026</p>
          <Button variant="primary" size="sm">Choose file</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatCard label="Matched Entries" value={`${matched} / ${RECON_RECORDS.length}`} icon={CheckCircle2} tone="green" />
        <StatCard label="Flagged for Review" value={(RECON_RECORDS.length - matched).toString()} icon={AlertTriangle} tone="rust" />
        <StatCard label="Net Variance" value={kes(variance)} tone={variance === 0 ? "green" : "rust"} />
      </div>

      <Card padded={false}>
        <div className="p-5 pb-0"><CardHeader eyebrow="May 2026" title="Statement lines" /></div>
        <DataTable
          keyField={(r) => r.id}
          rows={RECON_RECORDS}
          columns={[
            { header: "Date", render: (r) => <span className="figures text-xs text-ink-soft">{r.date}</span> },
            { header: "Description", render: (r) => <span className="text-sm">{r.description}</span> },
            { header: "Bank Amount", align: "right", render: (r) => <span className="figures text-sm">{r.bankAmount ? kes(r.bankAmount) : "—"}</span> },
            { header: "Book Amount", align: "right", render: (r) => <span className="figures text-sm">{r.bookAmount ? kes(r.bookAmount) : "—"}</span> },
            { header: "Status", align: "right", render: (r) => <StatusStamp status={r.status} /> },
            {
              header: "",
              align: "right",
              render: (r) => r.status !== "Matched" && <Button variant="ghost" size="sm">Match</Button>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
