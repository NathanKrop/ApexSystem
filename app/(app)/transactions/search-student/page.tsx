import Link from "next/link";
import { Search as SearchIcon, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { StatusStamp } from "@/components/ui/Stamp";
import { kes } from "@/lib/format";
import { STUDENTS } from "@/lib/mock-data";

export default function SearchStudentPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Transactions · 02"
        title="Search Student"
        subtitle="Fast lookup by Adm No, name or guardian phone — for finance staff fielding a walk-in query."
      />

      <div className="relative max-w-xl mb-5">
        <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
        <Input placeholder="Search by Adm No, name, or guardian phone…" className="pl-10 py-3 text-base" autoFocus />
      </div>

      <Card padded={false}>
        <DataTable
          keyField={(s) => s.id}
          rows={STUDENTS.slice(0, 12)}
          columns={[
            { header: "Adm No", render: (s) => <span className="figures text-xs font-medium">{s.admNo}</span> },
            { header: "Student", render: (s) => <span className="text-sm">{s.name}</span> },
            { header: "Class", render: (s) => <span className="text-xs text-ink-soft">{s.classroom} {s.stream}</span> },
            { header: "Guardian Phone", render: (s) => <span className="figures text-xs text-ink-soft">{s.guardianPhone}</span> },
            {
              header: "Balance",
              align: "right",
              render: (s) => (
                <span className={`figures text-sm font-medium ${s.balance > 0 ? "text-stamp-rust" : "text-stamp-green"}`}>{kes(s.balance)}</span>
              ),
            },
            { header: "Status", align: "right", render: (s) => <StatusStamp status={s.status} /> },
            {
              header: "",
              align: "right",
              render: () => (
                <Link href="/registration/students/view" className="text-xs font-medium text-spine hover:underline inline-flex items-center gap-1">
                  Open <ArrowUpRight size={12} />
                </Link>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
