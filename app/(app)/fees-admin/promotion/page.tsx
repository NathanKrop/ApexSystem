"use client";

import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox, Select } from "@/components/ui/Form";
import { STUDENTS } from "@/lib/mock-data";

export default function PromotionPage() {
  const [form, setForm] = useState("");
  const rows = STUDENTS.filter((student) => student.classroom === form);
  return <div><PageHeader eyebrow="Fees Admin · 03" title="Promotion / Demotion" subtitle="Move students between forms at the end of an academic period." /><div className="flex flex-wrap gap-2 mb-5">{["Form 1", "Form 2", "Form 3", "Form 4"].map((item) => <Button key={item} variant={form === item ? "primary" : "outline"} onClick={() => setForm(item)}>{item}</Button>)}</div>{!form ? <Card><p className="text-sm text-ink-soft">Select Form from the buttons above to start Promoting/Demoting Students.</p></Card> : <Card padded={false}><div className="p-5 flex justify-end"><Button variant="primary" icon={ArrowUpDown}>Promote All</Button></div><table className="w-full text-sm"><tbody>{rows.map((student) => <tr key={student.id} className="border-t border-line"><td className="p-4"><Checkbox label={student.name} /></td><td className="p-4 figures">{student.admNo}</td><td className="p-4"><Select defaultValue={form}><option>{form}</option><option>Form 2</option><option>Form 3</option><option>Form 4</option></Select></td><td className="p-4 text-right"><Button size="sm" variant="outline">Promote</Button></td></tr>)}</tbody></table></Card>}</div>;
}
