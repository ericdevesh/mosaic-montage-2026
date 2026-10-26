import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { requireAdmin } from "@/lib/require-admin";

export const runtime="nodejs";
export async function GET(request:Request){
  const auth=await requireAdmin(request);
  if("error" in auth) return NextResponse.json({error:auth.error},{status:auth.status});
  const db=auth.admin;
  const [r,p,i,t,e,pay,a,tm]=await Promise.all([
    db.from("registrations").select("*").order("created_at",{ascending:false}),
    db.from("participants").select("*"),
    db.from("institutions").select("*"),
    db.from("teams").select("*"),
    db.from("events").select("*"),
    db.from("payment_records").select("*"),
    db.from("accommodation_requests").select("*")
  ]);
  if([r,p,i,t,e,pay,a,tm].some(x=>x.error)) return NextResponse.json({error:"Export query failed. Check database setup."},{status:500});
  const registrations=r.data||[],participants=p.data||[],institutions=i.data||[],teams=t.data||[],events=e.data||[],payments=pay.data||[],accommodation=a.data||[],memberships=tm.data||[];
  const byId=(items:any[],id:string)=>items.find(x=>x.id===id);
  const safe=(v:unknown)=>typeof v==="string"&&/^[=+\-@\t\r]/.test(v)?"'"+v:v??"";
  const wb=new ExcelJS.Workbook(); wb.creator="MOSAIC-MONTAGE 2026";wb.created=new Date();
  const addSheet=(name:string,headers:string[],rows:any[][])=>{
    const s=wb.addWorksheet(name);s.addRow([name,"Exported at",new Date().toISOString()]);s.addRow(headers);
    for(const row of rows)s.addRow(row.map(safe));
    s.views=[{state:"frozen",ySplit:2}];s.autoFilter={from:{row:2,column:1},to:{row:2,column:Math.max(headers.length,1)}};
    s.getRow(2).font={bold:true,color:{argb:"FFFFFFFF"}};s.getRow(2).fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF10243A"}};
    s.columns=headers.map((h,idx)=>({header:h,key:String(idx),width:Math.min(34,Math.max(14,h.length+3))}));
    return s;
  };
  addSheet("All Registrations",["Registration ID","Submitted at","Institution","Student name","Email","Mobile","Course","Year/semester","City","State","Selected events","Team name","Team leader","Team members","Fee calculated","Payment status","Institution verification","Accommodation requested","Registration status"],registrations.map(reg=>{
    const inst=byId(institutions,reg.institution_id),person=byId(participants,reg.primary_participant_id);
    const regTeams=teams.filter(x=>x.registration_id===reg.id),eventNames=regTeams.map(x=>byId(events,x.event_id)?.name||x.event_id).join(", ");
    return [reg.reference,reg.created_at,inst?.name,person?.full_name,person?.email,person?.mobile,person?.course,person?.year_semester,person?.city,person?.state,eventNames,regTeams.map(x=>x.team_name).filter(Boolean).join(", "),person?.full_name,regTeams.length,reg.amount_due,reg.payment,reg.verification,reg.accommodation_requested?"Yes":"No",reg.status];
  }));
  const rosterRows=participants.map(person=>{
    const inst=byId(institutions,person.institution_id);
    const links=teams.filter(team=>team.team_leader_id===person.id);
    const regs=registrations.filter(reg=>reg.institution_id===person.institution_id&&reg.primary_participant_id===person.id);
    const names=links.map(team=>byId(events,team.event_id)?.name||team.event_id).join(", ");
    return [person.id,person.full_name,person.email,person.mobile,inst?.name,person.course,person.year_semester,person.city,person.state,regs.map(x=>x.reference).join(", "),names];
  });
  addSheet("Participant Roster",["Participant ID","Name","Email","Mobile","Institution","Course","Year/semester","City","State","Registration reference","Selected events"],rosterRows);
  addSheet("Event-wise Summary",["Event","Registration count","Unique participants","Team count","Capacity","Registration open"],events.map(event=>{
    const et=teams.filter(team=>team.event_id===event.id),regIds=new Set(et.map(team=>team.registration_id));
    return [event.name,regIds.size,new Set(et.map(team=>team.team_leader_id)).size,et.length,event.capacity_teams??"Not set",event.is_open?"Open":"Closed"];
  }));
  addSheet("College-wise Summary",["Institution","Unique participants","Registrations","Events","Payments due","Verified payments","Accommodation requests"],institutions.map(inst=>{
    const ir=registrations.filter(reg=>reg.institution_id===inst.id);
    const ids=new Set(ir.map(reg=>reg.primary_participant_id));
    return [inst.name,participants.filter(person=>person.institution_id===inst.id).length,ir.length,[...new Set(ir.flatMap(reg=>teams.filter(team=>team.registration_id===reg.id).map(team=>byId(events,team.event_id)?.name||team.event_id)))].join(", "),ir.reduce((sum,reg)=>sum+Number(reg.amount_due||0),0),ir.filter(reg=>reg.payment==="paid").reduce((sum,reg)=>sum+Number(reg.amount_paid||0),0),accommodation.filter(req=>ir.some(reg=>reg.id===req.registration_id)&&req.requested).length];
  }));
  addSheet("Payments",["Registration reference","Institution","Participant/team reference","Amount due","Amount paid","Payment status","Verification date","Notes"],payments.map(payment=>{
    const reg=byId(registrations,payment.registration_id),inst=reg?byId(institutions,reg.institution_id):null;
    return [reg?.reference,inst?.name,payment.registration_id,payment.amount,reg?.amount_paid,payment.status,payment.verified_at,payment.reference_note];
  }));
  const buffer=await wb.xlsx.writeBuffer();
  return new Response(buffer,{status:200,headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":'attachment; filename="mosaic-montage-2026-registrations.xlsx"',"Cache-Control":"no-store"}});
}
