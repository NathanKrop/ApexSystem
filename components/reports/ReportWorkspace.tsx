"use client";

import { useState } from "react";
import { Download, Printer, ToggleRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { CLASSROOMS, INVOICES, STUDENTS, TRANSACTIONS, VOTE_HEADS } from "@/lib/mock-data";
import { kes } from "@/lib/format";

type ReportKind =
  | "student"
  | "summary"
  | "stream"
  | "month"
  | "form"
  | "date"
  | "audit"
  | "votehead"
  | "collection"
  | "accounting"
  | "invoices"
  | "range"
  | "receipt-range"
  | "stub";

type ReportConfig = {
  title: string;
  action: string;
  kind: ReportKind;
  subtitle?: string;
};

const YEARS = ["2026", "2025", "2024"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function ReportWorkspace({ title, action, kind, subtitle }: ReportConfig) {
  const [generated, setGenerated] = useState(false);
  const isStudentReport = kind === "student" || kind === "summary";
  const isDateRange = kind === "range";

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-5 mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="figures text-[11px] uppercase tracking-[0.2em] text-brass mb-1.5">Reports · 04</p>
          <h1 className="font-display text-[1.65rem] leading-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-soft">{subtitle ?? "Configure the report filters, then preview the results."}</p>
        </div>
        <div className="stamp stamp-green"><ToggleRight size={13} /> ON</div>
      </div>

      {kind === "stub" ? (
        <Card><CardHeader title={title} /><p className="text-sm text-ink-soft">This report was listed in the source system but its fields were not captured. Re-capture the page before implementation.</p></Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-5">
          <Card>
            <CardHeader title="Report Filters" subtitle="Choose the scope for this report." />
            {isDateRange && <div className="grid grid-cols-2 gap-3 mb-4"><Field label="Start Date"><Input type="date" defaultValue="2026-08-28" /></Field><Field label="End Date"><Input type="date" defaultValue="2026-08-28" /></Field></div>}
            {(kind === "date" || kind === "votehead" || kind === "collection") && <Field label="Date" className="mb-4"><Input type="date" defaultValue="2026-08-28" /></Field>}
            {kind === "audit" && <div className="grid grid-cols-2 gap-3 mb-4"><Field label="Term"><Select defaultValue="Term 2"><option>Term 1</option><option>Term 2</option><option>Term 3</option></Select></Field><Field label="Date"><Input type="date" defaultValue="2026-08-28" /></Field></div>}
            {kind === "month" && <div className="grid grid-cols-2 gap-3 mb-4"><Field label="Month"><Select defaultValue="May"><option value="">select month</option>{MONTHS.map((month) => <option key={month}>{month}</option>)}</Select></Field><Field label="Year"><Select defaultValue="2026">{YEARS.map((year) => <option key={year}>{year}</option>)}</Select></Field></div>}
            {kind === "stream" && <div className="mb-4"><Field label="Year" className="mb-4"><Select defaultValue="2026">{YEARS.map((year) => <option key={year}>{year}</option>)}</Select></Field><Field label="Form"><Select defaultValue=""><option value="">All</option>{CLASSROOMS.map((item) => <option key={item.id}>{item.name}</option>)}</Select></Field></div>}
            {kind === "form" && <div className="grid grid-cols-2 gap-3 mb-4"><Field label="Form"><Select defaultValue=""><option value="">select form</option>{CLASSROOMS.map((item) => <option key={item.id}>{item.name}</option>)}</Select></Field><Field label="Stream"><Select defaultValue=""><option value="">select stream</option><option>East</option><option>West</option><option>Central</option></Select></Field></div>}
            {isStudentReport && <><Field label="Year" className="mb-4"><Select defaultValue="2026">{YEARS.map((year) => <option key={year}>{year}</option>)}</Select></Field><Field label="Student" className="mb-4"><Input placeholder="student's adm no." /></Field><div className="grid grid-cols-2 gap-3 mb-4"><Field label="Form / Grade"><Select defaultValue=""><option value="">select form</option>{CLASSROOMS.map((item) => <option key={item.id}>{item.name}</option>)}</Select></Field><Field label="Stream"><Select defaultValue=""><option value="">select stream</option><option>East</option><option>West</option><option>Central</option></Select></Field></div><Field label="Borders / Day Scholars" className="mb-4"><Select defaultValue="all"><option value="all">all</option><option value="boarders">boarders</option><option value="day">day scholars</option></Select></Field><div className="border-t border-line pt-4"><Field label="Arrears range"><Input type="number" placeholder="Num / Blank" /></Field><p className="text-[11px] text-ink-soft mt-1">Set report arrears range or just Ignore</p><div className="flex gap-4 mt-3 text-xs"><label><input type="radio" name="range" defaultChecked /> And Above</label><label><input type="radio" name="range" /> And Below</label></div></div></>}
            {kind === "summary" && <Field label="Balance by Date" className="mb-4"><Input type="date" defaultValue="2026-08-28" /></Field>}
            {kind === "receipt-range" && <div className="mb-4"><Field label="From" className="mb-4"><Input placeholder="Receipt Number Start" /></Field><Field label="To"><Input placeholder="Receipt Number End" /></Field></div>}
            <Button variant="secondary" className="w-full mt-5" onClick={() => setGenerated(true)}>{action}</Button>
          </Card>
          <Card padded={false}>
            <div className="p-5 flex items-center justify-between border-b border-line"><CardHeader title="Report Preview" subtitle={generated ? "Preview generated from available report data" : "Results will appear here"} /><div className="flex gap-2"><Button size="sm" variant="outline" icon={Download} disabled={!generated}>Export</Button><Button size="sm" variant="outline" icon={Printer} disabled={!generated} onClick={() => window.print()}>Print</Button></div></div>
            {generated ? <ReportResults kind={kind} /> : <p className="p-12 text-center text-sm text-ink-soft">Run the report to view results.</p>}
          </Card>
        </div>
      )}
    </div>
  );
}

function ReportResults({ kind }: { kind: ReportKind }) {
  const rows = kind === "votehead"
    ? VOTE_HEADS.map((voteHead) => ({ label: voteHead.name, amount: TRANSACTIONS.filter((transaction) => transaction.voteHead === voteHead.name).reduce((total, transaction) => total + transaction.amount, 0) }))
    : kind === "collection"
      ? TRANSACTIONS.slice(0, 6).map((transaction) => ({ label: `${transaction.paymentType} · ${transaction.receiptNo}`, amount: transaction.amount }))
    : kind === "accounting"
      ? TRANSACTIONS.slice(0, 8).map((transaction) => ({ label: `${transaction.date} · ${transaction.receiptNo}`, amount: transaction.amount }))
      : kind === "invoices"
        ? INVOICES.map((invoice) => ({ label: `${invoice.invoiceNo} · ${invoice.supplier}`, amount: invoice.amount }))
        : kind === "stream"
    ? CLASSROOMS.flatMap((classroom) => ["East", "West"].map((stream) => ({ label: `${classroom.name} · ${stream}`, amount: 142000 + classroom.students * 10 })))
    : kind === "range"
      ? TRANSACTIONS.slice(0, 6).map((transaction) => ({ label: transaction.receiptNo, amount: transaction.amount }))
      : STUDENTS.slice(0, 8).map((student) => ({ label: `${student.name} · ${student.admNo}`, amount: student.balance }));

  return <table className="w-full text-sm"><thead><tr className="border-b border-line text-left text-xs text-ink-soft"><th className="p-4">Description</th><th className="p-4 text-right">Amount</th></tr></thead><tbody>{rows.map((row) => <tr key={row.label} className="border-b border-line last:border-0"><td className="p-4">{row.label}</td><td className="p-4 text-right figures">{kes(row.amount)}</td></tr>)}</tbody></table>;
}
