# 🏢 Insurance Agency System
> Stack: Next.js 15 + Supabase + Vercel + TypeScript
> Modules: Auth (Login + Register + Forgot Password + Logout) + Client Module + Policy Module + Quote Module + Commission Module + Document Module + Claims Module + Task & Calendar Module + Lead Module + Certificate Module + Dashboard + Reports
> Goal: Build locally → test → deploy to Vercel

---

## 📋 BUILD ORDER FOR CODEX

```
PHASE 1 — LOCAL DEV:
0A. GitHub: clone existing repo from https://github.com/AI-Kurukshetra/insurance-agency-platform → update README → initial commit
0B. Supabase MCP: create project + all tables + RLS + seed data
0C. Scaffold Next.js app + install all dependencies
0D. Create .mcp.json for Next.js DevTools MCP
1.  Supabase clients (browser + server) + middleware + TypeScript types
2.  Auth pages (login + register + forgot-password) + server actions + validation
3.  App layout (sidebar + header + mobile drawer)
4.  Dashboard home (stats cards + recent activity)
5.  Client module (list + add + edit + view + delete)
6.  Policy module (list + add + edit + view + delete)
7.  Quote module (list + add + compare + bind)
8.  Commission module (tracking + reports)
9.  Document module (upload + manage + search)
10. Claims module (list + add + update status)
11. Task & Calendar module (tasks + reminders)
12. Lead module (pipeline + add + convert)
13. Certificate of Insurance generator
14. Reports & financial dashboard
15. Write all Vitest unit tests + Playwright E2E tests
16. Git: commit all features → push to main

PHASE 2 — DEPLOY (only after Phase 1 fully working locally):
17. npm run build — fix ALL errors
18. npm run test:run + npm run test:e2e — all must pass
19. Git: final push to main
20. Vercel MCP: create project + set env vars + deploy
21. Supabase: add Vercel URL to Auth redirect URLs (manual step)
22. Verify production — test auth, all modules, logout
23. Record demo + submit
```

---

## 🗄️ STEP 0A — CLONE GITHUB REPO + INITIAL README COMMIT

**Do this FIRST before anything else.**

```bash
# Clone the existing repository
git clone https://github.com/AI-Kurukshetra/insurance-agency-platform.git
cd insurance-agency-platform
```

Create / overwrite `README.md` with the following content:

```markdown
# 🏢 Insurance Agency Platform

## What it does
Insurance Agency Platform is a full-stack agency management system for
independent insurance brokers. It centralises client management, policy
tracking, quote generation, claims handling, commission reporting, document
storage, task management, and lead pipeline in a single modern web app —
giving agents everything they need to run their agency efficiently.

## What it is an alternative to
This is an open-source alternative to **Applied Epic** (Applied Systems) —
the industry-leading insurance agency management system used by independent
brokers worldwide. Other commercial products it replaces include HawkSoft,
EZLynx, and Agency Matrix.
```

Then commit and push:

```bash
git add README.md
git commit -m "init: add project README — Insurance Agency Platform"
git push origin main
```

---

## 🗄️ STEP 0B — CREATE SUPABASE PROJECT (via Supabase MCP)

```
Using Supabase MCP:
1. Create a new Supabase project called "insurance-agency-platform"
2. Wait for provisioning to complete
3. Create all tables below with RLS policies
4. Insert all seed data below
5. Give me these 3 values for .env.local:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
```

---

## 🗃️ DATABASE SCHEMA

### Table: `profiles`
Extends Supabase auth.users — auto-created on signup via trigger.
```sql
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  email       text not null,
  avatar_url  text,
  role        text not null default 'agent' check (role in ('admin', 'agent', 'manager', 'accountant')),
  agency_id   uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

### Table: `agencies`
```sql
create table agencies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  address     text,
  city        text,
  state       text,
  zip         text,
  phone       text,
  email       text,
  website     text,
  license_no  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
```

### Table: `clients`
```sql
create table clients (
  id                  uuid primary key default gen_random_uuid(),
  client_id           text not null unique,   -- e.g. "CLT-001"
  type                text not null default 'individual'
                      check (type in ('individual', 'business')),
  first_name          text,
  last_name           text,
  business_name       text,
  email               text not null unique,
  phone               text,
  date_of_birth       date,
  address             text,
  city                text,
  state               text,
  zip                 text,
  status              text not null default 'active'
                      check (status in ('active', 'inactive', 'prospect')),
  assigned_agent_id   uuid references profiles(id),
  notes               text,
  created_by          uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clients_updated_at
  before update on clients
  for each row execute procedure update_updated_at_column();
```

### Table: `carriers`
```sql
create table carriers (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  code            text not null unique,   -- e.g. "STATE-FARM"
  contact_name    text,
  contact_email   text,
  contact_phone   text,
  website         text,
  lines_of_business text[],              -- e.g. ARRAY['auto','home','life']
  status          text not null default 'active'
                  check (status in ('active', 'inactive')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger carriers_updated_at
  before update on carriers
  for each row execute procedure update_updated_at_column();
```

### Table: `policies`
```sql
create table policies (
  id                  uuid primary key default gen_random_uuid(),
  policy_number       text not null unique,   -- e.g. "POL-001"
  client_id           uuid not null references clients(id) on delete cascade,
  carrier_id          uuid not null references carriers(id),
  line_of_business    text not null
                      check (line_of_business in ('auto','home','life','health','commercial','liability','umbrella','other')),
  status              text not null default 'active'
                      check (status in ('active','expired','cancelled','pending','renewed')),
  effective_date      date not null,
  expiration_date     date not null,
  premium             numeric(12,2) not null,
  coverage_limit      numeric(14,2),
  deductible          numeric(10,2),
  description         text,
  assigned_agent_id   uuid references profiles(id),
  created_by          uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger policies_updated_at
  before update on policies
  for each row execute procedure update_updated_at_column();
```

### Table: `quotes`
```sql
create table quotes (
  id                  uuid primary key default gen_random_uuid(),
  quote_number        text not null unique,   -- e.g. "QUO-001"
  client_id           uuid not null references clients(id) on delete cascade,
  carrier_id          uuid not null references carriers(id),
  line_of_business    text not null
                      check (line_of_business in ('auto','home','life','health','commercial','liability','umbrella','other')),
  status              text not null default 'draft'
                      check (status in ('draft','sent','accepted','rejected','expired','bound')),
  premium             numeric(12,2),
  coverage_limit      numeric(14,2),
  deductible          numeric(10,2),
  valid_until         date,
  notes               text,
  assigned_agent_id   uuid references profiles(id),
  created_by          uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger quotes_updated_at
  before update on quotes
  for each row execute procedure update_updated_at_column();
```

### Table: `claims`
```sql
create table claims (
  id                  uuid primary key default gen_random_uuid(),
  claim_number        text not null unique,   -- e.g. "CLM-001"
  policy_id           uuid not null references policies(id) on delete cascade,
  client_id           uuid not null references clients(id),
  carrier_id          uuid not null references carriers(id),
  status              text not null default 'open'
                      check (status in ('open','in_review','approved','denied','closed','pending_info')),
  incident_date       date not null,
  reported_date       date not null default current_date,
  description         text not null,
  claim_amount        numeric(12,2),
  settled_amount      numeric(12,2),
  adjuster_name       text,
  adjuster_phone      text,
  notes               text,
  assigned_agent_id   uuid references profiles(id),
  created_by          uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger claims_updated_at
  before update on claims
  for each row execute procedure update_updated_at_column();
```

### Table: `commissions`
```sql
create table commissions (
  id                  uuid primary key default gen_random_uuid(),
  policy_id           uuid references policies(id) on delete set null,
  carrier_id          uuid not null references carriers(id),
  agent_id            uuid not null references profiles(id),
  type                text not null default 'new_business'
                      check (type in ('new_business','renewal','bonus','adjustment')),
  status              text not null default 'pending'
                      check (status in ('pending','paid','voided')),
  commission_rate     numeric(5,2),            -- percentage e.g. 12.50
  gross_premium       numeric(12,2) not null,
  commission_amount   numeric(12,2) not null,
  paid_date           date,
  payment_reference   text,
  notes               text,
  created_by          uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger commissions_updated_at
  before update on commissions
  for each row execute procedure update_updated_at_column();
```

### Table: `documents`
```sql
create table documents (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  type                text not null
                      check (type in ('policy','certificate','claim','quote','application','correspondence','other')),
  file_url            text not null,
  file_size           bigint,
  mime_type           text,
  client_id           uuid references clients(id) on delete cascade,
  policy_id           uuid references policies(id) on delete set null,
  claim_id            uuid references claims(id) on delete set null,
  quote_id            uuid references quotes(id) on delete set null,
  version             integer not null default 1,
  tags                text[],
  uploaded_by         uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger documents_updated_at
  before update on documents
  for each row execute procedure update_updated_at_column();
```

### Table: `tasks`
```sql
create table tasks (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  description         text,
  type                text not null default 'follow_up'
                      check (type in ('follow_up','renewal','payment','claim','meeting','call','other')),
  priority            text not null default 'medium'
                      check (priority in ('low','medium','high','urgent')),
  status              text not null default 'open'
                      check (status in ('open','in_progress','completed','cancelled')),
  due_date            timestamptz,
  client_id           uuid references clients(id) on delete cascade,
  policy_id           uuid references policies(id) on delete set null,
  assigned_to         uuid references profiles(id),
  created_by          uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger tasks_updated_at
  before update on tasks
  for each row execute procedure update_updated_at_column();
```

### Table: `leads`
```sql
create table leads (
  id                  uuid primary key default gen_random_uuid(),
  lead_id             text not null unique,   -- e.g. "LED-001"
  first_name          text not null,
  last_name           text not null,
  email               text,
  phone               text,
  source              text
                      check (source in ('referral','website','cold_call','social_media','event','other')),
  stage               text not null default 'new'
                      check (stage in ('new','contacted','qualified','proposal','negotiation','won','lost')),
  interested_in       text[],                 -- lines of business interested in
  estimated_premium   numeric(12,2),
  notes               text,
  assigned_agent_id   uuid references profiles(id),
  converted_client_id uuid references clients(id),
  created_by          uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger leads_updated_at
  before update on leads
  for each row execute procedure update_updated_at_column();
```

### Table: `certificates`
```sql
create table certificates (
  id                  uuid primary key default gen_random_uuid(),
  certificate_number  text not null unique,   -- e.g. "CERT-001"
  policy_id           uuid not null references policies(id) on delete cascade,
  client_id           uuid not null references clients(id),
  holder_name         text not null,
  holder_address      text,
  issued_date         date not null default current_date,
  expiry_date         date,
  file_url            text,
  status              text not null default 'active'
                      check (status in ('active','expired','revoked')),
  created_by          uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger certificates_updated_at
  before update on certificates
  for each row execute procedure update_updated_at_column();
```

### Table: `activities`
```sql
create table activities (
  id                  uuid primary key default gen_random_uuid(),
  type                text not null
                      check (type in ('note','call','email','meeting','status_change','document_upload','system')),
  description         text not null,
  client_id           uuid references clients(id) on delete cascade,
  policy_id           uuid references policies(id) on delete set null,
  claim_id            uuid references claims(id) on delete set null,
  lead_id             uuid references leads(id) on delete set null,
  performed_by        uuid references profiles(id),
  created_at          timestamptz not null default now()
);
```

### Table: `renewals`
```sql
create table renewals (
  id                  uuid primary key default gen_random_uuid(),
  policy_id           uuid not null references policies(id) on delete cascade,
  client_id           uuid not null references clients(id),
  renewal_date        date not null,
  status              text not null default 'upcoming'
                      check (status in ('upcoming','notified','renewed','non_renewed','lapsed')),
  reminder_sent_at    timestamptz,
  notes               text,
  assigned_agent_id   uuid references profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger renewals_updated_at
  before update on renewals
  for each row execute procedure update_updated_at_column();
```

### Table: `notifications`
```sql
create table notifications (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references profiles(id) on delete cascade,
  title               text not null,
  message             text not null,
  type                text not null default 'info'
                      check (type in ('info','warning','success','error','renewal','task','claim')),
  read                boolean not null default false,
  link                text,
  created_at          timestamptz not null default now()
);
```

### Table: `audit_logs`
```sql
create table audit_logs (
  id                  uuid primary key default gen_random_uuid(),
  table_name          text not null,
  record_id           uuid not null,
  action              text not null check (action in ('insert','update','delete')),
  old_data            jsonb,
  new_data            jsonb,
  performed_by        uuid references profiles(id),
  ip_address          text,
  created_at          timestamptz not null default now()
);
```

### RLS Policies

```sql
-- profiles
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Authenticated users can view all profiles"
  on profiles for select using (auth.role() = 'authenticated');

-- agencies
alter table agencies enable row level security;
create policy "Authenticated users can manage agencies"
  on agencies for all using (auth.role() = 'authenticated');

-- clients
alter table clients enable row level security;
create policy "Authenticated users can view clients"
  on clients for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert clients"
  on clients for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update clients"
  on clients for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete clients"
  on clients for delete using (auth.role() = 'authenticated');

-- carriers
alter table carriers enable row level security;
create policy "Authenticated users can manage carriers"
  on carriers for all using (auth.role() = 'authenticated');

-- policies
alter table policies enable row level security;
create policy "Authenticated users can manage policies"
  on policies for all using (auth.role() = 'authenticated');

-- quotes
alter table quotes enable row level security;
create policy "Authenticated users can manage quotes"
  on quotes for all using (auth.role() = 'authenticated');

-- claims
alter table claims enable row level security;
create policy "Authenticated users can manage claims"
  on claims for all using (auth.role() = 'authenticated');

-- commissions
alter table commissions enable row level security;
create policy "Authenticated users can manage commissions"
  on commissions for all using (auth.role() = 'authenticated');

-- documents
alter table documents enable row level security;
create policy "Authenticated users can manage documents"
  on documents for all using (auth.role() = 'authenticated');

-- tasks
alter table tasks enable row level security;
create policy "Authenticated users can manage tasks"
  on tasks for all using (auth.role() = 'authenticated');

-- leads
alter table leads enable row level security;
create policy "Authenticated users can manage leads"
  on leads for all using (auth.role() = 'authenticated');

-- certificates
alter table certificates enable row level security;
create policy "Authenticated users can manage certificates"
  on certificates for all using (auth.role() = 'authenticated');

-- activities
alter table activities enable row level security;
create policy "Authenticated users can manage activities"
  on activities for all using (auth.role() = 'authenticated');

-- renewals
alter table renewals enable row level security;
create policy "Authenticated users can manage renewals"
  on renewals for all using (auth.role() = 'authenticated');

-- notifications
alter table notifications enable row level security;
create policy "Users can view own notifications"
  on notifications for select using (auth.uid() = user_id);
create policy "Authenticated users can insert notifications"
  on notifications for insert with check (auth.role() = 'authenticated');
create policy "Users can update own notifications"
  on notifications for update using (auth.uid() = user_id);

-- audit_logs
alter table audit_logs enable row level security;
create policy "Authenticated users can view audit logs"
  on audit_logs for select using (auth.role() = 'authenticated');
create policy "System can insert audit logs"
  on audit_logs for insert with check (auth.role() = 'authenticated');
```

### Seed Data

```sql
-- Insert 3 carriers
insert into carriers (name, code, contact_email, lines_of_business, status) values
('State Farm Insurance',    'STATE-FARM',  'agency@statefarm.com',    ARRAY['auto','home','life'],       'active'),
('Progressive Insurance',   'PROGRESSIVE', 'agency@progressive.com',  ARRAY['auto','commercial'],        'active'),
('Allstate Insurance',      'ALLSTATE',    'agency@allstate.com',     ARRAY['auto','home','life','umbrella'], 'active');

-- Insert 1 agency
insert into agencies (name, address, city, state, zip, phone, email) values
('Apex Insurance Agency', '123 Commerce Blvd', 'Ahmedabad', 'Gujarat', '380001', '9876500001', 'info@apexinsurance.com');

-- Insert 8 sample clients
insert into clients (
  client_id, type, first_name, last_name, email, phone,
  date_of_birth, city, state, status
) values
('CLT-001', 'individual', 'Aarav',   'Shah',    'aarav.shah@email.com',    '9876543201', '1985-04-12', 'Ahmedabad', 'Gujarat', 'active'),
('CLT-002', 'individual', 'Diya',    'Patel',   'diya.patel@email.com',    '9876543202', '1990-07-22', 'Surat',     'Gujarat', 'active'),
('CLT-003', 'business',   null,      null,      'rohan.corp@email.com',    '9876543203', null,         'Vadodara',  'Gujarat', 'active'),
('CLT-004', 'individual', 'Priya',   'Joshi',   'priya.joshi@email.com',   '9876543204', '1978-11-05', 'Rajkot',    'Gujarat', 'active'),
('CLT-005', 'individual', 'Arjun',   'Singh',   'arjun.singh@email.com',   '9876543205', '1992-03-30', 'Ahmedabad', 'Gujarat', 'prospect'),
('CLT-006', 'business',   null,      null,      'kavya.enterprises@email.com','9876543206',null,        'Surat',     'Gujarat', 'active'),
('CLT-007', 'individual', 'Vivaan',  'Gupta',   'vivaan.gupta@email.com',  '9876543207', '1999-08-18', 'Gandhinagar','Gujarat','active'),
('CLT-008', 'individual', 'Ananya',  'Sharma',  'ananya.sharma@email.com', '9876543208', '1988-12-01', 'Ahmedabad', 'Gujarat', 'inactive');

-- Insert sample leads
insert into leads (
  lead_id, first_name, last_name, email, phone, source, stage, interested_in
) values
('LED-001', 'Ishaan',  'Verma',  'ishaan.verma@email.com',  '9876543211', 'referral',    'new',        ARRAY['auto','home']),
('LED-002', 'Riya',    'Desai',  'riya.desai@email.com',    '9876543212', 'website',     'contacted',  ARRAY['life']),
('LED-003', 'Raj',     'Mehta',  'raj.mehta@email.com',     '9876543213', 'cold_call',   'qualified',  ARRAY['commercial']),
('LED-004', 'Sneha',   'Nair',   'sneha.nair@email.com',    '9876543214', 'social_media','proposal',   ARRAY['auto']);
```

---

## ⚡ STEP 0C — PROJECT SETUP

### Scaffold + Install
```bash
# Repo already cloned in STEP 0A — just enter the directory
cd insurance-agency-platform

# Core dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react clsx tailwind-merge sonner date-fns
npm install recharts
npm install @radix-ui/react-tabs

# shadcn UI
npx shadcn@latest init
npx shadcn@latest add button input label form card dialog select textarea badge avatar dropdown-menu sheet separator skeleton toast table tabs progress calendar popover

# Testing
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# E2E Testing
npm install -D @playwright/test
npx playwright install chromium
```

### Create `.mcp.json` (Next.js DevTools MCP)
```json
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    }
  }
}
```

### Create `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=paste_from_supabase_mcp
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_from_supabase_mcp
SUPABASE_SERVICE_ROLE_KEY=paste_from_supabase_mcp
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ Only manual step: paste the 3 keys Supabase MCP gave you above.

### Commit scaffold to GitHub
```bash
git add .
git commit -m "init: scaffold Next.js 15 + all dependencies"
git push origin main
```

---

## 📁 FOLDER STRUCTURE

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                    ← sidebar + header
│   │   ├── dashboard/
│   │   │   └── page.tsx                  ← stats + activity
│   │   ├── clients/
│   │   │   ├── page.tsx                  ← client list
│   │   │   ├── add/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx              ← client detail
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── policies/
│   │   │   ├── page.tsx
│   │   │   ├── add/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── quotes/
│   │   │   ├── page.tsx
│   │   │   ├── add/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── claims/
│   │   │   ├── page.tsx
│   │   │   ├── add/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── commissions/
│   │   │   └── page.tsx
│   │   ├── documents/
│   │   │   └── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   ├── leads/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── certificates/
│   │   │   ├── page.tsx
│   │   │   └── add/
│   │   │       └── page.tsx
│   │   └── reports/
│   │       └── page.tsx
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   └── layout.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ForgotPasswordForm.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MobileDrawer.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── RecentActivity.tsx
│   │   └── RenewalAlerts.tsx
│   ├── clients/
│   │   ├── ClientTable.tsx
│   │   ├── ClientCard.tsx
│   │   ├── ClientForm.tsx
│   │   ├── ClientDetail.tsx
│   │   ├── ClientFilters.tsx
│   │   ├── ClientStatusBadge.tsx
│   │   └── DeleteClientDialog.tsx
│   ├── policies/
│   │   ├── PolicyTable.tsx
│   │   ├── PolicyCard.tsx
│   │   ├── PolicyForm.tsx
│   │   ├── PolicyDetail.tsx
│   │   ├── PolicyFilters.tsx
│   │   ├── PolicyStatusBadge.tsx
│   │   └── DeletePolicyDialog.tsx
│   ├── quotes/
│   │   ├── QuoteTable.tsx
│   │   ├── QuoteCard.tsx
│   │   ├── QuoteForm.tsx
│   │   ├── QuoteDetail.tsx
│   │   └── QuoteStatusBadge.tsx
│   ├── claims/
│   │   ├── ClaimTable.tsx
│   │   ├── ClaimCard.tsx
│   │   ├── ClaimForm.tsx
│   │   ├── ClaimDetail.tsx
│   │   └── ClaimStatusBadge.tsx
│   ├── commissions/
│   │   ├── CommissionTable.tsx
│   │   ├── CommissionSummaryCards.tsx
│   │   └── CommissionStatusBadge.tsx
│   ├── documents/
│   │   ├── DocumentList.tsx
│   │   ├── DocumentUploadDialog.tsx
│   │   └── DocumentTypeBadge.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskPriorityBadge.tsx
│   ├── leads/
│   │   ├── LeadPipeline.tsx
│   │   ├── LeadTable.tsx
│   │   ├── LeadCard.tsx
│   │   ├── LeadForm.tsx
│   │   └── LeadStageBadge.tsx
│   ├── certificates/
│   │   ├── CertificateTable.tsx
│   │   ├── CertificateForm.tsx
│   │   └── CertificatePreview.tsx
│   └── reports/
│       ├── RevenueChart.tsx
│       ├── PolicyLineChart.tsx
│       └── CommissionReport.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── validations/
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── policy.ts
│   │   ├── quote.ts
│   │   ├── claim.ts
│   │   ├── commission.ts
│   │   ├── lead.ts
│   │   └── certificate.ts
│   └── utils.ts
├── actions/
│   ├── auth.ts
│   ├── clients.ts
│   ├── policies.ts
│   ├── quotes.ts
│   ├── claims.ts
│   ├── commissions.ts
│   ├── documents.ts
│   ├── tasks.ts
│   ├── leads.ts
│   ├── certificates.ts
│   └── reports.ts
└── types/
    └── index.ts
```

---

## 🔷 TYPESCRIPT TYPES — `src/types/index.ts`

```typescript
export type UserRole = 'admin' | 'agent' | 'manager' | 'accountant'
export type ClientType = 'individual' | 'business'
export type ClientStatus = 'active' | 'inactive' | 'prospect'
export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'pending' | 'renewed'
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'bound'
export type ClaimStatus = 'open' | 'in_review' | 'approved' | 'denied' | 'closed' | 'pending_info'
export type CommissionStatus = 'pending' | 'paid' | 'voided'
export type CommissionType = 'new_business' | 'renewal' | 'bonus' | 'adjustment'
export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type LeadSource = 'referral' | 'website' | 'cold_call' | 'social_media' | 'event' | 'other'
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskType = 'follow_up' | 'renewal' | 'payment' | 'claim' | 'meeting' | 'call' | 'other'
export type DocumentType = 'policy' | 'certificate' | 'claim' | 'quote' | 'application' | 'correspondence' | 'other'
export type CertificateStatus = 'active' | 'expired' | 'revoked'
export type RenewalStatus = 'upcoming' | 'notified' | 'renewed' | 'non_renewed' | 'lapsed'

export const LINES_OF_BUSINESS = [
  'auto', 'home', 'life', 'health', 'commercial', 'liability', 'umbrella', 'other'
] as const
export type LineOfBusiness = typeof LINES_OF_BUSINESS[number]

export interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  role: UserRole
  agency_id: string | null
  created_at: string
  updated_at: string
}

export interface Agency {
  id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  phone: string | null
  email: string | null
  website: string | null
  license_no: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  client_id: string
  type: ClientType
  first_name: string | null
  last_name: string | null
  business_name: string | null
  email: string
  phone: string | null
  date_of_birth: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  status: ClientStatus
  assigned_agent_id: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Carrier {
  id: string
  name: string
  code: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  website: string | null
  lines_of_business: string[]
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Policy {
  id: string
  policy_number: string
  client_id: string
  carrier_id: string
  line_of_business: LineOfBusiness
  status: PolicyStatus
  effective_date: string
  expiration_date: string
  premium: number
  coverage_limit: number | null
  deductible: number | null
  description: string | null
  assigned_agent_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Quote {
  id: string
  quote_number: string
  client_id: string
  carrier_id: string
  line_of_business: LineOfBusiness
  status: QuoteStatus
  premium: number | null
  coverage_limit: number | null
  deductible: number | null
  valid_until: string | null
  notes: string | null
  assigned_agent_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Claim {
  id: string
  claim_number: string
  policy_id: string
  client_id: string
  carrier_id: string
  status: ClaimStatus
  incident_date: string
  reported_date: string
  description: string
  claim_amount: number | null
  settled_amount: number | null
  adjuster_name: string | null
  adjuster_phone: string | null
  notes: string | null
  assigned_agent_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Commission {
  id: string
  policy_id: string | null
  carrier_id: string
  agent_id: string
  type: CommissionType
  status: CommissionStatus
  commission_rate: number | null
  gross_premium: number
  commission_amount: number
  paid_date: string | null
  payment_reference: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  name: string
  type: DocumentType
  file_url: string
  file_size: number | null
  mime_type: string | null
  client_id: string | null
  policy_id: string | null
  claim_id: string | null
  quote_id: string | null
  version: number
  tags: string[]
  uploaded_by: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  due_date: string | null
  client_id: string | null
  policy_id: string | null
  assigned_to: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  lead_id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  source: LeadSource | null
  stage: LeadStage
  interested_in: string[]
  estimated_premium: number | null
  notes: string | null
  assigned_agent_id: string | null
  converted_client_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  certificate_number: string
  policy_id: string
  client_id: string
  holder_name: string
  holder_address: string | null
  issued_date: string
  expiry_date: string | null
  file_url: string | null
  status: CertificateStatus
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Renewal {
  id: string
  policy_id: string
  client_id: string
  renewal_date: string
  status: RenewalStatus
  reminder_sent_at: string | null
  notes: string | null
  assigned_agent_id: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error' | 'renewal' | 'task' | 'claim'
  read: boolean
  link: string | null
  created_at: string
}

export interface DashboardStats {
  totalClients: number
  activePolicies: number
  openClaims: number
  pendingCommissions: number
  openTasks: number
  activeLeads: number
  upcomingRenewals: number
  monthlyRevenue: number
}

export interface ClientFilters {
  search: string
  type: ClientType | 'all'
  status: ClientStatus | 'all'
}

export interface PolicyFilters {
  search: string
  status: PolicyStatus | 'all'
  line_of_business: LineOfBusiness | 'all'
  carrier_id: string | 'all'
}
```

---

## ✅ STEP 1 — SUPABASE CLIENTS + MIDDLEWARE

### `src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### `src/lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
```

### `src/middleware.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/auth/callback']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isPublicRoute = PUBLIC_ROUTES.some(r =>
    request.nextUrl.pathname.startsWith(r))

  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && (request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/register' ||
    request.nextUrl.pathname === '/forgot-password' ||
    request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

---

## 🔐 STEP 2 — VALIDATION SCHEMAS

### `src/lib/validations/auth.ts`
```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
```

### `src/lib/validations/client.ts`
```typescript
import { z } from 'zod'

export const clientSchema = z.object({
  type: z.enum(['individual', 'business']).default('individual'),
  first_name: z.string().min(1, 'First name is required').max(50).optional().or(z.literal('')),
  last_name: z.string().min(1, 'Last name is required').max(50).optional().or(z.literal('')),
  business_name: z.string().max(150).optional().or(z.literal('')),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number').optional().or(z.literal('')),
  date_of_birth: z.string().optional(),
  address: z.string().max(300).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  state: z.string().max(100).optional().or(z.literal('')),
  zip: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'prospect']).default('active'),
  notes: z.string().max(500).optional().or(z.literal('')),
})

export type ClientInput = z.infer<typeof clientSchema>
```

### `src/lib/validations/policy.ts`
```typescript
import { z } from 'zod'

export const policySchema = z.object({
  client_id: z.string().uuid('Select a client'),
  carrier_id: z.string().uuid('Select a carrier'),
  line_of_business: z.enum(['auto','home','life','health','commercial','liability','umbrella','other']),
  status: z.enum(['active','expired','cancelled','pending','renewed']).default('active'),
  effective_date: z.string().min(1, 'Effective date is required'),
  expiration_date: z.string().min(1, 'Expiration date is required'),
  premium: z.number().positive('Premium must be positive'),
  coverage_limit: z.number().positive().optional().nullable(),
  deductible: z.number().nonnegative().optional().nullable(),
  description: z.string().max(500).optional().or(z.literal('')),
})

export type PolicyInput = z.infer<typeof policySchema>
```

### `src/lib/validations/quote.ts`
```typescript
import { z } from 'zod'

export const quoteSchema = z.object({
  client_id: z.string().uuid('Select a client'),
  carrier_id: z.string().uuid('Select a carrier'),
  line_of_business: z.enum(['auto','home','life','health','commercial','liability','umbrella','other']),
  status: z.enum(['draft','sent','accepted','rejected','expired','bound']).default('draft'),
  premium: z.number().positive().optional().nullable(),
  coverage_limit: z.number().positive().optional().nullable(),
  deductible: z.number().nonnegative().optional().nullable(),
  valid_until: z.string().optional(),
  notes: z.string().max(500).optional().or(z.literal('')),
})

export type QuoteInput = z.infer<typeof quoteSchema>
```

### `src/lib/validations/claim.ts`
```typescript
import { z } from 'zod'

export const claimSchema = z.object({
  policy_id: z.string().uuid('Select a policy'),
  client_id: z.string().uuid('Client is required'),
  carrier_id: z.string().uuid('Carrier is required'),
  status: z.enum(['open','in_review','approved','denied','closed','pending_info']).default('open'),
  incident_date: z.string().min(1, 'Incident date is required'),
  reported_date: z.string().min(1, 'Reported date is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  claim_amount: z.number().positive().optional().nullable(),
  settled_amount: z.number().nonnegative().optional().nullable(),
  adjuster_name: z.string().max(100).optional().or(z.literal('')),
  adjuster_phone: z.string().max(20).optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
})

export type ClaimInput = z.infer<typeof claimSchema>
```

---

## 🔐 STEP 3 — AUTH PAGES

### Auth Layout — `src/app/(auth)/layout.tsx`
Centered card layout. Background: gradient from `blue-50` to `indigo-100`.
Insurance Agency System logo (🏢) + tagline centered above the card.

### Login Page — `src/app/(auth)/login/page.tsx`
Fields:
- Email (type email)
- Password (type password, show/hide toggle)
- Sign In button (full width, loading state)
- Link to /forgot-password: "Forgot your password?"
- Link to /register: "Don't have an account? Register"

Server action (`src/actions/auth.ts → loginAction`):
1. Validate with loginSchema
2. `supabase.auth.signInWithPassword()`
3. On success → redirect('/dashboard')
4. On error → return `{ error: 'Invalid email or password' }`

### Register Page — `src/app/(auth)/register/page.tsx`
Fields:
- Full Name
- Email
- Password (with strength indicator)
- Confirm Password
- Create Account button (full width, loading state)
- Link to /login: "Already have an account? Sign In"

Server action (`src/actions/auth.ts → registerAction`):
1. Validate with registerSchema
2. `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`
3. Profile auto-created via DB trigger
4. On success → redirect('/dashboard')
5. On error → return `{ error: 'Email already registered' }`

### Forgot Password Page — `src/app/(auth)/forgot-password/page.tsx`
Two UI states:
- **Default**: Show email form
- **Sent**: "Check your email — a reset link has been sent to [email]"

Server action (`src/actions/auth.ts → forgotPasswordAction`):
1. Validate with forgotPasswordSchema
2. `supabase.auth.resetPasswordForEmail(email, { redirectTo: ... })`
3. Always show success state (don't reveal if email exists)

### Auth Callback — `src/app/auth/callback/route.ts`
Standard Supabase callback handler for email confirmation and password reset.

### Sign Out Action
```typescript
export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

---

## 🏠 STEP 4 — APP LAYOUT

### `src/app/(dashboard)/layout.tsx`
- Desktop: fixed sidebar (260px) + main content area
- Mobile: hidden sidebar + hamburger → Sheet drawer

### `src/components/layout/Sidebar.tsx`
```
Logo: 🏢 Insurance Agency System (blue-700)

Navigation:
  📊 Dashboard         → /dashboard
  👥 Clients           → /clients
  📋 Policies          → /policies
  💬 Quotes            → /quotes
  🚨 Claims            → /claims
  💰 Commissions       → /commissions
  📄 Documents         → /documents
  ✅ Tasks             → /tasks
  🎯 Leads             → /leads
  📜 Certificates      → /certificates
  📈 Reports           → /reports

Bottom:
  User avatar + name + email
  Sign Out button
```

Sidebar colors:
- Background: `white`
- Active item: `bg-blue-50 text-blue-700`
- Hover: `hover:bg-gray-50`
- Border right: `border-r border-gray-200`

### `src/components/layout/Header.tsx`
- Mobile: hamburger menu button + "Insurance Agency System" title
- Desktop: Page title (dynamic) + notification bell + User avatar dropdown
- Avatar dropdown: Profile info + Sign Out button

---

## 📊 STEP 5 — DASHBOARD PAGE

### `src/app/(dashboard)/dashboard/page.tsx`

Stats cards row (4 cards top, 4 cards second row):
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Total       │ │ Active      │ │ Open        │ │ Pending     │
│ Clients     │ │ Policies    │ │ Claims      │ │ Commission  │
│    8        │ │    —        │ │    —        │ │   ₹ —       │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Open Tasks  │ │ Active      │ │ Upcoming    │ │ Leads in    │
│             │ │ Leads       │ │ Renewals    │ │ Pipeline    │
│    —        │ │    4        │ │    —        │ │    4        │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

Below stats:
- "Recent Clients" — last 5 added clients
- "Renewal Alerts" — policies expiring within 30 days
- "Open Tasks" — top 5 urgent tasks

Fetch all stats server-side. Show loading skeleton while fetching.

---

## 👥 STEP 6 — CLIENT MODULE

### `src/app/(dashboard)/clients/page.tsx`

#### Header Row
```
Clients                                [+ Add Client]
```

#### Filters Row
```
[🔍 Search by name, email, ID...]  [Type ▼]  [Status ▼]
```

#### Desktop — Table View (`md+`)
```
┌──────────┬──────────────────┬───────────────┬────────────┬────────────┬──────────┐
│ CLT ID   │ Name/Business    │ Email         │ Type       │ Status     │ Actions  │
├──────────┼──────────────────┼───────────────┼────────────┼────────────┼──────────┤
│ CLT-001  │ Aarav Shah       │ aarav@...     │ Individual │ Active     │ 👁 ✏ 🗑  │
│ CLT-003  │ Rohan Corp       │ rohan@...     │ Business   │ Active     │ 👁 ✏ 🗑  │
└──────────┴──────────────────┴───────────────┴────────────┴────────────┴──────────┘
```

#### Mobile — Card View (`< md`)
```
┌──────────────────────────────────┐
│ Aarav Shah              CLT-001  │
│ aarav@email.com                  │
│ Individual  •  Ahmedabad         │
│ [Active]         [View][Edit][Del│
└──────────────────────────────────┘
```

#### Status Badge Colors
```
active    → green badge
inactive  → gray badge
prospect  → blue badge
```

#### Add/Edit Client Form Sections:
**Section 1: Client Type** — Individual / Business radio toggle
**Section 2: Personal / Business Info** — Name fields (or business name), Email*, Phone
**Section 3: Address** — Address, City, State, ZIP
**Section 4: Additional** — Date of Birth, Status, Notes

Server action (`src/actions/clients.ts → addClientAction`):
1. Validate with clientSchema
2. Auto-generate client_id: `CLT-${String(count + 1).padStart(3, '0')}`
3. Insert into clients table
4. On success → redirect('/clients') + toast "Client added successfully"

#### Client Detail Page — `src/app/(dashboard)/clients/[id]/page.tsx`
Shows: Client info cards + linked Policies + active Claims + Documents + Activity log.

---

## 📋 STEP 7 — POLICY MODULE

### `src/app/(dashboard)/policies/page.tsx`

#### Header Row
```
Policies                               [+ Add Policy]
```

#### Filters Row
```
[🔍 Search by policy number, client...]  [Status ▼]  [Line of Business ▼]  [Carrier ▼]
```

#### Desktop Table
```
┌──────────┬──────────────┬───────────────┬──────────────┬────────────┬─────────────┬──────────┐
│ Pol. No  │ Client       │ Carrier       │ Line         │ Premium    │ Expires     │ Status   │
├──────────┼──────────────┼───────────────┼──────────────┼────────────┼─────────────┼──────────┤
│ POL-001  │ Aarav Shah   │ State Farm    │ Auto         │ ₹12,500    │ 31 Mar 2027 │ Active   │
└──────────┴──────────────┴───────────────┴──────────────┴────────────┴─────────────┴──────────┘
```

#### Status Badge Colors
```
active    → green
expired   → red
cancelled → gray
pending   → yellow
renewed   → blue
```

#### Add Policy Form Sections:
**Section 1: Client & Carrier** — Client (searchable select), Carrier (select)
**Section 2: Coverage** — Line of Business, Status, Effective Date, Expiration Date
**Section 3: Financial** — Premium*, Coverage Limit, Deductible
**Section 4: Additional** — Description/Notes

Server action (`src/actions/policies.ts → addPolicyAction`):
1. Validate with policySchema
2. Auto-generate policy_number: `POL-${String(count + 1).padStart(3, '0')}`
3. Insert into policies table
4. Auto-create a renewal record for 30 days before expiration_date
5. On success → redirect('/policies') + toast "Policy added successfully"

---

## 💬 STEP 8 — QUOTE MODULE

### `src/app/(dashboard)/quotes/page.tsx`

#### Header Row
```
Quotes                                 [+ New Quote]
```

#### Desktop Table
```
┌──────────┬──────────────┬───────────────┬────────────┬────────────┬──────────────┬──────────┐
│ Quote No │ Client       │ Carrier       │ Line       │ Premium    │ Valid Until  │ Status   │
└──────────┴──────────────┴───────────────┴────────────┴────────────┴──────────────┴──────────┘
```

#### Status Badge Colors
```
draft     → gray
sent      → blue
accepted  → green
rejected  → red
expired   → orange
bound     → purple
```

#### Add Quote Form:
Same fields as Policy form with Valid Until date. Status starts as 'draft'.

#### Quote Detail Page Actions:
- "Mark as Sent" button → update status to sent
- "Bind Policy" button (when accepted) → creates a new Policy from quote data
- "Reject" button → status rejected

---

## 🚨 STEP 9 — CLAIMS MODULE

### `src/app/(dashboard)/claims/page.tsx`

#### Header Row
```
Claims                                 [+ File Claim]
```

#### Desktop Table
```
┌──────────┬──────────────┬───────────────┬────────────────┬──────────────┬──────────────┐
│ Claim No │ Client       │ Policy No     │ Incident Date  │ Claim Amount │ Status       │
└──────────┴──────────────┴───────────────┴────────────────┴──────────────┴──────────────┘
```

#### Status Badge Colors
```
open         → blue
in_review    → yellow
approved     → green
denied       → red
closed       → gray
pending_info → orange
```

#### Add Claim Form Sections:
**Section 1: Policy & Client** — Policy (searchable select → auto-fills client & carrier)
**Section 2: Incident Details** — Incident Date*, Reported Date*, Description*
**Section 3: Financial** — Claim Amount, Settled Amount
**Section 4: Adjuster** — Adjuster Name, Adjuster Phone
**Section 5: Notes**

---

## 💰 STEP 10 — COMMISSION MODULE

### `src/app/(dashboard)/commissions/page.tsx`

#### Summary Cards
```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Total Commissions│ │ Paid             │ │ Pending          │
│   ₹ —           │ │   ₹ —           │ │   ₹ —           │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

#### Desktop Table
```
┌────────────┬───────────────┬────────────┬──────────────┬────────────┬──────────┐
│ Agent      │ Carrier       │ Type       │ Gross Prem.  │ Commission │ Status   │
└────────────┴───────────────┴────────────┴──────────────┴────────────┴──────────┘
```

#### Status Badge Colors
```
pending → yellow
paid    → green
voided  → gray
```

Commissions are auto-created when a new Policy is added (default: 10% of premium, status: pending).
Agent can mark commission as "Paid" with a payment reference.

---

## 📄 STEP 11 — DOCUMENT MODULE

### `src/app/(dashboard)/documents/page.tsx`

#### Header Row
```
Documents                              [+ Upload Document]
```

#### Filters
```
[🔍 Search by name, tags...]  [Type ▼]  [Client ▼]
```

#### Document List (grid cards)
```
┌──────────────────┐ ┌──────────────────┐
│ 📄 Policy Doc    │ │ 📋 Certificate   │
│ CLT-001 Aarav    │ │ CLT-002 Diya     │
│ 2.3 MB  PDF      │ │ 0.8 MB  PDF      │
│ [Download][Del]  │ │ [Download][Del]  │
└──────────────────┘ └──────────────────┘
```

#### Upload Dialog — `DocumentUploadDialog.tsx`
Fields: Document Name, Type (select), Client (optional), Policy/Claim/Quote link (optional), Tags (comma separated), File input.

Documents stored in Supabase Storage bucket `documents`.
File URL saved to documents table.

---

## ✅ STEP 12 — TASK MODULE

### `src/app/(dashboard)/tasks/page.tsx`

#### Header Row
```
Tasks                                  [+ Add Task]
```

#### Filter Tabs
```
[All] [Open] [In Progress] [Completed] [Overdue]
```

#### Task List (card per task)
```
┌───────────────────────────────────────────────────────────┐
│ 🔴 HIGH  Follow up with Aarav Shah re: renewal            │
│ Due: 15 Mar 2026  •  Client: CLT-001  •  Type: Renewal    │
│                                    [Complete] [Edit] [Del] │
└───────────────────────────────────────────────────────────┘
```

#### Priority Badge Colors
```
low    → gray
medium → blue
high   → orange
urgent → red
```

#### Add Task Form:
Title*, Type (select), Priority (select), Status, Due Date, Client (optional), Policy (optional), Description.

Overdue tasks (due_date < now and status = open/in_progress) shown with red border.

---

## 🎯 STEP 13 — LEAD MODULE

### `src/app/(dashboard)/leads/page.tsx`

#### Two Views — Toggle between Pipeline and Table

#### Pipeline View (Kanban-style columns):
```
┌──────────┐ ┌───────────┐ ┌───────────┐ ┌──────────┐ ┌─────────────┐ ┌─────┐ ┌─────┐
│  NEW (1) │ │CONTACTED  │ │QUALIFIED  │ │PROPOSAL  │ │NEGOTIATION  │ │ WON │ │LOST │
│          │ │    (1)    │ │    (1)    │ │   (1)    │ │     (0)     │ │ (0) │ │ (0) │
│ Ishaan   │ │  Riya     │ │   Raj     │ │  Sneha   │ │             │ │     │ │     │
│ Verma    │ │  Desai    │ │  Mehta    │ │  Nair    │ │             │ │     │ │     │
└──────────┘ └───────────┘ └───────────┘ └──────────┘ └─────────────┘ └─────┘ └─────┘
```

#### Lead Detail Page:
Shows lead info + "Convert to Client" button (creates client record, updates lead.converted_client_id, sets stage to 'won').

#### Lead Stage Badge Colors
```
new         → gray
contacted   → blue
qualified   → purple
proposal    → yellow
negotiation → orange
won         → green
lost        → red
```

---

## 📜 STEP 14 — CERTIFICATE MODULE

### `src/app/(dashboard)/certificates/page.tsx`

#### Header Row
```
Certificates of Insurance              [+ Generate Certificate]
```

#### Desktop Table
```
┌──────────┬──────────────┬──────────────┬──────────────┬────────────┬──────────┐
│ Cert No  │ Policy No    │ Holder Name  │ Issued Date  │ Expires    │ Status   │
└──────────┴──────────────┴──────────────┴──────────────┴────────────┴──────────┘
```

#### Generate Certificate Form:
Policy (select), Certificate Holder Name*, Holder Address, Issued Date (auto today), Expiry Date.

On create: auto-generate certificate_number `CERT-${padded}`, save to certificates table.

#### Certificate Preview:
Show a formatted certificate preview card with all policy details, carrier info, coverage limits, and effective dates.

---

## 📈 STEP 15 — REPORTS PAGE

### `src/app/(dashboard)/reports/page.tsx`

#### Tab Navigation
```
[Revenue Overview] [Policy Summary] [Commission Report] [Claims Analysis]
```

#### Revenue Overview Tab
- Monthly premium revenue bar chart (recharts BarChart)
- Total MRR, YTD Revenue, Active Policies cards

#### Policy Summary Tab
- Policies by line of business (recharts PieChart)
- Policies by carrier (recharts BarChart)
- Expiring in next 30/60/90 days table

#### Commission Report Tab
- Commissions by agent (recharts BarChart)
- Pending vs Paid totals
- Sortable commission table with export hint

#### Claims Analysis Tab
- Claims by status (recharts PieChart)
- Open vs Closed claims trend
- Total claimed vs total settled amounts

All charts use recharts. Data fetched server-side from Supabase.

---

## 🎨 DESIGN SYSTEM

### Colors
```
Primary:       blue-700   (#1D4ED8)
Primary Hover: blue-800
Success:       green-600
Warning:       yellow-600
Error:         red-600
Info:          blue-500
Background:    gray-50
Card:          white
Border:        gray-200
Text Primary:  gray-900
Text Muted:    gray-500
```

### Typography
```
App Name:    text-xl font-bold text-blue-700
Page Title:  text-2xl font-bold text-gray-900
Section:     text-lg font-semibold text-gray-800
Label:       text-sm font-medium text-gray-700
Body:        text-sm text-gray-600
Muted:       text-xs text-gray-500
```

### Components
```
Primary Button:   bg-blue-700 hover:bg-blue-800 text-white rounded-md px-4 py-2
Secondary Button: border border-gray-300 hover:bg-gray-50 rounded-md px-4 py-2
Danger Button:    bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2
Input:            border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500
Card:             bg-white rounded-lg border border-gray-200 shadow-sm p-6
Badge:            rounded-full px-2.5 py-0.5 text-xs font-medium
```

---

## 📱 RESPONSIVE DESIGN RULES

| Element | Mobile (< md) | Desktop (md+) |
|---|---|---|
| Sidebar | Hidden | Fixed 260px left |
| Header | Hamburger + title | Page title + notifications + avatar |
| Client/Policy list | Card list | Full table |
| Add/Edit forms | Single column | Two columns |
| Stats cards | 2×2 grid | 4 columns row |
| Detail page | Stacked cards | 2×2 grid |
| Lead pipeline | Horizontal scroll | Full kanban |
| Reports charts | Full width stacked | Side-by-side |
| All touch targets | Min 44px height | — |
| No horizontal scroll | ✅ | — |

---

## 🧪 STEP 16A — UNIT TESTS (Vitest)

### `src/tests/validations/auth.test.ts`
```typescript
import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, forgotPasswordSchema } from '@/lib/validations/auth'

describe('loginSchema', () => {
  it('✅ valid credentials pass', () => {
    expect(loginSchema.safeParse({ email: 'test@test.com', password: 'Pass1' }).success).toBe(true)
  })
  it('❌ empty email fails', () => {
    const r = loginSchema.safeParse({ email: '', password: 'Pass1' })
    expect(r.success).toBe(false)
    expect(r.error?.flatten().fieldErrors.email).toBeDefined()
  })
  it('❌ invalid email fails', () => {
    const r = loginSchema.safeParse({ email: 'notanemail', password: 'Pass1' })
    expect(r.success).toBe(false)
  })
  it('❌ empty password fails', () => {
    const r = loginSchema.safeParse({ email: 'test@test.com', password: '' })
    expect(r.success).toBe(false)
    expect(r.error?.flatten().fieldErrors.password).toBeDefined()
  })
})

describe('registerSchema', () => {
  const valid = {
    full_name: 'John Doe',
    email: 'john@test.com',
    password: 'Password1',
    confirm_password: 'Password1',
  }
  it('✅ valid data passes', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })
  it('❌ password mismatch fails', () => {
    const r = registerSchema.safeParse({ ...valid, confirm_password: 'Wrong1' })
    expect(r.success).toBe(false)
  })
  it('❌ password too short fails', () => {
    const r = registerSchema.safeParse({ ...valid, password: 'Pass1', confirm_password: 'Pass1' })
    expect(r.success).toBe(false)
  })
  it('❌ no uppercase in password fails', () => {
    const r = registerSchema.safeParse({ ...valid, password: 'password1', confirm_password: 'password1' })
    expect(r.success).toBe(false)
  })
})

describe('forgotPasswordSchema', () => {
  it('✅ valid email passes', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'test@test.com' }).success).toBe(true)
  })
  it('❌ invalid email fails', () => {
    const r = forgotPasswordSchema.safeParse({ email: 'notanemail' })
    expect(r.success).toBe(false)
  })
  it('❌ empty email fails', () => {
    const r = forgotPasswordSchema.safeParse({ email: '' })
    expect(r.success).toBe(false)
  })
})
```

### `src/tests/validations/client.test.ts`
```typescript
import { describe, it, expect } from 'vitest'
import { clientSchema } from '@/lib/validations/client'

const validClient = {
  type: 'individual' as const,
  first_name: 'Aarav',
  last_name: 'Shah',
  email: 'aarav@test.com',
  status: 'active' as const,
}

describe('clientSchema', () => {
  it('✅ valid individual passes', () => {
    expect(clientSchema.safeParse(validClient).success).toBe(true)
  })
  it('❌ invalid email fails', () => {
    const r = clientSchema.safeParse({ ...validClient, email: 'bademail' })
    expect(r.success).toBe(false)
  })
  it('❌ invalid phone fails', () => {
    const r = clientSchema.safeParse({ ...validClient, phone: '1234' })
    expect(r.success).toBe(false)
  })
  it('✅ valid phone passes', () => {
    const r = clientSchema.safeParse({ ...validClient, phone: '9876543210' })
    expect(r.success).toBe(true)
  })
  it('❌ invalid zip fails', () => {
    const r = clientSchema.safeParse({ ...validClient, zip: '123' })
    expect(r.success).toBe(false)
  })
  it('✅ business type with business_name passes', () => {
    const r = clientSchema.safeParse({ ...validClient, type: 'business', business_name: 'Acme Corp' })
    expect(r.success).toBe(true)
  })
})
```

### `src/tests/validations/policy.test.ts`
```typescript
import { describe, it, expect } from 'vitest'
import { policySchema } from '@/lib/validations/policy'

const validPolicy = {
  client_id: '00000000-0000-0000-0000-000000000001',
  carrier_id: '00000000-0000-0000-0000-000000000002',
  line_of_business: 'auto' as const,
  status: 'active' as const,
  effective_date: '2026-01-01',
  expiration_date: '2027-01-01',
  premium: 12500,
}

describe('policySchema', () => {
  it('✅ valid policy passes', () => {
    expect(policySchema.safeParse(validPolicy).success).toBe(true)
  })
  it('❌ missing effective_date fails', () => {
    const r = policySchema.safeParse({ ...validPolicy, effective_date: '' })
    expect(r.success).toBe(false)
  })
  it('❌ negative premium fails', () => {
    const r = policySchema.safeParse({ ...validPolicy, premium: -100 })
    expect(r.success).toBe(false)
  })
  it('❌ invalid client_id fails', () => {
    const r = policySchema.safeParse({ ...validPolicy, client_id: 'not-a-uuid' })
    expect(r.success).toBe(false)
  })
})
```

### `src/tests/components/auth/LoginForm.test.tsx`
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/auth/LoginForm'

vi.mock('@/actions/auth', () => ({ loginAction: vi.fn() }))

describe('LoginForm', () => {
  it('✅ renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })
  it('✅ renders sign in button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
  it('❌ shows error for empty email', async () => {
    render(<LoginForm />)
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })
  it('❌ shows error for invalid email', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'bademail')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })
})
```

### `src/tests/components/clients/ClientStatusBadge.test.tsx`
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ClientStatusBadge from '@/components/clients/ClientStatusBadge'

describe('ClientStatusBadge', () => {
  it('✅ renders Active badge', () => {
    render(<ClientStatusBadge status="active" />)
    expect(screen.getByText(/active/i)).toBeInTheDocument()
  })
  it('✅ renders Inactive badge', () => {
    render(<ClientStatusBadge status="inactive" />)
    expect(screen.getByText(/inactive/i)).toBeInTheDocument()
  })
  it('✅ renders Prospect badge', () => {
    render(<ClientStatusBadge status="prospect" />)
    expect(screen.getByText(/prospect/i)).toBeInTheDocument()
  })
})
```

### `src/tests/components/policies/PolicyStatusBadge.test.tsx`
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PolicyStatusBadge from '@/components/policies/PolicyStatusBadge'

describe('PolicyStatusBadge', () => {
  it('✅ renders Active badge', () => {
    render(<PolicyStatusBadge status="active" />)
    expect(screen.getByText(/active/i)).toBeInTheDocument()
  })
  it('✅ renders Expired badge', () => {
    render(<PolicyStatusBadge status="expired" />)
    expect(screen.getByText(/expired/i)).toBeInTheDocument()
  })
  it('✅ renders Cancelled badge', () => {
    render(<PolicyStatusBadge status="cancelled" />)
    expect(screen.getByText(/cancelled/i)).toBeInTheDocument()
  })
  it('✅ renders Pending badge', () => {
    render(<PolicyStatusBadge status="pending" />)
    expect(screen.getByText(/pending/i)).toBeInTheDocument()
  })
})
```

---

## 🎭 STEP 16B — E2E TESTS (Playwright)

### `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### `src/tests/e2e/helpers/auth.ts`
```typescript
import { Page } from '@playwright/test'

export const TEST_EMAIL = 'testuser@insurance-agency-platform.com'
export const TEST_PASSWORD = 'TestPass123'

export async function loginAs(page: Page, email = TEST_EMAIL, password = TEST_PASSWORD) {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL('**/dashboard')
}
```

### `src/tests/e2e/auth.spec.ts`
```typescript
import { test, expect } from '@playwright/test'
import { loginAs, TEST_EMAIL, TEST_PASSWORD } from './helpers/auth'

test.describe('Auth Flow', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('wrong credentials shows error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('wrong@test.com')
    await page.getByLabel(/password/i).fill('WrongPass1')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
  })

  test('successful login → dashboard', async ({ page }) => {
    await loginAs(page)
    await expect(page).toHaveURL(/dashboard/)
  })

  test('logout → login page', async ({ page }) => {
    await loginAs(page)
    await page.getByRole('button', { name: /sign out/i }).click()
    await expect(page).toHaveURL(/login/)
  })

  test('unauthenticated → redirect to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/login/)
  })

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible()
  })
})
```

### `src/tests/e2e/clients.spec.ts`
```typescript
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('Clients Module', () => {
  test.beforeEach(async ({ page }) => { await loginAs(page) })

  test('clients page loads with data', async ({ page }) => {
    await page.goto('/clients')
    await expect(page.getByText('CLT-001')).toBeVisible()
  })

  test('search filters clients', async ({ page }) => {
    await page.goto('/clients')
    await page.getByPlaceholder(/search/i).fill('Aarav')
    await expect(page.getByText('Aarav Shah')).toBeVisible()
  })

  test('add client → appears in list', async ({ page }) => {
    await page.goto('/clients/add')
    await page.getByLabel(/first name/i).fill('Test')
    await page.getByLabel(/last name/i).fill('Client')
    await page.getByLabel(/email/i).fill('test.client@test.com')
    await page.getByRole('button', { name: /add client/i }).click()
    await expect(page).toHaveURL(/\/clients/)
    await expect(page.getByText('Test Client')).toBeVisible()
  })

  test('view client detail', async ({ page }) => {
    await page.goto('/clients')
    await page.getByRole('link', { name: /view/i }).first().click()
    await expect(page.getByText('CLT-001')).toBeVisible()
  })
})
```

### `src/tests/e2e/policies.spec.ts`
```typescript
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('Policies Module', () => {
  test.beforeEach(async ({ page }) => { await loginAs(page) })

  test('policies page loads', async ({ page }) => {
    await page.goto('/policies')
    await expect(page.getByText(/policies/i)).toBeVisible()
  })

  test('add policy → appears in list', async ({ page }) => {
    await page.goto('/policies/add')
    // Select client, carrier, fill fields, submit
    await page.getByRole('button', { name: /add policy/i }).click()
  })
})
```

### `src/tests/e2e/responsive.spec.ts`
```typescript
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

test.describe('Responsive Design', () => {
  test('mobile: sidebar hidden, hamburger visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await loginAs(page)
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
  })

  test('desktop: sidebar always visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await loginAs(page)
    await expect(page.getByText('Insurance Agency System')).toBeVisible()
  })

  test('mobile: no horizontal scroll on clients page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await loginAs(page)
    await page.goto('/clients')
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5)
  })
})
```

---

## 🚀 HOW TO RUN LOCALLY

### Start Development
```bash
npm run dev
```

**Terminal 2 — Codex (after dev server running):**
```bash
# GitHub token needed for git push operations
export GITHUB_TOKEN="your_github_personal_access_token"
cd path/to/insurance-agency-platform
codex
```

### Test Commands
```bash
npm run test:run          # Unit tests
npm run test:e2e          # Browser E2E tests
npm run test:e2e:headed   # Watch browser tests run
npm run type-check        # TypeScript check
npm run build             # Production build check
```

### Manual QA Checklist
```
Auth:
[ ] /login loads correctly
[ ] Login with wrong credentials shows error
[ ] Login with correct credentials → /dashboard
[ ] Register new user → /dashboard
[ ] Logout button works → /login
[ ] /dashboard without login → redirect to /login
[ ] Session persists after page refresh
[ ] Forgot password page loads + success state works

Dashboard:
[ ] Stats cards show correct counts
[ ] Renewal alerts show upcoming renewals
[ ] Recent clients list shows
[ ] Open tasks show

Clients:
[ ] /clients loads with seeded data (8 clients)
[ ] Search filters work (name, email, ID)
[ ] Type filter works (individual / business)
[ ] Status filter works
[ ] Add client → form validates → saves → appears in list
[ ] View client → all details shown + linked policies
[ ] Edit client → pre-populated → saves changes
[ ] Delete client → confirmation → removed from list

Policies:
[ ] /policies loads
[ ] Status filter works
[ ] Line of business filter works
[ ] Add policy → generates POL-XXX → renewal auto-created
[ ] View policy detail
[ ] Edit policy → saves
[ ] Delete policy → confirmation → removed

Quotes:
[ ] /quotes loads
[ ] Add quote → generates QUO-XXX
[ ] Mark as sent → status changes
[ ] Bind policy → creates policy from quote

Claims:
[ ] /claims loads
[ ] Add claim → generates CLM-XXX
[ ] Update claim status works
[ ] View claim detail

Commissions:
[ ] /commissions loads with summary cards
[ ] Commission auto-created on new policy
[ ] Mark commission paid → status changes

Documents:
[ ] /documents loads
[ ] Upload document dialog works
[ ] Documents appear in grid

Tasks:
[ ] /tasks loads
[ ] Add task works
[ ] Mark task complete works
[ ] Overdue tasks shown with red border

Leads:
[ ] /leads loads with pipeline view (4 seeded leads)
[ ] Toggle to table view
[ ] Move lead stage works
[ ] Convert lead → creates client

Certificates:
[ ] /certificates loads
[ ] Generate certificate → creates CERT-XXX
[ ] Certificate preview shows all details

Reports:
[ ] /reports loads all 4 tabs
[ ] Charts render with data

Responsive:
[ ] Mobile: sidebar hidden, hamburger visible
[ ] Mobile: hamburger opens sidebar drawer
[ ] Mobile: clients/policies show as cards
[ ] Mobile: no horizontal scroll
[ ] Desktop: sidebar always visible
[ ] Desktop: table views shown
```

---

## 🗂️ FILES SUMMARY

```
Config:
  .env.local
  .mcp.json
  middleware.ts
  playwright.config.ts
  package.json

Auth (8 files):
  src/app/(auth)/layout.tsx
  src/app/(auth)/login/page.tsx
  src/app/(auth)/register/page.tsx
  src/app/(auth)/forgot-password/page.tsx
  src/app/auth/callback/route.ts
  src/components/auth/LoginForm.tsx
  src/components/auth/RegisterForm.tsx
  src/components/auth/ForgotPasswordForm.tsx

Layout (3 files):
  src/app/(dashboard)/layout.tsx
  src/components/layout/Sidebar.tsx
  src/components/layout/Header.tsx

Dashboard (3 files):
  src/app/(dashboard)/dashboard/page.tsx
  src/components/dashboard/StatsCard.tsx
  src/components/dashboard/RenewalAlerts.tsx

Clients (8 files):
  src/app/(dashboard)/clients/page.tsx
  src/app/(dashboard)/clients/add/page.tsx
  src/app/(dashboard)/clients/[id]/page.tsx
  src/app/(dashboard)/clients/[id]/edit/page.tsx
  src/components/clients/ClientTable.tsx
  src/components/clients/ClientCard.tsx
  src/components/clients/ClientForm.tsx
  src/components/clients/ClientStatusBadge.tsx

Policies (8 files):
  src/app/(dashboard)/policies/page.tsx
  src/app/(dashboard)/policies/add/page.tsx
  src/app/(dashboard)/policies/[id]/page.tsx
  src/app/(dashboard)/policies/[id]/edit/page.tsx
  src/components/policies/PolicyTable.tsx
  src/components/policies/PolicyCard.tsx
  src/components/policies/PolicyForm.tsx
  src/components/policies/PolicyStatusBadge.tsx

Quotes (6 files):
  src/app/(dashboard)/quotes/page.tsx
  src/app/(dashboard)/quotes/add/page.tsx
  src/app/(dashboard)/quotes/[id]/page.tsx
  src/components/quotes/QuoteTable.tsx
  src/components/quotes/QuoteForm.tsx
  src/components/quotes/QuoteStatusBadge.tsx

Claims (6 files):
  src/app/(dashboard)/claims/page.tsx
  src/app/(dashboard)/claims/add/page.tsx
  src/app/(dashboard)/claims/[id]/page.tsx
  src/components/claims/ClaimTable.tsx
  src/components/claims/ClaimForm.tsx
  src/components/claims/ClaimStatusBadge.tsx

Commissions (3 files):
  src/app/(dashboard)/commissions/page.tsx
  src/components/commissions/CommissionTable.tsx
  src/components/commissions/CommissionSummaryCards.tsx

Documents (3 files):
  src/app/(dashboard)/documents/page.tsx
  src/components/documents/DocumentList.tsx
  src/components/documents/DocumentUploadDialog.tsx

Tasks (3 files):
  src/app/(dashboard)/tasks/page.tsx
  src/components/tasks/TaskList.tsx
  src/components/tasks/TaskPriorityBadge.tsx

Leads (5 files):
  src/app/(dashboard)/leads/page.tsx
  src/app/(dashboard)/leads/[id]/page.tsx
  src/components/leads/LeadPipeline.tsx
  src/components/leads/LeadTable.tsx
  src/components/leads/LeadStageBadge.tsx

Certificates (3 files):
  src/app/(dashboard)/certificates/page.tsx
  src/app/(dashboard)/certificates/add/page.tsx
  src/components/certificates/CertificateForm.tsx

Reports (4 files):
  src/app/(dashboard)/reports/page.tsx
  src/components/reports/RevenueChart.tsx
  src/components/reports/PolicyLineChart.tsx
  src/components/reports/CommissionReport.tsx

Lib (9 files):
  src/lib/supabase/client.ts
  src/lib/supabase/server.ts
  src/lib/supabase/middleware.ts
  src/lib/validations/auth.ts
  src/lib/validations/client.ts
  src/lib/validations/policy.ts
  src/lib/validations/quote.ts
  src/lib/validations/claim.ts
  src/lib/utils.ts

Actions (10 files):
  src/actions/auth.ts
  src/actions/clients.ts
  src/actions/policies.ts
  src/actions/quotes.ts
  src/actions/claims.ts
  src/actions/commissions.ts
  src/actions/documents.ts
  src/actions/tasks.ts
  src/actions/leads.ts
  src/actions/certificates.ts

Types (1 file):
  src/types/index.ts

Unit Tests (7 files):
  src/tests/validations/auth.test.ts
  src/tests/validations/client.test.ts
  src/tests/validations/policy.test.ts
  src/tests/components/auth/LoginForm.test.tsx
  src/tests/components/auth/RegisterForm.test.tsx
  src/tests/components/auth/ForgotPasswordForm.test.tsx
  src/tests/components/clients/ClientStatusBadge.test.tsx
  src/tests/components/policies/PolicyStatusBadge.test.tsx

E2E Tests (5 files):
  src/tests/e2e/helpers/auth.ts
  src/tests/e2e/auth.spec.ts
  src/tests/e2e/clients.spec.ts
  src/tests/e2e/policies.spec.ts
  src/tests/e2e/responsive.spec.ts
```

---

# 🚀 PHASE 2 — DEPLOY TO VERCEL

> ⚠️ Only start after Phase 1 is fully working locally.
> Tell Codex: **"Phase 1 done. Execute Phase 2 — Deploy."**

---

## PHASE 2 — STEP 1: Pre-Deploy Checks
```bash
npm run type-check   # 0 TypeScript errors
npm run build        # must succeed with 0 errors
npm run test:run     # all unit tests pass
npm run test:e2e     # all browser tests pass
```
Fix every error before continuing. Paste errors to Codex: "Fix these build errors: [paste]"

---

## PHASE 2 — STEP 2: Final GitHub Push
```bash
git add .
git commit -m "feat: complete Insurance Agency Platform — all modules + tests"
git push origin main
# Confirm: https://github.com/AI-Kurukshetra/insurance-agency-platform
```

---

## PHASE 2 — STEP 3: Deploy to Vercel
```
Using Vercel MCP:
1. Create new Vercel project called "insurance-agency-platform"
2. Connect to my GitHub repo: https://github.com/AI-Kurukshetra/insurance-agency-platform
3. Set environment variables:
   NEXT_PUBLIC_SUPABASE_URL      = [from .env.local]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [from .env.local]
   SUPABASE_SERVICE_ROLE_KEY     = [from .env.local]
   NEXT_PUBLIC_SITE_URL          = https://insurance-agency-platform.vercel.app
4. Trigger production deployment
5. Wait for completion
6. Give me the live Vercel URL
```

---

## PHASE 2 — STEP 4: Fix Supabase Auth URLs ⚠️ MANUAL

> Without this step, login/register/forgot-password will FAIL in production.

Go to: supabase.com → Your Project → Authentication → URL Configuration

```
Site URL:
https://insurance-agency-platform.vercel.app

Redirect URLs (add all):
https://insurance-agency-platform.vercel.app/**
https://insurance-agency-platform.vercel.app/auth/callback
http://localhost:3000/**
```

Save changes.

---

## PHASE 2 — STEP 5: Verify Production
```
[ ] https://insurance-agency-platform.vercel.app loads
[ ] /login works
[ ] Register new user → /dashboard
[ ] Login works → /dashboard
[ ] Forgot password sends reset email
[ ] Dashboard stats load
[ ] Clients page loads with seeded data
[ ] Policies page loads
[ ] Add client works
[ ] Add policy works
[ ] Quotes, Claims, Commissions, Documents, Tasks, Leads, Certificates all load
[ ] Reports charts render
[ ] Logout works → /login
[ ] /dashboard without login → /login (protected)
[ ] No console errors in browser DevTools
```

---

## PHASE 2 — STEP 6: Submit
```
Links to submit:
[ ] Live URL:     https://insurance-agency-platform.vercel.app
[ ] GitHub Repo:  https://github.com/AI-Kurukshetra/insurance-agency-platform
[ ] Demo Video:   https://loom.com/share/[id]

Demo video script (3–5 min):
0:00 - 0:30  App name + login page + register flow
0:30 - 1:00  Dashboard → stats cards + renewal alerts
1:00 - 1:45  Add client → view detail → linked policies
1:45 - 2:30  Add policy → commission auto-created
2:30 - 3:00  File a claim → update status
3:00 - 3:30  Leads pipeline → convert to client
3:30 - 4:00  Generate certificate + Reports charts
4:00 - 4:30  Mobile responsive + GitHub repo
```

---

*Phase 1 done when: `npm run dev` works + all tests pass + manual QA checklist done ✅*
*Phase 2 done when: live Vercel URL works + all production checks pass ✅*
