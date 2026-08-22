import { ArrowRight, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Select, Checkbox } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { CLASSROOMS, STUDENTS } from "@/lib/mock-data";

export default function BulkEditPage() {
  const preview = STUDENTS.filter((s) => s.classroom === "Form 2").slice(0, 6);

  return (
    <div>
      <PageHeader
        eyebrow="Registration · 01"
        title="Bulk Student Edit"
        subtitle="Apply one change to a whole class or stream at once — e.g. promoting Form 2 to Form 3 at year-end."
      />

      <Card className="mb-5">
        <CardHeader title="Define the action" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <Field label="From classroom" required>
            <Select defaultValue="Form 2">{CLASSROOMS.map((c) => <option key={c.id}>{c.name}</option>)}</Select>
          </Field>
          <Field label="Action" required>
            <Select defaultValue="Promote">
              <option>Promote to next form</option>
              <option>Move to stream</option>
              <option>Change boarding status</option>
              <option>Mark as graduated</option>
            </Select>
          </Field>
          <Field label="To classroom">
            <Select defaultValue="Form 3">{CLASSROOMS.map((c) => <option key={c.id}>{c.name}</option>)}</Select>
          </Field>
          <Button variant="primary" icon={ArrowRight}>Preview change</Button>
        </div>
      </Card>

      <Card className="mb-5 bg-brass-dim border-brass/30">
        <div className="flex items-start gap-2.5">
          <Info size={15} className="text-brass mt-0.5 shrink-0" />
          <p className="text-[11.5px] text-ink-soft leading-relaxed">
            This affects {preview.length + 33} students currently in Form 2. Review the preview below before
            committing — the change is logged to the audit trail with a before/after snapshot per student.
          </p>
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-5 pb-0 flex items-center justify-between">
          <CardHeader title="Preview" subtitle="Showing 6 of 39 affected students" />
          <Checkbox label="Select all" defaultChecked />
        </div>
        <DataTable
          keyField={(s) => s.id}
          rows={preview}
          columns={[
            { header: "", render: () => <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-line-strong accent-[var(--spine)]" /> },
            { header: "Adm No", render: (s) => <span className="figures text-xs">{s.admNo}</span> },
            { header: "Student", render: (s) => <span className="text-sm">{s.name}</span> },
            { header: "Current", render: (s) => <span className="text-xs text-ink-soft">{s.classroom} {s.stream}</span> },
            {
              header: "New value",
              render: (s) => (
                <span className="text-xs text-ink flex items-center gap-1.5">
                  {s.classroom.replace("2", "3")} {s.stream} <ArrowRight size={11} className="text-brass" />
                </span>
              ),
            },
          ]}
        />
        <div className="flex justify-end px-5 py-4 border-t border-line">
          <Button variant="primary">Commit change to 39 students</Button>
        </div>
      </Card>
    </div>
  );
}
