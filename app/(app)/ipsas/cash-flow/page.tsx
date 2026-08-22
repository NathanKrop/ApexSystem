import { Download, Printer } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { kes } from "@/lib/format";
import { SCHOOL, IPSAS_CASHFLOW } from "@/lib/mock-data";

export default function CashFlowPage() {
  const netMovement = IPSAS_CASHFLOW.operating + IPSAS_CASHFLOW.investing + IPSAS_CASHFLOW.financing;

  return (
    <div>
      <PageHeader
        eyebrow="IPSAS · 08"
        title="Statement of Cash Flow"
        subtitle="Movement of cash and cash equivalents across operating, investing and financing activities."
        actions={
          <>
            <Button variant="outline" icon={Download}>Export</Button>
            <Button variant="primary" icon={Printer}>Print</Button>
          </>
        }
      />

      <Card className="max-w-2xl mx-auto">
        <div className="text-center border-b border-line pb-5 mb-5">
          <p className="font-display text-lg text-ink">{SCHOOL.name}</p>
          <p className="figures text-[11px] uppercase tracking-[0.14em] text-brass mt-1">Statement of Cash Flow</p>
          <p className="text-xs text-ink-soft mt-1">For the period ended 30 June 2026</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-ink-soft">Opening Cash &amp; Cash Equivalents</span>
            <span className="figures font-medium">{kes(IPSAS_CASHFLOW.openingBalance)}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-line pt-3">
            <span className="text-ink-soft">Net Cash from Operating Activities</span>
            <span className="figures text-stamp-green">{kes(IPSAS_CASHFLOW.operating)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-soft">Net Cash used in Investing Activities</span>
            <span className="figures text-stamp-rust">{kes(IPSAS_CASHFLOW.investing)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-soft">Net Cash from Financing Activities</span>
            <span className="figures">{kes(IPSAS_CASHFLOW.financing)}</span>
          </div>
        </div>

        <div className="perforated mt-5 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-ink-soft">Net Increase / (Decrease) in Cash</span>
            <span className="figures font-medium">{kes(netMovement)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-line">
            <span className="font-display text-base text-ink">Closing Cash &amp; Cash Equivalents</span>
            <span className="figures text-xl font-medium text-stamp-green">{kes(IPSAS_CASHFLOW.closingBalance)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
