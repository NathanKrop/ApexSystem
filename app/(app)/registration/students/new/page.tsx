"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, RotateCcw, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Checkbox, FormSection } from "@/components/ui/Form";
import { CLASSROOMS, STREAMS, HOUSES, FAMILIES_PLACEHOLDER } from "@/lib/mock-data";

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    adm_no: "",
    upi_no: "",
    full_name: "",
    gender: "",
    date_of_birth: "",
    classroom: "",
    stream: "",
    form_admitted: "",
    date_admitted: "",
    is_boarder: false,
    house: "",
    family: "",
    kcpe_marks: "",
    kcpe_index_no: "",
    kcse_index_no: "",
    year_of_leaving: "",
    guardian_name: "",
    guardian_phone_primary: "",
    guardian_phone_secondary: "",
    county: "",
    division: "",
    location: "",
    sub_location: "",
    address: "",
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adm_no: form.adm_no,
          upi_no: form.upi_no || null,
          full_name: form.full_name,
          gender: form.gender,
          date_of_birth: form.date_of_birth || null,
          classroom_id: form.classroom || null,
          stream_id: form.stream || null,
          form_admitted: form.form_admitted || null,
          date_admitted: form.date_admitted || null,
          is_boarder: form.is_boarder,
          house_id: form.house || null,
          family_id: form.family || null,
          kcpe_marks: form.kcpe_marks ? Number(form.kcpe_marks) : null,
          kcpe_index_no: form.kcpe_index_no || null,
          kcse_index_no: form.kcse_index_no || null,
          year_of_leaving: form.year_of_leaving ? Number(form.year_of_leaving) : null,
          guardian_name: form.guardian_name,
          guardian_phone_primary: form.guardian_phone_primary,
          guardian_phone_secondary: form.guardian_phone_secondary || null,
          county: form.county,
          division: form.division || null,
          location: form.location || null,
          sub_location: form.sub_location || null,
          address: form.address || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save student");
        setLoading(false);
        return;
      }

      router.push("/registration/students");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  function handleClear() {
    setForm({
      adm_no: "",
      upi_no: "",
      full_name: "",
      gender: "",
      date_of_birth: "",
      classroom: "",
      stream: "",
      form_admitted: "",
      date_admitted: "",
      is_boarder: false,
      house: "",
      family: "",
      kcpe_marks: "",
      kcpe_index_no: "",
      kcse_index_no: "",
      year_of_leaving: "",
      guardian_name: "",
      guardian_phone_primary: "",
      guardian_phone_secondary: "",
      county: "",
      division: "",
      location: "",
      sub_location: "",
      address: "",
    });
    setError(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Registration · 01"
        title="Student Registration"
        subtitle="Single-entry admission form. For a whole intake class, use Bulk Excel Upload instead."
        actions={
          <Link href="/registration/bulk-upload">
            <Button variant="ghost">Bulk upload instead →</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <Card>
          <form className="divide-y divide-line" onSubmit={handleSubmit}>
            <FormSection title="Identification" description="Adm No is admin-entered — the register never auto-assigns it.">
              <Field label="Admission Number" required hint="Last entered: 4234 · Highest on file: 4234">
                <Input
                  placeholder="e.g. 4235"
                  className="figures"
                  value={form.adm_no}
                  onChange={(e) => update("adm_no", e.target.value)}
                  required
                />
              </Field>
              <Field label="UPI Number (NEMIS)" hint="Format validated against the NEMIS UPI pattern">
                <Input
                  placeholder="e.g. KE1023456F1"
                  className="figures"
                  value={form.upi_no}
                  onChange={(e) => update("upi_no", e.target.value)}
                />
              </Field>
              <Field label="Full Name" required className="sm:col-span-2">
                <Input
                  placeholder="Surname, First name, Middle name"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  required
                />
              </Field>
              <Field label="Gender" required>
                <Select
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  required
                >
                  <option value="" disabled>Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </Select>
              </Field>
              <Field label="Date of Birth" required>
                <Input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) => update("date_of_birth", e.target.value)}
                  required
                />
              </Field>
            </FormSection>

            <FormSection title="Class placement">
              <Field label="Classroom" required>
                <Select
                  value={form.classroom}
                  onChange={(e) => update("classroom", e.target.value)}
                  required
                >
                  <option value="" disabled>Select classroom</option>
                  {CLASSROOMS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Stream" required>
                <Select
                  value={form.stream}
                  onChange={(e) => update("stream", e.target.value)}
                  required
                >
                  <option value="" disabled>Select stream</option>
                  {STREAMS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Form Admitted">
                <Select
                  value={form.form_admitted}
                  onChange={(e) => update("form_admitted", e.target.value)}
                >
                  <option value="" disabled>Select form</option>
                  {CLASSROOMS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Date Admitted" required>
                <Input
                  type="date"
                  value={form.date_admitted}
                  onChange={(e) => update("date_admitted", e.target.value)}
                  required
                />
              </Field>
            </FormSection>

            <FormSection title="Boarding">
              <div className="sm:col-span-2 flex items-center gap-6">
                <Checkbox
                  label="Is a boarder"
                  checked={form.is_boarder}
                  onChange={(e) => update("is_boarder", e.target.checked)}
                />
              </div>
              <Field label="House">
                <Select
                  value={form.house}
                  onChange={(e) => update("house", e.target.value)}
                >
                  <option value="" disabled>Select house</option>
                  {HOUSES.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Family" hint="Sub-group within the house">
                <Select
                  value={form.family}
                  onChange={(e) => update("family", e.target.value)}
                >
                  <option value="" disabled>Select family</option>
                  {FAMILIES_PLACEHOLDER.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </Select>
              </Field>
            </FormSection>

            <FormSection title="Academic records">
              <Field label="KCPE Marks">
                <Input
                  type="number"
                  placeholder="e.g. 386"
                  className="figures"
                  value={form.kcpe_marks}
                  onChange={(e) => update("kcpe_marks", e.target.value)}
                />
              </Field>
              <Field label="KCPE Index No.">
                <Input
                  placeholder="e.g. 20112345001"
                  className="figures"
                  value={form.kcpe_index_no}
                  onChange={(e) => update("kcpe_index_no", e.target.value)}
                />
              </Field>
              <Field label="KCSE Index No." hint="Assigned in Form 4">
                <Input
                  placeholder="—"
                  className="figures"
                  value={form.kcse_index_no}
                  onChange={(e) => update("kcse_index_no", e.target.value)}
                />
              </Field>
              <Field label="Year of Leaving">
                <Input
                  type="number"
                  placeholder="e.g. 2028"
                  className="figures"
                  value={form.year_of_leaving}
                  onChange={(e) => update("year_of_leaving", e.target.value)}
                />
              </Field>
            </FormSection>

            <FormSection title="Guardian contact">
              <Field label="Guardian Name" required>
                <Input
                  placeholder="Full name"
                  value={form.guardian_name}
                  onChange={(e) => update("guardian_name", e.target.value)}
                  required
                />
              </Field>
              <Field label="Primary Phone" required>
                <Input
                  placeholder="07XX XXX XXX"
                  className="figures"
                  value={form.guardian_phone_primary}
                  onChange={(e) => update("guardian_phone_primary", e.target.value)}
                  required
                />
              </Field>
              <Field label="Secondary Phone(s)" hint="Comma-separated for additional numbers" className="sm:col-span-2">
                <Input
                  placeholder="07XX XXX XXX, 07XX XXX XXX"
                  className="figures"
                  value={form.guardian_phone_secondary}
                  onChange={(e) => update("guardian_phone_secondary", e.target.value)}
                />
              </Field>
            </FormSection>

            <FormSection title="Location">
              <Field label="County" required>
                <Input
                  placeholder="e.g. Meru"
                  value={form.county}
                  onChange={(e) => update("county", e.target.value)}
                  required
                />
              </Field>
              <Field label="Division">
                <Input
                  placeholder="Free text — legacy field"
                  value={form.division}
                  onChange={(e) => update("division", e.target.value)}
                />
              </Field>
              <Field label="Location">
                <Input
                  placeholder="Free text — legacy field"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                />
              </Field>
              <Field label="Sub-Location">
                <Input
                  placeholder="Free text — legacy field"
                  value={form.sub_location}
                  onChange={(e) => update("sub_location", e.target.value)}
                />
              </Field>
              <Field label="Address" className="sm:col-span-2">
                <Input
                  placeholder="P.O. Box, town"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              </Field>
            </FormSection>

            {error && (
              <div className="pt-4">
                <p className="text-xs text-stamp-rust bg-stamp-rust/10 border border-stamp-rust/30 rounded-md px-3 py-2">
                  {error}
                </p>
              </div>
            )}

            <div className="pt-5 flex items-center justify-between">
              <Checkbox label="Remember classroom / boarder / house for next entry" defaultChecked />
              <div className="flex items-center gap-2.5">
                <Button variant="ghost" icon={RotateCcw} type="button" onClick={handleClear}>Clear</Button>
                <Button variant="primary" icon={Save} type="submit" disabled={loading}>
                  {loading ? "Saving…" : "Save Student"}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="text-xs font-medium text-ink-soft uppercase tracking-[0.1em] mb-2.5">Photo</p>
            <div className="aspect-square rounded-md bg-paper-dim border border-dashed border-line-strong flex items-center justify-center text-xs text-ink-soft">
              No photo yet
            </div>
            <p className="text-[11px] text-ink-soft mt-2.5">
              Photos are usually added later in bulk — see Student Photos, matched by Adm No.
            </p>
          </Card>
          <Card className="bg-brass-dim border-brass/30">
            <div className="flex items-start gap-2.5">
              <Info size={15} className="text-brass mt-0.5 shrink-0" />
              <p className="text-[11.5px] text-ink-soft leading-relaxed">
                Admission numbers are re-used across systems at many schools — the register keeps this field
                admin-entered and only validates uniqueness, rather than auto-generating it.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}