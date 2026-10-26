import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
export const runtime="nodejs";
export async function GET(request:Request){
 const auth=await requireAdmin(request);if("error" in auth)return NextResponse.json({error:auth.error},{status:auth.status});
 const db=auth.admin;
 const [r,p,i,t,e]=await Promise.all([db.from("registrations").select("*").order("created_at",{ascending:false}).limit(500),db.from("participants").select("*"),db.from("institutions").select("*"),db.from("teams").select("*"),db.from("events").select("id,name")]);
 if([r,p,i,t,e].some(x=>x.error))return NextResponse.json({error:"Unable to load registration records."},{status:500});
 const people=p.data||[],institutions=i.data||[],teams=t.data||[],events=e.data||[];
 const rows=(r.data||[]).map(reg=>{
  const person=people.find(x=>x.id===reg.primary_participant_id),institution=institutions.find(x=>x.id===reg.institution_id);
  const eventTeams=teams.filter(x=>x.registration_id===reg.id);
  return {...reg,student_name:person?.full_name||"",email:person?.email||"",mobile:person?.mobile||"",institution_name:institution?.name||"",event_names:eventTeams.map(team=>events.find(ev=>ev.id===team.event_id)?.name||team.event_id).join(", ")};
 });
 return NextResponse.json({registrations:rows});
}
export async function PATCH(request:Request){
 const auth=await requireAdmin(request);if("error" in auth)return NextResponse.json({error:auth.error},{status:auth.status});
 const body=await request.json().catch(()=>null);
 if(!body||typeof body.id!=="string")return NextResponse.json({error:"Registration ID is required."},{status:400});
 const allowedStatus=["submitted","approved","rejected","cancelled"],allowedPayment=["pending","submitted","paid","rejected","waived"],allowedVerification=["pending","verified","rejected"];
 const patch:Record<string,unknown>={updated_at:new Date().toISOString()};
 if(typeof body.status==="string"&&allowedStatus.includes(body.status))patch.status=body.status;
 if(typeof body.payment==="string"&&allowedPayment.includes(body.payment))patch.payment=body.payment;
 if(typeof body.verification==="string"&&allowedVerification.includes(body.verification))patch.verification=body.verification;
 if(typeof body.internal_notes==="string"&&body.internal_notes.length<=2000)patch.internal_notes=body.internal_notes;
 if(Object.keys(patch).length===1)return NextResponse.json({error:"No valid status changes supplied."},{status:400});
 const {data,error}=await auth.admin.from("registrations").update(patch).eq("id",body.id).select("id,reference,status,payment,verification,updated_at").single();
 if(error||!data)return NextResponse.json({error:"Registration update failed."},{status:400});
 await auth.admin.from("admin_audit_logs").insert({admin_user_id:auth.userId,action:"update_registration",entity_type:"registration",entity_id:body.id,details:patch});
 return NextResponse.json({registration:data});
}
