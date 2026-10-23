import Link from "next/link";
import { ArrowRight, Bell, BookOpen, CalendarDays, CheckCircle2, Flower2, Heart, Play, ShieldCheck, Sparkles, Star, Sun, Users, Volume2 } from "lucide-react";

const guides = [
  ["Swami Anant Das", "Vaishnav · Vrindavan", "Bhakti, meditation & family guidance"],
  ["Mata Amrit Jyoti", "Shaiv · Haridwar", "Mantra, healing & spiritual growth"],
  ["Acharya Ved Prakash", "Sanatan Dharma · Varanasi", "Vedic studies & daily sadhana"],
];

const festivals = [
  ["27 Oct", "Dhanteras", "Special Lakshmi aarti · 7:00 PM"],
  ["30 Oct", "Diwali Deepotsav", "Live darshan · 6:30 PM"],
  ["06 Nov", "Govardhan Puja", "Gau seva & satsang · 8:00 AM"],
];

export default function HomePage() {
  return (
    <main className="spiritual-home">
      <div className="festival-strip"><Bell size={14} /> Daily aarti, blessings and spiritual guidance <Link href="#darshan">Enter the temple <ArrowRight size={14} /></Link></div>
      <section className="spiritual-hero" id="home">
        <div className="spiritual-hero-copy">
          <p className="eyebrow"><span /> A peaceful digital temple</p>
          <h1>Receive divine blessings, <em>anywhere.</em></h1>
          <p className="hero-lede">Join live darshan, connect with revered spiritual guides, offer your prayers, and bring a little more peace into every day.</p>
          <div className="hero-actions"><Link className="button button-primary" href="#darshan"><Play size={16} fill="currentColor" /> Watch live darshan</Link><Link className="button button-secondary" href="#blessings">Seek blessings <ArrowRight size={16} /></Link></div>
          <div className="trust-row"><span><CheckCircle2 /> Live aarti daily</span><span><ShieldCheck /> Verified guides</span><span><Heart /> Private prayer requests</span></div>
        </div>
        <div className="spiritual-hero-art"><div className="hero-mandala" /><div className="hero-glow" /><img src="/gau-mata.png" alt="Peaceful sacred Gau Mata surrounded by a glowing mandala" /><span className="hero-chip chip-one"><Sun size={15} /> Divine light</span><span className="hero-chip chip-two"><Flower2 size={15} /> With devotion</span></div>
      </section>

      <section className="darshan-section" id="darshan"><div className="section-heading"><div><p className="eyebrow">Be present in prayer</p><h2>Live darshan</h2></div><span className="live-pill"><i /> LIVE NOW</span></div><div className="darshan-grid"><div className="darshan-player"><img src="/gau-mata.png" alt="Live Gau Mata darshan" /><div className="player-overlay"><span className="player-label"><i /> Live darshan</span><div><h3>Gau Shala Sandhya Aarti</h3><p>Vrindavan · 482 devotees joined</p></div><button aria-label="Play live darshan"><Play size={22} fill="currentColor" /></button></div></div><div className="aarti-panel"><p className="panel-kicker">Today&apos;s aarti</p><h3>Sandhya Aarti</h3><p className="panel-muted">The evening light offering begins in</p><strong className="countdown">00 : 24 : 18</strong><div className="aarti-list"><span className="active"><b>Now</b> Gau Shala Darshan <small>Live</small></span><span><b>7:00 PM</b> Main Temple Aarti <small>Today</small></span><span><b>8:30 PM</b> Om chanting <small>Today</small></span></div><div className="offer-actions"><button><Sun size={15} /> Offer diya</button><button><Flower2 size={15} /> Offer flowers</button></div></div></div></section>

      <section className="guides-section" id="guides"><div className="section-heading"><div><p className="eyebrow">Wisdom for your journey</p><h2>Revered sadhus & spiritual guides</h2></div><Link href="#guides" className="text-link">Meet all guides <ArrowRight size={16} /></Link></div><div className="guide-grid">{guides.map(([name, tradition, focus], index) => <article className="guide-card" key={name}><div className={`guide-avatar avatar-${index + 1}`}>{index === 0 ? "ॐ" : index === 1 ? "श्री" : "ॐ"}</div><div className="guide-copy"><span className="verified"><CheckCircle2 size={14} /> Verified by Satantani</span><h3>{name}</h3><p>{tradition}</p><small>{focus}</small><div><Link href="#blessings">Request blessing <ArrowRight size={14} /></Link><span className="available"><i /> Available</span></div></div></article>)}</div></section>

      <section className="blessings-section" id="blessings"><div className="blessing-art"><div className="diya"><span /></div><div className="blessing-rings" /></div><div className="blessing-copy"><p className="eyebrow">Your prayer is held with care</p><h2>Seek blessings & submit a prayer</h2><p>Share your prayer intention with devotion. Our guides and community will hold it in collective prayer.</p><form className="prayer-form"><label>Your prayer intention<input placeholder="What would you like to offer in prayer?" /></label><div className="form-row"><label>Your first name<input placeholder="First name" /></label><label>Prayer category<select defaultValue="Peace"><option>Peace</option><option>Health</option><option>Family</option><option>Gratitude</option></select></label></div><button className="button button-primary" type="button">Submit with devotion <ArrowRight size={16} /></button></form></div></section>

      <section className="daily-section"><div className="daily-card"><div><p className="eyebrow">Blessing of the day</p><p className="sanskrit">धर्मो रक्षति रक्षितः</p><p className="translation">“Dharma protects those who protect it.”</p><span>— An invitation to walk with truth today</span></div><button aria-label="Play blessing audio"><Volume2 size={20} /></button></div><div className="daily-links"><Link href="#mantras"><BookOpen size={18} /> Aarti & mantras <ArrowRight size={14} /></Link><Link href="#calendar"><CalendarDays size={18} /> Festival calendar <ArrowRight size={14} /></Link></div></section>

      <section className="calendar-section" id="calendar"><div className="section-heading"><div><p className="eyebrow">Mark the sacred days</p><h2>Festival & spiritual calendar</h2></div><Link href="#calendar" className="text-link">View full calendar <ArrowRight size={16} /></Link></div><div className="festival-grid">{festivals.map(([date, title, detail]) => <article key={title}><time>{date}</time><div><h3>{title}</h3><p>{detail}</p></div><button aria-label={`Add ${title} to calendar`}><CalendarDays size={16} /></button></article>)}</div></section>

      <section className="gau-story"><div className="story-art"><div className="story-mandala" /><img src="/gau-mata.png" alt="Gau Mata, the sacred spirit of Satantani" /></div><div className="story-copy"><p className="eyebrow">The heart of Satantani</p><h2>Gau Mata — the sacred spirit of Satantani</h2><p>At Satantani, the cow is revered as a symbol of purity, nourishment, protection, and selfless service. We carry this sacred spirit into everyday life.</p><div className="value-list"><div><span><Sparkles /></span><b>Purity<small>Honour in every ritual.</small></b></div><div><span><Heart /></span><b>Nourishment<small>Care that gives back.</small></b></div><div><span><ShieldCheck /></span><b>Protection<small>A trusted spiritual home.</small></b></div></div></div></section>

      <section className="sacred-items" id="items"><div className="section-heading"><div><p className="eyebrow">A quiet offering for your home temple</p><h2>Sacred items for your puja</h2></div><Link href="/store" className="text-link">Explore items <ArrowRight size={16} /></Link></div><div className="item-grid"><article className="item-card"><img src="/pure-cow-ghee.png" alt="Pure cow ghee in premium devotional packaging" /><div><span>For daily offerings</span><h3>Pure cow ghee</h3><p>For aarti, havan and sacred light.</p><strong>₹449</strong><Link href="/store">Enquire <ArrowRight size={14} /></Link></div></article><article className="item-card item-placeholder"><div><Sparkles size={22} /><span>Thoughtfully sourced</span><h3>Essential puja samagri</h3><p>Incense, kumkum, diya and more for your home temple.</p><Link href="/store">View sacred items <ArrowRight size={14} /></Link></div></article></div></section>

      <section className="experiences"><p className="eyebrow">Blessings received</p><h2>Experiences from our community</h2><div className="experience-card"><div className="stars"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div><blockquote>“Joining the evening aarti has become a quiet, beautiful part of my day. I feel connected even from far away.”</blockquote><span>— Meera, Pune</span></div></section>

      <footer className="site-footer"><div><div className="footer-logo"><span>ॐ</span><strong>Satantani</strong></div><p>A peaceful digital temple for every seeker.<br />Made with devotion for every journey.</p></div><div><h4>Explore</h4><Link href="#darshan">Live darshan</Link><Link href="#guides">Sadhus & guides</Link><Link href="#blessings">Seek blessings</Link></div><div><h4>Resources</h4><Link href="#mantras">Aarti & mantras</Link><Link href="#calendar">Festival calendar</Link><Link href="/store">Sacred items</Link></div><div className="footer-news"><h4>Receive daily blessings</h4><p>Aarti reminders and gentle spiritual notes.</p><div className="newsletter"><input aria-label="Email address" placeholder="Your email address" /><button aria-label="Subscribe"><ArrowRight /></button></div></div><div className="footer-bottom">© 2026 Satantani · Made with devotion for every seeker.</div></footer>
    </main>
  );
}
