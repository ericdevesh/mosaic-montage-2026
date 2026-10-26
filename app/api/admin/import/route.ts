import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { Readable } from "node:stream";
import { requireAdmin } from "@/lib/require-admin";

export const runtime="nodejs";
const headers=["full_name","email","mobile","institution","course","year_semester","city","state","event_ids"];
type ImportRow={row:number;status:"ready"|"invalid"|"duplicate"|"imported"|"failed";detail:string;data?:{full_name:string;email:string;mobile:string;institution:string;course:string;year_semester:string;city:string;state:string;events:string[]}};

export async function GET(request:Request){
  const auth=await requireAdmin(request);
  if("error" in auth)return NextResponse.json({error:auth.error},{status:auth.status});
  const wb=new ExcelJS.Workbook(),sheet=wb.addWorksheet("Import Template");
  sheet.addRow(headers);sheet.views=[{state:"frozen",ySplit:1}];sheet.autoFilter={from:"A1",to:"I1"};
  const info=wb.addWorksheet("Instructions");
  info.addRow(["Required column","What to enter"]);
  info.addRows([
    ["full_name","Participant's full name"],["email","Unique email address"],["mobile","Mobile number including country code"],
    ["institution","Official institution name"],["course","Course or degree"],["year_semester","Current year or semester"],
    ["city","City"],["state","State"],["event_ids","Comma-separated event IDs; e.g. idea-volcano"]
  ]);
  const buffer=await wb.xlsx.writeBuffer();
  return new Response(buffer,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":'attachment; filename="mosaic-import-template.xlsx"',"Cache-Control":"no-store"}});
}

export async function POST(request:Request){
  const auth=await requireAdmin(request);
  if("error" in auth)return NextResponse.json({error:auth.error},{status:auth.status});
  const form=await request.formData(),file=form.get("file"),mode=String(form.get("mode")||"preview");
  if(!(file instanceof File))return NextResponse.json({error:"Upload an .xlsx or .csv file."},{status:400});
  if(file.size>5*1024*1024)return NextResponse.json({error:"File exceeds the 5 MB limit."},{status:413});
  const ext=file.name.toLowerCase().split(".").pop();
  if(!["xlsx","csv"].includes(ext||""))return NextResponse.json({error:"Only .xlsx and .csv files are supported."},{status:400});
  const bytes=Buffer.from(await file.arrayBuffer()),wb=new ExcelJS.Workbook();
  try{if(ext==="csv")await wb.csv.read(Readable.from(bytes.toString("utf8")));else await wb.xlsx.load(bytes);}
  catch{return NextResponse.json({error:"The spreadsheet could not be read."},{status:400});}
  const sheet=wb.worksheets[0];
  if(!sheet||sheet.rowCount<2)return NextResponse.json({error:"The spreadsheet has no data rows."},{status:400});
  const normalize=(v:ExcelJS.CellValue)=>String(v??"").trim().toLowerCase().replace(/[\s/-]+/g,"_");
  const map=new Map<string,number>();
  sheet.getRow(1).eachCell((cell,col)=>map.set(normalize(cell.value as ExcelJS.CellValue),col));
  const missing=headers.filter(h=>!map.has(h));
  if(missing.length)return NextResponse.json({error:"Missing required columns: "+missing.join(", ")},{status:400});

  const db=auth.admin,rows:ImportRow[]=[],seen=new Set<string>();
  const eventResult=await db.from("events").select("id,name,is_open,min_team_size,max_team_size");
  if(eventResult.error)return NextResponse.json({error:"Unable to validate event IDs."},{status:500});
  const events=new Map((eventResult.data||[]).map(e=>[e.id,e]));
  for(let rowNum=2;rowNum<=sheet.rowCount;rowNum++){
    const row=sheet.getRow(rowNum),rowValues=row.values as ExcelJS.CellValue[];
    if(row.cellCount===0||rowValues.slice(1).every(v=>String(v??"").trim()===""))continue;
    const val=(key:string)=>String(row.getCell(map.get(key)!).text??"").trim();
    const data={full_name:val("full_name"),email:val("email").toLowerCase(),mobile:val("mobile"),institution:val("institution"),course:val("course"),year_semester:val("year_semester"),city:val("city"),state:val("state"),events:val("event_ids").split(/[;,]/).map(x=>x.trim()).filter(Boolean)};
    const errors:string[]=[];
    if(data.full_name.length<2)errors.push("full_name is required");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))errors.push("valid email required");
    if(data.mobile.replace(/\D/g,"").length<7)errors.push("valid mobile required");
    if(!data.institution||!data.course||!data.year_semester||!data.city||!data.state)errors.push("institution/course/year/city/state required");
    if(!data.events.length)errors.push("event_ids required");
    if(data.events.some(id=>!events.has(id)))errors.push("unknown event ID");
    if(data.events.some(id=>events.has(id)&&!events.get(id)?.is_open))errors.push("one or more selected events are closed");
    if(data.events.some(id=>events.has(id)&&(events.get(id)!.min_team_size>1||events.get(id)!.max_team_size<1)))errors.push("team events need team-member details; bulk import currently supports individual registrations only");
    if(errors.length){rows.push({row:rowNum,status:"invalid",detail:errors.join("; "),data});continue;}
    if(seen.has(data.email)){rows.push({row:rowNum,status:"duplicate",detail:"Email appears more than once in this file",data});continue;}
    seen.add(data.email);
    const {data:existing,error}=await db.from("participants").select("id").eq("email",data.email).limit(1);
    if(error){rows.push({row:rowNum,status:"invalid",detail:"Could not check duplicate email",data});continue;}
    if(existing?.length){rows.push({row:rowNum,status:"duplicate",detail:"Email already exists in participant records",data});continue;}
    rows.push({row:rowNum,status:"ready",detail:"Passed basic validation; server will recheck limits and event rules",data});
  }
  if(mode!=="commit"){
    return NextResponse.json({mode:"preview",total:rows.length,ready:rows.filter(x=>x.status==="ready").length,invalid:rows.filter(x=>x.status==="invalid").length,duplicates:rows.filter(x=>x.status==="duplicate").length,results:rows});
  }

  const results:ImportRow[]=[];
  for(const item of rows){
    if(item.status!=="ready"||!item.data){results.push(item);continue;}
    const data=item.data;
    const {data:result,error}=await db.rpc("submit_registration",{payload:{
      institution:data.institution,city:data.city,state:data.state,
      members:[{full_name:data.full_name,email:data.email,mobile:data.mobile,course:data.course,year_semester:data.year_semester,city:data.city,state:data.state}],
      events:data.events,team_name:null,accommodation_requested:false,consent_terms:true,consent_privacy:true
    }});
    if(error)results.push({...item,status:"failed",detail:error.message});
    else results.push({...item,status:"imported",detail:String(result?.reference||"Saved")});
  }
  return NextResponse.json({mode:"commit",total:results.length,imported:results.filter(x=>x.status==="imported").length,invalid:results.filter(x=>x.status==="invalid").length,duplicates:results.filter(x=>x.status==="duplicate").length,failed:results.filter(x=>x.status==="failed").length,results});
}
