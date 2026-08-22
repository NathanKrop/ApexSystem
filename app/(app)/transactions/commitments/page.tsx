import { ClipboardList, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { StatusStamp } from "@/components/ui/Stamp";
import { kes } from "@/lib/format";
import { COMMITMENTS, VOTE_HEADS } from "@/lib/mock-data";

export default function CommitmentsPage() {
  const paymentVoteHeads = VOTE_HEADS.filter((v) => v.type === "Payment");

  return (
    <div>
      <PageHeader
        eyebrow="Transactions · 02"
        title="Set Commitment"
        subtitle="Reserve budget against a vote head before actual expenditure — standard public-sector budget control."
      />

      <Card className="mb-5 bg-brass-dim border-brass/30">
        <div className="flex items-start gap-2.5">
          <Info size={15} className="text-brass mt-0.5 shrink-0" />
          <p className="text-[11.5px] text-ink-soft leading-relaxed">
            A commitment reduces the uncommitted balance shown in Votes Assignment, even before a Payment Voucher
            is raised — this is what lets the Budget vs Actual report warn about over-commitment early.
          </p>
        </div>
      </Card>

      <Card className="mb-5">
        <CardHeader eyebrow="New commitment" title="Commit budget" />
        <form className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Field label="Vote Head" required className="sm:col-span-1">
            <Select defaultValue="">
              <option value="" disabled>Select vote head</option>
              {paymentVoteHeads.map((v) => <option key={v.id}>{v.name}</option>)}
            </Select>
          </Field>
          <Field label="Description" required className="sm:col-span-2">
            <Textarea rows={1} placeholder="What this commitment covers" />
          </Field>
          <Field label="Amount (KES)" required><Input type="number" placeholder="0.00" className="figures font-medium" /></Field>
          <div className="sm:col-span-4 flex justify-end">
            <Button variant="primary" icon={ClipboardList}>Set commitment</Button>
          </div>
        </form>
      </Card>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <CardHeader eyebrow="This term" title="Active commitments" />
        </div>
        <DataTable
          keyField={(c) => c.id}
          rows={COMMITMENTS}
          columns={[
            { header: "Ref", render: (c) => <span className="figures text-xs">{c.ref}</span> },
            { header: "Vote Head", render: (c) => <span className="text-sm">{c.voteHead}</span> },
            { header: "Description", render: (c) => <span className="text-xs text-ink-soft">{c.description}</span> },
            { header: "Date", render: (c) => <span className="figures text-xs text-ink-soft">{c.date}</span> },
            { header: "Amount", align: "right", render: (c) => <span className="figures text-sm font-medium">{kes(c.amount)}</span> },
            { header: "Status", align: "right", render: (c) => <StatusStamp status={c.status} /> },
          ]}
        />
      </Card>
    </div>
  );
}
