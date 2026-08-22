import { Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toolbar } from "@/components/ui/Toolbar";
import { Select } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { StatusStamp } from "@/components/ui/Stamp";
import { kes } from "@/lib/format";
import { STAFF } from "@/lib/mock-data";

export default function StaffPage() {
  return (
    <div>
      <PageHeader
        eyebrow="PayRoll · 07"
        title="Staff Records"
        subtitle="Employment records feeding salary structure, statutory deductions and payslip generation."
        actions={<Button variant="primary" icon={Plus}>Add staff member</Button>}
      />

      <Card padded={false}>
        <div className="p-5 pb-0">
          <Toolbar searchPlaceholder="Search staff…">
            <Select className="w-auto" defaultValue="">
              <option value="">All departments</option>
              <option>Administration</option><option>Finance</option><option>Academics</option><option>Support Staff</option>
            </Select>
          </Toolbar>
        </div>
        <DataTable
          keyField={(s) => s.id}
          rows={STAFF}
          columns={[
            { header: "Staff No.", render: (s) => <span className="figures text-xs">{s.staffNo}</span> },
            { header: "Name", render: (s) => <span className="text-sm">{s.name}</span> },
            { header: "Role", render: (s) => <span className="text-xs text-ink-soft">{s.role}</span> },
            { header: "Department", render: (s) => <span className="text-xs text-ink-soft">{s.department}</span> },
            { header: "Basic Salary", align: "right", render: (s) => <span className="figures text-sm font-medium">{kes(s.basicSalary)}</span> },
            { header: "Status", align: "right", render: (s) => <StatusStamp status={s.status} /> },
            {
              header: "",
              align: "right",
              render: () => (
                <Link href="/payroll/payslips" className="text-xs font-medium text-spine hover:underline inline-flex items-center gap-1">
                  Payslips <ArrowUpRight size={12} />
                </Link>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
