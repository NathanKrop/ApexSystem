"use client";

import { useState } from "react";
import { Printer, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import { TRANSACTIONS } from "@/lib/mock-data";

type ReceiptType = "fees" | "fse" | "other_income" | "bursary";

const titles: Record<ReceiptType, string> = {
  fees: "Delete / Re-print Receipts",
  fse: "Delete / Re-print FSE Payment",
  other_income: "Delete / Re-print Other Income",
  bursary: "Delete / Re-print Bursary",
};

export function ReceiptLookup({ type }: { type: ReceiptType }) {
  const [date, setDate] = useState("2026-05-20");
  const [receipt, setReceipt] = useState("");
  const [reason, setReason] = useState("");
  const [deleted, setDeleted] = useState(false);
  const receipts = type === "fees"
    ? TRANSACTIONS.filter((transaction) => !transaction.voided && (!date || transaction.date === date))
    : [];
  const selected = receipts.find((transaction) => transaction.receiptNo === receipt);

  function handleDelete() {
    if (!selected || !reason.trim()) return;
    setDeleted(true);
  }

  return (
    <div>
      <div className="border-b border-line pb-5 mb-6">
        <p className="figures text-[11px] uppercase tracking-[0.2em] text-brass mb-1.5">Fees Admin · 03</p>
        <h1 className="font-display text-[1.65rem] leading-tight text-ink">{titles[type]}</h1>
        <p className="mt-1.5 text-sm text-ink-soft">Find a receipt by date and number. Financial records are soft-deleted and require a reason.</p>
      </div>
      <Card className="max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date / RCT No.">
            <Input type="date" value={date} onChange={(event) => { setDate(event.target.value); setReceipt(""); }} />
          </Field>
          <Field label="RCT No.">
            <Select value={receipt} onChange={(event) => { setReceipt(event.target.value); setDeleted(false); }}>
              <option value="">select receipt</option>
              {receipts.map((transaction) => (
                <option key={transaction.id} value={transaction.receiptNo}>{transaction.receiptNo} · {transaction.studentName}</option>
              ))}
            </Select>
          </Field>
        </div>
        {!receipts.length && <p className="mt-5 text-sm text-ink-soft">No receipts found for this category and date.</p>}
        {selected && (
          <div className="mt-5 border-t border-line pt-5 text-sm text-ink-soft">
            <p><span className="font-medium text-ink">{selected.studentName}</span> · Adm {selected.studentAdm}</p>
            <p>{selected.voteHead} · KES {selected.amount.toLocaleString("en-KE")} · {selected.date}</p>
          </div>
        )}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Button variant="outline" icon={Printer} disabled={!selected}>Re-Print Receipt</Button>
          <Button variant="danger" icon={Trash2} disabled={!selected || !reason.trim()} onClick={handleDelete}>Delete Receipt</Button>
        </div>
        {selected && !deleted && (
          <div className="mt-4">
            <Field label="Deletion reason" required>
              <Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain why this receipt is being voided" rows={3} />
            </Field>
          </div>
        )}
        {deleted && <p className="mt-4 text-sm text-stamp-green">Receipt marked for soft deletion. Ledger reversal and audit logging require the finance API.</p>}
      </Card>
    </div>
  );
}
