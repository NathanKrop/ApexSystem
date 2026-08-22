import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { SMS_DELIVERY_LOG } from "@/lib/mock-data";

export default function DeliveryLogPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Message · 06"
        title="Delivery Log"
        subtitle="Every bulk send, with delivery and failure counts reported back by Africa's Talking."
      />

      <Card padded={false}>
        <div className="p-5 pb-0"><CardHeader eyebrow="This term" title="Send history" /></div>
        <DataTable
          keyField={(l) => l.id}
          rows={SMS_DELIVERY_LOG}
          columns={[
            { header: "Sent", render: (l) => <span className="figures text-xs text-ink-soft">{l.date}</span> },
            { header: "Template", render: (l) => <span className="text-sm">{l.template}</span> },
            { header: "Recipients", align: "right", render: (l) => <span className="figures text-sm">{l.recipients}</span> },
            { header: "Delivered", align: "right", render: (l) => <span className="figures text-sm text-stamp-green">{l.delivered}</span> },
            { header: "Failed", align: "right", render: (l) => <span className="figures text-sm text-stamp-rust">{l.failed}</span> },
            { header: "Units Used", align: "right", render: (l) => <span className="figures text-sm text-ink-soft">{l.unitsUsed}</span> },
          ]}
        />
      </Card>
    </div>
  );
}
