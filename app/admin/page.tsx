export default function AdminPage() {
  return <main className="container section" style={{maxWidth:850}}>
    <a href="/" style={{color:"var(--teal)",fontWeight:800}}>← Public website</a>
    <div style={{marginTop:30}} className="eyebrow">Organizer access</div>
    <h1 style={{fontSize:"clamp(2.5rem,6vw,4rem)",color:"var(--navy)",letterSpacing:"-.06em",margin:"12px 0"}}>Admin dashboard</h1>
    <div className="notice">The dashboard is not enabled yet. Before using it for real student data, configure Supabase Auth, admin-only authorization, audited status changes, and the database-backed Excel import/export endpoints.</div>
    <p className="muted">Public administrator sign-up is intentionally not provided. Create the first organizer account in the Supabase dashboard and add its user UUID to <code>public.admin_users</code> only after the database migration has been applied.</p>
    <a className="btn btn-primary" href="mailto:iiim@icfia.org?subject=MOSAIC-MONTAGE%202026%20Organizer%20Access">Contact organizer team</a>
  </main>;
}
