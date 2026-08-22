import { Download, Printer, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { kes } from "@/lib/format";
import { SCHOOL, IPSAS_RECEIPTS, IPSAS_PAYMENTS, IPSAS_CASHFLOW } from "@/lib/mock-data";

export default function ReceiptsPaymentsPage() {
  const totalReceipts = IPSAS_RECEIPTS.reduce((s, r) => s + r.amount, 0);
  const totalPayments = IPSAS_PAYMENTS.reduce((s, p) => s + p.amount, 0);
  const netSurplus = totalReceipts - totalPayments;

  return (
    <div>
      <PageHeader
        eyebrow="IPSAS · 08"
        title="Statement of Receipts &amp; Payments"
        subtitle="Cash-basis IPSAS format — all inflows and outflows of public funds, classified by economic code."
        actions={
          <>
            <Button variant="outline" icon={Download}>Export</Button>
            <Button variant="primary" icon={Printer}>Print</Button>
          </>
        }
      />

      <Card className="mb-5 bg-brass-dim border-brass/30">
        <div className="flex items-start gap-2.5">
          <Info size={15} className="text-brass mt-0.5 shrink-0" />
          <p className="text-[11.5px] text-ink-soft leading-relaxed">
            Confirm the exact template and classification codes currently required by the Ministry of Education /
            TSC / County Education Board with the school&apos;s auditor before submitting — PSASB updates these
            templates periodically.
          </p>
        </div>
      </Card>

      <Card className="max-w-3xl mx-auto">
        <div className="text-center border-b border-line pb-5 mb-5">
          <p className="font-display text-lg text-ink">{SCHOOL.name}</p>
          <p className="figures text-[11px] uppercase tracking-[0.14em] text-brass mt-1">
            Statement of Receipts and Payments
          </p>
          <p className="text-xs text-ink-soft mt-1">For the period ended 30 June 2026 · {SCHOOL.county}</p>
        </div>

        <p className="text-[10.5px] uppercase tracking-[0.1em] text-ink-soft mb-2">Receipts</p>
        <table className="w-full text-sm mb-5">
          <tbody>
            {IPSAS_RECEIPTS.map((r) => (
              <tr key={r.code} className="border-b border-line">
                <td className="py-2 figures text-xs text-ink-soft w-16">{r.code}</td>
                <td className="py-2 text-ink">{r.item}</td>
                <td className="py-2 text-right figures">{kes(r.amount)}</td>
              </tr>
            ))}
            <tr className="font-medium">
              <td colSpan={2} className="py-2 text-ink">Total Receipts (A)</td>
              <td className="py-2 text-right figures text-stamp-green">{kes(totalReceipts)}</td>
            </tr>
          </tbody>
        </table>

        <p className="text-[10.5px] uppercase tracking-[0.1em] text-ink-soft mb-2">Payments</p>
        <table className="w-full text-sm mb-5">
          <tbody>
            {IPSAS_PAYMENTS.map((p) => (
              <tr key={p.code} className="border-b border-line">
                <td className="py-2 figures text-xs text-ink-soft w-16">{p.code}</td>
                <td className="py-2 text-ink">{p.item}</td>
                <td className="py-2 text-right figures">{kes(p.amount)}</td>
              </tr>
            ))}
            <tr className="font-medium">
              <td colSpan={2} className="py-2 text-ink">Total Payments (B)</td>
              <td className="py-2 text-right figures text-stamp-rust">{kes(totalPayments)}</td>
            </tr>
          </tbody>
        </table>

        <div className="perforated pt-4 flex items-center justify-between">
          <span className="font-display text-base text-ink">Net Surplus / (Deficit) for Period (A – B)</span>
          <span className="figures text-xl font-medium text-stamp-green">{kes(netSurplus)}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 text-sm">
          <div className="flex justify-between"><span className="text-ink-soft">Opening Cash Balance</span><span className="figures">{kes(IPSAS_CASHFLOW.openingBalance)}</span></div>
          <div className="flex justify-between"><span className="text-ink-soft">Closing Cash Balance</span><span className="figures font-medium">{kes(IPSAS_CASHFLOW.closingBalance)}</span></div>
        </div>
      </Card>
    </div>
  );
}
