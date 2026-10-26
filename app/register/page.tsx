"use client";

import { FormEvent, useState } from "react";

const eventOptions = [
  ["idea-volcano","IDEA VOLCANO"],["memeconomics","MEMECONOMICS"],["bulls-bears","BULLS & BEARS"],
  ["code-acumen","CODE ACUMEN"],["web-vision","WEB VISION"],["rolling-reels","ROLLING REELS"],
  ["fusion-fiesta","FUSION FIESTA"],["d4u","D4U"],["strings-unplugged","STRINGS UNPLUGGED"]
];

export default function RegisterPage() {
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const [reference,setReference] = useState("");
  const [selected,setSelected] = useState<string[]>([]);
  const [teamSize,setTeamSize] = useState("1");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage(""); setReference("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.events = selected.join(",");
    payload.team_size = teamSize;
    try {
      const response = await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration could not be submitted.");
      setReference(result.reference);
      setMessage("Your registration has been received.");
      e.currentTarget.reset(); setSelected([]);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  }
  return <main style={{minHeight:"100vh",padding:"48px 0"}}>
    <div className="container" style={{maxWidth:820}}>
      <a href="/" style={{color:"var(--teal)",fontWeight:800}}>← Back to fest website</a>
      <div style={{marginTop:26,marginBottom:24}}><div className="eyebrow">MOSAIC-MONTAGE 2026</div><h1 style={{fontSize:"clamp(2.5rem,7vw,4rem)",letterSpacing:"-.06em",color:"var(--navy)",margin:"12px 0"}}>Student registration</h1><p className="muted">Registration costs ₹150 per participant. Your submission can only be confirmed when the registration service and database have been configured by the organizers.</p></div>
      {message && <div role="status" className="notice" style={{marginBottom:20}}>{message}{reference && <p><strong>Registration reference: {reference}</strong></p>}</div>}
      <form onSubmit={submit} className="day" style={{display:"grid",gap:18}}>
        <h2 style={{margin:0,color:"var(--navy)"}}>Student details</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
          <label>Full name *<input name="full_name" required autoComplete="name" className="form-control" /></label>
          <label>Email address *<input name="email" type="email" required autoComplete="email" className="form-control" /></label>
          <label>Mobile with country code *<input name="mobile" required placeholder="+91..." className="form-control" /></label>
          <label>College / institute *<input name="institution" required className="form-control" /></label>
          <label>Course / degree *<input name="course" required className="form-control" /></label>
          <label>Year / semester *<input name="year_semester" required className="form-control" /></label>
          <label>City *<input name="city" required className="form-control" /></label>
          <label>State *<input name="state" required className="form-control" /></label>
        </div>
        <h2 style={{margin:"10px 0 0",color:"var(--navy)"}}>Choose events</h2>
        <p className="muted" style={{margin:0}}>Select every event you want to participate in. Team registration requires full member details; this initial form collects the primary participant only.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
          {eventOptions.map(([id,name])=><label key={id} style={{display:"flex",gap:10,alignItems:"center",border:"1px solid #e5e2d9",borderRadius:12,padding:13,background:"#fff"}}><input type="checkbox" checked={selected.includes(id)} onChange={e=>setSelected(old=>e.target.checked?[...old,id]:old.filter(x=>x!==id))}/><span style={{fontWeight:750}}>{name}</span></label>)}
        </div>
        <label>Team size (if applicable)<select value={teamSize} onChange={e=>setTeamSize(e.target.value)} className="form-control"><option value="1">1 participant</option><option value="2">2 participants</option><option value="3">3 participants</option><option value="4">4 participants</option></select></label>
        <h2 style={{margin:"10px 0 0",color:"var(--navy)"}}>Accommodation</h2>
        <label style={{display:"flex",gap:10,alignItems:"center"}}><input name="accommodation_requested" type="checkbox" value="yes"/> I would like to request accommodation (subject to organizer confirmation).</label>
        <label style={{display:"flex",gap:10,alignItems:"start"}}><input name="consent_terms" type="checkbox" required value="yes" style={{marginTop:5}}/> I agree to the participation rules and understand that the organizers may update the schedule.</label>
        <label style={{display:"flex",gap:10,alignItems:"start"}}><input name="consent_privacy" type="checkbox" required value="yes" style={{marginTop:5}}/> I consent to the use of these details for event registration and coordination.</label>
        <div className="notice">Published fee: ₹150 per participant. Do not submit payment to any unofficial account. Official payment instructions will be provided by the organizers.</div>
        <button disabled={busy || selected.length===0} className="btn btn-primary" type="submit">{busy?"Submitting…":"Submit registration"}</button>
        <small className="muted">If database configuration is incomplete, this form will show an error instead of claiming that your registration was saved.</small>
      </form>
    </div>
    <style jsx>{`.form-control{display:block;width:100%;margin-top:7px;border:1px solid #d7dce0;border-radius:10px;background:white;padding:12px;color:#243447}.form-control:focus{outline:2px solid #0f9e9a;outline-offset:2px}label{font-size:.92rem;font-weight:650;color:#243447}`}</style>
  </main>;
}
