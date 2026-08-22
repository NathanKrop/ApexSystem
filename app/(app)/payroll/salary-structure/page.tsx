import { Info, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { kes } from "@/lib/format";
import { STAFF } from "@/lib/mock-data";

const ALLOWANCES = [
  { name: "House Allowance", type: "Fixed", value: 15000 },
  { name: "Commuter Allowance", type: "Fixed", value: 5000 },
  { name: "Responsibility Allowance", type: "Fixed", value: 8000 },
];

export default function SalaryStructurePage() {
  const staff = STAFF[3];

  return (
    <div>
      <PageHeader
        eyebrow="PayRoll · 07"
        title="Salary Structure"
        subtitle="Basic pay, allowances and statutory deduction bands used to generate payslips."
      />

      <Card className="mb-5 bg-brass-dim border-brass/30">
        <div className="flex items-start gap-2.5">
          <Info size={15} className="text-brass mt-0.5 shrink-0" />
          <p className="text-[11.5px] text-ink-soft leading-relaxed">
            PAYE bands and the NHIF→SHA contribution structure change periodically. Confirm the current KRA PAYE
            bands and SHA rates with your payroll administrator before running live payroll — the figures below are
            placeholders for layout purposes only.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <Card>
          <CardHeader eyebrow={staff.name} title="Editable structure" subtitle={`${staff.role} · ${staff.staffNo}`} />
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <Field label="Basic Salary (KES)"><Input type="number" defaultValue={staff.basicSalary} className="figures font-medium" /></Field>
            <Field label="Pay Frequency"><Select defaultValue="Monthly"><option>Monthly</option></Select></Field>
          </form>

          <p className="text-xs font-medium text-ink-soft uppercase tracking-[0.1em] mb-2.5">Allowances</p>
          <DataTable
            dense
            keyField={(a) => a.name}
            rows={ALLOWANCES}
            columns={[
              { header: "Allowance", render: (a) => <span className="text-sm">{a.name}</span> },
              { header: "Type", render: (a) => <span className="text-xs text-ink-soft">{a.type}</span> },
              { header: "Amount", align: "right", render: (a) => <span className="figures text-sm font-medium">{kes(a.value)}</span> },
            ]}
          />
          <div className="flex justify-end mt-5">
            <Button variant="primary" icon={Save}>Save structure</Button>
          </div>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Statutory deductions" subtitle="Illustrative — confirm current rates" />
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span className="text-ink-soft">PAYE (KRA)</span><span className="figures">per band</span></li>
            <li className="flex justify-between"><span className="text-ink-soft">NSSF Tier I & II</span><span className="figures">per band</span></li>
            <li className="flex justify-between"><span className="text-ink-soft">SHA Contribution</span><span className="figures">per band</span></li>
            <li className="flex justify-between"><span className="text-ink-soft">Housing Levy</span><span className="figures">1.5%</span></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
