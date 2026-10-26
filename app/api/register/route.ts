import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const schema = z.object({
  full_name:z.string().trim().min(2).max(120),
  email:z.string().trim().email().max(254),
  mobile:z.string().trim().min(7).max(24),
  institution:z.string().trim().min(2).max(180),
  course:z.string().trim().min(2).max(100),
  year_semester:z.string().trim().min(1).max(50),
  city:z.string().trim().min(2).max(100),
  state:z.string().trim().min(2).max(100),
  events:z.string().min(1),
  team_size:z.string().regex(/^[1-4]$/),
  accommodation_requested:z.string().optional(),
  consent_terms:z.string().optional(),
  consent_privacy:z.string().optional()
});

export async function POST(request: Request) {
  let raw: unknown;
  try { raw = await request.json(); } catch { return NextResponse.json({error:"Invalid JSON body."},{status:400}); }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({error:"Please check all required fields and try again."},{status:400});
  const data = parsed.data;
  if (data.consent_terms !== "yes" || data.consent_privacy !== "yes") {
    return NextResponse.json({error:"Please accept the participation rules and privacy consent."},{status:400});
  }
  const eventIds = [...new Set(data.events.split(",").filter(Boolean))];
  const allowed = new Set(["idea-volcano","memeconomics","bulls-bears","code-acumen","web-vision","rolling-reels","fusion-fiesta","d4u","strings-unplugged"]);
  if (!eventIds.length || eventIds.some(id=>!allowed.has(id))) return NextResponse.json({error:"Please select valid events."},{status:400});

  try {
    const supabase = createAdminSupabase();
    // Until a transactional registration RPC is deployed, fail closed rather than
    // writing incomplete participant/team data or showing a false success.
    const { data: eventRows, error: eventError } = await supabase.from("events").select("id,is_open").in("id",eventIds);
    if (eventError) throw eventError;
    if (!eventRows || eventRows.length !== eventIds.length || eventRows.some(e=>!e.is_open)) {
      return NextResponse.json({error:"Online registration is not open for one or more selected events yet. Please contact iiim@icfia.org."},{status:409});
    }
    return NextResponse.json({error:"The registration database is reachable, but the organizer must finish the transactional team-registration workflow before submissions can be accepted. Please contact iiim@icfia.org."},{status:503});
  } catch (error) {
    console.error("Registration configuration error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({error:"Registration service is not configured yet. Please contact iiim@icfia.org."},{status:503});
  }
}
