"use client";

import { KeyRound } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Form";

export default function ChangePasswordPage() {
  return <div><PageHeader eyebrow="Fees Admin · 03" title="Change Password" subtitle="Update the password for your signed-in finance account." /><Card className="max-w-xl"><div className="space-y-4"><Field label="Username"><Input value="finance" readOnly /></Field><Field label="Current Password" required><Input type="password" /></Field><Field label="New Password" required><Input type="password" minLength={8} /></Field><Field label="Re-Enter New Password" required><Input type="password" minLength={8} /></Field><Button variant="primary" icon={KeyRound}>Change Password</Button><p className="text-xs text-ink-soft">Password validation and Supabase Auth update will be handled server-side.</p></div></Card></div>;
}
