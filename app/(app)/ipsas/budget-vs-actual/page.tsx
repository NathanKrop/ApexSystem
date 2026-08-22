import { Download, Printer } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Stamp } from "@/components/ui/Stamp";
import { kes, pct } from "@/lib/format";
import { BUDGET_VS_ACTUAL } from "@/lib/mock-data";

export default function BudgetVsActualPage() {
  const totalBudget = BUDGET_VS_ACTUAL.reduce((s, v) => s + v.budget, 0);
  const totalActual = BUDGET_VS_ACTUAL.reduce((s, v) => s + v.actual, 0);
  const totalVariance = totalBudget - totalActual;

  return (
    <div>
      <PageHeader
        eyebrow="IPSAS · 08"
        title="Budget vs Actual"
        subtitle="Approved termly budget against actual receipts and payments, ties to Votes Assignment commitments."
        actions={
          <>
            <Button variant="outline" icon={Download}>Export</Button>
            <Button variant="primary" icon={Printer}>Print</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card><p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Approved Budget</p><p className="figures text-lg font-medium">{kes(totalBudget)}</p></Card>
        <Card><p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Actual Utilisation</p><p className="figures text-lg font-medium">{kes(totalActual)}</p></Card>
        <Card><p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Variance</p><p className="figures text-lg font-medium text-stamp-green">{kes(totalVariance)}</p></Card>
      </div>

      <Card padded={false}>
        <div className="p-5 pb-0"><CardHeader eyebrow="Term 2, 2026" title="By vote head" /></div>
        <DataTable
          keyField={(v) => v.voteHead}
          rows={BUDGET_VS_ACTUAL}
          columns={[
            { header: "Vote Head", render: (v) => <span className="text-sm font-medium">{v.voteHead}</span> },
            { header: "Budget", align: "right", render: (v) => <span className="figures text-sm">{kes(v.budget)}</span> },
            { header: "Actual", align: "right", render: (v) => <span className="figures text-sm">{kes(v.actual)}</span> },
            {
              header: "Variance",
              align: "right",
              render: (v) => <span className={`figures text-sm font-medium ${v.variance < 0 ? "text-stamp-rust" : "text-stamp-green"}`}>{kes(v.variance)}</span>,
            },
            {
              header: "Utilisation",
              align: "right",
              render: (v) => <Stamp tone={v.pct >= 100 ? "rust" : v.pct >= 80 ? "amber" : "green"}>{pct(v.pct)}</Stamp>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
