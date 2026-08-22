import { FileOutput } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import { Toolbar } from "@/components/ui/Toolbar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusStamp } from "@/components/ui/Stamp";
import { kes } from "@/lib/format";
import { PAYMENT_VOUCHERS, VOTE_HEADS, BANK_ACCOUNTS } from "@/lib/mock-data";

export default function PaymentVoucherPage() {
  const paymentVoteHeads = VOTE_HEADS.filter((v) => v.type === "Payment");

  return (
    <div>
      <PageHeader
        eyebrow="Transactions · 02"
        title="Payment Voucher"
        subtitle="The expenditure side of the ledger — every voucher is tagged to a vote head for budget and IPSAS reporting."
        actions={<Button variant="primary" icon={FileOutput}>New voucher</Button>}
      />

      <Card className="mb-5">
        <CardHeader eyebrow="New voucher" title="Voucher details" />
        <form className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Payee" required className="sm:col-span-1"><Input placeholder="Supplier or individual" /></Field>
          <Field label="Vote Head" required>
            <Select defaultValue="">
              <option value="" disabled>Select vote head</option>
              {paymentVoteHeads.map((v) => <option key={v.id}>{v.name}</option>)}
            </Select>
          </Field>
          <Field label="Paid From" required>
            <Select defaultValue="">
              <option value="" disabled>Select bank account</option>
              {BANK_ACCOUNTS.map((b) => <option key={b.id}>{b.bank} — {b.type}</option>)}
            </Select>
          </Field>
          <Field label="Amount (KES)" required><Input type="number" placeholder="0.00" className="figures font-medium" /></Field>
          <Field label="Voucher Date" required><Input type="date" defaultValue="2026-05-21" /></Field>
          <Field label="Linked Invoice" hint="Optional"><Input placeholder="e.g. INV-3305" className="figures" /></Field>
          <Field label="Description / Purpose" className="sm:col-span-3"><Textarea rows={2} placeholder="What this payment is for" /></Field>
          <div className="sm:col-span-3 flex justify-end">
            <Button variant="primary">Save voucher</Button>
          </div>
        </form>
      </Card>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <Toolbar searchPlaceholder="Search payee or voucher no…">
            <Select className="w-auto" defaultValue="">
              <option value="">All statuses</option><option>Paid</option><option>Pending</option>
            </Select>
          </Toolbar>
        </div>
        <DataTable
          keyField={(v) => v.id}
          rows={PAYMENT_VOUCHERS}
          columns={[
            { header: "Voucher No.", render: (v) => <span className="figures text-xs">{v.voucherNo}</span> },
            { header: "Payee", render: (v) => <span className="text-sm">{v.payee}</span> },
            { header: "Vote Head", render: (v) => <span className="text-xs text-ink-soft">{v.voteHead}</span> },
            { header: "Date", render: (v) => <span className="figures text-xs text-ink-soft">{v.date}</span> },
            { header: "Amount", align: "right", render: (v) => <span className="figures text-sm font-medium">{kes(v.amount)}</span> },
            { header: "Status", align: "right", render: (v) => <StatusStamp status={v.status} /> },
          ]}
        />
      </Card>
    </div>
  );
}
