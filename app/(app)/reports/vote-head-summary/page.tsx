import { Download } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Stamp } from "@/components/ui/Stamp";
import { kes } from "@/lib/format";
import { VOTES_ASSIGNMENT, VOTE_HEADS } from "@/lib/mock-data";

export default function VoteHeadSummaryPage() {
  const rows = VOTE_HEADS.map((v, index) => {
    const match = VOTES_ASSIGNMENT.find((a) => a.voteHead === v.name);
    return { ...v, actual: match?.actual ?? 80000 + index * 5000 };
  });
  const receiptsTotal = rows.filter((r) => r.type === "Receipt").reduce((s, r) => s + r.actual, 0);
  const paymentsTotal = rows.filter((r) => r.type === "Payment").reduce((s, r) => s + r.actual, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Reports · 04"
        title="Vote Head Summary"
        subtitle="Actual receipts and payments to date, grouped by vote head and IPSAS classification code."
        actions={<Button variant="outline" icon={Download}>Export</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Card><p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Total Receipts</p><p className="figures text-lg font-medium text-stamp-green">{kes(receiptsTotal)}</p></Card>
        <Card><p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Total Payments</p><p className="figures text-lg font-medium text-stamp-rust">{kes(paymentsTotal)}</p></Card>
      </div>

      <Card padded={false}>
        <div className="p-5 pb-0"><CardHeader eyebrow="Term 2, 2026" title="By vote head" /></div>
        <DataTable
          keyField={(v) => v.id}
          rows={rows}
          columns={[
            { header: "Code", render: (v) => <span className="figures text-xs text-ink-soft">{v.code}</span> },
            { header: "Vote Head", render: (v) => <span className="text-sm font-medium">{v.name}</span> },
            { header: "Category", render: (v) => <span className="text-xs text-ink-soft">{v.category}</span> },
            { header: "Type", render: (v) => <Stamp tone={v.type === "Receipt" ? "green" : "amber"}>{v.type}</Stamp> },
            { header: "Actual", align: "right", render: (v) => <span className="figures text-sm font-medium">{kes(v.actual)}</span> },
          ]}
        />
      </Card>
    </div>
  );
}
