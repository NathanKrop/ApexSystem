"use client";

import { useState } from "react";
import { CalendarRange } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";

export default function TermYearPage() {
  const [editing, setEditing] = useState(false);
  return <div><PageHeader eyebrow="Fees Admin · 03" title="Set Term / Year" subtitle="Review the active school calendar used by fees and receipts." /><Card className="max-w-xl"><div className="flex items-center gap-2 mb-5"><CalendarRange size={18} className="text-brass" /><h2 className="font-display text-lg">CURRENT SCHOOL CALENDAR</h2></div><div className="grid grid-cols-2 gap-4"><Field label="Term"><Select disabled={!editing} defaultValue="Term 2"><option>Term 1</option><option>Term 2</option><option>Term 3</option></Select></Field><Field label="Year"><Input type="number" disabled={!editing} defaultValue={2026} /></Field></div><div className="flex gap-2.5 mt-5"><Button variant="danger" onClick={() => setEditing(true)} disabled={editing}>Change</Button><Button variant="primary" onClick={() => setEditing(false)}>OK</Button></div><p className="text-xs text-ink-soft mt-4">Changing the calendar should be protected and recorded in the audit log when the server action is connected.</p></Card></div>;
}
