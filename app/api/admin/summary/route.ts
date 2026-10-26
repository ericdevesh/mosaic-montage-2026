import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

export const runtime="nodejs";
export async function GET(request:Request){
  const auth=await requireAdmin(request);
  if("error" in auth) return NextResponse.json({error:auth.error},{status:auth.status});
  const db=auth.admin;
  const [regs,people,colleges,teams,payments,verifications,accommodation]=await Promise.all([
    db.from("registrations").select("id",{count:"exact",head:true}),
    db.from("participants").select("id",{count:"exact",head:true}),
    db.from("institutions").select("id",{count:"exact",head:true}),
    db.from("teams").select("id",{count:"exact",head:true}),
    db.from("registrations").select("id",{count:"exact",head:true}).eq("payment","pending"),
    db.from("registrations").select("id",{count:"exact",head:true}).eq("verification","pending"),
    db.from("accommodation_requests").select("id",{count:"exact",head:true}).eq("requested",true)
  ]);
  const errors=[regs,people,colleges,teams,payments,verifications,accommodation].filter(x=>x.error);
  if(errors.length) return NextResponse.json({error:"Unable to load dashboard data."},{status:500});
  return NextResponse.json({registrations:regs.count||0,participants:people.count||0,colleges:colleges.count||0,teams:teams.count||0,pendingPayments:payments.count||0,pendingVerification:verifications.count||0,accommodation:accommodation.count||0});
}
