create extension if not exists pgcrypto;

create type public.verification_status as enum ('pending','verified','rejected');
create type public.payment_status as enum ('pending','submitted','paid','rejected','waived');
create type public.registration_status as enum ('submitted','approved','rejected','cancelled');

create table public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
create table public.institutions (id uuid primary key default gen_random_uuid(), name text not null, city text not null, state text not null, coordinator_name text, coordinator_designation text, official_email text, coordinator_phone text, created_at timestamptz not null default now(), unique(name,city,state));
create table public.events (id text primary key, name text not null, description text not null default '', tagline text not null default '', min_team_size integer not null default 1 check(min_team_size>=1), max_team_size integer not null default 1 check(max_team_size>=min_team_size), capacity_teams integer, is_open boolean not null default false, registration_deadline timestamptz, created_at timestamptz not null default now());
create table public.participants (id uuid primary key default gen_random_uuid(), full_name text not null, email text not null, mobile text not null, course text not null, year_semester text not null, city text not null, state text not null, institution_id uuid not null references public.institutions(id), created_at timestamptz not null default now(), unique(institution_id,email));
create table public.registrations (id uuid primary key default gen_random_uuid(), reference text not null unique default ('MM26-'||upper(substr(encode(gen_random_bytes(8),'hex'),1,8))), primary_participant_id uuid not null references public.participants(id), institution_id uuid not null references public.institutions(id), status public.registration_status not null default 'submitted', verification public.verification_status not null default 'pending', payment public.payment_status not null default 'pending', amount_due numeric(10,2) not null default 150 check(amount_due>=0), amount_paid numeric(10,2) not null default 0 check(amount_paid>=0), accommodation_requested boolean not null default false, arrival_date date, departure_date date, accommodation_people integer check(accommodation_people is null or accommodation_people>0), institution_document_path text, consent_terms boolean not null default false, consent_privacy boolean not null default false, internal_notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check(consent_terms and consent_privacy));
create table public.teams (id uuid primary key default gen_random_uuid(), registration_id uuid not null references public.registrations(id) on delete cascade, event_id text not null references public.events(id), team_name text, team_leader_id uuid references public.participants(id), created_at timestamptz not null default now(), unique(registration_id,event_id));
create table public.registration_team_members (team_id uuid not null references public.teams(id) on delete cascade, participant_id uuid not null references public.participants(id), is_leader boolean not null default false, primary key(team_id,participant_id));
create table public.accommodation_requests (id uuid primary key default gen_random_uuid(), registration_id uuid not null unique references public.registrations(id) on delete cascade, travelling_from_outside_jaipur boolean not null default false, requested boolean not null default false, arrival_date date, departure_date date, people_count integer check(people_count is null or people_count>0), special_requirements text, emergency_contact text, created_at timestamptz not null default now());
create table public.institution_documents (id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.institutions(id), registration_id uuid references public.registrations(id) on delete cascade, storage_path text not null, original_filename text not null, verification public.verification_status not null default 'pending', admin_note text, created_at timestamptz not null default now());
create table public.payment_records (id uuid primary key default gen_random_uuid(), registration_id uuid not null references public.registrations(id) on delete cascade, amount numeric(10,2) not null check(amount>=0), status public.payment_status not null default 'pending', reference_note text, verified_by uuid references auth.users(id), verified_at timestamptz, created_at timestamptz not null default now());
create table public.admin_audit_logs (id bigint generated always as identity primary key, admin_user_id uuid references auth.users(id), action text not null, entity_type text not null, entity_id text, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());

create index registrations_institution_idx on public.registrations(institution_id);
create index registrations_created_idx on public.registrations(created_at desc);
create index registrations_status_idx on public.registrations(status,payment,verification);
create index participants_email_idx on public.participants(lower(email));
create index teams_event_idx on public.teams(event_id);

alter table public.admin_users enable row level security;
alter table public.institutions enable row level security;
alter table public.events enable row level security;
alter table public.participants enable row level security;
alter table public.registrations enable row level security;
alter table public.teams enable row level security;
alter table public.registration_team_members enable row level security;
alter table public.accommodation_requests enable row level security;
alter table public.institution_documents enable row level security;
alter table public.payment_records enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "Public can read event information" on public.events for select using (true);
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.admin_users where user_id=auth.uid()); $$;
create policy "Admins manage institutions" on public.institutions for all using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage participants" on public.participants for all using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage registrations" on public.registrations for all using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage teams" on public.teams for all using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage team members" on public.registration_team_members for all using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage accommodation" on public.accommodation_requests for all using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage documents" on public.institution_documents for all using(public.is_admin()) with check(public.is_admin());
create policy "Admins manage payments" on public.payment_records for all using(public.is_admin()) with check(public.is_admin());
create policy "Admins read audit logs" on public.admin_audit_logs for select using(public.is_admin());
create policy "Admins write audit logs" on public.admin_audit_logs for insert with check(public.is_admin());
create policy "Users read own admin row" on public.admin_users for select using(auth.uid()=user_id);

insert into public.events(id,name,tagline,description,min_team_size,max_team_size,is_open) values
('idea-volcano','IDEA VOLCANO','Great insight begins with an idea.','Extempore competition: complete and expand an unfinished sentence.',1,1,false),
('memeconomics','MEMECONOMICS','Business Meme War.','Create accurate, funny memes explaining business concepts.',1,1,false),
('bulls-bears','BULLS & BEARS','Trade Virtual, Think Rich.','Virtual stock-trading competition.',2,2,false),
('code-acumen','CODE ACUMEN','Code is conquered when Logic meets Action.','Programming, debugging and logical reasoning.',2,2,false),
('web-vision','WEB VISION','Web Designing Decoded.','Web-designing skills competition.',2,2,false),
('rolling-reels','ROLLING REELS','Vision behind the Lens.','Original 1–2 minute motivational reel; theme Beyond the Ordinary.',1,1,false),
('fusion-fiesta','FUSION FIESTA','From Trash to Trend, Creating a Better Tomorrow.','Eco-friendly creations made from discarded materials.',1,2,false),
('d4u','D4U','Feel the Beat, Live the Dance.','Choreography and dance competition.',1,4,false),
('strings-unplugged','STRINGS UNPLUGGED','Where medley meets the Soul.','Solo singing competition.',1,1,false)
on conflict(id) do nothing;
