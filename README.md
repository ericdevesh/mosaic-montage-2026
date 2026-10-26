# MOSAIC-MONTAGE 2026

Responsive event website and registration system for the 27th Annual Management & IT Fest hosted by IIIM Jaipur.

## Implemented

- Responsive event landing page with event cards, schedule, rules and contact details.
- Student registration form with primary contact, additional team members, event selection, consent and accommodation request.
- Server-side validation and a PostgreSQL RPC for atomic registration submission, unique registration references, event-open checks, team-size checks, capacity checks, and the 15-unique-participant institute limit.
- Supabase Auth-backed organizer sign-in with server-side authorization against `public.admin_users`.
- Admin overview, event open/close and capacity controls, registration search and status updates with audit entries.
- Authorized Excel export with five worksheets.
- Authorized .xlsx/.csv bulk import with row-level result reporting and a downloadable template.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Supabase PostgreSQL/Auth
- ExcelJS for .xlsx import/export
- Zod for server-side input validation

## Local setup

1. Install Node.js 20 or later.
2. Clone this repository.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Create a Supabase project and set the URL, anon key and server-only service-role key.
6. Apply the SQL migrations in order: `supabase/migrations/001_initial_schema.sql`, then `supabase/migrations/002_submit_registration_rpc.sql`.
7. Create an organizer user in Supabase Authentication.
8. In the Supabase SQL Editor, add the organizer's Auth user UUID:
   ```sql
   insert into public.admin_users (user_id) values ('YOUR_AUTH_USER_UUID');
   ```
9. Run `npm run dev` and open http://localhost:3000.

## Environment variables

See `.env.example`. Never expose `SUPABASE_SERVICE_ROLE_KEY) in browser code or commit real secrets to GitHub.

## Configure event registration

All events are seeded closed by default. Sign in at `/admin` after database setup, review the rules/team sizes/capacity, and open only events the organizers have authorized for registration. Registration checks each selected event's team size; one submission currently applies the same participant team to all selected events.

## Excel import template

Use the admin dashboard to download the template. Required columns:

- `full_name`
- `email`
- `mobile`
- `institution`
- `course`
- `year_semester`
- `city`
- `state`
- `event_ids` — comma- or semicolon-separated database event IDs, for example `idea-volcano`

Imported records are subject to the same event-open and team-size rules as online registration. Review each row's outcome; the import summary does not imply failed or skipped rows were saved.

## Deployment

Import the repository into Vercel and set the environment variables there. Configure the production Supabase URL and allowed redirect URLs. Then apply migrations and verify the organizer login, test registration, admin status updates, and export/import workflows in the deployed environment before publicizing the URL.

## Event facts

- Dates: 20–21 November 2026
- Registration fee: ₹150 per participant
- Maximum: 15 unique participating students per institute
- Address: Sector-12, Mahaveer Marg, Mansarovar, Jaipur – 302020
- Help desk: 0141-2781154 / 0141-2781155 / 93582-10063
- Email: iiim@icfia.org
- Official website: https://www.icfia.org

## Important notes

- Some schedule times in the brochure are ambiguous; the public page flags starred entries for organizer confirmation.
- The initial accommodation-intimation cutoff is 5 November 2026; confirm this with organizers before publishing.
- The initial registration form collects additional team members' names, emails and mobile numbers; course/year/city/state are inherited from the primary contact for those additional members.
- Email notifications, document upload/verification, payment screenshot handling, and rollback of multi-row imports are not yet implemented.
- Complete a security and functional review before collecting real student data.
