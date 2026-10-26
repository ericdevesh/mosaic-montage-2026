-- Atomic registration submission. Apply after 001_initial_schema.sql.
create or replace function public.submit_registration(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inst_id uuid;
  v_registration_id uuid;
  v_reference text;
  v_primary_id uuid;
  v_participant_id uuid;
  v_member jsonb;
  v_event_id text;
  v_event record;
  v_members jsonb;
  v_events jsonb;
  v_member_count integer;
  v_existing_count integer;
  v_total_count integer;
  v_fee numeric(10,2);
  v_team_id uuid;
  v_leader_email text;
  v_seen_emails text[] := array[]::text[];
begin
  if coalesce((payload->>'consent_terms')::boolean,false) is not true
     or coalesce((payload->>'consent_privacy')::boolean,false) is not true then
    raise exception 'Both participation rules and privacy consent are required.';
  end if;

  v_members := payload->'members';
  v_events := payload->'events';
  if jsonb_typeof(v_members) <> 'array' or jsonb_array_length(v_members) < 1 or jsonb_array_length(v_members) > 4 then
    raise exception 'Provide between one and four participant records.';
  end if;
  if jsonb_typeof(v_events) <> 'array' or jsonb_array_length(v_events) < 1 then
    raise exception 'Select at least one event.';
  end if;

  v_member_count := jsonb_array_length(v_members);
  if exists (
    select 1 from jsonb_array_elements(v_members) m
    where length(trim(coalesce(m->>'full_name',''))) < 2
       or coalesce(m->>'email','') !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
       or length(regexp_replace(coalesce(m->>'mobile',''), '[^0-9]', '', 'g')) < 7
  ) then
    raise exception 'Every participant must have a valid name, email and mobile number.';
  end if;

  select array_agg(lower(m->>'email')) into v_seen_emails from jsonb_array_elements(v_members) m;
  if cardinality(v_seen_emails) <> (select count(distinct x) from unnest(v_seen_emails) x) then
    raise exception 'Duplicate email addresses are not allowed within a team.';
  end if;

  insert into public.institutions(name,city,state,coordinator_name,coordinator_designation,official_email,coordinator_phone)
  values (trim(payload->>'institution'),trim(payload->>'city'),trim(payload->>'state'),
          nullif(trim(payload->>'coordinator_name'),''),nullif(trim(payload->>'coordinator_designation'),''),
          nullif(lower(trim(payload->>'official_email')),''),nullif(trim(payload->>'coordinator_phone'),''))
  on conflict (name,city,state) do update set name=excluded.name
  returning id into v_inst_id;

  -- Lock selected event rows in a stable order to serialize capacity checks.
  perform 1 from public.events where id in (select jsonb_array_elements_text(v_events)) order by id for update;
  if (select count(*) from public.events where id in (select jsonb_array_elements_text(v_events))) <> jsonb_array_length(v_events) then
    raise exception 'One or more selected events are invalid.';
  end if;
  for v_event in select * from public.events where id in (select jsonb_array_elements_text(v_events)) order by id loop
    if not v_event.is_open then raise exception 'Registration is not open for %.',v_event.name; end if;
    if v_member_count < v_event.min_team_size or v_member_count > v_event.max_team_size then
      raise exception 'Team size for % must be between % and % participant(s).',v_event.name,v_event.min_team_size,v_event.max_team_size;
    end if;
    if v_event.capacity_teams is not null and
       (select count(*) from public.teams where event_id=v_event.id) >= v_event.capacity_teams then
      raise exception 'Registration capacity has been reached for %.',v_event.name;
    end if;
    if v_event.registration_deadline is not null and now() > v_event.registration_deadline then
      raise exception 'Registration deadline has passed for %.',v_event.name;
    end if;
  end loop;

  -- Reuse known participants for this institution, otherwise create them.
  for v_member in select value from jsonb_array_elements(v_members) loop
    insert into public.participants(full_name,email,mobile,course,year_semester,city,state,institution_id)
    values (trim(v_member->>'full_name'),lower(trim(v_member->>'email')),trim(v_member->>'mobile'),
            trim(v_member->>'course'),trim(v_member->>'year_semester'),trim(v_member->>'city'),
            trim(v_member->>'state'),v_inst_id)
    on conflict (institution_id,email) do update
      set full_name=excluded.full_name, mobile=excluded.mobile
    returning id into v_participant_id;
    if v_member = v_members->0 then v_primary_id := v_participant_id; end if;
  end loop;

  select count(distinct p.id) into v_existing_count from public.participants p where p.institution_id=v_inst_id;
  if v_existing_count > 15 then
    raise exception 'This institute has reached the limit of 15 unique participants.';
  end if;

  if exists (
    select 1
    from public.teams t
    join public.registration_team_members rtm on rtm.team_id=t.id
    join public.participants p on p.id=rtm.participant_id
    where t.event_id in (select jsonb_array_elements_text(v_events))
      and p.institution_id=v_inst_id
      and lower(p.email) in (select lower(m->>'email') from jsonb_array_elements(v_members) m)
  ) then
    raise exception 'One or more participants are already registered for a selected event.';
  end if;

  v_fee := 150 * (select count(distinct lower(m->>'email')) from jsonb_array_elements(v_members) m);
  insert into public.registrations(primary_participant_id,institution_id,amount_due,accommodation_requested,consent_terms,consent_privacy)
  values(v_primary_id,v_inst_id,v_fee,coalesce((payload->>'accommodation_requested')::boolean,false),true,true)
  returning id,reference into v_registration_id,v_reference;

  for v_event_id in select jsonb_array_elements_text(v_events) loop
    insert into public.teams(registration_id,event_id,team_name,team_leader_id)
    values(v_registration_id,v_event_id,nullif(trim(payload->>'team_name'),''),v_primary_id)
    returning id into v_team_id;
    for v_member in select value from jsonb_array_elements(v_members) loop
      select id into v_participant_id from public.participants
      where institution_id=v_inst_id and email=lower(trim(v_member->>'email'));
      insert into public.registration_team_members(team_id,participant_id,is_leader)
      values(v_team_id,v_participant_id,v_participant_id=v_primary_id);
    end loop;
  end loop;

  insert into public.accommodation_requests(registration_id,travelling_from_outside_jaipur,requested,people_count)
  values(v_registration_id,coalesce((payload->>'accommodation_requested')::boolean,false),
         coalesce((payload->>'accommodation_requested')::boolean,false),
         case when coalesce((payload->>'accommodation_requested')::boolean,false) then v_member_count else null end);

  return jsonb_build_object('reference',v_reference,'registration_id',v_registration_id,'amount_due',v_fee);
end;
$$;

revoke all on function public.submit_registration(jsonb) from public, anon, authenticated;
grant execute on function public.submit_registration(jsonb) to service_role;
