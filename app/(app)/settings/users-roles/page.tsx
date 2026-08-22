import { Plus, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { DataTable } from "@/components/ui/DataTable";
import { StatusStamp, Stamp } from "@/components/ui/Stamp";
import { ROLES } from "@/lib/nav-config";

const STAFF_USERS = [
  { id: "u1", name: "Alfred Mutiso", email: "a.mutiso@kendihigh.ac.ke", roles: ["Super Admin"], status: "Active" },
  { id: "u2", name: "Caroline Njeri", email: "c.njeri@kendihigh.ac.ke", roles: ["Finance / Bursar"], status: "Active" },
  { id: "u3", name: "Beatrice Kilonzo", email: "b.kilonzo@kendihigh.ac.ke", roles: ["Finance / Bursar", "Registrar"], status: "Active" },
  { id: "u4", name: "Dennis Kiptoo", email: "d.kiptoo@kendihigh.ac.ke", roles: ["Head Teacher"], status: "Active" },
  { id: "u5", name: "Grace Wambui", email: "g.wambui@kendihigh.ac.ke", roles: ["Payroll Officer"], status: "On Leave" },
];

export default function UsersRolesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Settings · 09"
        title="Users &amp; Roles"
        subtitle="Manage staff accounts. A person may hold more than one role — reflected as a many-to-many staff_roles join."
        actions={<Button variant="primary" icon={Plus}>Invite staff member</Button>}
      />

      <Card className="mb-5 bg-brass-dim border-brass/30">
        <div className="flex items-start gap-2.5">
          <Info size={15} className="text-brass mt-0.5 shrink-0" />
          <p className="text-[11.5px] text-ink-soft leading-relaxed">
            Every sign-in and money-affecting action performed by these accounts is written to the audit log with
            staff ID, timestamp, and before/after values.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <Card padded={false}>
          <div className="p-5 pb-0"><CardHeader title="Staff accounts" subtitle={`${STAFF_USERS.length} accounts`} /></div>
          <DataTable
            keyField={(u) => u.id}
            rows={STAFF_USERS}
            columns={[
              { header: "Name", render: (u) => <span className="text-sm">{u.name}</span> },
              { header: "Email", render: (u) => <span className="text-xs text-ink-soft">{u.email}</span> },
              {
                header: "Roles",
                render: (u) => (
                  <div className="flex flex-wrap gap-1.5">
                    {u.roles.map((r) => <Stamp key={r} tone="brass">{r}</Stamp>)}
                  </div>
                ),
              },
              { header: "Status", align: "right", render: (u) => <StatusStamp status={u.status} /> },
              { header: "", align: "right", render: () => <Button variant="ghost" size="sm">Edit</Button> },
            ]}
          />
        </Card>

        <Card className="h-fit">
          <CardHeader title="Invite staff member" />
          <form className="space-y-4">
            <Field label="Full Name" required><Input placeholder="Full name" /></Field>
            <Field label="Email" required><Input type="email" placeholder="name@kendihigh.ac.ke" /></Field>
            <Field label="Role(s)" required hint="A person may hold multiple roles">
              <Select defaultValue="">
                <option value="" disabled>Select a role</option>
                {ROLES.map((r) => <option key={r.id}>{r.label}</option>)}
              </Select>
            </Field>
            <Button variant="primary" icon={Plus} className="w-full">Send invite</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
