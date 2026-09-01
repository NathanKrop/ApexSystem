"use client";

import { useState } from "react";
import { Percent } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input } from "@/components/ui/Form";
import { STUDENTS, VOTE_HEADS } from "@/lib/mock-data";

export default function DiscountsPage() {
  const [adm, setAdm] = useState("");
  const [heads, setHeads] = useState<string[]>([]);
  const student = STUDENTS.find((item) => item.admNo === adm);
  const options = VOTE_HEADS.filter((item) => item.type === "Receipt");
  return <div><PageHeader eyebrow="Fees Admin · 03" title="Set Fees Discounts" subtitle="Apply a percentage discount to one or more fee vote heads." /><div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5"><Card><div className="space-y-4"><Field label="ADM" required><Input placeholder="pupil's ADM no." value={adm} onChange={(event) => setAdm(event.target.value)} /></Field><Field label="Student's Name"><Input value={student?.name ?? ""} readOnly placeholder="Student name" /></Field><Field label="Discount (%)" required><Input type="number" min="1" max="100" disabled={!student} placeholder="0" /></Field><div><p className="text-xs font-medium text-ink-soft mb-2">Vote Head</p><div className="space-y-2">{options.map((item) => <Checkbox key={item.id} label={item.name} checked={heads.includes(item.id)} onChange={() => setHeads((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} />)}</div></div><Button variant="primary" icon={Percent} disabled={!student || !heads.length}>Set Discount.</Button></div></Card><Card><CardHeader title={`Financial Year ${2026} Discount List`} /><p className="text-sm text-ink-soft text-center py-10">~ No Discounts Found ~</p></Card></div></div>;
}
