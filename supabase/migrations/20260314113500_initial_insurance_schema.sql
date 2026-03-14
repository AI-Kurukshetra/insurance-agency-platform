create extension if not exists pgcrypto;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  state text,
  zip text,
  phone text,
  email text,
  website text,
  license_no text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  role text not null default 'agent' check (role in ('admin', 'agent', 'manager', 'accountant')),
  agency_id uuid references public.agencies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carriers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  contact_name text,
  contact_email text,
  contact_phone text,
  website text,
  lines_of_business text[],
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  client_id text not null unique,
  type text not null default 'individual' check (type in ('individual', 'business')),
  first_name text,
  last_name text,
  business_name text,
  email text not null unique,
  phone text,
  date_of_birth date,
  address text,
  city text,
  state text,
  zip text,
  status text not null default 'active' check (status in ('active', 'inactive', 'prospect')),
  assigned_agent_id uuid references public.profiles(id) on delete set null,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_name_check check (
    (type = 'individual' and first_name is not null and last_name is not null)
    or (type = 'business' and business_name is not null)
  )
);

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  policy_number text not null unique,
  client_id uuid not null references public.clients(id) on delete cascade,
  carrier_id uuid not null references public.carriers(id) on delete restrict,
  line_of_business text not null check (line_of_business in ('auto', 'home', 'life', 'health', 'commercial', 'liability', 'umbrella', 'other')),
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled', 'pending', 'renewed')),
  effective_date date not null,
  expiration_date date not null,
  premium numeric(12,2) not null check (premium >= 0),
  coverage_limit numeric(14,2),
  deductible numeric(10,2),
  description text,
  assigned_agent_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint policies_date_check check (expiration_date >= effective_date)
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  client_id uuid not null references public.clients(id) on delete cascade,
  carrier_id uuid not null references public.carriers(id) on delete restrict,
  line_of_business text not null check (line_of_business in ('auto', 'home', 'life', 'health', 'commercial', 'liability', 'umbrella', 'other')),
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected', 'expired', 'bound')),
  premium numeric(12,2) check (premium is null or premium >= 0),
  coverage_limit numeric(14,2),
  deductible numeric(10,2),
  valid_until date,
  notes text,
  assigned_agent_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  claim_number text not null unique,
  policy_id uuid not null references public.policies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  carrier_id uuid not null references public.carriers(id) on delete restrict,
  status text not null default 'open' check (status in ('open', 'in_review', 'approved', 'denied', 'closed', 'pending_info')),
  incident_date date not null,
  reported_date date not null default current_date,
  description text not null,
  claim_amount numeric(12,2),
  settled_amount numeric(12,2),
  adjuster_name text,
  adjuster_phone text,
  notes text,
  assigned_agent_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint claims_dates_check check (reported_date >= incident_date)
);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies(id) on delete set null,
  carrier_id uuid not null references public.carriers(id) on delete restrict,
  agent_id uuid references public.profiles(id) on delete set null,
  type text not null default 'new_business' check (type in ('new_business', 'renewal', 'bonus', 'adjustment')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'voided')),
  commission_rate numeric(5,2),
  gross_premium numeric(12,2) not null check (gross_premium >= 0),
  commission_amount numeric(12,2) not null check (commission_amount >= 0),
  paid_date date,
  payment_reference text,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('policy', 'certificate', 'claim', 'quote', 'application', 'correspondence', 'other')),
  file_url text not null,
  file_size bigint,
  mime_type text,
  client_id uuid references public.clients(id) on delete cascade,
  policy_id uuid references public.policies(id) on delete set null,
  claim_id uuid references public.claims(id) on delete set null,
  quote_id uuid references public.quotes(id) on delete set null,
  version integer not null default 1 check (version > 0),
  tags text[],
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null default 'follow_up' check (type in ('follow_up', 'renewal', 'payment', 'claim', 'meeting', 'call', 'other')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  due_date timestamptz,
  client_id uuid references public.clients(id) on delete cascade,
  policy_id uuid references public.policies(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null unique,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  source text check (source in ('referral', 'website', 'cold_call', 'social_media', 'event', 'other')),
  stage text not null default 'new' check (stage in ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  interested_in text[],
  estimated_premium numeric(12,2),
  notes text,
  assigned_agent_id uuid references public.profiles(id) on delete set null,
  converted_client_id uuid references public.clients(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_number text not null unique,
  policy_id uuid not null references public.policies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  holder_name text not null,
  holder_address text,
  issued_date date not null default current_date,
  expiry_date date,
  file_url text,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint certificates_dates_check check (expiry_date is null or expiry_date >= issued_date)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('note', 'call', 'email', 'meeting', 'status_change', 'document_upload', 'system')),
  description text not null,
  client_id uuid references public.clients(id) on delete cascade,
  policy_id uuid references public.policies(id) on delete set null,
  claim_id uuid references public.claims(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  performed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.renewals (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.policies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  renewal_date date not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'notified', 'renewed', 'non_renewed', 'lapsed')),
  reminder_sent_at timestamptz,
  notes text,
  assigned_agent_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info', 'warning', 'success', 'error', 'renewal', 'task', 'claim')),
  read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  old_data jsonb,
  new_data jsonb,
  performed_by uuid references public.profiles(id) on delete set null,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_agency_id on public.profiles (agency_id);
create index if not exists idx_profiles_role on public.profiles (role);

create index if not exists idx_clients_status on public.clients (status);
create index if not exists idx_clients_assigned_agent_id on public.clients (assigned_agent_id);
create index if not exists idx_clients_created_by on public.clients (created_by);

create index if not exists idx_policies_client_id on public.policies (client_id);
create index if not exists idx_policies_carrier_id on public.policies (carrier_id);
create index if not exists idx_policies_status on public.policies (status);
create index if not exists idx_policies_assigned_agent_id on public.policies (assigned_agent_id);

create index if not exists idx_quotes_client_id on public.quotes (client_id);
create index if not exists idx_quotes_carrier_id on public.quotes (carrier_id);
create index if not exists idx_quotes_status on public.quotes (status);
create index if not exists idx_quotes_assigned_agent_id on public.quotes (assigned_agent_id);

create index if not exists idx_claims_policy_id on public.claims (policy_id);
create index if not exists idx_claims_client_id on public.claims (client_id);
create index if not exists idx_claims_carrier_id on public.claims (carrier_id);
create index if not exists idx_claims_status on public.claims (status);
create index if not exists idx_claims_assigned_agent_id on public.claims (assigned_agent_id);

create index if not exists idx_commissions_policy_id on public.commissions (policy_id);
create index if not exists idx_commissions_carrier_id on public.commissions (carrier_id);
create index if not exists idx_commissions_agent_id on public.commissions (agent_id);
create index if not exists idx_commissions_status on public.commissions (status);

create index if not exists idx_documents_client_id on public.documents (client_id);
create index if not exists idx_documents_policy_id on public.documents (policy_id);
create index if not exists idx_documents_claim_id on public.documents (claim_id);
create index if not exists idx_documents_quote_id on public.documents (quote_id);
create index if not exists idx_documents_type on public.documents (type);

create index if not exists idx_tasks_client_id on public.tasks (client_id);
create index if not exists idx_tasks_policy_id on public.tasks (policy_id);
create index if not exists idx_tasks_assigned_to on public.tasks (assigned_to);
create index if not exists idx_tasks_status on public.tasks (status);
create index if not exists idx_tasks_due_date on public.tasks (due_date);

create index if not exists idx_leads_stage on public.leads (stage);
create index if not exists idx_leads_assigned_agent_id on public.leads (assigned_agent_id);
create index if not exists idx_leads_converted_client_id on public.leads (converted_client_id);

create index if not exists idx_certificates_policy_id on public.certificates (policy_id);
create index if not exists idx_certificates_client_id on public.certificates (client_id);
create index if not exists idx_certificates_status on public.certificates (status);

create index if not exists idx_activities_client_id on public.activities (client_id);
create index if not exists idx_activities_policy_id on public.activities (policy_id);
create index if not exists idx_activities_claim_id on public.activities (claim_id);
create index if not exists idx_activities_lead_id on public.activities (lead_id);

create index if not exists idx_renewals_policy_id on public.renewals (policy_id);
create index if not exists idx_renewals_client_id on public.renewals (client_id);
create index if not exists idx_renewals_status on public.renewals (status);
create index if not exists idx_renewals_renewal_date on public.renewals (renewal_date);

create index if not exists idx_notifications_user_id on public.notifications (user_id);
create index if not exists idx_notifications_read on public.notifications (read);

create index if not exists idx_audit_logs_table_name on public.audit_logs (table_name);
create index if not exists idx_audit_logs_record_id on public.audit_logs (record_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);

drop trigger if exists agencies_updated_at on public.agencies;
create trigger agencies_updated_at
before update on public.agencies
for each row
execute function public.update_updated_at_column();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

drop trigger if exists carriers_updated_at on public.carriers;
create trigger carriers_updated_at
before update on public.carriers
for each row
execute function public.update_updated_at_column();

drop trigger if exists clients_updated_at on public.clients;
create trigger clients_updated_at
before update on public.clients
for each row
execute function public.update_updated_at_column();

drop trigger if exists policies_updated_at on public.policies;
create trigger policies_updated_at
before update on public.policies
for each row
execute function public.update_updated_at_column();

drop trigger if exists quotes_updated_at on public.quotes;
create trigger quotes_updated_at
before update on public.quotes
for each row
execute function public.update_updated_at_column();

drop trigger if exists claims_updated_at on public.claims;
create trigger claims_updated_at
before update on public.claims
for each row
execute function public.update_updated_at_column();

drop trigger if exists commissions_updated_at on public.commissions;
create trigger commissions_updated_at
before update on public.commissions
for each row
execute function public.update_updated_at_column();

drop trigger if exists documents_updated_at on public.documents;
create trigger documents_updated_at
before update on public.documents
for each row
execute function public.update_updated_at_column();

drop trigger if exists tasks_updated_at on public.tasks;
create trigger tasks_updated_at
before update on public.tasks
for each row
execute function public.update_updated_at_column();

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at
before update on public.leads
for each row
execute function public.update_updated_at_column();

drop trigger if exists certificates_updated_at on public.certificates;
create trigger certificates_updated_at
before update on public.certificates
for each row
execute function public.update_updated_at_column();

drop trigger if exists renewals_updated_at on public.renewals;
create trigger renewals_updated_at
before update on public.renewals
for each row
execute function public.update_updated_at_column();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.log_audit_changes()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_logs (table_name, record_id, action, old_data, new_data, performed_by)
    values (tg_table_name, new.id, 'insert', null, to_jsonb(new), auth.uid());
    return new;
  elsif tg_op = 'UPDATE' then
    insert into public.audit_logs (table_name, record_id, action, old_data, new_data, performed_by)
    values (tg_table_name, new.id, 'update', to_jsonb(old), to_jsonb(new), auth.uid());
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.audit_logs (table_name, record_id, action, old_data, new_data, performed_by)
    values (tg_table_name, old.id, 'delete', to_jsonb(old), null, auth.uid());
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists agencies_audit on public.agencies;
create trigger agencies_audit
after insert or update or delete on public.agencies
for each row
execute function public.log_audit_changes();

drop trigger if exists profiles_audit on public.profiles;
create trigger profiles_audit
after insert or update or delete on public.profiles
for each row
execute function public.log_audit_changes();

drop trigger if exists carriers_audit on public.carriers;
create trigger carriers_audit
after insert or update or delete on public.carriers
for each row
execute function public.log_audit_changes();

drop trigger if exists clients_audit on public.clients;
create trigger clients_audit
after insert or update or delete on public.clients
for each row
execute function public.log_audit_changes();

drop trigger if exists policies_audit on public.policies;
create trigger policies_audit
after insert or update or delete on public.policies
for each row
execute function public.log_audit_changes();

drop trigger if exists quotes_audit on public.quotes;
create trigger quotes_audit
after insert or update or delete on public.quotes
for each row
execute function public.log_audit_changes();

drop trigger if exists claims_audit on public.claims;
create trigger claims_audit
after insert or update or delete on public.claims
for each row
execute function public.log_audit_changes();

drop trigger if exists commissions_audit on public.commissions;
create trigger commissions_audit
after insert or update or delete on public.commissions
for each row
execute function public.log_audit_changes();

drop trigger if exists documents_audit on public.documents;
create trigger documents_audit
after insert or update or delete on public.documents
for each row
execute function public.log_audit_changes();

drop trigger if exists tasks_audit on public.tasks;
create trigger tasks_audit
after insert or update or delete on public.tasks
for each row
execute function public.log_audit_changes();

drop trigger if exists leads_audit on public.leads;
create trigger leads_audit
after insert or update or delete on public.leads
for each row
execute function public.log_audit_changes();

drop trigger if exists certificates_audit on public.certificates;
create trigger certificates_audit
after insert or update or delete on public.certificates
for each row
execute function public.log_audit_changes();

drop trigger if exists activities_audit on public.activities;
create trigger activities_audit
after insert or update or delete on public.activities
for each row
execute function public.log_audit_changes();

drop trigger if exists renewals_audit on public.renewals;
create trigger renewals_audit
after insert or update or delete on public.renewals
for each row
execute function public.log_audit_changes();

drop trigger if exists notifications_audit on public.notifications;
create trigger notifications_audit
after insert or update or delete on public.notifications
for each row
execute function public.log_audit_changes();

alter table public.profiles enable row level security;
alter table public.agencies enable row level security;
alter table public.clients enable row level security;
alter table public.carriers enable row level security;
alter table public.policies enable row level security;
alter table public.quotes enable row level security;
alter table public.claims enable row level security;
alter table public.commissions enable row level security;
alter table public.documents enable row level security;
alter table public.tasks enable row level security;
alter table public.leads enable row level security;
alter table public.certificates enable row level security;
alter table public.activities enable row level security;
alter table public.renewals enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Authenticated users can view all profiles"
on public.profiles
for select
to authenticated
using (true);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Authenticated users can manage agencies"
on public.agencies
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage clients"
on public.clients
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage carriers"
on public.carriers
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage policies"
on public.policies
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage quotes"
on public.quotes
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage claims"
on public.claims
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage commissions"
on public.commissions
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage documents"
on public.documents
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage tasks"
on public.tasks
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage leads"
on public.leads
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage certificates"
on public.certificates
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage activities"
on public.activities
for all
to authenticated
using (true)
with check (true);

create policy "Authenticated users can manage renewals"
on public.renewals
for all
to authenticated
using (true)
with check (true);

create policy "Users can view own notifications"
on public.notifications
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own notifications"
on public.notifications
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own notifications"
on public.notifications
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Authenticated users can view audit logs"
on public.audit_logs
for select
to authenticated
using (true);

create policy "Authenticated users can insert audit logs"
on public.audit_logs
for insert
to authenticated
with check (true);
