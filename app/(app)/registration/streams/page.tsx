import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { STREAMS, CLASSROOMS } from "@/lib/mock-data";

export default function StreamsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Registration · 01"
        title="Streams Registration"
        subtitle="Reference data feeding classroom, transcript and reporting dropdowns across the system."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <Card padded={false}>
          <div className="p-5 pb-0">
            <CardHeader title="All streams" subtitle={`${STREAMS.length} streams across ${CLASSROOMS.length} classrooms`} />
          </div>
          <DataTable
            keyField={(s) => s.id}
            rows={STREAMS}
            columns={[
              { header: "Classroom", render: (s) => <span className="text-sm">{s.classroom}</span> },
              { header: "Stream", render: (s) => <span className="text-sm font-medium">{s.name}</span> },
              { header: "Capacity", align: "right", render: (s) => <span className="figures text-sm text-ink-soft">{s.capacity}</span> },
              { header: "Enrolled", align: "right", render: (s) => <span className="figures text-sm font-medium">{s.enrolled}</span> },
              {
                header: "Fill Rate",
                align: "right",
                render: (s) => (
                  <span className="figures text-xs text-ink-soft">{Math.round((s.enrolled / s.capacity) * 100)}%</span>
                ),
              },
              { header: "", align: "right", render: () => <Button variant="ghost" size="sm">Edit</Button> },
            ]}
          />
        </Card>

        <Card className="h-fit">
          <CardHeader title="Add stream" />
          <form className="space-y-4">
            <Field label="Classroom" required>
              <Select defaultValue="">
                <option value="" disabled>Select classroom</option>
                {CLASSROOMS.map((c) => <option key={c.id}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Stream Name" required>
              <Input placeholder="e.g. North" />
            </Field>
            <Field label="Capacity" required>
              <Input type="number" placeholder="e.g. 45" className="figures" />
            </Field>
            <Button variant="primary" icon={Plus} className="w-full">Add stream</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
