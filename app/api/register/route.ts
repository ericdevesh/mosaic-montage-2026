import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const person = z.object({
  full_name:z.string().trim().min(2).max(120),
  email:z.string().trim().email().max(254),
  mobile:z.string().trim().min(7).max(24),
  course:z.string().trim().min(2).max(100),
  year_semester:z.string().trim().min(1).max(50),
  city:z.string().trim().min(2).max(100),
  state:z.string().trim().min(2).max(100)
});
const schema = z.object({
  full_name:z.string().trim().min(2).max(120),
  email:z.string().trim().email().max(254),
  mobile:z.string().trim().min(7).max(24),
  institution:z.string().trim().min(2).max(180),
  course:z.string().trim().min(2).max(100),
  year_semester:z.string().trim().min(1).max(50),
  city:z.string().trim().min(2).max(100),
  state:z.string().trim().min(2).max(100),
  events:z.array(z.string()).min(1).max(9),
  team_name:z.string().trim().max(120).optional(),
  team_size:z.number().int().min(1).max(4),
  members:z.array(person).min(1).max(4),
  accommodation_requested:z.boolean().default(false),
  consent_terms:z.boolean(),
  consent_privacy:z.boolean(),
  coordinator_name:z.string().max(120).optional(),
  coordinator_designation:z.string().max(120).optional(),
  official_email:z.string().email().optional().or(z.literal("")),
  coordinator_phone:z.string().max(24).optional()
});

export async function POST(request: Request) {
  let raw: unknown;
  try { raw = await request.json(); }
  catch { return NextResponse.json({error:"Invalid request body."},{status:400}); }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({error:"Please check all required fields and participant details."},{status:400});
  const data = parsed.data;
  if (!data.consent_terms || !data.consent_privacy) {
    return NextResponse.json({error:"Both participation rules and privacy consent are required."},{status:400});
  }
  const allowed = new Set(["idea-volcano","memeconomics","bulls-bears","code-acumen","web-vision","rolling-reels","fusion-fiesta","d4u","strings-unplugged"]);
  const eventIds = [...new Set(data.events)];
  if (eventIds.length !== data.events.length || eventIds.some(id=>!allowed.has(id))) {
    return NextResponse.json({error:"Selected events contain an invalid or duplicate entry."},{status:400});
  }
  if (data.members.length !== data.team_size) {
    return NextResponse.json({error:"Please provide details for every team member."},{status:400});
  }
  const members = data.members.map(m=>({...m,email:m.email.trim().toLowerCase()}));
  if (new Set(members.map(m=>m.email)).size !== members.length) {
    return NextResponse.json({error:"Each team member must use a different email address."},{status:400});
  }
  if (members[0].email !== data.email.trim().toLowerCase()) {
    return NextResponse.json({error:"The first participant must be the primary contact."},{status:400});
  }
  try {
    const supabase = createAdminSupabase();
    const {data:result,error} = await supabase.rpc("submit_registration",{
      payload:{
        institution:data.institution, city:data.city, state:data.state,
        coordinator_name:data.coordinator_name || null,
        coordinator_designation:data.coordinator_designation || null,
        official_email:data.official_email || null,
        coordinator_phone:data.coordinator_phone || null,
        members, events:eventIds, team_name:data.team_name || null,
        accommodation_requested:data.accommodation_requested,
        consent_terms:data.consent_terms, consent_privacy:data.consent_privacy
      }
    });
    if(error) {
      const safeMessage = error.message || "Registration could not be saved.";
      const status = /not open|capacity|deadline|limit of 15|team size|duplicate|invalid|consent|required/i.test(safeMessage) ? 409 : 503;
      return NextResponse.json({error:safeMessage},{status});
    }
    return NextResponse.json({reference:result.reference,amount_due:result.amount_due},{status:201});
  } catch(error) {
    console.error("Registration service error:",error instanceof Error?error.message:"unknown");
    return NextResponse.json({error:"Registration service is not configured. Please contact iiim@icfia.org."},{status:503});
  }
}
