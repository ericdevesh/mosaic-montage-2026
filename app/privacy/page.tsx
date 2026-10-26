export default function PrivacyPage(){
 return <main className="container section" style={{maxWidth:820,minHeight:"70vh"}}>
  <a href="/" style={{color:"var(--teal)",fontWeight:800}}>← Back to website</a>
  <div className="eyebrow" style={{marginTop:28}}>MOSAIC-MONTAGE 2026</div>
  <h1 style={{fontSize:"clamp(2.5rem,6vw,4rem)",color:"var(--navy)",letterSpacing:"-.06em",margin:"12px 0 20px"}}>Privacy notice</h1>
  <p className="muted">This notice describes the information requested by the Mosaic-Montage 2026 registration form. The organizing institution should review and approve it before collecting live participant data.</p>
  <section className="rule" style={{marginTop:18}}><b>Information collected</b>The registration form requests participant names, contact details, institution, course/year, selected events, consent records and optional accommodation requests. Coordinator details may also be supplied by an institution.</section>
  <section className="rule" style={{marginTop:12}}><b>How information is used</b>Information is intended to support registration processing, event planning, institution verification, participant communication, fee tracking and accommodation coordination.</section>
  <section className="rule" style={{marginTop:12}}><b>Access and security</b>Registration records are intended for authorized event organizers. The application uses protected organizer endpoints and server-side database access. Do not submit real participant information until the institution has configured and reviewed the deployment, access policies and data-handling arrangements.</section>
  <section className="rule" style={{marginTop:12}}><b>Payments</b>Do not enter bank passwords, card details, UPI PINs or other payment credentials in this form. Payment instructions must come from the organizers through an official channel.</section>
  <section className="rule" style={{marginTop:12}}><b>Questions or corrections</b>Contact the event help desk at <a href="mailto:iiim@icfia.org" style={{color:"var(--teal)",fontWeight:800}}>iiim@icfia.org</a> or call 0141-2781154 / 0141-2781155 / 93582-10063.</section>
  <div className="notice" style={{marginTop:20}}>This is an initial project privacy notice, not a substitute for the institution's approved privacy policy, retention schedule or applicable legal review.</div>
 </main>;
}
