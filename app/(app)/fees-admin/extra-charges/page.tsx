"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import { STUDENTS, VOTE_HEADS } from "@/lib/mock-data";

export default function ExtraChargesPage() {
  const [adm, setAdm] = useState("");
  const student = STUDENTS.find((item) => item.admNo === adm);
  return <div><PageHeader eyebrow="Fees Admin · 03" title="Set Extra Charges" subtitle="Add a one-off charge to a student's selected vote head and term." /><Card className="max-w-3xl"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Field label="ADM" required><Input placeholder="student's ADM no." value={adm} onChange={(event) => setAdm(event.target.value)} /></Field><Field label="Vote Head"><Select defaultValue=""><option value="">~select votehead~</option>{VOTE_HEADS.filter((item) => item.type === "Receipt").map((item) => <option key={item.id}>{item.name}</option>)}</Select></Field><Field label="Extra Charge Term"><Select defaultValue=""><option value="">~select term~</option><option>Term 1</option><option>Term 2</option><option>Term 3</option></Select></Field></div><Button variant="secondary" icon={Plus} className="mt-5" disabled={!student}>Get Fees Info.</Button>{student && <div className="mt-5 border-t border-line pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4"><Field label="Amount"><Input type="number" min="1" /></Field><Field label="Description"><Textarea placeholder="Charge description" rows={2} /></Field></div>}</Card></div>;
}
