import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { StatusStamp } from "@/components/ui/Stamp";
import { kes } from "@/lib/format";
import { CLASSROOMS } from "@/lib/mock-data";

const STRUCTURE_HEADERS = CLASSROOMS.map((c, i) => ({
  id: c.id,
  classroom: c.name,
  term: "Term 2",
  year: 2026,
  total: [24500, 26800, 28200, 31500][i],
  status: i < 3 ? "Active" : "Draft",
}));

export default function FeesStructurePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Registration · 01"
        title="Fees Structure"
        subtitle="One structure per classroom, per term. Open a structure to itemise it by vote head in the Fee Structure Builder."
        actions={
          <Link href="/fees-admin/structure-builder">
            <Button variant="primary" icon={Plus}>New structure</Button>
          </Link>
        }
      />

      <Card padded={false}>
        <DataTable
          keyField={(s) => s.id}
          rows={STRUCTURE_HEADERS}
          columns={[
            { header: "Classroom", render: (s) => <span className="text-sm font-medium">{s.classroom}</span> },
            { header: "Term", render: (s) => <span className="text-sm text-ink-soft">{s.term}, {s.year}</span> },
            { header: "Total Fee", align: "right", render: (s) => <span className="figures text-sm font-medium">{kes(s.total)}</span> },
            { header: "Status", align: "right", render: (s) => <StatusStamp status={s.status} /> },
            {
              header: "",
              align: "right",
              render: () => (
                <Link href="/fees-admin/structure-builder" className="text-xs font-medium text-spine hover:underline inline-flex items-center gap-1">
                  Itemise <ArrowUpRight size={12} />
                </Link>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
