import { Plus, Landmark } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { BANK_ACCOUNTS } from "@/lib/mock-data";

export default function BankAccountsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Registration · 01"
        title="Bank Accounts"
        subtitle="Accounts available for selection when recording transactions and reconciling statements."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <Card padded={false}>
          <DataTable
            keyField={(b) => b.id}
            rows={BANK_ACCOUNTS}
            columns={[
              {
                header: "Bank",
                render: (b) => (
                  <div className="flex items-center gap-2.5">
                    <span className="h-8 w-8 rounded-md bg-paper-dim flex items-center justify-center shrink-0">
                      <Landmark size={14} className="text-ink-soft" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{b.bank}</p>
                      <p className="text-[11px] text-ink-soft">{b.branch} branch</p>
                    </div>
                  </div>
                ),
              },
              { header: "Account Name", render: (b) => <span className="text-sm text-ink-soft">{b.accountName}</span> },
              { header: "Account No.", render: (b) => <span className="figures text-sm">{b.accountNo}</span> },
              { header: "Purpose", render: (b) => <span className="text-xs text-ink-soft">{b.type}</span> },
              { header: "", align: "right", render: () => <Button variant="ghost" size="sm">Edit</Button> },
            ]}
          />
        </Card>

        <Card className="h-fit">
          <CardHeader title="Add bank account" />
          <form className="space-y-4">
            <Field label="Bank" required><Input placeholder="e.g. Equity Bank" /></Field>
            <Field label="Branch" required><Input placeholder="e.g. Meru" /></Field>
            <Field label="Account Name" required><Input placeholder="Account holder name" /></Field>
            <Field label="Account Number" required><Input placeholder="Account number" className="figures" /></Field>
            <Field label="Purpose" required>
              <Select defaultValue="">
                <option value="" disabled>Select purpose</option>
                <option>Fees</option><option>Operations</option><option>Bursary</option><option>Payroll</option>
              </Select>
            </Field>
            <Button variant="primary" icon={Plus} className="w-full">Add account</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
