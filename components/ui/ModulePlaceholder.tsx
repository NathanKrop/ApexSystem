import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={description} />
      <Card className="min-h-64 flex items-center justify-center">
        <p className="text-sm text-ink-soft">This workspace is ready for its report and workflow controls.</p>
      </Card>
    </div>
  );
}
