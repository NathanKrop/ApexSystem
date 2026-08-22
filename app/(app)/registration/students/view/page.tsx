import Link from "next/link";
import { ArrowLeft, Printer, MessageSquareText, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { StatusStamp } from "@/components/ui/Stamp";
import { kes } from "@/lib/format";
import { STUDENTS, TRANSACTIONS, CLASSROOMS, HOUSES } from "@/lib/mock-data";

export default function ViewStudentPage() {
  const student = STUDENTS[6];
  const history = TRANSACTIONS.filter((t) => t.studentAdm === student.admNo);
  const paid = history.filter((t) => !t.voided).reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <Link href="/registration/students" className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink mb-3">
        <ArrowLeft size={13} /> Back to students
      </Link>
      <PageHeader
        eyebrow={`Adm No ${student.admNo} · ${student.upi}`}
        title={student.name}
        subtitle={`${student.classroom} ${student.stream} · ${student.isBoarder ? `Boarder, ${student.house}` : "Day scholar"}`}
        actions={
          <>
            <Link href="/fees-admin/statements">
              <Button variant="outline" icon={Printer}>Print Statement</Button>
            </Link>
            <Link href="/messages/bulk-sms">
              <Button variant="outline" icon={MessageSquareText}>Message Guardian</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Status</p>
          <StatusStamp status={student.status} />
        </Card>
        <Card>
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Total Paid — Term</p>
          <p className="figures text-lg font-medium text-stamp-green">{kes(paid)}</p>
        </Card>
        <Card>
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Outstanding Balance</p>
          <p className={`figures text-lg font-medium ${student.balance > 0 ? "text-stamp-rust" : "text-stamp-green"}`}>
            {kes(student.balance)}
          </p>
        </Card>
        <Card>
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Date Admitted</p>
          <p className="figures text-lg font-medium">{student.dateAdmitted}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
        <Card>
          <CardHeader eyebrow="Editable record" title="Student details" />
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name"><Input defaultValue={student.name} /></Field>
            <Field label="Gender">
              <Select defaultValue={student.gender}><option>Male</option><option>Female</option></Select>
            </Field>
            <Field label="Classroom">
              <Select defaultValue={student.classroom}>
                {CLASSROOMS.map((c) => <option key={c.id}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Stream"><Input defaultValue={student.stream} /></Field>
            <Field label="House">
              <Select defaultValue={student.house ?? ""}>
                <option value="">Day scholar</option>
                {HOUSES.map((h) => <option key={h.id}>{h.name}</option>)}
              </Select>
            </Field>
            <Field label="Status">
              <Select defaultValue={student.status}>
                <option>Active</option><option>Left</option><option>Graduated</option><option>Transferred</option>
              </Select>
            </Field>
            <Field label="Guardian Name"><Input defaultValue={student.guardian} /></Field>
            <Field label="Guardian Phone"><Input defaultValue={student.guardianPhone} className="figures" /></Field>
            <div className="sm:col-span-2 flex justify-end pt-1">
              <Button variant="primary" icon={Save}>Save changes</Button>
            </div>
          </form>
        </Card>

        <Card className="h-fit">
          <p className="text-xs font-medium text-ink-soft uppercase tracking-[0.1em] mb-2.5">Photo</p>
          <div className="aspect-square rounded-md bg-paper-dim border border-line flex items-center justify-center text-2xl font-display text-ink-soft">
            {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
        </Card>
      </div>

      <Card className="mt-5" padded={false}>
        <div className="p-5 pb-0">
          <CardHeader eyebrow="Append-only ledger" title="Transaction history" subtitle="A student's balance is never a stored field — it's computed from this history." />
        </div>
        <DataTable
          keyField={(t) => t.id}
          rows={history.length ? history : TRANSACTIONS.slice(0, 3)}
          columns={[
            { header: "Receipt", render: (t) => <span className="figures text-xs">{t.receiptNo}</span> },
            { header: "Vote Head", render: (t) => <span className="text-xs">{t.voteHead}</span> },
            { header: "Payment Type", render: (t) => <span className="text-xs text-ink-soft">{t.paymentType}</span> },
            { header: "Ref No.", render: (t) => <span className="figures text-xs text-ink-soft">{t.refNo}</span> },
            { header: "Date", render: (t) => <span className="figures text-xs text-ink-soft">{t.date}</span> },
            { header: "Amount", align: "right", render: (t) => <span className="figures text-sm font-medium">{kes(t.amount)}</span> },
            { header: "Status", align: "right", render: (t) => <StatusStamp status={t.voided ? "Void" : "Paid"} /> },
          ]}
        />
      </Card>
    </div>
  );
}
