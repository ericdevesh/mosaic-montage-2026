const events = [
  { n:"01", name:"IDEA VOLCANO", tagline:"Great insight begins with an idea.", desc:"An extempore competition with a twist: complete and expand an unfinished sentence with a bold, original idea.", format:"Individual · 1 participant" },
  { n:"02", name:"MEMECONOMICS", tagline:"Business Meme War.", desc:"Turn serious business concepts into sharp, funny memes that explain the concept accurately.", format:"Individual · 1 participant" },
  { n:"03", name:"BULLS & BEARS", tagline:"Trade Virtual, Think Rich.", desc:"A virtual stock-trading competition where timely, analytical decisions make the difference.", format:"Team · 2 participants" },
  { n:"04", name:"CODE ACUMEN", tagline:"Code is conquered when Logic meets Action.", desc:"Test programming, coding, debugging and logical reasoning skills in a problem-solving challenge.", format:"Team · 2 participants" },
  { n:"05", name:"WEB VISION", tagline:"Web Designing Decoded.", desc:"Showcase web-designing skills, creative thinking and the ability to bring ideas to the browser.", format:"Team · 2 participants" },
  { n:"06", name:"ROLLING REELS", tagline:"Vision behind the Lens.", desc:"Create an original 1–2 minute inspirational or motivational reel on “Beyond the Ordinary.”", format:"Hybrid · Individual" },
  { n:"07", name:"FUSION FIESTA", tagline:"From Trash to Trend.", desc:"Transform discarded materials into eco-friendly, stylish, decorative or innovative creations on the spot.", format:"Team · 1–2 participants" },
  { n:"08", name:"D4U", tagline:"Feel the Beat, Live the Dance.", desc:"A choreography and dance competition. Team size and event arrangements are set by the organizers.", format:"Team · 1–4 participants" },
  { n:"09", name:"STRINGS UNPLUGGED", tagline:"Where medley meets the Soul.", desc:"A solo singing competition for performers ready to share their voice.", format:"Individual · 1 participant" }
];

const dayOne = [
  ["IDEA VOLCANO","10:00 AM – 11:30 PM*","IIIM Auditorium"],
  ["MEMECONOMICS","10:00 AM – 11:30 PM*","Class Room"],
  ["CODE ACUMEN","10:00 AM – 11:30 PM*","IBM Lab"],
  ["BULLS & BEARS","12:00 AM – 1:30 PM*","Seminar Hall"],
  ["ROLLING REELS (HYBRID)","12:00 AM – 1:30 PM*","Computer Centre"],
  ["FUSION FIESTA","12:00 AM – 1:30 PM*","Class Room"],
  ["WEB VISION","12:00 AM – 1:30 PM*","Computer Centre"],
  ["D4U & STRINGS UNPLUGGED","2:30 PM – 5:00 PM","Dr. APJ Abdul Kalam Auditorium, IIS, Kshipra Path"],
  ["DJ & DINNER","5:00 PM – 7:30 PM","Dr. APJ Abdul Kalam Auditorium, IIS, Kshipra Path"]
];

export default function Home() {
  return <>
    <header className="nav">
      <div className="container" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:18,minHeight:76}}>
        <a href="#home" style={{display:"flex",alignItems:"center",gap:11}}>
          <span className="brand-mark">MM</span>
          <span><strong style={{display:"block",color:"var(--navy)",letterSpacing:".04em"}}>MOSAIC-MONTAGE</strong><small style={{color:"var(--muted)"}}>IIIM Jaipur · 2026</small></span>
        </a>
        <nav aria-label="Main navigation" style={{display:"flex",alignItems:"center",gap:18,flexWrap:"wrap",justifyContent:"end",fontSize:".9rem",fontWeight:700}}>
          <a href="#about">About</a><a href="#events">Events</a><a href="#schedule">Schedule</a><a href="#rules">Rules</a><a className="btn btn-primary" href="#register">Register</a>
        </nav>
      </div>
    </header>

    <main id="home">
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow" style={{color:"#67d9d0"}}>27th Annual Management & IT Fest</div>
            <h1>MOSAIC-<span>MONTAGE</span><br/>2026</h1>
            <p className="hero-copy">A meeting ground for bold ideas. Two days of management, technology, creativity and fresh perspectives — hosted by IIIM Jaipur.</p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:26}}>
              <a className="btn btn-primary" href="#register">Register interest <span aria-hidden="true">↗</span></a>
              <a className="btn btn-outline" style={{color:"white",borderColor:"#637386"}} href="#events">Explore events</a>
            </div>
            <div className="stats">
              <div className="stat"><strong>20–21 Nov</strong><span style={{color:"var(--muted)",fontSize:".88rem"}}>2026 · Two days</span></div>
              <div className="stat"><strong>₹150</strong><span style={{color:"var(--muted)",fontSize:".88rem"}}>Per participant</span></div>
              <div className="stat"><strong>Jaipur</strong><span style={{color:"var(--muted)",fontSize:".88rem"}}>IIIM · Mansarovar</span></div>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="orbit"></div><div className="orbit two"></div><div className="art-core">M<span style={{color:"white"}}>²</span></div><div className="floating one">IDEAS IN MOTION</div><div className="floating two">THINK · MAKE · LEAD</div></div>
        </div>
      </section>

      <section id="about" className="section container">
        <div className="section-head"><div><div className="eyebrow">The festival</div><h2>Where ideas meet action.</h2></div><p className="muted" style={{maxWidth:470,margin:0}}>A campus gathering for curious minds to explore business, technology, design and performance through friendly competition.</p></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:18}}>
          <div className="rule"><b>01 / Think boldly</b>Pitch a fresh perspective, solve a problem, or make a concept memorable.</div>
          <div className="rule"><b>02 / Build together</b>Bring your team, your skills and your college spirit to the challenge.</div>
          <div className="rule"><b>03 / Meet your people</b>Connect with students and future leaders across institutions.</div>
        </div>
      </section>

      <section id="events" className="section" style={{background:"#f2efe6"}}>
        <div className="container">
          <div className="section-head"><div><div className="eyebrow">Choose your challenge</div><h2>Find your event.</h2></div><p className="muted" style={{maxWidth:400,margin:0}}>Explore the competitions and check each event’s format before registering.</p></div>
          <div className="event-grid">{events.map(e=><article className="event-card" key={e.n}><div className="event-no">{e.n}</div><h3>{e.name}</h3><b style={{fontSize:".9rem",color:"var(--teal)",marginBottom:8}}>{e.tagline}</b><p>{e.desc}</p><div className="event-meta">{e.format}</div></article>)}</div>
        </div>
      </section>

      <section id="schedule" className="section container">
        <div className="section-head"><div><div className="eyebrow">Mark your calendar</div><h2>Two days. Many possibilities.</h2></div><p className="muted" style={{maxWidth:400,margin:0}}>Schedule entries marked with an asterisk need organizer confirmation. Times are shown as published in the brochure.</p></div>
        <div className="schedule">
          <div className="day"><h3>Day 01 <span style={{color:"var(--teal)"}}>· 20 November</span></h3>{dayOne.map((item,i)=><div className="schedule-row" key={item[0]}><div><strong>{item[0]}</strong><span className="muted" style={{fontSize:".87rem"}}>{item[2]}</span></div><span className="pill">{item[1]}</span>{i<7 && <span className="muted" style={{gridColumn:"1 / -1",fontSize:".75rem"}}> * Time to be confirmed</span>}</div>)}</div>
          <div className="day"><h3>Day 02 <span style={{color:"var(--teal)"}}>· 21 November</span></h3><div className="schedule-row"><div><strong>LEAD TALKS</strong><span className="muted" style={{fontSize:".87rem"}}>IIIM Auditorium</span></div><span className="pill">11:00 AM – 2:00 PM</span></div><p className="muted">LEAD TALKS is IIIM’s alumni leadership series, sharing alumni achievements, professional insights, experiences, challenges and leadership journeys.</p><div className="notice" style={{marginTop:22}}>The brochure contains potentially inconsistent AM/PM entries. Starred times are not confirmed; please check official updates before making travel plans.</div></div>
        </div>
      </section>

      <section id="rules" className="section" style={{background:"#f2efe6"}}>
        <div className="container">
          <div className="section-head"><div><div className="eyebrow">Before you register</div><h2>Good to know.</h2></div></div>
          <div className="rule-grid">
            <div className="rule"><b>Registration fee</b>₹150 per participant. This is not an individual event fee.</div>
            <div className="rule"><b>Institute limit</b>Maximum 15 participating students per institute.</div>
            <div className="rule"><b>Outstation participants</b>Free meals and lodging are stated for outstation participants with intimation 15 days in advance. Availability is not guaranteed here.</div>
            <div className="rule"><b>Participant list</b>Submit on institution letterhead, signed by an authorized signatory, or through the institution’s official email ID.</div>
            <div className="rule"><b>College ID</b>Students must carry their college ID proof on the event day.</div>
            <div className="rule"><b>Judges & schedule</b>Judges’ decisions are final. Schedule changes or event cancellation may occur as described in the official rules.</div>
          </div>
          <p className="muted" style={{marginTop:18}}>Overall Winner’s Trophy scoring criteria: <a href="https://www.icfia.org" target="_blank" rel="noreferrer" style={{color:"var(--teal)",fontWeight:800}}>icfia.org ↗</a></p>
        </div>
      </section>

      <section id="register" className="section container">
        <div className="cta"><div><div className="eyebrow">Ready to take part?</div><h2 style={{marginBottom:8}}>Bring your bold idea.</h2><p className="muted" style={{margin:0,maxWidth:540}}>Student registration and organizer data management are being prepared. Contact IIIM for official registration instructions until the registration portal is configured.</p></div><a className="btn btn-primary" href="mailto:iiim@icfia.org?subject=MOSAIC-MONTAGE%202026%20Registration%20Enquiry">Enquire to register ↗</a></div>
      </section>
    </main>

    <footer id="contact"><div className="container footer-grid"><div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><span className="brand-mark" style={{background:"var(--teal)"}}>MM</span><strong>MOSAIC-MONTAGE 2026</strong></div><p style={{color:"#b7c4d0",lineHeight:1.7,maxWidth:390}}>27th Annual Management & IT Fest<br/>“A meeting ground for bold ideas”</p></div><div><strong>Contact</strong><p style={{color:"#b7c4d0",lineHeight:2}}>IIIM, Sector-12, Mahaveer Marg<br/>Mansarovar, Jaipur – 302020<br/><a href="mailto:iiim@icfia.org">iiim@icfia.org</a></p></div><div><strong>Help desk</strong><p style={{color:"#b7c4d0",lineHeight:2}}><a href="tel:01412781154">0141-2781154</a><br/><a href="tel:01412781155">0141-2781155</a><br/><a href="tel:9358210063">93582-10063</a><br/><a href="https://www.icfia.org" target="_blank" rel="noreferrer">Official website ↗</a></p></div></div><div className="container" style={{borderTop:"1px solid #304154",marginTop:28,paddingTop:20,color:"#9baaba",fontSize:".83rem"}}>© 2026 International School of Informatics & Management, Jaipur. Event details subject to official confirmation.</div></footer>
  </>;
}
