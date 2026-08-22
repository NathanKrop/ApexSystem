import { Download, MessageSquareText, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toolbar } from "@/components/ui/Toolbar";
import { Select } from "@/components/ui/Form";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { kes } from "@/lib/format";
import { DEFAULTERS, CLASSROOMS } from "@/lib/mock-data";
import Link from "next/link";

export default function DefaultersPage() {
  const total = DEFAULTERS.reduce((s, d) => s + d.balance, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Reports · 04"
        title="Defaulters List"
        subtitle="Active students with an outstanding balance, computed live from the transactions ledger."
        actions={
          <>
            <Button variant="outline" icon={Download}>Export</Button>
            <Link href="/messages/bulk-sms">
              <Button variant="primary" icon={MessageSquareText}>Send reminders</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <StatCard label="Students in Arrears" value={DEFAULTERS.length.toString()} icon={AlertTriangle} tone="rust" />
        <StatCard label="Total Outstanding" value={kes(total)} tone="rust" />
        <StatCard label="Average Balance" value={kes(Math.round(total / DEFAULTERS.length))} />
      </div>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <Toolbar searchPlaceholder="Search student…">
            <Select className="w-auto" defaultValue="">
              <option value="">All classrooms</option>
              {CLASSROOMS.map((c) => <option key={c.id}>{c.name}</option>)}
            </Select>
            <Select className="w-auto" defaultValue="desc">
              <option value="desc">Highest balance first</option>
              <option value="asc">Lowest balance first</option>
            </Select>
          </Toolbar>
        </div>
        <DataTable
          keyField={(s) => s.id}
          rows={DEFAULTERS}
          columns={[
            { header: "Adm No", render: (s) => <span className="figures text-xs">{s.admNo}</span> },
            { header: "Student", render: (s) => <span className="text-sm">{s.name}</span> },
            { header: "Class", render: (s) => <span className="text-xs text-ink-soft">{s.classroom} {s.stream}</span> },
            { header: "Guardian Phone", render: (s) => <span className="figures text-xs text-ink-soft">{s.guardianPhone}</span> },
            { header: "Balance", align: "right", render: (s) => <span className="figures text-sm font-medium text-stamp-rust">{kes(s.balance)}</span> },
          ]}
        />
      </Card>
    </div>
  );
}
