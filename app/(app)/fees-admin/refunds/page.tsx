"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Form";
import { STUDENTS } from "@/lib/mock-data";

export default function RefundsPage() {
  const [adm, setAdm] = useState("");
  const student = STUDENTS.find((item) => item.admNo === adm);
  return <div><PageHeader eyebrow="Fees Admin · 03" title="Refund Receipts" subtitle="Issue a controlled refund against a student's available credit balance." /><Card className="max-w-2xl"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="ADM" required><Input placeholder="ADM number" value={adm} onChange={(event) => setAdm(event.target.value)} /></Field><Field label="Name"><Input placeholder="Student name" value={student?.name ?? ""} readOnly /></Field><Field label="Refund Amount" required><Input type="number" min="1" placeholder="Refund Amount" /></Field><Field label="Refund Date"><Input type="date" /></Field><Field label="Refund Reason" required className="sm:col-span-2"><Textarea placeholder="Reason for refund" rows={3} /></Field></div><Button variant="secondary" icon={RotateCcw} className="w-full mt-5" disabled={!student}>Refund</Button></Card></div>;
}
