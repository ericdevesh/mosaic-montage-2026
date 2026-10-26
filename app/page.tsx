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
      <div className="container nav-inner">
        <a href="#home" className="brand">
          <span className="brand-mark">M<span>²</span></span>
          <span><strong>MOSAIC<span className="brand-dash">—</span>MONTAGE</strong><small>IIIM JAIPUR <i/> 2026</small></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a><a href="#events">Events</a><a href="#schedule">Schedule</a><a href="#rules">Info</a>
          <a className="btn btn-primary nav-cta" href="/register">Register <span>↗</span></a>
        </nav>
      </div>
    </header>

    <main id="home">
      <section className="hero">
        <div className="hero-grid container">
          <div className="hero-copy-block">
            <div className="eyebrow"><span className="live-dot"/> THE 27TH ANNUAL MANAGEMENT & IT FEST</div>
            <h1>Ideas don't<br/>just happen.<br/><span className="gradient-text">They collide.</span></h1>
            <p className="hero-copy">Welcome to <strong>Mosaic-Montage 2026</strong> — where technology, business and creativity collide. Two days. Nine challenges. One unforgettable campus energy.</p>
            <div className="hero-actions"><a className="btn btn-primary" href="/register">Enter the experience <span>↗</span></a><a className="btn btn-ghost" href="#events"><span className="play-icon">↓</span> Explore the events</a></div>
            <div className="hero-meta"><span><b>20—21</b><small>NOVEMBER 2026</small></span><span className="meta-line"/><span><b>09</b><small>LIVE EVENTS</small></span><span className="meta-line"/><span><b>IIIM</b><small>JAIPUR, INDIA</small></span></div>
          </div>
          <div className="visual-stage" aria-label="Abstract three-dimensional Mosaic Montage event artwork">
            <div className="stage-grid"/>
            <div className="ring ring-a"/><div className="ring ring-b"/><div className="ring ring-c"/>
            <div className="glass-orb"><div className="orb-shine"/><span>MM</span><small>2026</small></div>
            <div className="float-card card-top"><span className="card-spark">✳</span><div><small>CREATIVITY LEVEL</small><b>UNLOCKED</b></div></div>
            <div className="float-card card-bottom"><span className="signal-bars"><i/><i/><i/><i/></span><div><small>YOUR NEXT CHAPTER</small><b>STARTS HERE ↗</b></div></div>
            <div className="orbit-label label-blue">THINK DIFFERENT<span>✳</span></div><div className="orbit-label label-pink">MAKE NOISE<span>↗</span></div>
          </div>
          <div className="scroll-cue"><span/> SCROLL TO EXPLORE</div>
        </div>
      </section>

      <section id="campus" className="campus-banner"><div className="campus-photo"><img src="/campus.jpg" alt="International School of Informatics and Management Technical Campus, Jaipur"/></div><div className="campus-overlay"><span className="section-kicker">THE PLACE WHERE IDEAS MEET</span><h2>Welcome to <span className="gradient-text">IIIM Jaipur.</span></h2><p>One campus. Nine events. A whole lot of creative energy.</p></div></section>

      <section id="about" className="section container about-section">
        <div className="section-kicker">01 / THE BIG PICTURE</div>
        <div className="section-head"><h2>Not just a fest.<br/><span className="gradient-text">A creative collision.</span></h2><p className="muted">A meeting ground for curious minds to challenge convention, experiment with ideas and meet the people who make things happen.</p></div>
        <div className="feature-grid">
          <article className="feature-card"><span className="feature-number">01</span><div className="feature-icon blue-icon">✳</div><h3>Think boldly.</h3><p>Question the obvious. Pitch a fresh perspective. Make a concept impossible to ignore.</p><span className="feature-line"/></article>
          <article className="feature-card"><span className="feature-number">02</span><div className="feature-icon pink-icon">↗</div><h3>Build together.</h3><p>Bring your team, your skills and your college spirit. The best ideas grow in good company.</p><span className="feature-line"/></article>
          <article className="feature-card"><span className="feature-number">03</span><div className="feature-icon blue-icon">⌘</div><h3>Meet your people.</h3><p>Connect with students across institutions and leave with new perspectives and possibilities.</p><span className="feature-line"/></article>
        </div>
      </section>

      <section id="events" className="section events-section">
        <div className="container">
          <div className="section-kicker">02 / PICK YOUR PLAYGROUND</div>
          <div className="section-head"><h2>Nine ways to<br/><span className="gradient-text">make your mark.</span></h2><p className="muted">Find your lane — from code and commerce to performance and pure imagination.</p></div>
          <div className="event-grid">{events.map(e=><article className="event-card" key={e.n}><div className="event-card-top"><span className="event-no">{e.n}</span><span className="event-arrow">↗</span></div><h3>{e.name}</h3><b className="event-tagline">{e.tagline}</b><p>{e.desc}</p><div className="event-meta"><span className="meta-dot"/>{e.format}</div></article>)}</div>
          <div className="events-bottom"><span>YOUR IDEA DESERVES A STAGE.</span><a href="/register">Find your event <b>↗</b></a></div>
        </div>
      </section>

      <section id="schedule" className="section container schedule-section">
        <div className="section-kicker">03 / SAVE THE DATES</div>
        <div className="section-head"><h2>Two days.<br/><span className="gradient-text">Infinite energy.</span></h2><p className="muted">The festival unfolds across two days at IIIM Jaipur. Please confirm starred times with the organizing team before travel.</p></div>
        <div className="schedule">
          <div className="day"><div className="day-heading"><span className="day-index">DAY 01</span><h3>Friday <span>20 November</span></h3></div>{dayOne.map((item,i)=><div className="schedule-row" key={item[0]}><div className="schedule-marker">{String(i+1).padStart(2,"0")}</div><div className="schedule-info"><strong>{item[0]}</strong><span>{item[2]}</span></div><span className="pill">{item[1]}</span></div>)}</div>
          <div className="day day-two"><div className="day-heading"><span className="day-index pink">DAY 02</span><h3>Saturday <span>21 November</span></h3></div><div className="schedule-row"><div className="schedule-marker">01</div><div className="schedule-info"><strong>LEAD TALKS</strong><span>IIIM Auditorium</span></div><span className="pill">11:00 AM – 2:00 PM</span></div><div className="day-two-art"><div className="talk-orbit">LEAD<br/>TALKS<span>2026</span></div><p>Real journeys.<br/>Honest lessons.<br/><b>Ideas worth sharing.</b></p></div><div className="notice">Some Day 01 AM/PM entries in the published schedule appear inconsistent. Starred times need organizer confirmation.</div></div>
        </div>
      </section>

      <section id="rules" className="section info-section">
        <div className="container">
          <div className="section-kicker">04 / THE IMPORTANT BITS</div>
          <div className="section-head"><h2>Good to know.<br/><span className="gradient-text">Better to be ready.</span></h2></div>
          <div className="rule-grid">
            <div className="rule"><span>01</span><div><b>Registration fee</b><p>₹150 per participant. This is not an individual event fee.</p></div></div>
            <div className="rule"><span>02</span><div><b>Institute limit</b><p>Maximum 15 participating students per institute.</p></div></div>
            <div className="rule"><span>03</span><div><b>Outstation participants</b><p>Free meals and lodging are stated with intimation 15 days in advance. Availability is not guaranteed here.</p></div></div>
            <div className="rule"><span>04</span><div><b>Participant list</b><p>Submit on institution letterhead with authorized signature, or through the institution’s official email ID.</p></div></div>
            <div className="rule"><span>05</span><div><b>College ID</b><p>Carry your college ID proof on the event day.</p></div></div>
            <div className="rule"><span>06</span><div><b>Judges & schedule</b><p>Judges’ decisions are final. Schedule changes or event cancellation may occur under official rules.</p></div></div>
          </div>
          <p className="rules-foot">Overall Winner’s Trophy scoring criteria: <a href="https://www.icfia.org" target="_blank" rel="noreferrer">icfia.org ↗</a></p>
        </div>
      </section>

      <section id="register" className="section container register-section">
        <div className="cta">
          <div className="cta-orb">MM<span>²</span></div>
          <div className="cta-copy"><div className="eyebrow"><span className="live-dot"/> YOUR MOMENT IS WAITING</div><h2>Make some<br/><span className="gradient-text">good noise.</span></h2><p>Bring your curiosity, your crew and your best idea. Your Mosaic-Montage story starts here.</p><a className="btn btn-primary" href="/register">Register for 2026 <span>↗</span></a></div>
          <div className="cta-stamp">THINK<br/>MAKE<br/>LEAD<span>✳</span></div>
        </div>
      </section>
    </main>

    <footer id="contact"><div className="container footer-grid"><div className="footer-brand"><a href="#home" className="brand"><span className="brand-mark">M<span>²</span></span><span><strong>MOSAIC—MONTAGE</strong><small>IIIM JAIPUR · 2026</small></span></a><p>27th Annual Management & IT Fest.<br/>A meeting ground for bold ideas.</p></div><div><strong className="footer-title">FIND US</strong><p>IIIM, Sector-12, Mahaveer Marg<br/>Mansarovar, Jaipur – 302020<br/><a href="mailto:iiim@icfia.org">iiim@icfia.org</a></p></div><div><strong className="footer-title">NEED A HAND?</strong><p><a href="tel:01412781154">0141-2781154</a><br/><a href="tel:01412781155">0141-2781155</a><br/><a href="tel:9358210063">93582-10063</a><br/><a href="https://www.icfia.org" target="_blank" rel="noreferrer">Official website ↗</a><br/><a href="/admin">Organizer login ↗</a></p></div></div><div className="container footer-bottom"><span>© 2026 INTERNATIONAL SCHOOL OF INFORMATICS & MANAGEMENT, JAIPUR</span><a href="#home">BACK TO TOP ↑</a></div></footer>
  </>;
}
