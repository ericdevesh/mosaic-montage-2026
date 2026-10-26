import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { Readable } from "node:stream";
import { requireAdmin } from "@/lib/require-admin";

export const runtime="nodejs";
const headers=["full_name","email","mobile","institution","course","year_semester","city","state","event_ids"];
export async function GET(request:Request){
  const auth=await requireAdmin(request);
  if("error" in auth) return NextResponse.json({error:auth.error},{status:auth.status});
  const wb=new ExcelJS.Workbook(),sheet=wb.addWorksheet("Import Template");
  sheet.addRow(headers);sheet.addRow(["Sample Student","student@example.com","+91 9876543210","Example College","MCA","Semester 1","Jaipur","Rajasthan","idea-volcano"]);
  sheet.views=[{state:"frozen",ySplit:1}];sheet.autoFilter={from:"A1",to:"I1"};
  const buffer=await wb.xlsx.writeBuffer();
  return new Response(buffer,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":'attachment; filename="mosaic-import-template.xlsx"',"Cache-Control":"no-store"}});
}
export async function POST(request:Request){
  const auth=await requireAdmin(request);
  if("error" in auth) return NextResponse.json({error:auth.error},{status:auth.status});
  const form=await request.formData(),file=form.get("file");
  if(!(file instanceof File)) return NextResponse.json({error:"Upload an .xlsx or .csv file."},{status:400});
  if(file.size>5*1024*1024) return NextResponse.json({error:"File exceeds the 5 MB limit."},{status:413});
  const ext=file.name.toLowerCase().split(".").pop();
  if(!["xlsx","csv"].includes(ext||"")) return NextResponse.json({error:"Only .xlsx and .csv files are supported."},{status:400});
  const bytes=Buffer.from(await file.arrayBuffer()),wb=new ExcelJS.Workbook();
  try{
    if(ext==="csv") await wb.csv.read(Readable.from(bytes.toString("utf8")));
    else await wb.xlsx.load(bytes);
  }catch{return NextResponse.json({error:"The spreadsheet could not be read."},{status:400});}
  const sheet=wb.worksheets[0];
  if(!sheet||sheet.rowCount<2) return NextResponse.json({error:"The spreadsheet has no data rows."},{status:400});
  const normalize=(v:ExcelJS.CellValue)=>String(v??"").trim().toLowerCase().replace(/[\s/-]+/g,"_");
  const first=sheet.getRow(1),map=new Map<string,number>();
  first.eachCell((cell,col)=>map.set(normalize(cell.value as ExcelJS.CellValue),col));
  const missing=headers.filter(h=>!map.has(h));
  if(missing.length) return NextResponse.json({error:"Missing required columns: "+missing.join(", ")},{status:400});
  const db=auth.admin,results:{row:number,status:string,detail:string}[]=[];
  for(let rowNum=2;rowNum<=sheet.rowCount;rowNum++){
    const row=sheet.getRow(rowNum);
    const rowValues=row.values as ExcelJS.CellValue[];
    if(row.cellCount===0||rowValues.slice(1).every(v=>String(v??"").trim()==="")) continue;
    const val=(key:string)=>String(row.getCell(map.get(key)!).text??"").trim();
    const item={full_name:val("full_name"),email:val("email").toLowerCase(),mobile:val("mobile"),institution:val("institution"),course:val("course"),year_semester:val("year_semester"),city:val("city"),state:val("state"),events:val("event_ids").split(/[;,]/).map(x=>x.trim()).filter(Boolean)};
    const errors:string[]=[];
    if(item.full_name.length<2)errors.push("full_name is required");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email))errors.push("valid email required");
    if(item.mobile.replace(/\D/g,"").length<7)errors.push("valid mobile required");
    if(!item.institution||!item.course||!item.year_semester||!item.city||!item.state)errors.push("institution/course/year/city/state required");
    if(!item.events.length)errors.push("event_ids required");
    if(errors.length){results.push({row:rowNum,status:"invalid",detail:errors.join("; ")});continue;}
    const {data:existing}=await db.from("participants").select("id").eq("email",item.email).limit(1);
    if(existing?.length){results.push({row:rowNum,status:"skipped",detail:"Email already exists in participant records"});continue;}
    const {data,error}=await db.rpc("submit_registration",{payload:{
      institution:item.institution,city:item.city,state:item.state,
      members:[{full_name:item.full_name,email:item.email,mobile:item.mobile,course:item.course,year_semester:item.year_semester,city:item.city,state:item.state}],
      events:item.events,team_name:null,accommodation_requested:false,consent_terms:true,consent_privacy:true
    }});
    if(error)results.push({row:rowNum,status:"failed",detail:error.message});
    else results.push({row:rowNum,status:"imported",detail:String(data?.reference||"Saved")});
  }
  return NextResponse.json({total:results.length,imported:results.filter(x=>x.status==="imported").length,invalid:results.filter(x=>x.status==="invalid").length,skipped:results.filter(x=>x.status==="skipped").length,failed:results.filter(x=>x.status==="failed").length,results});
}
