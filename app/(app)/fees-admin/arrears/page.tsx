"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { CLASSROOMS, STUDENTS } from "@/lib/mock-data";

export default function ArrearsPage() {
  const [query, setQuery] = useState("");
  const rows = STUDENTS.filter((student) => `${student.name} ${student.admNo}`.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
  return <div><PageHeader eyebrow="Fees Admin · 03" title="Set Fees Arrears" subtitle="Review and adjust arrears by student or class." actions={<Button variant="primary" icon={Save}>Save arrears</Button>} /><Card className="mb-5"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="Form / Stream"><Select defaultValue=""><option value="">All</option>{CLASSROOMS.map((item) => <option key={item.id}>{item.name}</option>)}</Select></Field><Field label="Name / Adm"><Input placeholder="Student name/adm" value={query} onChange={(event) => setQuery(event.target.value)} /></Field></div></Card><Card padded={false}><table className="w-full text-sm"><thead><tr className="border-b border-line text-left text-xs text-ink-soft"><th className="p-4">Name</th><th className="p-4">Adm</th><th className="p-4">Class</th><th className="p-4">Current Arrears</th><th className="p-4">New Arrears</th></tr></thead><tbody>{rows.map((student) => <tr key={student.id} className="border-b border-line last:border-0"><td className="p-4">{student.name}</td><td className="p-4 figures">{student.admNo}</td><td className="p-4 text-ink-soft">{student.classroom} {student.stream}</td><td className="p-4 figures">KES {student.balance.toLocaleString("en-KE")}</td><td className="p-4"><Input type="number" defaultValue={student.balance} /></td></tr>)}</tbody></table></Card></div>;
}
