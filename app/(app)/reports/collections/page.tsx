import { Download } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Form";
import { StatCard } from "@/components/ui/StatCard";
import { BarChart, HorizontalBar } from "@/components/charts/BarChart";
import { DataTable } from "@/components/ui/DataTable";
import { kes } from "@/lib/format";
import { COLLECTIONS_BY_DAY, COLLECTIONS_BY_TYPE, TRANSACTIONS, BANK_ACCOUNTS } from "@/lib/mock-data";
import { Wallet, Receipt, TrendingUp } from "lucide-react";

export default function CollectionsReportPage() {
  const total = COLLECTIONS_BY_TYPE.reduce((s, c) => s + c.amount, 0);
  const byBank = BANK_ACCOUNTS.map((b, i) => ({ label: b.bank, value: [820000, 512000, 371200][i] }));

  return (
    <div>
      <PageHeader
        eyebrow="Reports · 04"
        title="Collection Reports"
        subtitle="Fees collected across the term, broken down by day, payment type and receiving bank."
        actions={
          <>
            <Select className="w-auto"><option>Term 2, 2026</option><option>Term 1, 2026</option></Select>
            <Button variant="outline" icon={Download}>Export</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatCard label="Total Collected" value={kes(total)} icon={Wallet} tone="green" />
        <StatCard label="Receipts Issued" value={TRANSACTIONS.filter((t) => !t.voided).length.toString()} icon={Receipt} />
        <StatCard label="Avg. Daily Collection" value={kes(Math.round(total / COLLECTIONS_BY_DAY.length))} icon={TrendingUp} tone="brass" />
      </div>

      <Card className="mb-5">
        <CardHeader eyebrow="Daily posting" title="Collections by day" />
        <BarChart data={COLLECTIONS_BY_DAY.map((d) => ({ label: d.date, value: d.amount }))} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Card>
          <CardHeader title="By payment type" />
          <HorizontalBar data={COLLECTIONS_BY_TYPE.map((c) => ({ label: c.type, value: c.amount }))} formatValue={kes} />
        </Card>
        <Card>
          <CardHeader title="By receiving bank" />
          <HorizontalBar data={byBank} formatValue={kes} />
        </Card>
      </div>

      <Card padded={false}>
        <div className="p-5 pb-0"><CardHeader eyebrow="Detail" title="All receipts, this term" /></div>
        <DataTable
          keyField={(t) => t.id}
          rows={TRANSACTIONS}
          columns={[
            { header: "Receipt", render: (t) => <span className="figures text-xs">{t.receiptNo}</span> },
            { header: "Student", render: (t) => <span className="text-sm">{t.studentName}</span> },
            { header: "Vote Head", render: (t) => <span className="text-xs text-ink-soft">{t.voteHead}</span> },
            { header: "Type", render: (t) => <span className="text-xs text-ink-soft">{t.paymentType}</span> },
            { header: "Date", render: (t) => <span className="figures text-xs text-ink-soft">{t.date}</span> },
            { header: "Amount", align: "right", render: (t) => <span className={`figures text-sm font-medium ${t.voided ? "line-through text-ink-soft" : ""}`}>{kes(t.amount)}</span> },
          ]}
        />
      </Card>
    </div>
  );
}
