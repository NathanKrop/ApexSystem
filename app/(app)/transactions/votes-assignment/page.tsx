import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Select, Input } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { kes, pct } from "@/lib/format";
import { VOTES_ASSIGNMENT, VOTE_HEADS } from "@/lib/mock-data";

export default function VotesAssignmentPage() {
  const totalBudget = VOTES_ASSIGNMENT.reduce((s, v) => s + v.budget, 0);
  const totalActual = VOTES_ASSIGNMENT.reduce((s, v) => s + v.actual, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Transactions · 02"
        title="Votes Assignment"
        subtitle="Allocate the termly budget across vote heads. Ties into Set Commitment and the IPSAS Budget vs Actual statement."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card><p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Total Budget — Term</p><p className="figures text-lg font-medium">{kes(totalBudget)}</p></Card>
        <Card><p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Actual to Date</p><p className="figures text-lg font-medium">{kes(totalActual)}</p></Card>
        <Card><p className="text-[11px] uppercase tracking-[0.12em] text-ink-soft mb-1.5">Uncommitted</p><p className="figures text-lg font-medium text-stamp-green">{kes(totalBudget - totalActual)}</p></Card>
      </div>

      <Card className="mb-5">
        <CardHeader eyebrow="New allocation" title="Assign vote" />
        <form className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <Field label="Vote Head" required>
            <Select defaultValue="">
              <option value="" disabled>Select vote head</option>
              {VOTE_HEADS.map((v) => <option key={v.id}>{v.name}</option>)}
            </Select>
          </Field>
          <Field label="Term" required>
            <Select defaultValue="Term 2"><option>Term 1</option><option>Term 2</option><option>Term 3</option></Select>
          </Field>
          <Field label="Budgeted Amount (KES)" required><Input type="number" placeholder="0.00" className="figures font-medium" /></Field>
          <Button variant="primary">Assign</Button>
        </form>
      </Card>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <CardHeader eyebrow="Term 2, 2026" title="Vote head allocations" />
        </div>
        <DataTable
          keyField={(v) => v.voteHead}
          rows={VOTES_ASSIGNMENT}
          columns={[
            { header: "Vote Head", render: (v) => <span className="text-sm font-medium">{v.voteHead}</span> },
            { header: "Budget", align: "right", render: (v) => <span className="figures text-sm">{kes(v.budget)}</span> },
            { header: "Actual", align: "right", render: (v) => <span className="figures text-sm">{kes(v.actual)}</span> },
            {
              header: "Utilisation",
              render: (v) => {
                const p = Math.round((v.actual / v.budget) * 100);
                return (
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <div className="h-1.5 flex-1 rounded-full bg-paper-dim overflow-hidden">
                      <div className={`h-full rounded-full ${p >= 100 ? "bg-stamp-rust" : "bg-brass"}`} style={{ width: `${Math.min(p, 100)}%` }} />
                    </div>
                    <span className="figures text-[11px] text-ink-soft w-9 text-right">{pct(p)}</span>
                  </div>
                );
              },
            },
          ]}
        />
      </Card>
    </div>
  );
}
