import { Plus, Trash2, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Select, Input } from "@/components/ui/Form";
import { kes } from "@/lib/format";
import { CLASSROOMS, VOTE_HEADS } from "@/lib/mock-data";

const LINE_ITEMS = [
  { voteHead: "Tuition", amount: 12500 },
  { voteHead: "Boarding", amount: 8800 },
  { voteHead: "Activity Fee", amount: 1500 },
  { voteHead: "Exam Fee", amount: 2200 },
  { voteHead: "Lunch Programme", amount: 3800 },
];

export default function StructureBuilderPage() {
  const total = LINE_ITEMS.reduce((s, i) => s + i.amount, 0);
  const feeVoteHeads = VOTE_HEADS.filter((v) => v.type === "Receipt");

  return (
    <div>
      <PageHeader
        eyebrow="Fees Admin · 03"
        title="Fee Structure Builder"
        subtitle="Itemise the fee structure for a classroom and term. This total is what each student's expected balance is calculated against."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-line mb-5">
            <Field label="Classroom" required>
              <Select defaultValue="Form 1">{CLASSROOMS.map((c) => <option key={c.id}>{c.name}</option>)}</Select>
            </Field>
            <Field label="Term" required>
              <Select defaultValue="Term 2"><option>Term 1</option><option>Term 2</option><option>Term 3</option></Select>
            </Field>
            <Field label="Academic Year" required><Input type="number" defaultValue={2026} className="figures" /></Field>
          </div>

          <CardHeader title="Line items" />
          <div className="space-y-2.5">
            {LINE_ITEMS.map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_160px_36px] gap-2.5 items-center">
                <Select defaultValue={item.voteHead}>
                  {feeVoteHeads.map((v) => <option key={v.id}>{v.name}</option>)}
                </Select>
                <Input type="number" defaultValue={item.amount} className="figures text-right" />
                <button className="h-9 w-9 flex items-center justify-center text-ink-soft hover:text-stamp-rust rounded-md hover:bg-stamp-rust-dim">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" icon={Plus} className="mt-3">Add line item</Button>
        </Card>

        <div className="space-y-5">
          <Card className="bg-spine text-paper border-spine">
            <p className="text-[11px] uppercase tracking-[0.16em] text-paper/60 mb-1.5">Total Fee — Form 1, Term 2</p>
            <p className="figures text-3xl font-medium">{kes(total)}</p>
            <p className="text-xs text-paper/60 mt-1">Across {LINE_ITEMS.length} vote heads</p>
          </Card>
          <Button variant="primary" icon={Save} className="w-full">Save fee structure</Button>
          <Card>
            <p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-2">Applies to</p>
            <p className="text-sm text-ink">214 students currently in Form 1</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
