import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
export const runtime="nodejs";
export async function GET(request:Request){
 const auth=await requireAdmin(request);if("error" in auth)return NextResponse.json({error:auth.error},{status:auth.status});
 const {data,error}=await auth.admin.from("events").select("*").order("name");
 if(error)return NextResponse.json({error:"Unable to load events."},{status:500});
 return NextResponse.json({events:data||[]});
}
export async function PATCH(request:Request){
 const auth=await requireAdmin(request);if("error" in auth)return NextResponse.json({error:auth.error},{status:auth.status});
 const body=await request.json().catch(()=>null);
 if(!body||typeof body.id!=="string")return NextResponse.json({error:"An event ID is required."},{status:400});
 const patch:Record<string,unknown>={};
 if(typeof body.is_open==="boolean")patch.is_open=body.is_open;
 if(body.capacity_teams===null||Number.isInteger(body.capacity_teams)&&body.capacity_teams>=0)patch.capacity_teams=body.capacity_teams;
 if(typeof body.min_team_size==="number"&&Number.isInteger(body.min_team_size)&&body.min_team_size>=1&&body.min_team_size<=4)patch.min_team_size=body.min_team_size;
 if(typeof body.max_team_size==="number"&&Number.isInteger(body.max_team_size)&&body.max_team_size>=1&&body.max_team_size<=4)patch.max_team_size=body.max_team_size;
 if(typeof body.description==="string"&&body.description.length<=3000)patch.description=body.description;
 if(typeof body.registration_deadline==="string"||body.registration_deadline===null)patch.registration_deadline=body.registration_deadline;
 if(!Object.keys(patch).length)return NextResponse.json({error:"No valid event changes supplied."},{status:400});
 const {data,error}=await auth.admin.from("events").update(patch).eq("id",body.id).select("*").single();
 if(error||!data)return NextResponse.json({error:"Event update failed. Check team-size settings and database constraints."},{status:400});
 await auth.admin.from("admin_audit_logs").insert({admin_user_id:auth.userId,action:"update_event",entity_type:"event",entity_id:body.id,details:patch});
 return NextResponse.json({event:data});
}
