"use client";

import { FormEvent, useState } from "react";

const eventOptions = [
  ["idea-volcano","IDEA VOLCANO","Individual · 1 member"],["memeconomics","MEMECONOMICS","Individual · 1 member"],
  ["bulls-bears","BULLS & BEARS","Team · 2 members"],["code-acumen","CODE ACUMEN","Team · 2 members"],
  ["web-vision","WEB VISION","Team · 2 members"],["rolling-reels","ROLLING REELS","Individual · 1 member"],
  ["fusion-fiesta","FUSION FIESTA","Team · 1–2 members"],["d4u","D4U","Team · 1–4 members"],
  ["strings-unplugged","STRINGS UNPLUGGED","Individual · 1 member"]
];

export default function RegisterPage() {
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const [reference,setReference] = useState("");
  const [amount,setAmount] = useState<number|null>(null);
  const [selected,setSelected] = useState<string[]>([]);
  const [teamSize,setTeamSize] = useState(1);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage(""); setReference(""); setAmount(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (key:string) => String(fd.get(key) ?? "").trim();
    const members = Array.from({length:teamSize},(_,i)=>{
      if(i===0) return {
        full_name:get("full_name"),email:get("email"),mobile:get("mobile"),
        course:get("course"),year_semester:get("year_semester"),city:get("city"),state:get("state")
      };
      return {
        full_name:get(`member_name_${i}`),email:get(`member_email_${i}`),mobile:get(`member_mobile_${i}`),
        course:get("course"),year_semester:get("year_semester"),city:get("city"),state:get("state")
      };
    });
    const payload = {
      full_name:get("full_name"),email:get("email"),mobile:get("mobile"),institution:get("institution"),
      course:get("course"),year_semester:get("year_semester"),city:get("city"),state:get("state"),
      events:selected,team_size:teamSize,members,team_name:get("team_name"),
      coordinator_name:get("coordinator_name"),coordinator_designation:get("coordinator_designation"),
      official_email:get("official_email"),coordinator_phone:get("coordinator_phone"),
      accommodation_requested:fd.get("accommodation_requested")==="yes",
      consent_terms:fd.get("consent_terms")==="yes",consent_privacy:fd.get("consent_privacy")==="yes"
    };
    try {
      const response = await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result = await response.json();
      if(!response.ok) throw new Error(result.error || "Registration could not be submitted.");
      setReference(result.reference);setAmount(result.amount_due);setMessage("Your registration has been saved successfully.");form.reset();setSelected([]);setTeamSize(1);
    } catch(err) {
      setMessage(err instanceof Error?err.message:"Something went wrong. Please try again.");
    } finally {setBusy(false);}
  }

  return <main style={{minHeight:"100vh",padding:"42px 0 70px"}}>
    <div className="container" style={{maxWidth:900}}>
      <a href="/" style={{color:"var(--teal)",fontWeight:800}}>← Back to fest website</a>
      <div style={{marginTop:26,marginBottom:24}}><div className="eyebrow">MOSAIC-MONTAGE 2026 · IIIM JAIPUR</div><h1 style={{fontSize:"clamp(2.5rem,7vw,4rem)",letterSpacing:"-.06em",color:"var(--navy)",margin:"12px 0"}}>Student registration</h1><p className="muted">20–21 November 2026 · Published fee ₹150 per participant. Team members are counted once per institution for the 15-student limit.</p></div>
      {message && <div role="status" className={reference?"success-note":"notice"} style={{marginBottom:20}}>{message}{reference && <div style={{marginTop:10}}><strong>Registration reference: {reference}</strong>{amount!==null&&<p style={{margin:"6px 0 0"}}>Registration fee due: ₹{amount}</p>}</div>}</div>}
      <form onSubmit={submit} className="day form-layout">
        <h2>01 / Primary contact</h2>
        <div className="fields">
          <label>Full name *<input name="full_name" required minLength={2} autoComplete="name" className="form-control"/></label>
          <label>Email address *<input name="email" type="email" required autoComplete="email" className="form-control"/></label>
          <label>Mobile with country code *<input name="mobile" required minLength={7} placeholder="+91..." className="form-control"/></label>
          <label>College / institute *<input name="institution" required minLength={2} className="form-control"/></label>
          <label>Course / degree *<input name="course" required className="form-control"/></label>
          <label>Current year / semester *<input name="year_semester" required className="form-control"/></label>
          <label>City *<input name="city" required className="form-control"/></label>
          <label>State *<input name="state" required className="form-control"/></label>
        </div>
        <h2>02 / Institution coordinator <span className="optional">Optional</span></h2>
        <div className="fields">
          <label>Coordinator name<input name="coordinator_name" className="form-control"/></label>
          <label>Designation<input name="coordinator_designation" className="form-control"/></label>
          <label>Official institutional email<input name="official_email" type="email" className="form-control"/></label>
          <label>Coordinator contact number<input name="coordinator_phone" className="form-control"/></label>
        </div>
        <h2>03 / Select events</h2>
        <p className="muted">The same team members are registered for each selected event. Team size must meet the requirements of every selected event.</p>
        <div className="event-options">{eventOptions.map(([id,name,format])=><label key={id} className="event-option"><input type="checkbox" checked={selected.includes(id)} onChange={e=>setSelected(old=>e.target.checked?[...old,id]:old.filter(x=>x!==id))}/><span><strong>{name}</strong><small>{format}</small></span></label>)}</div>
        <div className="fields">
          <label>Team name (if applicable)<input name="team_name" className="form-control" placeholder="Enter your team name"/></label>
          <label>Number of team members<select value={teamSize} onChange={e=>setTeamSize(Number(e.target.value))} className="form-control">{[1,2,3,4].map(n=><option key={n} value={n}>{n} participant{n>1?"s":""}</option>)}</select></label>
        </div>
        {teamSize>1 && <div className="member-panel"><h3>Additional team members</h3><p className="muted">Enter each teammate’s name, unique email and mobile number. Course, year/semester, city and state are taken from the primary contact for these additional entries.</p>{Array.from({length:teamSize-1},(_,i)=><div className="fields member-fields" key={i}><label>Member {i+2} full name *<input name={`member_name_${i+1}`} required minLength={2} className="form-control"/></label><label>Member {i+2} email *<input name={`member_email_${i+1}`} required type="email" className="form-control"/></label><label>Member {i+2} mobile *<input name={`member_mobile_${i+1}`} required minLength={7} className="form-control"/></label></div>)}</div>}
        <h2>04 / Accommodation</h2>
        <label className="check-line"><input name="accommodation_requested" type="checkbox" value="yes"/> Request accommodation (subject to confirmation).</label>
        <p className="muted">Outstation accommodation intimation should be provided 15 days in advance. The suggested cutoff is 5 November 2026; availability is not guaranteed.</p>
        <h2>05 / Review & consent</h2>
        <div className="fee-summary"><span>Participants in this submission</span><strong>{teamSize}</strong><span>Estimated fee for unique participants</span><strong>₹{teamSize*150}</strong><small>Final fee is calculated by the server from unique participant records. Additional event selections do not automatically multiply the participant fee.</small></div>
        <label className="check-line"><input name="consent_terms" type="checkbox" required value="yes"/> I agree to the participation rules and understand that schedule details may change.</label>
        <label className="check-line"><input name="consent_privacy" type="checkbox" required value="yes"/> I consent to use of these details for event registration and coordination.</label>
        <div className="notice">Do not pay to an unofficial account. Use only payment instructions verified by the organizers. The system will not mark payment as received automatically.</div>
        <button disabled={busy||selected.length===0} className="btn btn-primary submit-button" type="submit">{busy?"Submitting registration…":"Submit registration →"}</button>
        <small className="muted">A unique reference is displayed only after the database confirms that the registration was saved.</small>
      </form>
    </div>
    <style jsx>{`
      .form-layout{display:grid;gap:18px}.form-layout h2{font-size:1.2rem;color:var(--navy);margin:12px 0 0}.optional{font-size:.75rem;color:var(--muted);font-weight:500}
      .fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.fields label{font-size:.9rem;font-weight:650;color:var(--ink)}
      .form-control{display:block;width:100%;margin-top:7px;border:1px solid #d7dce0;border-radius:10px;background:white;padding:12px;color:#243447;min-height:45px}
      .form-control:focus{outline:2px solid #0f9e9a;outline-offset:2px}
      .event-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.event-option{display:flex;gap:11px;align-items:center;border:1px solid #e5e2d9;border-radius:13px;padding:14px;background:#fff;cursor:pointer}.event-option input,.check-line input{accent-color:#0f9e9a;width:17px;height:17px;flex-shrink:0}.event-option strong,.event-option small{display:block}.event-option strong{font-size:.9rem;color:var(--navy)}.event-option small{font-size:.78rem;color:var(--muted);margin-top:4px}
      .member-panel{border:1px solid #d9e9e5;background:#f4fbf9;border-radius:16px;padding:18px}.member-panel h3{margin:0;color:var(--navy)}.member-fields{padding-top:12px;border-top:1px solid #dcebe7;margin-top:12px}
      .check-line{display:flex;align-items:flex-start;gap:10px;line-height:1.55;font-size:.92rem}.check-line input{margin-top:3px}
      .fee-summary{display:grid;grid-template-columns:1fr auto;gap:9px;padding:17px;border-radius:14px;background:#f2efe6}.fee-summary strong{color:var(--navy)}.fee-summary small{grid-column:1/-1;color:var(--muted);line-height:1.5}
      .submit-button{width:100%;border:0}.success-note{border-left:4px solid #0f9e9a;background:#e1f5f1;padding:16px 18px;border-radius:0 14px 14px 0;color:#164c49}
      @media(max-width:600px){.fields,.event-options{grid-template-columns:1fr}.form-layout{padding:18px}.member-panel{padding:12px}}
    `}</style>
  </main>;
}
