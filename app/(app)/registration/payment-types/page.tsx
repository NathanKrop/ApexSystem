import { Plus, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { PAYMENT_TYPES } from "@/lib/mock-data";

export default function PaymentTypesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Registration · 01"
        title="Payment Types"
        subtitle="The dropdown options offered on every transaction screen — Fees Payment, Bursary RCT, Other Income."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <Card padded={false}>
          <DataTable
            keyField={(p) => p.id}
            rows={PAYMENT_TYPES}
            columns={[
              {
                header: "Payment Type",
                render: (p) => (
                  <div className="flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-md bg-paper-dim flex items-center justify-center shrink-0">
                      <CreditCard size={14} className="text-ink-soft" />
                    </span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                ),
              },
              { header: "Code", render: (p) => <span className="figures text-xs text-ink-soft">{p.code}</span> },
              { header: "", align: "right", render: () => <Button variant="ghost" size="sm">Edit</Button> },
            ]}
          />
        </Card>

        <Card className="h-fit">
          <CardHeader title="Add payment type" />
          <form className="space-y-4">
            <Field label="Name" required><Input placeholder="e.g. Airtel Money" /></Field>
            <Field label="Code" required hint="Short code used in reports"><Input placeholder="e.g. AIRTEL" className="figures" /></Field>
            <Button variant="primary" icon={Plus} className="w-full">Add payment type</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
