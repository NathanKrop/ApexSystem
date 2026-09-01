"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Checkbox } from "@/components/ui/Form";
import { TRANSACTIONS } from "@/lib/mock-data";

export default function BulkReprintPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <div><PageHeader eyebrow="Fees Admin · 03" title="Bulk Receipts Reprint" subtitle="Select receipts from a date range and prepare them for batch printing." actions={<Button variant="primary" icon={Printer} disabled={!selected.length}>Reprint Selected ({selected.length})</Button>} />
    <Card className="mb-5"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Field label="From"><Input type="date" defaultValue="2026-05-01" /></Field><Field label="To"><Input type="date" defaultValue="2026-05-31" /></Field><Field label="Form / Stream"><Select defaultValue=""><option value="">All forms and streams</option><option>Form 1</option><option>Form 2</option><option>Form 3</option><option>Form 4</option></Select></Field></div></Card>
    <Card><div className="space-y-1">{TRANSACTIONS.filter((transaction) => !transaction.voided).map((transaction) => <Checkbox key={transaction.id} label={`${transaction.receiptNo} · ${transaction.studentName} · KES ${transaction.amount.toLocaleString("en-KE")}`} checked={selected.includes(transaction.id)} onChange={() => toggle(transaction.id)} />)}</div></Card>
  </div>;
}
