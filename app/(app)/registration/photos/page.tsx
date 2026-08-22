import { UploadCloud, Link2, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toolbar } from "@/components/ui/Toolbar";
import { STUDENTS } from "@/lib/mock-data";

export default function PhotosPage() {
  const withPhoto = STUDENTS.slice(0, 8);
  const withoutPhoto = STUDENTS.slice(8, 16);

  return (
    <div>
      <PageHeader
        eyebrow="Registration · 01"
        title="Student Photos"
        subtitle="Match a batch of photos to students by Adm No — filenames like 4234.jpg auto-match on upload."
        actions={<Button variant="primary" icon={UploadCloud}>Upload photo batch</Button>}
      />

      <Card className="mb-5">
        <div className="border-2 border-dashed border-line-strong rounded-lg py-8 flex flex-col items-center justify-center text-center bg-paper-dim/40">
          <UploadCloud size={24} className="text-ink-soft mb-2.5" strokeWidth={1.5} />
          <p className="text-sm text-ink mb-1">Drop a folder or select multiple images</p>
          <p className="text-xs text-ink-soft">Name each file by Adm No, e.g. 4235.jpg, for automatic matching</p>
        </div>
      </Card>

      <Toolbar searchPlaceholder="Search unmatched by Adm No…" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader
            eyebrow="Needs a photo"
            title={`${withoutPhoto.length} students`}
            actions={<span className="stamp stamp-amber"><Link2 size={11} /> Match manually</span>}
          />
          <ul className="space-y-2">
            {withoutPhoto.map((s) => (
              <li key={s.id} className="flex items-center justify-between border border-line rounded-md px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-md bg-paper-dim border border-dashed border-line-strong flex items-center justify-center text-[10px] text-ink-soft">
                    none
                  </div>
                  <div>
                    <p className="text-sm text-ink">{s.name}</p>
                    <p className="figures text-[11px] text-ink-soft">Adm {s.admNo}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Attach</Button>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            eyebrow="Matched"
            title={`${withPhoto.length} students`}
            actions={<span className="stamp stamp-green"><CheckCircle2 size={11} /> Up to date</span>}
          />
          <ul className="space-y-2">
            {withPhoto.map((s) => (
              <li key={s.id} className="flex items-center justify-between border border-line rounded-md px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-md bg-spine text-paper flex items-center justify-center text-[11px] font-medium">
                    {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm text-ink">{s.name}</p>
                    <p className="figures text-[11px] text-ink-soft">Adm {s.admNo}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Replace</Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
