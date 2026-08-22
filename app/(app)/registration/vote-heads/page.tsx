import { Plus, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { Stamp } from "@/components/ui/Stamp";
import { VOTE_HEADS } from "@/lib/mock-data";

export default function VoteHeadsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Registration · 01"
        title="Vote Heads Registration"
        subtitle="Named fee and expenditure categories, each tagged with an IPSAS economic classification code."
        actions={<Button variant="primary" icon={Plus}>Add vote head</Button>}
      />

      <Card className="mb-5 bg-brass-dim border-brass/30">
        <div className="flex items-start gap-2.5">
          <Info size={15} className="text-brass mt-0.5 shrink-0" />
          <p className="text-[11.5px] text-ink-soft leading-relaxed">
            Codes feed directly into the IPSAS Statement of Receipts and Payments. Confirm the classification
            scheme with your auditor before renaming or renumbering an existing vote head.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <Card padded={false}>
          <DataTable
            keyField={(v) => v.id}
            rows={VOTE_HEADS}
            columns={[
              { header: "Code", render: (v) => <span className="figures text-xs text-ink-soft">{v.code}</span> },
              { header: "Vote Head", render: (v) => <span className="text-sm font-medium">{v.name}</span> },
              { header: "Category", render: (v) => <span className="text-xs text-ink-soft">{v.category}</span> },
              { header: "Type", align: "right", render: (v) => <Stamp tone={v.type === "Receipt" ? "green" : "amber"}>{v.type}</Stamp> },
              { header: "", align: "right", render: () => <Button variant="ghost" size="sm">Edit</Button> },
            ]}
          />
        </Card>

        <Card className="h-fit">
          <CardHeader title="Add vote head" />
          <form className="space-y-4">
            <Field label="Code" required hint="IPSAS economic classification code"><Input placeholder="e.g. 1900" className="figures" /></Field>
            <Field label="Name" required><Input placeholder="e.g. Library Fee" /></Field>
            <Field label="Category" required><Input placeholder="e.g. Instructional" /></Field>
            <Field label="Type" required>
              <Select defaultValue=""><option value="" disabled>Select type</option><option>Receipt</option><option>Payment</option></Select>
            </Field>
            <Button variant="primary" icon={Plus} className="w-full">Add vote head</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
