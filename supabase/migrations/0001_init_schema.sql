-- ============================================================
-- St. Elizabeth Girls Senior Secondary School — Manager
-- Initial schema: tables, RLS, triggers, views
-- ============================================================

-- ============================================================
-- 2.1 Auth & roles
-- ============================================================

create table roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null check (name in
    ('super_admin','finance','registrar','head_teacher','payroll'))
);

create table staff_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  status text not null default 'active' check (status in ('active','on_leave','disabled')),
  created_at timestamptz default now()
);

create table staff_roles (
  staff_id uuid references staff_users(id) on delete cascade,
  role_id uuid references roles(id) on delete cascade,
  primary key (staff_id, role_id)
);

-- Helper used throughout RLS policies
create or replace function auth_has_role(role_name text) returns boolean as $$
  select exists (
    select 1 from staff_roles sr
    join roles r on r.id = sr.role_id
    where sr.staff_id = auth.uid() and r.name = role_name
  );
$$ language sql stable security definer;

-- ============================================================
-- 2.2 Reference tables
-- ============================================================

create table classrooms (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort_order int
);

create table streams (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid references classrooms(id),
  name text not null,
  capacity int,
  unique (classroom_id, name)
);

create table houses (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  capacity int,
  patron text
);

create table families (
  id uuid primary key default gen_random_uuid(),
  house_id uuid references houses(id),
  name text not null
);

create table counties (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table vote_heads (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  category text,
  type text not null check (type in ('Receipt','Payment'))
);

create table payment_types (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  code text unique not null
);

create table bank_accounts (
  id uuid primary key default gen_random_uuid(),
  bank text not null,
  branch text,
  account_name text not null,
  account_no text not null,
  purpose text not null check (purpose in ('Fees','Operations','Bursary','Payroll'))
);

-- ============================================================
-- 2.3 Students
-- ============================================================

create table students (
  id uuid primary key default gen_random_uuid(),
  adm_no text unique not null,
  upi_no text,
  full_name text not null,
  gender text not null check (gender in ('Male','Female')),
  date_of_birth date,
  classroom_id uuid references classrooms(id),
  stream_id uuid references streams(id),
  form_admitted text,
  date_admitted date,
  year_of_leaving int,
  is_boarder boolean default false,
  house_id uuid references houses(id),
  family_id uuid references families(id),
  kcpe_marks int,
  kcpe_index_no text,
  kcse_index_no text,
  guardian_name text,
  guardian_phone_primary text,
  guardian_phone_secondary text,
  county text,
  division text,
  location text,
  sub_location text,
  address text,
  photo_url text,
  status text not null default 'active' check (status in ('active','left','graduated','transferred')),
  created_by uuid references staff_users(id),
  updated_by uuid references staff_users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on students (adm_no);
create index on students (classroom_id, status);

-- ============================================================
-- 2.4 Fees & the transactions ledger (core of the system)
-- ============================================================

create table fee_structures (
  id uuid primary key default gen_random_uuid(),
  classroom_id uuid references classrooms(id),
  term text not null,
  academic_year int not null,
  status text not null default 'draft' check (status in ('draft','active')),
  created_at timestamptz default now(),
  unique (classroom_id, term, academic_year)
);

create table fee_structure_items (
  id uuid primary key default gen_random_uuid(),
  fee_structure_id uuid references fee_structures(id) on delete cascade,
  vote_head_id uuid references vote_heads(id),
  amount numeric(12,2) not null check (amount >= 0),
  created_at timestamptz default now()
);

-- Non-negotiable rule #2: receipt numbers come from a Postgres sequence
create sequence receipt_no_seq start 8840;

-- Non-negotiable rule #3: append-only. No balance column anywhere on this table.
create table transactions (
  id uuid primary key default gen_random_uuid(),
  receipt_no text not null unique default ('RCT-' || nextval('receipt_no_seq')::text),
  student_id uuid not null references students(id),
  term text not null,
  academic_year int not null,
  vote_head_id uuid references vote_heads(id),
  amount numeric(12,2) not null check (amount > 0),
  amount_in_words text,
  payment_type_id uuid references payment_types(id),
  bank_account_id uuid references bank_accounts(id),
  ref_no text,
  transaction_date date not null default current_date,
  recorded_by uuid references staff_users(id),
  voided boolean not null default false,
  void_reason text,
  voided_by uuid references staff_users(id),
  voided_at timestamptz,
  created_at timestamptz default now()
);
create index on transactions (student_id);
create index on transactions (transaction_date);

-- The computed balance: a view, never a stored column
create view student_balances as
select
  s.id as student_id,
  s.adm_no,
  s.full_name,
  s.classroom_id,
  coalesce(fs_total.total, 0) as expected_total,
  coalesce(tx_total.paid, 0) as paid_total,
  coalesce(fs_total.total, 0) - coalesce(tx_total.paid, 0) as balance
from students s
left join lateral (
  select sum(fsi.amount) as total
  from fee_structures fs
  join fee_structure_items fsi on fsi.fee_structure_id = fs.id
  where fs.classroom_id = s.classroom_id and fs.status = 'active'
) fs_total on true
left join lateral (
  select sum(t.amount) as paid
  from transactions t
  where t.student_id = s.id and t.voided = false
) tx_total on true;

-- ============================================================
-- 2.5 Other transaction-module tables
-- ============================================================

create table bursary_disbursements (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  student_id uuid references students(id),
  source text not null,
  amount numeric(12,2) not null,
  date_received date not null,
  recorded_by uuid references staff_users(id),
  created_at timestamptz default now()
);

create table other_income (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  vote_head_id uuid references vote_heads(id),
  amount numeric(12,2) not null,
  date date not null,
  recorded_by uuid references staff_users(id),
  created_at timestamptz default now()
);

create table payment_vouchers (
  id uuid primary key default gen_random_uuid(),
  voucher_no text not null unique default ('PV-' || to_char(now(),'YYYY') || '-' || nextval('receipt_no_seq')::text),
  payee text not null,
  vote_head_id uuid references vote_heads(id),
  bank_account_id uuid references bank_accounts(id),
  amount numeric(12,2) not null,
  description text,
  linked_invoice_id uuid,
  status text not null default 'pending' check (status in ('pending','paid')),
  voucher_date date not null default current_date,
  recorded_by uuid references staff_users(id),
  created_at timestamptz default now()
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_no text not null,
  supplier text not null,
  vote_head_id uuid references vote_heads(id),
  amount numeric(12,2) not null,
  date_received date not null,
  status text not null default 'outstanding' check (status in ('outstanding','settled')),
  created_at timestamptz default now()
);
alter table payment_vouchers add constraint fk_invoice foreign key (linked_invoice_id) references invoices(id);

create table commitments (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  vote_head_id uuid references vote_heads(id),
  description text,
  amount numeric(12,2) not null,
  status text not null default 'draft' check (status in ('draft','committed')),
  created_by uuid references staff_users(id),
  created_at timestamptz default now()
);

create table votes_assignment (
  id uuid primary key default gen_random_uuid(),
  vote_head_id uuid references vote_heads(id),
  term text not null,
  academic_year int not null,
  budget numeric(12,2) not null,
  created_at timestamptz default now(),
  unique (vote_head_id, term, academic_year)
);

-- ============================================================
-- 2.6 Audit log (non-negotiable rule #4)
-- ============================================================

create table audit_log (
  id bigint generated always as identity primary key,
  staff_id uuid references staff_users(id),
  table_name text not null,
  record_id uuid not null,
  action text not null check (action in ('insert','update','void','delete')),
  before jsonb,
  after jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- 2.7 Messaging
-- ============================================================

create table sms_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  body text not null,
  created_at timestamptz default now()
);

create table sms_unit_ledger (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  units int not null,
  created_at timestamptz default now()
);

create table sms_delivery_log (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references sms_templates(id),
  recipients int not null,
  delivered int not null default 0,
  failed int not null default 0,
  units_used int not null,
  sent_by uuid references staff_users(id),
  sent_at timestamptz default now()
);

-- ============================================================
-- 2.8 Payroll
-- ============================================================

create table staff_payroll_profile (
  staff_id uuid primary key references staff_users(id),
  staff_no text unique not null,
  role text,
  department text,
  basic_salary numeric(12,2) not null,
  status text default 'active',
  created_at timestamptz default now()
);

create table payroll_allowances (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references staff_users(id),
  name text not null,
  type text check (type in ('Fixed','Percentage')),
  amount numeric(12,2) not null,
  created_at timestamptz default now()
);

create table payroll_runs (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  staff_id uuid references staff_users(id),
  gross numeric(12,2),
  paye numeric(12,2),
  nssf numeric(12,2),
  sha numeric(12,2),
  housing_levy numeric(12,2),
  net numeric(12,2),
  generated_at timestamptz default now(),
  unique (period, staff_id)
);

-- ============================================================
-- 2.9 Bank reconciliation
-- ============================================================

create table bank_statement_lines (
  id uuid primary key default gen_random_uuid(),
  bank_account_id uuid references bank_accounts(id),
  statement_date date not null,
  description text,
  amount numeric(12,2) not null,
  matched_transaction_id uuid references transactions(id),
  status text not null default 'unmatched' check (status in ('matched','unmatched','variance')),
  uploaded_by uuid references staff_users(id),
  created_at timestamptz default now()
);

-- ============================================================
-- 3. Row-Level Security
-- ============================================================

-- Enable RLS on all tables
alter table roles enable row level security;
alter table staff_users enable row level security;
alter table staff_roles enable row level security;
alter table classrooms enable row level security;
alter table streams enable row level security;
alter table houses enable row level security;
alter table families enable row level security;
alter table counties enable row level security;
alter table vote_heads enable row level security;
alter table payment_types enable row level security;
alter table bank_accounts enable row level security;
alter table students enable row level security;
alter table fee_structures enable row level security;
alter table fee_structure_items enable row level security;
alter table transactions enable row level security;
alter table bursary_disbursements enable row level security;
alter table other_income enable row level security;
alter table payment_vouchers enable row level security;
alter table invoices enable row level security;
alter table commitments enable row level security;
alter table votes_assignment enable row level security;
alter table audit_log enable row level security;
alter table sms_templates enable row level security;
alter table sms_unit_ledger enable row level security;
alter table sms_delivery_log enable row level security;
alter table staff_payroll_profile enable row level security;
alter table payroll_allowances enable row level security;
alter table payroll_runs enable row level security;
alter table bank_statement_lines enable row level security;

-- Everyone authenticated can read reference data
create policy "read reference data" on classrooms for select using (auth.role() = 'authenticated');
create policy "read reference data" on streams for select using (auth.role() = 'authenticated');
create policy "read reference data" on houses for select using (auth.role() = 'authenticated');
create policy "read reference data" on families for select using (auth.role() = 'authenticated');
create policy "read reference data" on counties for select using (auth.role() = 'authenticated');
create policy "read reference data" on vote_heads for select using (auth.role() = 'authenticated');
create policy "read reference data" on payment_types for select using (auth.role() = 'authenticated');
create policy "read reference data" on bank_accounts for select using (auth.role() = 'authenticated');

-- Students: registrar + super_admin write, finance + head_teacher read-only
create policy "students read" on students for select using (
  auth_has_role('super_admin') or auth_has_role('registrar') or
  auth_has_role('finance') or auth_has_role('head_teacher'));
create policy "students write" on students for insert with check (
  auth_has_role('super_admin') or auth_has_role('registrar'));
create policy "students update" on students for update using (
  auth_has_role('super_admin') or auth_has_role('registrar'));

-- Transactions: finance + super_admin write, head_teacher + registrar read-only,
-- and never a hard delete policy — void only, via UPDATE
create policy "transactions read" on transactions for select using (
  auth_has_role('super_admin') or auth_has_role('finance') or
  auth_has_role('head_teacher') or auth_has_role('registrar'));
create policy "transactions insert" on transactions for insert with check (
  auth_has_role('super_admin') or auth_has_role('finance'));
create policy "transactions void" on transactions for update using (
  auth_has_role('super_admin') or auth_has_role('finance'));
-- No delete policy is created for transactions — enforce append-only at the DB layer.

-- Fee structures: finance + super_admin write, others read
create policy "fee_structures read" on fee_structures for select using (
  auth_has_role('super_admin') or auth_has_role('finance') or
  auth_has_role('head_teacher') or auth_has_role('registrar'));
create policy "fee_structures write" on fee_structures for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

create policy "fee_structure_items read" on fee_structure_items for select using (
  auth_has_role('super_admin') or auth_has_role('finance') or
  auth_has_role('head_teacher') or auth_has_role('registrar'));
create policy "fee_structure_items write" on fee_structure_items for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

-- Bursary: finance + super_admin
create policy "bursary read" on bursary_disbursements for select using (
  auth_has_role('super_admin') or auth_has_role('finance') or auth_has_role('head_teacher'));
create policy "bursary write" on bursary_disbursements for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

-- Other income: finance + super_admin
create policy "other_income read" on other_income for select using (
  auth_has_role('super_admin') or auth_has_role('finance') or auth_has_role('head_teacher'));
create policy "other_income write" on other_income for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

-- Payment vouchers: finance + super_admin
create policy "payment_vouchers read" on payment_vouchers for select using (
  auth_has_role('super_admin') or auth_has_role('finance') or auth_has_role('head_teacher'));
create policy "payment_vouchers write" on payment_vouchers for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

-- Invoices: finance + super_admin
create policy "invoices read" on invoices for select using (
  auth_has_role('super_admin') or auth_has_role('finance') or auth_has_role('head_teacher'));
create policy "invoices write" on invoices for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

-- Commitments: finance + super_admin
create policy "commitments read" on commitments for select using (
  auth_has_role('super_admin') or auth_has_role('finance') or auth_has_role('head_teacher'));
create policy "commitments write" on commitments for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

-- Votes assignment: finance + super_admin
create policy "votes_assignment read" on votes_assignment for select using (
  auth_has_role('super_admin') or auth_has_role('finance') or auth_has_role('head_teacher'));
create policy "votes_assignment write" on votes_assignment for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

-- Payroll: payroll officer + super_admin only
create policy "payroll read" on staff_payroll_profile for select using (
  auth_has_role('super_admin') or auth_has_role('payroll'));
create policy "payroll write" on staff_payroll_profile for all using (
  auth_has_role('super_admin') or auth_has_role('payroll'));

create policy "payroll_allowances read" on payroll_allowances for select using (
  auth_has_role('super_admin') or auth_has_role('payroll'));
create policy "payroll_allowances write" on payroll_allowances for all using (
  auth_has_role('super_admin') or auth_has_role('payroll'));

create policy "payroll_runs read" on payroll_runs for select using (
  auth_has_role('super_admin') or auth_has_role('payroll'));
create policy "payroll_runs write" on payroll_runs for all using (
  auth_has_role('super_admin') or auth_has_role('payroll'));

-- Bank reconciliation: finance + super_admin
create policy "bank_statement_lines read" on bank_statement_lines for select using (
  auth_has_role('super_admin') or auth_has_role('finance'));
create policy "bank_statement_lines write" on bank_statement_lines for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

-- SMS: finance + super_admin
create policy "sms_templates read" on sms_templates for select using (
  auth_has_role('super_admin') or auth_has_role('finance'));
create policy "sms_templates write" on sms_templates for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

create policy "sms_unit_ledger read" on sms_unit_ledger for select using (
  auth_has_role('super_admin') or auth_has_role('finance'));
create policy "sms_unit_ledger write" on sms_unit_ledger for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

create policy "sms_delivery_log read" on sms_delivery_log for select using (
  auth_has_role('super_admin') or auth_has_role('finance'));
create policy "sms_delivery_log write" on sms_delivery_log for all using (
  auth_has_role('super_admin') or auth_has_role('finance'));

-- Audit log: read-only, super_admin + head_teacher
create policy "audit_log read" on audit_log for select using (
  auth_has_role('super_admin') or auth_has_role('head_teacher'));

-- Staff users / roles: super_admin only
create policy "staff_users read" on staff_users for select using (
  auth_has_role('super_admin'));
create policy "staff_users write" on staff_users for all using (
  auth_has_role('super_admin'));

create policy "staff_roles read" on staff_roles for select using (
  auth_has_role('super_admin'));
create policy "staff_roles write" on staff_roles for all using (
  auth_has_role('super_admin'));

create policy "roles read" on roles for select using (
  auth_has_role('super_admin'));
create policy "roles write" on roles for all using (
  auth_has_role('super_admin'));

-- ============================================================
-- 4. Business logic (Postgres functions & triggers)
-- ============================================================

-- 4.1 Amount in words
create or replace function numeric_to_words(amount numeric) returns text as $$
declare
  words text := '';
  num bigint;
  cents int;
begin
  num := floor(amount)::bigint;
  cents := round((amount - num) * 100)::int;

  if num = 0 then
    words := 'Zero';
  else
    -- Handle thousands groups
    declare
      groups text[] := array['', 'Thousand', 'Million', 'Billion'];
      g int := 0;
      part int;
      ones text[] := array['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                           'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                           'Seventeen', 'Eighteen', 'Nineteen'];
      tens text[] := array['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      part_words text;
    begin
      while num > 0 loop
        part := num % 1000;
        if part > 0 then
          part_words := '';
          if part / 100 > 0 then
            part_words := part_words || ones[part / 100 + 1] || ' Hundred';
          end if;
          if part % 100 >= 20 then
            if part_words <> '' then part_words := part_words || ' '; end if;
            part_words := part_words || tens[(part % 100) / 10 + 1];
            if part % 10 > 0 then
              part_words := part_words || '-' || ones[part % 10 + 1];
            end if;
          elsif part % 100 > 0 then
            if part_words <> '' then part_words := part_words || ' '; end if;
            part_words := part_words || ones[part % 100 + 1];
          end if;
          if groups[g + 1] <> '' then
            part_words := part_words || ' ' || groups[g + 1];
          end if;
          if words <> '' then
            words := part_words || ' ' || words;
          else
            words := part_words;
          end if;
        end if;
        num := num / 1000;
        g := g + 1;
      end loop;
    end;
  end if;

  if cents > 0 then
    words := words || ' and ' || cents::text || '/100';
  end if;

  return words;
end;
$$ language plpgsql;

-- 4.2 Generic audit trigger
create or replace function log_audit() returns trigger as $$
begin
  insert into audit_log (staff_id, table_name, record_id, action, before, after)
  values (
    auth.uid(),
    tg_table_name,
    coalesce(new.id, old.id),
    lower(tg_op),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
    case when tg_op in ('UPDATE','INSERT') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger audit_transactions after insert or update on transactions
  for each row execute function log_audit();
create trigger audit_bursary after insert or update on bursary_disbursements
  for each row execute function log_audit();
create trigger audit_other_income after insert or update on other_income
  for each row execute function log_audit();
create trigger audit_payment_vouchers after insert or update on payment_vouchers
  for each row execute function log_audit();
create trigger audit_invoices after insert or update on invoices
  for each row execute function log_audit();
create trigger audit_commitments after insert or update on commitments
  for each row execute function log_audit();
create trigger audit_votes_assignment after insert or update on votes_assignment
  for each row execute function log_audit();
create trigger audit_fee_structures after insert or update on fee_structures
  for each row execute function log_audit();
create trigger audit_fee_structure_items after insert or update on fee_structure_items
  for each row execute function log_audit();

-- 4.3 updated_at maintenance
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger students_updated_at before update on students
  for each row execute function set_updated_at();

-- ============================================================
-- Seed reference data
-- ============================================================

insert into roles (name) values
  ('super_admin'), ('finance'), ('registrar'), ('head_teacher'), ('payroll');

insert into classrooms (name, sort_order) values
  ('Form 1', 1), ('Form 2', 2), ('Form 3', 3), ('Form 4', 4);

insert into streams (classroom_id, name, capacity)
select c.id, s.name, s.capacity
from classrooms c
cross join (values ('East', 45), ('West', 45), ('Central', 45)) as s(name, capacity)
where c.name in ('Form 1', 'Form 2', 'Form 3')
union all
select c.id, s.name, s.capacity
from classrooms c
cross join (values ('East', 48), ('West', 48)) as s(name, capacity)
where c.name = 'Form 4';

insert into houses (name, capacity, patron) values
  ('Kilimanjaro', 120, 'Mr. O. Wambua'),
  ('Kenya', 120, 'Mrs. J. Achieng'),
  ('Elgon', 100, 'Mr. D. Kiptoo'),
  ('Longonot', 100, 'Mrs. F. Chebet');

insert into vote_heads (code, name, category, type) values
  ('1100', 'Tuition', 'Instructional', 'Receipt'),
  ('1200', 'Boarding', 'Welfare', 'Receipt'),
  ('1300', 'Activity Fee', 'Co-curricular', 'Receipt'),
  ('1400', 'Exam Fee', 'Instructional', 'Receipt'),
  ('1500', 'Lunch Programme', 'Welfare', 'Receipt'),
  ('1600', 'Medical / Insurance', 'Welfare', 'Receipt'),
  ('1700', 'Bursary & Grants', 'Grants', 'Receipt'),
  ('1800', 'Other Income', 'Other', 'Receipt'),
  ('2100', 'Staff Salaries', 'Compensation', 'Payment'),
  ('2200', 'Repairs & Maintenance', 'Operations', 'Payment'),
  ('2300', 'Teaching Materials', 'Instructional', 'Payment'),
  ('2400', 'Utilities', 'Operations', 'Payment'),
  ('2500', 'Capital — Infrastructure', 'Capital', 'Payment');

insert into payment_types (name, code) values
  ('M-Pesa Paybill', 'MPESA'),
  ('Bank Transfer / RTGS', 'BANK'),
  ('Cash', 'CASH'),
  ('Cheque', 'CHQ'),
  ('Bursary — CDF', 'BURS-CDF'),
  ('Bursary — County', 'BURS-CTY');

insert into bank_accounts (bank, branch, account_name, account_no, purpose) values
  ('Equity Bank', 'Meru', 'ST. ELIZABETH GIRLS SINOR SECONDARY SCHOOL — Fees', '1090 2734 5510', 'Fees'),
  ('KCB Bank', 'Meru', 'ST. ELIZABETH GIRLS SINOR SECONDARY SCHOOL — Operations', '1122 8890 041', 'Operations'),
  ('Co-operative Bank', 'Meru', 'ST. ELIZABETH GIRLS SINOR SECONDARY SCHOOL — Bursary', '0114 5567 213', 'Bursary');

insert into sms_templates (name, body) values
  ('Fee balance reminder', 'Dear Parent, {student_name} (Adm {adm_no}) has an outstanding balance of KES {balance}. Kindly clear before {deadline}. — ST. ELIZABETH GIRLS SINOR SECONDARY SCHOOL'),
  ('Payment confirmation', 'Payment of KES {amount} received for {student_name}, Adm {adm_no}. Receipt No. {receipt_no}. New balance: KES {balance}. Thank you.'),
  ('Term opening notice', 'Reminder: Term {term} opens on {date}. Please ensure fees and requirements are ready. — ST. ELIZABETH GIRLS SINOR SECONDARY SCHOOL');