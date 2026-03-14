insert into public.carriers (name, code, contact_email, lines_of_business, status)
values
  ('State Farm Insurance', 'STATE-FARM', 'agency@statefarm.com', array['auto', 'home', 'life'], 'active'),
  ('Progressive Insurance', 'PROGRESSIVE', 'agency@progressive.com', array['auto', 'commercial'], 'active'),
  ('Allstate Insurance', 'ALLSTATE', 'agency@allstate.com', array['auto', 'home', 'life', 'umbrella'], 'active')
on conflict (code) do nothing;

insert into public.agencies (name, address, city, state, zip, phone, email, website, license_no)
values
  ('Apex Insurance Agency', '123 Commerce Blvd', 'Ahmedabad', 'Gujarat', '380001', '9876500001', 'info@apexinsurance.com', 'https://apexinsurance.example.com', 'GJ-INS-2026-001')
on conflict do nothing;

insert into public.clients (
  client_id,
  type,
  first_name,
  last_name,
  business_name,
  email,
  phone,
  date_of_birth,
  address,
  city,
  state,
  zip,
  status,
  notes
)
values
  ('CLT-001', 'individual', 'Aarav', 'Shah', null, 'aarav.shah@email.com', '9876543201', '1985-04-12', '12 Riverfront Residency', 'Ahmedabad', 'Gujarat', '380015', 'active', 'High-value auto and home cross-sell opportunity.'),
  ('CLT-002', 'individual', 'Diya', 'Patel', null, 'diya.patel@email.com', '9876543202', '1990-07-22', '8 Lakeview Apartments', 'Surat', 'Gujarat', '395003', 'active', 'Interested in bundled home coverage.'),
  ('CLT-003', 'business', null, null, 'Rohan Corp Pvt Ltd', 'rohan.corp@email.com', '9876543203', null, '44 GIDC Estate', 'Vadodara', 'Gujarat', '390010', 'active', 'Commercial fleet and liability account.'),
  ('CLT-004', 'individual', 'Priya', 'Joshi', null, 'priya.joshi@email.com', '9876543204', '1978-11-05', '22 Heritage Park', 'Rajkot', 'Gujarat', '360001', 'active', 'Life policy review due this quarter.'),
  ('CLT-005', 'individual', 'Arjun', 'Singh', null, 'arjun.singh@email.com', '9876543205', '1992-03-30', '17 Skyline Homes', 'Ahmedabad', 'Gujarat', '380054', 'prospect', 'Requested competitive auto quote.'),
  ('CLT-006', 'business', null, null, 'Kavya Enterprises', 'kavya.enterprises@email.com', '9876543206', null, '2 Textile Hub', 'Surat', 'Gujarat', '395007', 'active', 'Commercial property and workers coverage inquiry.'),
  ('CLT-007', 'individual', 'Vivaan', 'Gupta', null, 'vivaan.gupta@email.com', '9876543207', '1999-08-18', '5 Green Acres', 'Gandhinagar', 'Gujarat', '382010', 'active', 'Potential umbrella upsell.'),
  ('CLT-008', 'individual', 'Ananya', 'Sharma', null, 'ananya.sharma@email.com', '9876543208', '1988-12-01', '91 Central Avenue', 'Ahmedabad', 'Gujarat', '380009', 'inactive', 'Policy lapsed last year; nurture for reactivation.')
on conflict (client_id) do nothing;

insert into public.leads (
  lead_id,
  first_name,
  last_name,
  email,
  phone,
  source,
  stage,
  interested_in,
  estimated_premium,
  notes
)
values
  ('LED-001', 'Ishaan', 'Verma', 'ishaan.verma@email.com', '9876543211', 'referral', 'new', array['auto', 'home'], 42000.00, 'Referral from existing client.'),
  ('LED-002', 'Riya', 'Desai', 'riya.desai@email.com', '9876543212', 'website', 'contacted', array['life'], 18000.00, 'Requested term life comparison.'),
  ('LED-003', 'Raj', 'Mehta', 'raj.mehta@email.com', '9876543213', 'cold_call', 'qualified', array['commercial'], 95000.00, 'Commercial liability package in discussion.'),
  ('LED-004', 'Sneha', 'Nair', 'sneha.nair@email.com', '9876543214', 'social_media', 'proposal', array['auto'], 22000.00, 'Proposal sent for family auto plan.')
on conflict (lead_id) do nothing;

do $$
declare
  client_1 uuid;
  client_2 uuid;
  client_3 uuid;
  client_4 uuid;
  client_5 uuid;
  client_6 uuid;
  carrier_state_farm uuid;
  carrier_progressive uuid;
  carrier_allstate uuid;
  policy_1 uuid;
  policy_2 uuid;
  policy_3 uuid;
  policy_4 uuid;
  quote_1 uuid;
  quote_2 uuid;
  claim_1 uuid;
  claim_2 uuid;
begin
  select id into client_1 from public.clients where client_id = 'CLT-001';
  select id into client_2 from public.clients where client_id = 'CLT-002';
  select id into client_3 from public.clients where client_id = 'CLT-003';
  select id into client_4 from public.clients where client_id = 'CLT-004';
  select id into client_5 from public.clients where client_id = 'CLT-005';
  select id into client_6 from public.clients where client_id = 'CLT-006';

  select id into carrier_state_farm from public.carriers where code = 'STATE-FARM';
  select id into carrier_progressive from public.carriers where code = 'PROGRESSIVE';
  select id into carrier_allstate from public.carriers where code = 'ALLSTATE';

  insert into public.policies (
    policy_number,
    client_id,
    carrier_id,
    line_of_business,
    status,
    effective_date,
    expiration_date,
    premium,
    coverage_limit,
    deductible,
    description
  )
  values
    ('POL-001', client_1, carrier_state_farm, 'auto', 'active', '2026-01-01', '2026-12-31', 24000.00, 1200000.00, 5000.00, 'Comprehensive auto policy for family sedan.'),
    ('POL-002', client_2, carrier_progressive, 'home', 'pending', '2026-04-01', '2027-03-31', 36000.00, 5000000.00, 10000.00, 'Homeowners policy awaiting final inspection.'),
    ('POL-003', client_3, carrier_allstate, 'commercial', 'active', '2025-10-01', '2026-09-30', 125000.00, 20000000.00, 25000.00, 'Commercial package with property and liability coverage.'),
    ('POL-004', client_4, carrier_state_farm, 'life', 'active', '2025-07-01', '2026-06-30', 18000.00, 7500000.00, 0.00, '20-year term life policy.')
  on conflict (policy_number) do nothing;

  select id into policy_1 from public.policies where policy_number = 'POL-001';
  select id into policy_2 from public.policies where policy_number = 'POL-002';
  select id into policy_3 from public.policies where policy_number = 'POL-003';
  select id into policy_4 from public.policies where policy_number = 'POL-004';

  insert into public.quotes (
    quote_number,
    client_id,
    carrier_id,
    line_of_business,
    status,
    premium,
    coverage_limit,
    deductible,
    valid_until,
    notes
  )
  values
    ('QUO-001', client_5, carrier_progressive, 'auto', 'sent', 21500.00, 1000000.00, 5000.00, '2026-03-31', 'Quote shared after online comparison.'),
    ('QUO-002', client_6, carrier_allstate, 'commercial', 'draft', 142000.00, 25000000.00, 50000.00, '2026-04-15', 'Awaiting property schedule details.')
  on conflict (quote_number) do nothing;

  select id into quote_1 from public.quotes where quote_number = 'QUO-001';
  select id into quote_2 from public.quotes where quote_number = 'QUO-002';

  insert into public.claims (
    claim_number,
    policy_id,
    client_id,
    carrier_id,
    status,
    incident_date,
    reported_date,
    description,
    claim_amount,
    settled_amount,
    adjuster_name,
    adjuster_phone,
    notes
  )
  values
    ('CLM-001', policy_1, client_1, carrier_state_farm, 'in_review', '2026-02-18', '2026-02-19', 'Rear bumper collision claim under review.', 85000.00, null, 'Nikhil Rana', '9876511111', 'Inspection photos uploaded.'),
    ('CLM-002', policy_3, client_3, carrier_allstate, 'open', '2026-01-28', '2026-01-29', 'Warehouse water damage after pipe burst.', 450000.00, null, 'Sonal Mehra', '9876522222', 'Waiting for vendor estimate.')
  on conflict (claim_number) do nothing;

  select id into claim_1 from public.claims where claim_number = 'CLM-001';
  select id into claim_2 from public.claims where claim_number = 'CLM-002';

  insert into public.commissions (
    policy_id,
    carrier_id,
    type,
    status,
    commission_rate,
    gross_premium,
    commission_amount,
    paid_date,
    payment_reference,
    notes
  )
  values
    (policy_1, carrier_state_farm, 'new_business', 'paid', 12.50, 24000.00, 3000.00, '2026-01-10', 'COMM-001', 'Commission settled for POL-001.'),
    (policy_3, carrier_allstate, 'renewal', 'pending', 10.00, 125000.00, 12500.00, null, 'COMM-002', 'Renewal commission expected next cycle.')
  on conflict do nothing;

  insert into public.documents (
    name,
    type,
    file_url,
    file_size,
    mime_type,
    client_id,
    policy_id,
    claim_id,
    quote_id,
    tags
  )
  values
    ('POL-001 Policy Schedule.pdf', 'policy', 'https://example.com/documents/pol-001-schedule.pdf', 248120, 'application/pdf', client_1, policy_1, null, null, array['policy', 'auto']),
    ('QUO-001 Comparison.pdf', 'quote', 'https://example.com/documents/quo-001-comparison.pdf', 164220, 'application/pdf', client_5, null, null, quote_1, array['quote']),
    ('CLM-001 Photos.zip', 'claim', 'https://example.com/documents/clm-001-photos.zip', 842110, 'application/zip', client_1, policy_1, claim_1, null, array['claim', 'photos'])
  on conflict do nothing;

  insert into public.tasks (
    title,
    description,
    type,
    priority,
    status,
    due_date,
    client_id,
    policy_id
  )
  values
    ('Follow up on QUO-001', 'Call Arjun Singh to discuss quote terms and close objections.', 'follow_up', 'high', 'open', now() + interval '2 days', client_5, null),
    ('Renew POL-004 coverage review', 'Schedule annual review before term life policy anniversary.', 'renewal', 'medium', 'in_progress', now() + interval '5 days', client_4, policy_4),
    ('Check CLM-002 vendor estimate', 'Confirm restoration vendor estimate status with carrier adjuster.', 'claim', 'urgent', 'open', now() + interval '1 day', client_3, policy_3)
  on conflict do nothing;

  insert into public.certificates (
    certificate_number,
    policy_id,
    client_id,
    holder_name,
    holder_address,
    issued_date,
    expiry_date,
    file_url,
    status
  )
  values
    ('CERT-001', policy_3, client_3, 'Rohan Corp Pvt Ltd', '44 GIDC Estate, Vadodara, Gujarat', '2026-03-01', '2026-09-30', 'https://example.com/documents/cert-001.pdf', 'active')
  on conflict (certificate_number) do nothing;

  insert into public.activities (
    type,
    description,
    client_id,
    policy_id,
    claim_id,
    lead_id
  )
  values
    ('call', 'Called client regarding claim inspection scheduling.', client_1, policy_1, claim_1, null),
    ('email', 'Sent policy proposal to lead Sneha Nair.', null, null, null, (select id from public.leads where lead_id = 'LED-004')),
    ('status_change', 'Updated renewal tracking for POL-004.', client_4, policy_4, null, null)
  on conflict do nothing;

  insert into public.renewals (
    policy_id,
    client_id,
    renewal_date,
    status,
    reminder_sent_at,
    notes
  )
  values
    (policy_4, client_4, '2026-06-30', 'upcoming', now() - interval '1 day', 'Renewal reminder queued.'),
    (policy_3, client_3, '2026-09-30', 'notified', now() - interval '7 days', 'Commercial renewal review in progress.')
  on conflict do nothing;
end $$;
