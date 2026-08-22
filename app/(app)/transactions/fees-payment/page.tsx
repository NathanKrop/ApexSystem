"use client";

import { useState } from "react";
import { Printer, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Checkbox } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { kes } from "@/lib/format";
import { STUDENTS, TRANSACTIONS, VOTE_HEADS, PAYMENT_TYPES, BANK_ACCOUNTS } from "@/lib/mock-data";

export default function FeesPaymentPage() {
  const student = STUDENTS[6];
  const recent = TRANSACTIONS.filter((t) => t.studentAdm === student.admNo).slice(0, 4);
  const feeVoteHeads = VOTE_HEADS.filter((v) => v.type === "Receipt");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    adm_no: student.admNo,
    vote_head: "Tuition",
    amount: "",
    payment_type: "",
    bank_account: "",
    ref_no: "",
    transaction_date: new Date().toISOString().split("T")[0],
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Look up the student by adm_no
      const studentRes = await fetch(`/api/students?q=${encodeURIComponent(form.adm_no)}`);
      const studentData = await studentRes.json();

      if (!studentRes.ok || !studentData.data || studentData.data.length === 0) {
        setError(`No student found with admission number ${form.adm_no}`);
        setLoading(false);
        return;
      }

      const foundStudent = studentData.data[0];

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: foundStudent.id,
          term: "Term 2",
          academic_year: 2026,
          vote_head_id: form.vote_head,
          amount: Number(form.amount),
          payment_type_id: form.payment_type,
          bank_account_id: form.bank_account || null,
          ref_no: form.ref_no,
          transaction_date: form.transaction_date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to record payment");
        setLoading(false);
        return;
      }

      setSuccess(`Payment recorded. Receipt No: ${data.data.receipt_no}`);
      setForm((prev) => ({ ...prev, amount: "", ref_no: "" }));
      setLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Transactions · 02"
        title="Fees Payment"
        subtitle="Look up by Adm No to auto-fill the student, then record the amount received."
        actions={
          <span className="stamp stamp-brass">
            <Zap size={11} /> F10 to submit
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <Card>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 items-end pb-5 border-b border-line">
              <Field label="Adm No" required>
                <Input
                  className="figures font-medium"
                  autoFocus
                  value={form.adm_no}
                  onChange={(e) => update("adm_no", e.target.value)}
                  required
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Student Name">
                  <Input defaultValue={student.name} readOnly className="bg-paper-dim" />
                </Field>
                <Field label="Class">
                  <Input defaultValue={`${student.classroom} ${student.stream}`} readOnly className="bg-paper-dim" />
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Vote Head" required>
                <Select
                  value={form.vote_head}
                  onChange={(e) => update("vote_head", e.target.value)}
                  required
                >
                  {feeVoteHeads.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </Select>
              </Field>
              <Field label="Amount (KES)" required>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="figures font-medium"
                  value={form.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  required
                />
              </Field>
              <Field label="Payment Type" required>
                <Select
                  value={form.payment_type}
                  onChange={(e) => update("payment_type", e.target.value)}
                  required
                >
                  <option value="" disabled>Select payment type</option>
                  {PAYMENT_TYPES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </Select>
              </Field>
              <Field label="Bank Account" required>
                <Select
                  value={form.bank_account}
                  onChange={(e) => update("bank_account", e.target.value)}
                  required
                >
                  <option value="" disabled>Select bank account</option>
                  {BANK_ACCOUNTS.map((b) => <option key={b.id} value={b.id}>{b.bank} — {b.type}</option>)}
                </Select>
              </Field>
              <Field label="Ref No." required hint="M-Pesa code, cheque no. or deposit slip no.">
                <Input
                  placeholder="e.g. QFT8K2LM01"
                  className="figures"
                  value={form.ref_no}
                  onChange={(e) => update("ref_no", e.target.value)}
                  required
                />
              </Field>
              <Field label="Transaction Date" required>
                <Input
                  type="date"
                  value={form.transaction_date}
                  onChange={(e) => update("transaction_date", e.target.value)}
                  required
                />
              </Field>
            </div>

            {error && (
              <p className="text-xs text-stamp-rust bg-stamp-rust/10 border border-stamp-rust/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-xs text-spine bg-spine/10 border border-spine/30 rounded-md px-3 py-2">
                {success}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-5">
                <Checkbox label="Auto receipt number" defaultChecked />
                <Checkbox label="Print / preview receipt" defaultChecked />
              </div>
              <Button variant="primary" size="md" icon={Printer} type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save & Print Receipt"}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="bg-spine text-paper border-spine">
            <p className="text-[11px] uppercase tracking-[0.16em] text-paper/60 mb-1.5">Running Total Balance</p>
            <p className="figures text-3xl font-medium mb-1">{kes(student.balance)}</p>
            <p className="text-xs text-paper/60">Updates live as this payment is entered</p>
            <div className="perforated mt-4 pt-3 flex items-center justify-between text-xs">
              <span className="text-paper/60">Next receipt no.</span>
              <span className="figures text-paper">RCT-8858</span>
            </div>
          </Card>

          <Card>
            <CardHeader eyebrow="Recent for this student" title="Last 4 receipts" />
            <DataTable
              dense
              keyField={(t) => t.id}
              rows={recent.length ? recent : TRANSACTIONS.slice(0, 4)}
              columns={[
                { header: "Receipt", render: (t) => <span className="figures text-xs">{t.receiptNo}</span> },
                { header: "Vote Head", render: (t) => <span className="text-xs text-ink-soft">{t.voteHead}</span> },
                { header: "Amount", align: "right", render: (t) => <span className="figures text-xs font-medium">{kes(t.amount)}</span> },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}