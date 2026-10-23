import Link from "next/link";
import { ArrowRight, BadgeCheck, BellRing, CircleDot, Flame, Flower2, Heart, Leaf, PackageCheck, ShieldCheck, Sparkles, Star, Truck, Wheat } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const categories = [
  ["Agarbatti & Dhoop", Flame], ["Diyas & Thalis", Sparkles], ["Kumkum & Haldi", CircleDot],
  ["Ghee & Panchamrit", Wheat], ["Flowers & Garlands", Flower2], ["Rudraksha & Malas", Leaf],
];
const products = [
  ["Temple Grade Agarbatti", "Hand-rolled with natural resins", "₹149", "Bestseller", Flame],
  ["Brass Diya — Lotus", "Handcrafted festive diya", "₹299", "Handmade", Sparkles],
  ["Pure Cow Ghee", "A2 bilona ghee • 250 ml", "₹449", "Pure Ghee", Wheat],
  ["Kumkum & Haldi Set", "Natural, auspicious powders", "₹199", "New", CircleDot],
];
const kits = ["Griha Pravesh Puja Kit", "Satyanarayan Puja Kit", "Ganesh Puja Kit", "Diwali Lakshmi Kit"];

export default async function HomePage() {
  const [suvichar] = await Promise.all([
    prisma.suvichar.findFirst({ orderBy: { day: "asc" } }).catch(() => null),
  ]);

  return (
    <div className="satantani-page">
      <div className="festival-strip"><BellRing size={15} /> Diwali collections are here <Link href="/store">Shop festive puja kits <ArrowRight size={14} /></Link></div>
      <section className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Purely devotional, thoughtfully sourced</p>
          <h1>Pure Pooja Samagri for <em>Every Sacred Moment</em></h1>
          <p className="hero-lede">Authentic, handpicked and ethically sourced puja essentials — delivered with devotion to your home.</p>
          <div className="hero-actions"><Link className="button button-primary" href="/store">Shop Pooja Samagri <ArrowRight size={17} /></Link><Link className="button button-secondary" href="/store">Explore Puja Kits</Link></div>
          <div className="trust-row"><span><BadgeCheck /> 100% Authentic</span><span><Heart /> Ethically sourced</span><span><Truck /> Pan-India delivery</span></div>
        </div>
        <div className="hero-art"><div className="mandala" /><div className="hero-glow" /><img src="/satantani-hero.png" alt="Peaceful sacred cow beside a diya and brass puja thali" /><span className="petal petal-one">✦</span><span className="petal petal-two">✦</span><div className="hero-note"><Sparkles size={16} /><span><strong>Made with devotion</strong><small>For your sacred rituals</small></span></div></div>
      </section>

      <section className="category-section"><div className="section-heading"><div><p className="eyebrow">Find your essentials</p><h2>Shop by category</h2></div><Link href="/store" className="text-link">View all <ArrowRight size={16} /></Link></div><div className="category-grid">{categories.map(([label, Icon]) => <Link href="/store" className="category-card" key={label as string}><span className="icon-disc"><Icon size={25} /></span><span>{label as string}</span><ArrowRight size={15} /></Link>)}</div></section>

      <section className="story-section"><div className="story-art"><div className="story-mandala" /><img src="/satantani-hero.png" alt="Illustration of Gau Mata, the sacred spirit of Satantani" /></div><div className="story-copy"><p className="eyebrow">The heart of Satantani</p><h2>Gau Mata — the sacred spirit of Satantani</h2><p>At Satantani, the cow is not just a symbol — she represents purity, nourishment, protection, and sacred Indian tradition.</p><div className="value-list"><div><span><Heart /></span><div><strong>Purity</strong><small>Essentials that honour every ritual.</small></div></div><div><span><Wheat /></span><div><strong>Nourishment</strong><small>Natural, honest and thoughtfully made.</small></div></div><div><span><ShieldCheck /></span><div><strong>Protection</strong><small>Tradition wrapped with modern care.</small></div></div></div><Link className="text-link" href="/menu">Discover our story <ArrowRight size={16} /></Link></div></section>

      <section className="product-section"><div className="section-heading"><div><p className="eyebrow">Curated for your home temple</p><h2>Shop authentic pooja samagri</h2></div><Link href="/store" className="text-link">Browse the store <ArrowRight size={16} /></Link></div><div className="product-grid">{products.map(([name, desc, price, badge, Icon]) => <article className="product-card" key={name as string}><div className="product-image"><span className="product-badge">{badge as string}</span><button aria-label={`Add ${name as string} to wishlist`}><Heart size={18} /></button><Icon size={57} strokeWidth={1.2} /></div><div className="stars"><Star size={13} fill="currentColor" /> <span>4.9 · 38 reviews</span></div><h3>{name as string}</h3><p>{desc as string}</p><div className="product-bottom"><strong>{price as string}</strong><Link href="/store" aria-label={`View ${name as string}`}>View details <ArrowRight size={14} /></Link></div></article>)}</div></section>

      <section className="kit-section"><div className="section-heading"><div><p className="eyebrow">Everything in one box</p><h2>Complete puja kits for every occasion</h2></div></div><div className="kit-grid">{kits.map((kit, index) => <Link href="/store" className="kit-card" key={kit}><div className={`kit-art kit-art-${index + 1}`}><Sparkles size={30} /></div><div><h3>{kit}</h3><p>Curated essentials for a complete ritual</p><span className="text-link">View complete kit <ArrowRight size={15} /></span></div></Link>)}</div></section>

      <section className="benefits"><p className="eyebrow">Why devotees choose us</p><h2>Tradition, with a little more care</h2><div className="benefit-grid">{[[BadgeCheck,"Authentic & pure","Sourced with care and quality-checked."],[Heart,"Cow-centric values","Inspired by the sacredness of Gau Mata."],[PackageCheck,"Complete solutions","Everything you need, thoughtfully curated."],[Truck,"Delivered with devotion","Secure packaging and pan-India delivery."]].map(([Icon,title,copy]) => <div key={title as string}><span className="benefit-icon"><Icon /></span><h3>{title as string}</h3><p>{copy as string}</p></div>)}</div></section>

      <section className="quote-section"><div className="quote-mark">“</div><p>{suvichar?.text ?? "धर्मो रक्षति रक्षितः"}</p><span>— The Satantani promise</span></section>
      <footer className="site-footer"><div><div className="footer-logo"><span>ॐ</span><strong>Satantani</strong></div><p>Pure essentials for sacred living.<br />Made in India, delivered with devotion.</p></div><div><h4>Explore</h4><Link href="/store">Puja Samagri</Link><Link href="/store">Puja Kits</Link><Link href="/gau-seva">Gau Seva</Link></div><div><h4>Need help?</h4><Link href="/menu">About Satantani</Link><Link href="/menu">Contact us</Link><Link href="/menu">Shipping & returns</Link></div><div className="footer-news"><h4>Stay connected</h4><p>Festival guides and thoughtful offers, in your inbox.</p><div className="newsletter"><input aria-label="Email address" placeholder="Your email address" /><button aria-label="Subscribe"><ArrowRight /></button></div></div></footer>
    </div>
  );
}
