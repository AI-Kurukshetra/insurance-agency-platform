create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create index if not exists idx_activities_performed_by on public.activities (performed_by);
create index if not exists idx_audit_logs_performed_by on public.audit_logs (performed_by);
create index if not exists idx_certificates_created_by on public.certificates (created_by);
create index if not exists idx_claims_created_by on public.claims (created_by);
create index if not exists idx_commissions_created_by on public.commissions (created_by);
create index if not exists idx_documents_uploaded_by on public.documents (uploaded_by);
create index if not exists idx_leads_created_by on public.leads (created_by);
create index if not exists idx_policies_created_by on public.policies (created_by);
create index if not exists idx_quotes_created_by on public.quotes (created_by);
create index if not exists idx_renewals_assigned_agent_id on public.renewals (assigned_agent_id);
create index if not exists idx_tasks_created_by on public.tasks (created_by);

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Authenticated users can view all profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Authenticated users can manage agencies" on public.agencies;
drop policy if exists "Authenticated users can manage clients" on public.clients;
drop policy if exists "Authenticated users can manage carriers" on public.carriers;
drop policy if exists "Authenticated users can manage policies" on public.policies;
drop policy if exists "Authenticated users can manage quotes" on public.quotes;
drop policy if exists "Authenticated users can manage claims" on public.claims;
drop policy if exists "Authenticated users can manage commissions" on public.commissions;
drop policy if exists "Authenticated users can manage documents" on public.documents;
drop policy if exists "Authenticated users can manage tasks" on public.tasks;
drop policy if exists "Authenticated users can manage leads" on public.leads;
drop policy if exists "Authenticated users can manage certificates" on public.certificates;
drop policy if exists "Authenticated users can manage activities" on public.activities;
drop policy if exists "Authenticated users can manage renewals" on public.renewals;
drop policy if exists "Users can view own notifications" on public.notifications;
drop policy if exists "Users can insert own notifications" on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;
drop policy if exists "Authenticated users can view audit logs" on public.audit_logs;
drop policy if exists "Authenticated users can insert audit logs" on public.audit_logs;

create policy "Authenticated users can view profiles"
on public.profiles
for select
to authenticated
using ((select auth.uid()) is not null);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Authenticated users can manage agencies"
on public.agencies
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage clients"
on public.clients
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage carriers"
on public.carriers
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage policies"
on public.policies
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage quotes"
on public.quotes
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage claims"
on public.claims
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage commissions"
on public.commissions
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage documents"
on public.documents
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage tasks"
on public.tasks
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage leads"
on public.leads
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage certificates"
on public.certificates
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage activities"
on public.activities
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can manage renewals"
on public.renewals
for all
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Users can view own notifications"
on public.notifications
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert own notifications"
on public.notifications
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update own notifications"
on public.notifications
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Authenticated users can view audit logs"
on public.audit_logs
for select
to authenticated
using ((select auth.uid()) is not null);

create policy "Authenticated users can insert audit logs"
on public.audit_logs
for insert
to authenticated
with check ((select auth.uid()) is not null);
