import { FileStack } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { Toolbar } from "@/components/ui/Toolbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusStamp } from "@/components/ui/Stamp";
import { kes } from "@/lib/format";
import { INVOICES, VOTE_HEADS } from "@/lib/mock-data";

export default function InvoicesPage() {
  const outstanding = INVOICES.filter((i) => i.status === "Outstanding").reduce((s, i) => s + i.amount, 0);
  const paymentVoteHeads = VOTE_HEADS.filter((v) => v.type === "Payment");

  return (
    <div>
      <PageHeader
        eyebrow="Transactions · 02"
        title="Register Invoice"
        subtitle="Accounts payable — log supplier invoices as they arrive, then settle them via Payment Voucher."
        actions={<Button variant="primary" icon={FileStack}>Register invoice</Button>}
      />

      <Card className="mb-5">
        <CardHeader eyebrow="Outstanding" title={kes(outstanding)} subtitle={`${INVOICES.filter((i) => i.status === "Outstanding").length} unsettled invoices`} />
        <form className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Field label="Supplier" required><Input placeholder="Supplier name" /></Field>
          <Field label="Invoice No." required><Input placeholder="e.g. INV-3305" className="figures" /></Field>
          <Field label="Vote Head" required>
            <Select defaultValue="">
              <option value="" disabled>Select vote head</option>
              {paymentVoteHeads.map((v) => <option key={v.id}>{v.name}</option>)}
            </Select>
          </Field>
          <Field label="Amount (KES)" required><Input type="number" placeholder="0.00" className="figures font-medium" /></Field>
          <div className="sm:col-span-4 flex justify-end">
            <Button variant="primary">Save invoice</Button>
          </div>
        </form>
      </Card>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <Toolbar searchPlaceholder="Search supplier or invoice no…" />
        </div>
        <DataTable
          keyField={(i) => i.id}
          rows={INVOICES}
          columns={[
            { header: "Invoice No.", render: (i) => <span className="figures text-xs">{i.invoiceNo}</span> },
            { header: "Supplier", render: (i) => <span className="text-sm">{i.supplier}</span> },
            { header: "Vote Head", render: (i) => <span className="text-xs text-ink-soft">{i.voteHead}</span> },
            { header: "Received", render: (i) => <span className="figures text-xs text-ink-soft">{i.dateReceived}</span> },
            { header: "Amount", align: "right", render: (i) => <span className="figures text-sm font-medium">{kes(i.amount)}</span> },
            { header: "Status", align: "right", render: (i) => <StatusStamp status={i.status} /> },
          ]}
        />
      </Card>
    </div>
  );
}
