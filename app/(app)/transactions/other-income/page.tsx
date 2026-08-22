import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { kes } from "@/lib/format";
import { OTHER_INCOME } from "@/lib/mock-data";

export default function OtherIncomePage() {
  const total = OTHER_INCOME.reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Transactions · 02"
        title="Other Income"
        subtitle="Non-fee income — donations, facility hire, farm produce — required for the IPSAS Statement of Receipts and Payments, which covers all public funds."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <Card padded={false}>
          <div className="p-5 pb-0">
            <CardHeader eyebrow="This term" title="Recorded entries" subtitle={`${OTHER_INCOME.length} entries · ${kes(total)} total`} />
          </div>
          <DataTable
            keyField={(o) => o.id}
            rows={OTHER_INCOME}
            columns={[
              { header: "Date", render: (o) => <span className="figures text-xs text-ink-soft">{o.date}</span> },
              { header: "Source", render: (o) => <span className="text-sm">{o.source}</span> },
              { header: "Vote Head", render: (o) => <span className="text-xs text-ink-soft">{o.voteHead}</span> },
              { header: "Recorded By", render: (o) => <span className="text-xs text-ink-soft">{o.recordedBy}</span> },
              { header: "Amount", align: "right", render: (o) => <span className="figures text-sm font-medium">{kes(o.amount)}</span> },
            ]}
          />
        </Card>

        <Card className="h-fit">
          <CardHeader title="Record income" />
          <form className="space-y-4">
            <Field label="Source / Description" required>
              <Textarea rows={2} placeholder="e.g. Hire of hall — community event" />
            </Field>
            <Field label="Vote Head" required>
              <Select defaultValue="">
                <option value="" disabled>Select vote head</option>
                <option>Other Income</option>
                <option>Grants & Donations</option>
              </Select>
            </Field>
            <Field label="Amount (KES)" required><Input type="number" placeholder="0.00" className="figures font-medium" /></Field>
            <Field label="Date Received" required><Input type="date" defaultValue="2026-05-21" /></Field>
            <Button variant="primary" icon={Plus} className="w-full">Record income</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
