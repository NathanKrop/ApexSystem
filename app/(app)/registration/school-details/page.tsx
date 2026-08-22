import { Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea, FormSection } from "@/components/ui/Form";
import { SCHOOL } from "@/lib/mock-data";

export default function SchoolDetailsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Registration · 01"
        title="School Details"
        subtitle="Institution profile used across receipts, statements, SMS sender ID and IPSAS statements."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <Card>
          <form className="divide-y divide-line">
            <FormSection title="Identity">
              <Field label="School Name" required className="sm:col-span-2">
                <Input defaultValue={SCHOOL.name} />
              </Field>
              <Field label="Motto">
                <Input defaultValue={SCHOOL.motto} />
              </Field>
              <Field label="MoE Registration No." required>
                <Input defaultValue={SCHOOL.registration} className="figures" />
              </Field>
              <Field label="County" required>
                <Input defaultValue={SCHOOL.county} />
              </Field>
              <Field label="School Type">
                <Select defaultValue="Public — National">
                  <option>Public — National</option>
                  <option>Public — Extra County</option>
                  <option>Public — County</option>
                  <option>Public — Sub-County</option>
                </Select>
              </Field>
            </FormSection>

            <FormSection title="Contact">
              <Field label="Postal Address" className="sm:col-span-2">
                <Input defaultValue={SCHOOL.address} />
              </Field>
              <Field label="Phone">
                <Input defaultValue={SCHOOL.phone} className="figures" />
              </Field>
              <Field label="Email">
                <Input defaultValue={SCHOOL.email} />
              </Field>
            </FormSection>

            <FormSection title="Academic calendar">
              <Field label="Current Term" required>
                <Select defaultValue={SCHOOL.term}>
                  <option>Term 1</option><option>Term 2</option><option>Term 3</option>
                </Select>
              </Field>
              <Field label="Academic Year" required>
                <Input type="number" defaultValue={SCHOOL.year} className="figures" />
              </Field>
            </FormSection>

            <FormSection title="Receipt & statement footer" description="Printed on every receipt, fee statement and IPSAS report.">
              <Textarea rows={3} className="sm:col-span-2" defaultValue="All fees are payable via Paybill 400211 or bank transfer. Retain this receipt for your records." />
            </FormSection>

            <div className="pt-5 flex justify-end">
              <Button variant="primary" icon={Save}>Save school details</Button>
            </div>
          </form>
        </Card>

        <Card className="h-fit">
          <CardHeader title="School badge" />
          <div className="aspect-square rounded-md bg-paper-dim border border-dashed border-line-strong flex items-center justify-center text-xs text-ink-soft mb-3">
            No badge uploaded
          </div>
          <Button variant="outline" size="sm" className="w-full">Upload badge</Button>
        </Card>
      </div>
    </div>
  );
}
