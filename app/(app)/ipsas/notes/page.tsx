import { Download, Printer } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { kes } from "@/lib/format";
import { SCHOOL, STAFF } from "@/lib/mock-data";

const NOTES = [
  {
    n: 1,
    title: "Statement of Compliance and Basis of Preparation",
    body: "These financial statements have been prepared in accordance with the Cash Basis IPSAS financial reporting standard, as prescribed by the Public Sector Accounting Standards Board (PSASB) of Kenya.",
  },
  {
    n: 2,
    title: "Compensation of Employees",
    body: `Payroll costs for the period, before statutory deductions, are summarised below.`,
    table: STAFF.slice(0, 5).map((s) => ({ label: s.role, value: s.basicSalary })),
  },
  {
    n: 3,
    title: "Bank Accounts",
    body: "Cash and cash equivalents at period end are held across the fees, operations and bursary accounts disclosed under Bank Accounts.",
  },
  {
    n: 4,
    title: "Pending Bills",
    body: "Outstanding supplier invoices not yet settled at period end are disclosed as pending bills and carried forward to the next reporting period — see Register Invoice.",
  },
  {
    n: 5,
    title: "Related Party Transactions",
    body: "No material related party transactions were identified for the period under review.",
  },
];

export default function NotesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="IPSAS · 08"
        title="Notes to the Financial Statements"
        subtitle="Standard IPSAS disclosure notes accompanying the Statement of Receipts and Payments."
        actions={
          <>
            <Button variant="outline" icon={Download}>Export</Button>
            <Button variant="primary" icon={Printer}>Print</Button>
          </>
        }
      />

      <Card className="max-w-3xl mx-auto">
        <div className="text-center border-b border-line pb-5 mb-6">
          <p className="font-display text-lg text-ink">{SCHOOL.name}</p>
          <p className="figures text-[11px] uppercase tracking-[0.14em] text-brass mt-1">
            Notes to the Financial Statements
          </p>
          <p className="text-xs text-ink-soft mt-1">For the period ended 30 June 2026</p>
        </div>

        <div className="space-y-6">
          {NOTES.map((note) => (
            <div key={note.n} className="pb-6 border-b border-line last:border-0 last:pb-0">
              <CardHeader eyebrow={`Note ${note.n}`} title={note.title} />
              <p className="text-sm text-ink-soft leading-relaxed mb-3">{note.body}</p>
              {note.table && (
                <table className="w-full text-sm">
                  <tbody>
                    {note.table.map((row) => (
                      <tr key={row.label} className="border-b border-line last:border-0">
                        <td className="py-1.5 text-ink-soft">{row.label}</td>
                        <td className="py-1.5 text-right figures">{kes(row.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
