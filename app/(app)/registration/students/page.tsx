import Link from "next/link";
import { Plus, Upload, Users, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toolbar } from "@/components/ui/Toolbar";
import { Select } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { StatusStamp } from "@/components/ui/Stamp";
import { kes } from "@/lib/format";
import { STUDENTS, CLASSROOMS } from "@/lib/mock-data";

export default function StudentsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Registration · 01"
        title="View / Edit Students"
        subtitle="Search, filter and open any student record. Balances are computed live from the transactions ledger — never stored."
        actions={
          <>
            <Link href="/registration/bulk-upload">
              <Button variant="outline" icon={Upload}>
                Bulk Upload
              </Button>
            </Link>
            <Link href="/registration/students/new">
              <Button variant="primary" icon={Plus}>
                Register Student
              </Button>
            </Link>
          </>
        }
      />

      <Card padded={false}>
        <div className="p-5 pb-0">
          <Toolbar searchPlaceholder="Search by name or Adm No…">
            <Select className="w-auto" defaultValue="">
              <option value="">All classrooms</option>
              {CLASSROOMS.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </Select>
            <Select className="w-auto" defaultValue="">
              <option value="">All statuses</option>
              <option>Active</option>
              <option>Left</option>
              <option>Graduated</option>
              <option>Transferred</option>
            </Select>
          </Toolbar>
        </div>

        <DataTable
          keyField={(s) => s.id}
          rows={STUDENTS}
          columns={[
            { header: "Adm No", render: (s) => <span className="figures text-xs font-medium">{s.admNo}</span> },
            {
              header: "Student",
              render: (s) => (
                <Link href="/registration/students/view" className="flex items-center gap-2 group">
                  <span className="h-7 w-7 rounded-full bg-paper-dim text-ink-soft text-[11px] flex items-center justify-center font-medium shrink-0">
                    {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                  <span className="text-sm text-ink group-hover:text-spine group-hover:underline">{s.name}</span>
                </Link>
              ),
            },
            { header: "Class", render: (s) => <span className="text-xs text-ink-soft">{s.classroom} {s.stream}</span> },
            { header: "Boarding", render: (s) => <span className="text-xs text-ink-soft">{s.isBoarder ? s.house : "Day scholar"}</span> },
            { header: "Guardian", render: (s) => <span className="text-xs text-ink-soft">{s.guardianPhone}</span> },
            {
              header: "Balance",
              align: "right",
              render: (s) => (
                <span className={`figures text-sm font-medium ${s.balance > 0 ? "text-stamp-rust" : "text-stamp-green"}`}>
                  {kes(s.balance)}
                </span>
              ),
            },
            { header: "Status", align: "right", render: (s) => <StatusStamp status={s.status} /> },
            {
              header: "",
              align: "right",
              render: () => (
                <Link href="/registration/students/view">
                  <ChevronRight size={16} className="text-ink-soft" />
                </Link>
              ),
            },
          ]}
        />
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-line text-xs text-ink-soft">
          <span>
            Showing {STUDENTS.length} of {CLASSROOMS.reduce((s, c) => s + c.students, 0).toLocaleString()} students
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} /> Filtered view — refine with the filters above
          </span>
        </div>
      </Card>
    </div>
  );
}
