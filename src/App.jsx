import { useState, useEffect, useRef } from "react";

/* ═══════════ TOKENS — Warm Editorial Light Theme ═══════════ */
const T = {
  gold: "#8B6B20",
  goldSoft: "#A07C28",
  goldDim: "rgba(139,107,32,0.10)",
  goldGlow: "rgba(139,107,32,0.07)",
  bg: "#F6F1E9",
  bgDeep: "#EDE6D8",
  card: "#FFFFFF",
  cardHover: "#FAF7F2",
  border: "#DDD3C0",
  borderLight: "#CCC0A8",
  ink: "#1C1510",
  text: "#4A3F35",
  muted: "#9A8C7E",
  accent: "#5C3D1E",
};

/* ═══════════ DATA ═══════════ */
const SUIT_TYPES = [
  { id: "classic", name: "Classic", sub: "Single Breasted", desc: "Timeless two-button silhouette with notch lapel. The foundation of every gentleman's wardrobe.", icon: "I" },
  { id: "double", name: "Double Breasted", sub: "Peak Lapel", desc: "Commanding six-button front with wide peak lapels. For the man who leads every room.", icon: "II" },
];
const MATERIALS = [
  { id: "smart", name: "Smart Collection", desc: "Wrinkle-resistant wool blend. Engineered for the modern gentleman who moves.", price: "$379", tag: "POPULAR" },
  { id: "premium", name: "Premium Collection", desc: "Super 130s Italian wool from Vitale Barberis Canonico. Uncompromising luxury.", price: "$499", tag: "FINEST" },
];
const DESIGNS = [
  { id: "midnight", name: "Midnight Navy", hex: "#141E3C" },
  { id: "charcoal", name: "Charcoal", hex: "#2A2A2E" },
  { id: "oxford", name: "Oxford Grey", hex: "#484850" },
  { id: "black", name: "Jet Black", hex: "#0C0C0E" },
  { id: "burgundy", name: "Burgundy", hex: "#3E1428" },
  { id: "forest", name: "Forest", hex: "#1A3024" },
  { id: "camel", name: "Camel", hex: "#7A6244" },
  { id: "slate", name: "Slate Blue", hex: "#2E3A4A" },
];
const BTN_TYPES = [{ id: "metal", name: "Metal" }, { id: "plastic", name: "Plastic" }];
const BTN_COLORS = [
  { id: "gold", name: "Gold", hex: "#C6A855" }, { id: "silver", name: "Silver", hex: "#A0A0A8" },
  { id: "black", name: "Onyx", hex: "#1A1A1C" }, { id: "bronze", name: "Bronze", hex: "#7A5A20" },
];
const PANTS_STYLES = [
  { id: "classic", name: "Classic Original", desc: "Traditional straight cut with clean lines" },
  { id: "buckle", name: "Side Belts & Buckles", desc: "Distinguished adjustable side detail" },
];
const PANTS_FIT = [{ id: "regular", name: "Regular" }, { id: "slim", name: "Slim" }];
const MEASURE_FIELDS = [
  { id: "chest", label: "Chest", range: "38-48", icon: "◇" },
  { id: "waist", label: "Waist", range: "30-40", icon: "○" },
  { id: "shoulders", label: "Shoulders", range: "17-20", icon: "—" },
  { id: "sleeve", label: "Sleeve", range: "24-27", icon: "│" },
  { id: "jacket", label: "Jacket Length", range: "28-32", icon: "▯" },
  { id: "inseam", label: "Inseam", range: "28-34", icon: "┃" },
];

/* ═══════════ UTILS ═══════════ */
function Fade({ children, delay = 0, y = 18, style = {} }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div style={{ opacity: v ? 1 : 0, transform: v ? "none" : `translateY(${y}px)`, transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)", ...style }}>{children}</div>;
}

function CountUp({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1600;
        const startTime = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(animate);
          else setCount(end);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function PageTransition({ children }) {
  const [v, setV] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setV(true)); return () => cancelAnimationFrame(id); }, []);
  return <div style={{ opacity: v ? 1 : 0, transition: "opacity 0.35s ease" }}>{children}</div>;
}

/* ═══════════ NAV ═══════════ */
function Nav({ current, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const NAV_LINKS = [
    { label: "Collection", id: "section-collection" },
    { label: "Bespoke", id: "section-bespoke" },
    { label: "About", id: "section-about" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 58,
      background: scrolled ? "rgba(246,241,233,0.97)" : "rgba(246,241,233,0.8)",
      backdropFilter: "blur(20px) saturate(1.2)",
      borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
      padding: "0 36px", display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onNav("home")}>
        <div style={{ width: 30, height: 30, border: `1.5px solid ${T.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: 15, color: T.gold, fontWeight: 700, fontStyle: "italic", background: T.goldDim }}>K</div>
        <span style={{ fontFamily: "Georgia,serif", fontSize: 14, color: T.ink, fontWeight: 600, letterSpacing: 3 }}>KINGSMAN</span>
      </div>
      {current === "home" ? (
        <div style={{ display: "flex", gap: 32 }}>
          {NAV_LINKS.map(({ label, id }) => (
            <span key={label} onClick={() => scrollTo(id)}
              style={{ fontSize: 10, color: T.muted, letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = T.ink} onMouseLeave={e => e.target.style.color = T.muted}>{label}</span>
          ))}
        </div>
      ) : (
        <span style={{ fontSize: 10, letterSpacing: 3, color: T.muted, textTransform: "uppercase" }}>
          {current === "configure" ? "Suit Designer" : current === "measure" ? "Measurements" : "Checkout"}
        </span>
      )}
    </nav>
  );
}

/* ═══════════ SUIT SVG ═══════════ */
function SuitVisual({ config, size = 240 }) {
  const color = DESIGNS.find(d => d.id === config.design)?.hex || "#141E3C";
  const isD = config.suitType === "double";
  const bc = BTN_COLORS.find(b => b.id === config.buttonColor)?.hex || "#C6A855";
  const lt = (hex, a = 20) => { let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return `rgb(${Math.min(255, r + a)},${Math.min(255, g + a)},${Math.min(255, b + a)})`; };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ position: "absolute", top: "20%", left: "5%", right: "5%", bottom: "10%", background: `radial-gradient(ellipse, ${T.goldGlow}, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none" }} />
      <svg viewBox="0 0 240 380" style={{ width: size, filter: "drop-shadow(0 16px 48px rgba(28,21,16,0.18))", position: "relative", transition: "all 0.4s ease" }}>
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={lt(color, 15)} /><stop offset="100%" stopColor={color} /></linearGradient>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={lt(color, 30)} /><stop offset="100%" stopColor={lt(color, 8)} /></linearGradient>
          <linearGradient id="shim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.09)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="3 0" dur="3s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
        {/* Trousers behind jacket */}
        {(() => {
          const slim = config.pantsFit === "slim";
          const lx1 = slim ? 74 : 68, lx2 = slim ? 112 : 116;
          const rx1 = slim ? 128 : 124, rx2 = slim ? 166 : 172;
          return (<>
            <rect x={lx1} y="254" width={rx2 - lx1} height="11" fill={color} style={{ filter: "brightness(0.7)" }} />
            <path d={`M${lx1},265 L${lx1 - 3},372 L${lx2},372 L${lx2 + 2},265 Z`} fill={color} opacity="0.82" />
            <path d={`M${rx1},265 L${rx1 - 2},372 L${rx2 + 3},372 L${rx2},265 Z`} fill={color} opacity="0.82" />
            <line x1={lx1 + 18} y1="265" x2={lx1 + 16} y2="372" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
            <line x1={rx2 - 18} y1="265" x2={rx2 - 16} y2="372" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
            <path d={`M${lx1},265 L${lx1 - 3},372 L${lx2},372 L${lx2 + 2},265 Z`} fill="url(#shim)" opacity="0.7" />
            <path d={`M${rx1},265 L${rx1 - 2},372 L${rx2 + 3},372 L${rx2},265 Z`} fill="url(#shim)" opacity="0.7" />
          </>);
        })()}
        {/* Shoulders */}
        <path d="M72,92 L30,102 L24,98 L65,82 Z" fill={color} opacity="0.85" />
        <path d="M168,92 L210,102 L216,98 L175,82 Z" fill={color} opacity="0.85" />
        {/* Arms */}
        <path d="M30,102 L22,220 L38,222 L45,110 Z" fill={color} opacity="0.6" />
        <path d="M210,102 L218,220 L202,222 L195,110 Z" fill={color} opacity="0.6" />
        {/* Cuffs */}
        <rect x="20" y="218" width="20" height="12" rx="1" fill="#E8E0D0" opacity="0.6" />
        <rect x="200" y="218" width="20" height="12" rx="1" fill="#E8E0D0" opacity="0.6" />
        {/* Body */}
        <path d={isD ? "M65,92 L57,260 L183,260 L175,92 L148,74 L132,88 L120,68 L108,88 L92,74 Z" : "M68,92 L60,260 L180,260 L172,92 L146,74 L130,88 L120,66 L110,88 L94,74 Z"} fill="url(#sg)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        {/* Shimmer overlay */}
        <path d={isD ? "M65,92 L57,260 L183,260 L175,92 L148,74 L132,88 L120,68 L108,88 L92,74 Z" : "M68,92 L60,260 L180,260 L172,92 L146,74 L130,88 L120,66 L110,88 L94,74 Z"} fill="url(#shim)" />
        {/* Center */}
        <line x1="120" y1="130" x2="120" y2="260" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        {/* Lapels */}
        {isD ? (<>
          <path d="M92,74 L108,88 L85,168 L62,112 Z" fill="url(#lg)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <path d="M148,74 L132,88 L155,168 L178,112 Z" fill="url(#lg)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <path d="M62,112 L54,100 L68,104 Z" fill="url(#lg)" />
          <path d="M178,112 L186,100 L172,104 Z" fill="url(#lg)" />
        </>) : (<>
          <path d="M94,74 L110,88 L90,155 L66,108 Z" fill="url(#lg)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <path d="M146,74 L130,88 L150,155 L174,108 Z" fill="url(#lg)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <path d="M66,108 L60,102 L68,100 Z" fill="#1C1510" opacity="0.4" />
          <path d="M174,108 L180,102 L172,100 Z" fill="#1C1510" opacity="0.4" />
        </>)}
        {/* Shirt + Tie */}
        <path d="M110,88 L120,66 L130,88 L124,150 L120,155 L116,150 Z" fill="#EDE6D6" opacity="0.9" />
        <path d="M118,82 L120,70 L122,82 L121,158 L120,160 L119,158 Z" fill="#8B6B20" opacity="0.65" />
        <path d="M117,80 L120,72 L123,80 L121,86 L119,86 Z" fill="#8B6B20" opacity="0.8" />
        <ellipse cx="120" cy="64" rx="14" ry="5" fill="#D8D0C0" opacity="0.25" />
        {/* Buttons */}
        {isD ? [170, 200, 230].map((y, i) => (
          <g key={i}><circle cx="105" cy={y} r="4" fill={bc} opacity="0.9" /><circle cx="105" cy={y} r="2" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" /><circle cx="135" cy={y} r="3.5" fill={bc} opacity="0.2" /></g>
        )) : [165, 200].map((y, i) => (
          <g key={i}><circle cx="120" cy={y} r="4" fill={bc} opacity="0.9" /><circle cx="120" cy={y} r="2" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" /></g>
        ))}
        {/* Pocket square */}
        <line x1="138" y1="128" x2="152" y2="126" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
        <path d="M139,124 L143,118 L147,120 L151,126 L139,128 Z" fill="#8B6B20" opacity="0.25" />
        {/* Lower pockets */}
        <path d="M72,200 L98,198 L97,204 L71,206 Z" fill={color} stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" style={{ filter: "brightness(0.88)" }} />
        <path d="M142,198 L168,200 L169,206 L143,204 Z" fill={color} stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" style={{ filter: "brightness(0.88)" }} />
        {/* Stitching */}
        <path d={isD ? "M85,168 L79,260" : "M90,155 L83,260"} stroke="rgba(255,255,255,0.02)" strokeWidth="0.4" strokeDasharray="4 3" />
        <path d={isD ? "M155,168 L161,260" : "M150,155 L157,260"} stroke="rgba(255,255,255,0.02)" strokeWidth="0.4" strokeDasharray="4 3" />
        {/* Initials */}
        {config.initials && <text x="120" y="230" textAnchor="middle" fill="#C6A855" fontSize="11" fontFamily="Georgia,serif" opacity="0.6" fontStyle="italic" letterSpacing="2">{config.initials}</text>}
      </svg>
    </div>
  );
}

/* ═══════════ SHARED UI ═══════════ */
function OptCard({ sel, onClick, children, style = {} }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: sel ? T.goldDim : h ? T.cardHover : T.card,
        border: `1px solid ${sel ? T.gold : h ? T.borderLight : T.border}`,
        padding: "20px 22px", cursor: "pointer", transition: "all 0.25s", position: "relative",
        boxShadow: sel ? `0 2px 16px ${T.goldDim}` : h ? "0 2px 12px rgba(28,21,16,0.06)" : "0 1px 4px rgba(28,21,16,0.04)",
        ...style
      }}>
      {sel && <div style={{ position: "absolute", top: 12, right: 14, width: 20, height: 20, border: `1.5px solid ${T.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: T.gold, background: T.goldDim }}>✓</div>}
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  const [f, setF] = useState(false);
  return (
    <div>
      <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ width: "100%", padding: "13px 16px", background: T.card, border: `1px solid ${f ? T.gold : T.border}`, color: T.ink, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border 0.2s", boxShadow: f ? `0 0 0 3px ${T.goldDim}` : "none" }} />
    </div>
  );
}

function BtnPrimary({ children, onClick, disabled, style = {} }) {
  return <button onClick={onClick} disabled={disabled} style={{ background: disabled ? T.border : T.gold, border: "none", color: disabled ? T.muted : "#FFFFFF", padding: "14px 32px", cursor: disabled ? "default" : "pointer", fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "inherit", transition: "all 0.25s", ...style }}>{children}</button>;
}

function BtnGhost({ children, onClick }) {
  return <button onClick={onClick} style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.text, padding: "13px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "inherit", transition: "all 0.2s" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}>{children}</button>;
}

/* ═══════════ HOME PAGE ═══════════ */
function HomePage({ onStart }) {
  return (
    <div style={{ paddingTop: 58, background: T.bg }}>
      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 24px 80px", position: "relative", overflow: "hidden", background: `linear-gradient(180deg, #F6F1E9 0%, #EDE6D8 100%)` }}>
        {/* Decorative lines */}
        <div style={{ position: "absolute", top: 80, left: 48, width: 56, height: 56, borderTop: `1px solid ${T.border}`, borderLeft: `1px solid ${T.border}` }} />
        <div style={{ position: "absolute", bottom: 48, right: 48, width: 56, height: 56, borderBottom: `1px solid ${T.border}`, borderRight: `1px solid ${T.border}` }} />
        {/* Subtle rings */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 520, height: 520, border: `1px solid ${T.border}`, borderRadius: "50%", opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 680, height: 680, border: `1px solid ${T.border}`, borderRadius: "50%", opacity: 0.2, pointerEvents: "none" }} />

        <Fade delay={200}><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 7, textTransform: "uppercase", color: T.gold, marginBottom: 36 }}>Est. 2019</div></Fade>
        <Fade delay={400}>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(38px,7vw,68px)", fontWeight: 400, color: T.ink, lineHeight: 1.05, marginBottom: 4 }}>The Art of the</h1>
        </Fade>
        <Fade delay={560}>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(44px,8.5vw,78px)", fontWeight: 700, color: T.gold, lineHeight: 1.05, fontStyle: "italic", marginBottom: 28 }}>Bespoke Suit</h1>
        </Fade>
        <Fade delay={720}>
          <div style={{ width: 48, height: 1, background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`, margin: "0 auto 28px" }} />
        </Fade>
        <Fade delay={880}>
          <p style={{ fontSize: 15, color: T.text, maxWidth: 420, lineHeight: 1.95, fontWeight: 300, marginBottom: 48 }}>Welcome to a tailored experience of timeless elegance.<br />Design your custom suit, crafted to your exact measurements.</p>
        </Fade>
        <Fade delay={1060}>
          <button onClick={onStart}
            style={{ background: T.ink, border: `1px solid ${T.ink}`, color: "#F6F1E9", padding: "17px 60px", fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "all 0.35s" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.gold; e.currentTarget.style.borderColor = T.gold; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.ink; e.currentTarget.style.borderColor = T.ink; }}>
            Customize Your Suit
          </button>
        </Fade>
        <Fade delay={1300}>
          <div style={{ marginTop: 68, display: "flex", gap: 44, flexWrap: "wrap", justifyContent: "center" }}>
            {["Hand-Stitched", "Italian Fabrics", "Perfect Fit Guaranteed"].map(t => (
              <span key={t} style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: T.muted }}>{t}</span>
            ))}
          </div>
        </Fade>
      </section>

      {/* STATS */}
      <section id="section-collection" style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "64px 24px", background: T.card }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40, textAlign: "center" }}>
          {[{ end: 150, suffix: "+", l: "Fabric Options", s: "From the finest mills" }, { end: 6, suffix: "", l: "Customisation Steps", s: "Every detail, your choice" }, { end: 14, suffix: "", l: "Day Delivery", s: "Anywhere in the world" }, { end: 100, suffix: "%", l: "Fit Guarantee", s: "Or we remake it free" }].map((f, i) => (
            <Fade key={i} delay={200 + i * 150}>
              <div>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 40, color: T.gold, fontWeight: 400, marginBottom: 6, lineHeight: 1 }}>
                  <CountUp end={f.end} suffix={f.suffix} />
                </div>
                <div style={{ width: 24, height: 1, background: T.border, margin: "0 auto 10px" }} />
                <div style={{ fontSize: 11, color: T.ink, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>{f.l}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{f.s}</div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="section-bespoke" style={{ padding: "88px 24px", maxWidth: 860, margin: "0 auto" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 9, letterSpacing: 5, textTransform: "uppercase", color: T.gold, marginBottom: 14, fontWeight: 700 }}>The Process</div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 36, color: T.ink, fontWeight: 400 }}>Crafted in <em style={{ color: T.gold }}>Four</em> Simple Steps</h2>
          </div>
        </Fade>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
          {[{ n: "01", t: "Design", d: "Choose suit type, fabric, colour, and every fine detail." }, { n: "02", t: "Measure", d: "Smart estimation plus guided self-measuring system." }, { n: "03", t: "Order", d: "Secure checkout with instant WhatsApp confirmation." }, { n: "04", t: "Receive", d: "Bespoke suit delivered to your door. Fit guaranteed." }].map((s, i) => (
            <Fade key={i} delay={300 + i * 150}>
              <div style={{ background: T.card, border: `1px solid ${T.border}`, padding: "32px 24px", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.boxShadow = `0 4px 20px rgba(139,107,32,0.1)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 32, color: T.gold, opacity: 0.2, fontWeight: 700, marginBottom: 14, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 18, color: T.ink, fontWeight: 600, marginBottom: 10 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>{s.d}</div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section id="section-about" style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "80px 24px", textAlign: "center", background: T.bgDeep }}>
        <Fade>
          <div style={{ fontFamily: "Georgia,serif", fontSize: "clamp(20px,3.5vw,30px)", color: T.ink, fontWeight: 400, fontStyle: "italic", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
            "The suit is the modern gentleman's armour, and the Kingsman agents are the new knights."
          </div>
          <div style={{ fontSize: 9, color: T.muted, letterSpacing: 4, textTransform: "uppercase", marginTop: 28 }}>— Kingsman: The Secret Service</div>
        </Fade>
      </section>

      {/* CTA */}
      <section style={{ padding: "88px 24px", textAlign: "center", background: T.bg }}>
        <Fade>
          <div style={{ fontSize: 9, letterSpacing: 5, textTransform: "uppercase", color: T.gold, marginBottom: 16, fontWeight: 700 }}>Begin Your Journey</div>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: 32, color: T.ink, fontWeight: 400, marginBottom: 36 }}>Ready to Create Something <em style={{ color: T.gold }}>Extraordinary</em>?</h2>
          <button onClick={onStart}
            style={{ background: T.gold, border: "none", color: "#FFFFFF", padding: "17px 60px", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.background = T.goldSoft}
            onMouseLeave={e => e.currentTarget.style.background = T.gold}>
            Start Designing
          </button>
        </Fade>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "40px 24px", textAlign: "center", background: T.ink }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 22, height: 22, border: `1px solid rgba(198,168,85,0.4)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: 12, color: "#C6A855", fontWeight: 700, fontStyle: "italic" }}>K</div>
          <span style={{ fontFamily: "Georgia,serif", fontSize: 12, color: "rgba(246,241,233,0.6)", letterSpacing: 3 }}>KINGSMAN</span>
        </div>
        <div style={{ fontSize: 10, color: "rgba(246,241,233,0.3)", letterSpacing: 1 }}>© 2025 — Bespoke Tailoring for the Modern Gentleman</div>
      </footer>
    </div>
  );
}

/* ═══════════ CONFIGURATOR ═══════════ */
function ConfigPage({ config, setConfig, onNext }) {
  const [step, setStep] = useState(1);
  const total = 6;
  const up = (k, v) => setConfig(p => ({ ...p, [k]: v }));
  const canGo = () => {
    if (step === 1) return !!config.suitType;
    if (step === 2) return !!config.material;
    if (step === 3) return !!config.design;
    if (step === 4) return !!config.buttonType && !!config.buttonColor;
    if (step === 5) return true;
    if (step === 6) return !!config.pantsStyle && !!config.pantsFit;
    return false;
  };
  const next = () => step < total ? setStep(step + 1) : onNext();

  const FABRIC_TEXTURE = {
    backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.07) 0, rgba(0,0,0,0.07) 1px, transparent 0, transparent 50%)",
    backgroundSize: "5px 5px",
  };

  const renderStep = () => {
    if (step === 1) return (
      <Fade key="s1">
        <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Step 01</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Select Suit Type</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 28, lineHeight: 1.7 }}>Choose the silhouette that defines your presence.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SUIT_TYPES.map(t => (
            <OptCard key={t.id} sel={config.suitType === t.id} onClick={() => up("suitType", t.id)}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 24, color: T.gold, opacity: 0.4, fontWeight: 700, minWidth: 30 }}>{t.icon}</div>
                <div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 17, color: T.ink, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: T.muted, marginTop: 1, letterSpacing: 1 }}>{t.sub}</div>
                  <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7, marginTop: 6 }}>{t.desc}</div>
                </div>
              </div>
            </OptCard>
          ))}
        </div>
      </Fade>
    );

    if (step === 2) return (
      <Fade key="s2">
        <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Step 02</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Material Quality</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 28, lineHeight: 1.7 }}>Select the fabric tier for your suit.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MATERIALS.map(m => (
            <OptCard key={m.id} sel={config.material === m.id} onClick={() => up("material", m.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 17, color: T.ink, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7, marginTop: 6, maxWidth: 260 }}>{m.desc}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 70 }}>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: T.gold, textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>{m.tag}</div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 24, color: T.gold, fontWeight: 500 }}>{m.price}</div>
                </div>
              </div>
            </OptCard>
          ))}
        </div>
      </Fade>
    );

    if (step === 3) return (
      <Fade key="s3">
        <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Step 03</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Choose Your Design</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 28, lineHeight: 1.7 }}>Select from our curated collection.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {DESIGNS.map(d => (
            <OptCard key={d.id} sel={config.design === d.id} onClick={() => up("design", d.id)} style={{ padding: 14, textAlign: "center" }}>
              <div style={{ width: "100%", height: 52, background: d.hex, marginBottom: 10, border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", inset: 0, ...FABRIC_TEXTURE }} />
              </div>
              <div style={{ fontSize: 11, color: T.ink, fontWeight: 600 }}>{d.name}</div>
            </OptCard>
          ))}
        </div>
      </Fade>
    );

    if (step === 4) return (
      <Fade key="s4">
        <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Step 04</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Button Details</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 24, lineHeight: 1.7 }}>Choose material and finish.</p>
        <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Material</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          {BTN_TYPES.map(b => (<OptCard key={b.id} sel={config.buttonType === b.id} onClick={() => up("buttonType", b.id)} style={{ flex: 1, textAlign: "center", padding: 16 }}><div style={{ fontSize: 14, color: T.ink }}>{b.name}</div></OptCard>))}
        </div>
        <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>Colour</div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          {BTN_COLORS.map(c => (
            <div key={c.id} onClick={() => up("buttonColor", c.id)} style={{ cursor: "pointer", textAlign: "center" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: c.hex, margin: "0 auto 8px", border: config.buttonColor === c.id ? `2.5px solid ${T.gold}` : `2px solid ${T.border}`, boxShadow: config.buttonColor === c.id ? `0 0 0 3px ${T.goldDim}` : "none", transition: "all 0.25s" }} />
              <div style={{ fontSize: 10, color: config.buttonColor === c.id ? T.ink : T.muted, fontWeight: config.buttonColor === c.id ? 600 : 400 }}>{c.name}</div>
            </div>
          ))}
        </div>
      </Fade>
    );

    if (step === 5) return (
      <Fade key="s5">
        <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Step 05</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Personal Monogram</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 28, lineHeight: 1.7 }}>Add your initials embroidered inside the jacket.</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <OptCard sel={config.wantInitials === true} onClick={() => up("wantInitials", true)} style={{ flex: 1, textAlign: "center", padding: 16 }}><div style={{ fontSize: 14, color: T.ink }}>Add Initials</div></OptCard>
          <OptCard sel={config.wantInitials === false} onClick={() => { up("wantInitials", false); up("initials", ""); }} style={{ flex: 1, textAlign: "center", padding: 16 }}><div style={{ fontSize: 14, color: T.ink }}>Skip</div></OptCard>
        </div>
        {config.wantInitials && (
          <Fade>
            <div style={{ background: T.bgDeep, border: `1px solid ${T.border}`, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>Enter Your Initials</div>
              <input type="text" maxLength={5} value={config.initials || ""} onChange={e => up("initials", e.target.value.toUpperCase())} placeholder="e.g. J.H.R."
                style={{ width: 180, padding: 14, background: T.card, border: `1px solid ${T.border}`, color: T.gold, fontSize: 22, fontFamily: "Georgia,serif", letterSpacing: 4, textAlign: "center", outline: "none", fontStyle: "italic" }}
                onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.border} />
              <div style={{ fontSize: 11, color: T.muted, marginTop: 12 }}>Gold thread on the inner lining</div>
            </div>
          </Fade>
        )}
      </Fade>
    );

    if (step === 6) return (
      <Fade key="s6">
        <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Step 06</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Trousers</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 24, lineHeight: 1.7 }}>Complete your look.</p>
        <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Style</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {PANTS_STYLES.map(p => (<OptCard key={p.id} sel={config.pantsStyle === p.id} onClick={() => up("pantsStyle", p.id)}><div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: T.ink, fontWeight: 600, marginBottom: 2 }}>{p.name}</div><div style={{ fontSize: 12, color: T.muted }}>{p.desc}</div></OptCard>))}
        </div>
        <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Fit</div>
        <div style={{ display: "flex", gap: 10 }}>
          {PANTS_FIT.map(f => (<OptCard key={f.id} sel={config.pantsFit === f.id} onClick={() => up("pantsFit", f.id)} style={{ flex: 1, textAlign: "center", padding: 16 }}><div style={{ fontSize: 14, color: T.ink }}>{f.name}</div></OptCard>))}
        </div>
      </Fade>
    );
  };

  return (
    <div style={{ paddingTop: 58, minHeight: "100vh", background: T.bg }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: T.border }}><div style={{ height: 3, background: `linear-gradient(90deg, ${T.gold}, ${T.goldSoft})`, width: `${(step / total) * 100}%`, transition: "width 0.5s cubic-bezier(.22,1,.36,1)" }} /></div>
      {/* Step dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "14px 24px", borderBottom: `1px solid ${T.border}`, background: T.card }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} onClick={() => i + 1 < step && setStep(i + 1)} style={{
            width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700,
            color: i + 1 === step ? "#FFFFFF" : i + 1 < step ? T.gold : T.muted,
            border: `1px solid ${i + 1 === step ? T.gold : i + 1 < step ? T.gold : T.border}`,
            background: i + 1 === step ? T.gold : i + 1 < step ? T.goldDim : "transparent",
            cursor: i + 1 < step ? "pointer" : "default", transition: "all 0.3s",
          }}>{i + 1 < step ? "✓" : i + 1}</div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", minHeight: "calc(100vh - 113px)" }}>
        {/* Preview panel */}
        <div style={{ flex: "1 1 300px", minWidth: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: T.bgDeep, borderRight: `1px solid ${T.border}` }}>
          <SuitVisual config={config} size={260} />
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Preview</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: T.ink, fontWeight: 500 }}>{DESIGNS.find(d => d.id === config.design)?.name || "Your Suit"}</div>
            {config.suitType && <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{SUIT_TYPES.find(s => s.id === config.suitType)?.name}{config.material && ` · ${MATERIALS.find(m => m.id === config.material)?.name}`}</div>}
          </div>
        </div>
        {/* Options panel */}
        <div style={{ flex: "1 1 380px", padding: "40px 32px", maxWidth: 520, background: T.bg }}>
          {renderStep()}
          <div style={{ display: "flex", gap: 12, marginTop: 40, justifyContent: "space-between" }}>
            {step > 1 ? <BtnGhost onClick={() => setStep(step - 1)}>← Back</BtnGhost> : <div />}
            <BtnPrimary onClick={next} disabled={!canGo()}>{step === total ? "Measurements →" : "Continue →"}</BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ MEASUREMENTS ═══════════ */
function MeasurePage({ measurements: m, setMeasurements: setM, onNext, onBack }) {
  const [body, setBody] = useState({ age: "", height: "", weight: "" });
  const [phase, setPhase] = useState("body");
  const [loading, setLoading] = useState(false);

  const estimate = () => {
    setLoading(true);
    setTimeout(() => {
      const h = parseFloat(body.height) || 175, w = parseFloat(body.weight) || 78;
      const bmi = w / ((h / 100) ** 2);
      const ch = bmi < 22 ? 37 : bmi < 26 ? 40 : 43;
      const wa = bmi < 22 ? 31 : bmi < 26 ? 34 : 38;
      setM({ chest: String(ch), waist: String(wa), shoulders: String(Math.round(17 + (h - 165) * 0.06)), sleeve: String(Math.round(24 + (h - 165) * 0.08)), jacket: String(Math.round(28 + (h - 165) * 0.1)), inseam: String(Math.round(29 + (h - 165) * 0.12)) });
      setLoading(false); setPhase("refine");
    }, 1200);
  };

  return (
    <div style={{ paddingTop: 58, minHeight: "100vh", background: T.bg }}>
      <div style={{ height: 3, background: T.border }}><div style={{ height: 3, background: `linear-gradient(90deg, ${T.gold}, ${T.goldSoft})`, width: phase === "body" ? "50%" : "100%", transition: "width 0.5s" }} /></div>
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "48px 24px" }}>
        {phase === "body" && (
          <Fade key="body">
            <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Step A</div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Your Body Profile</h2>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 28, lineHeight: 1.7 }}>We'll estimate your measurements as a starting point.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <InputField label="Age" value={body.age} onChange={v => setBody(p => ({ ...p, age: v }))} placeholder="e.g. 32" type="number" />
              <InputField label="Height (cm)" value={body.height} onChange={v => setBody(p => ({ ...p, height: v }))} placeholder="e.g. 178" type="number" />
              <InputField label="Weight (kg)" value={body.weight} onChange={v => setBody(p => ({ ...p, weight: v }))} placeholder="e.g. 80" type="number" />
            </div>
            <BtnPrimary onClick={estimate} disabled={!body.height || !body.weight || loading} style={{ width: "100%", marginTop: 32 }}>
              {loading ? "Calculating..." : "Estimate My Measurements"}
            </BtnPrimary>
            {loading && (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <div style={{ width: 28, height: 28, border: `2px solid ${T.border}`, borderTopColor: T.gold, borderRadius: "50%", margin: "0 auto", animation: "kspin 0.8s linear infinite" }} />
                <style>{`@keyframes kspin{to{transform:rotate(360deg)}}`}</style>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 12 }}>Analysing your body profile...</div>
              </div>
            )}
          </Fade>
        )}
        {phase === "refine" && (
          <Fade key="refine">
            <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Step B</div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Fine-Tune Measurements</h2>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 12, lineHeight: 1.7 }}>Adjust with a tape measure for the perfect fit.</p>
            <div style={{ background: T.goldDim, border: `1px solid rgba(139,107,32,0.2)`, padding: "12px 16px", marginBottom: 28, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: T.gold }}>✦</span>
              <span style={{ fontSize: 12, color: T.gold, lineHeight: 1.6 }}>Estimated based on your profile. For best results, measure with a friend.</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {MEASURE_FIELDS.map(f => (
                <div key={f.id} style={{ background: T.card, border: `1px solid ${T.border}`, padding: 16, boxShadow: "0 1px 4px rgba(28,21,16,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>{f.label}</span>
                    <span style={{ fontSize: 12, color: T.muted, opacity: 0.5 }}>{f.icon}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="number" value={m[f.id] || ""} onChange={e => setM(p => ({ ...p, [f.id]: e.target.value }))} placeholder={f.range}
                      style={{ width: "100%", padding: 10, background: T.bgDeep, border: `1px solid ${T.border}`, color: T.ink, fontSize: 17, fontFamily: "Georgia,serif", textAlign: "center", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.border} />
                    <span style={{ fontSize: 11, color: T.muted }}>in</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
              <BtnGhost onClick={onBack}>← Back</BtnGhost>
              <BtnPrimary onClick={onNext} style={{ flex: 1 }}>Proceed to Checkout →</BtnPrimary>
            </div>
          </Fade>
        )}
      </div>
    </div>
  );
}

/* ═══════════ CHECKOUT ═══════════ */
function CheckoutPage({ config, onBack }) {
  const [ship, setShip] = useState({ name: "", address: "", country: "", postal: "", phone: "", email: "" });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [done, setDone] = useState(false);
  const [processing, setProcessing] = useState(false);

  const canSubmit = ship.name.trim() && ship.email.trim() && ship.address.trim();
  const submit = () => {
    if (!canSubmit) return;
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, 1800);
  };

  if (done) return (
    <div style={{ paddingTop: 58, minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <Fade delay={200}>
          <div style={{ width: 76, height: 76, border: `2px solid ${T.gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 32, color: T.gold, background: T.goldDim, animation: "kpulse 2s ease-in-out infinite" }}>✓</div>
          <style>{`@keyframes kpulse { 0%,100%{box-shadow:0 0 0 0 rgba(139,107,32,0)} 50%{box-shadow:0 0 0 14px rgba(139,107,32,0.1)} }`}</style>
        </Fade>
        <Fade delay={400}><h2 style={{ fontFamily: "Georgia,serif", fontSize: 34, color: T.ink, fontWeight: 500, marginBottom: 12 }}>Order Confirmed</h2></Fade>
        <Fade delay={600}><p style={{ fontSize: 14, color: T.text, lineHeight: 1.9, marginBottom: 36 }}>Thank you for choosing bespoke. You'll receive a WhatsApp confirmation shortly.</p></Fade>
        <Fade delay={800}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, padding: "24px 28px", textAlign: "left", boxShadow: "0 2px 16px rgba(28,21,16,0.06)" }}>
            <div style={{ fontSize: 9, color: T.gold, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>Order Summary</div>
            {[["Suit", SUIT_TYPES.find(s => s.id === config.suitType)?.name], ["Material", MATERIALS.find(mm => mm.id === config.material)?.name], ["Design", DESIGNS.find(d => d.id === config.design)?.name], ["Buttons", `${config.buttonType} — ${config.buttonColor}`], ...(config.initials ? [["Monogram", config.initials]] : []), ["Trousers", `${PANTS_STYLES.find(p => p.id === config.pantsStyle)?.name} · ${config.pantsFit}`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                <span style={{ color: T.muted }}>{k}</span><span style={{ color: T.ink, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 18, color: T.ink }}>Total</span>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.gold, fontWeight: 600 }}>{MATERIALS.find(mm => mm.id === config.material)?.price || "$379"}</span>
            </div>
          </div>
        </Fade>
        <Fade delay={1000}><div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#25D366" }} /><span style={{ fontSize: 12, color: "#25D366", fontWeight: 600 }}>WhatsApp confirmation sent</span></div></Fade>
        <Fade delay={1200}><div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: T.gold }} /><span style={{ fontSize: 12, color: T.gold, fontWeight: 600 }}>Admin notification delivered</span></div></Fade>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 58, minHeight: "100vh", background: T.bg }}>
      <div style={{ height: 3, background: T.gold }} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px" }}>
        <Fade>
          <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Final Step</div>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Delivery Details</h2>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 32, lineHeight: 1.7 }}>Where should we send your bespoke suit?</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InputField label="Full Name *" value={ship.name} onChange={v => setShip(p => ({ ...p, name: v }))} placeholder="James Harrison" />
            <InputField label="Shipping Address *" value={ship.address} onChange={v => setShip(p => ({ ...p, address: v }))} placeholder="11 Savile Row, Mayfair" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <InputField label="Country" value={ship.country} onChange={v => setShip(p => ({ ...p, country: v }))} placeholder="United Kingdom" />
              <InputField label="Postal Code" value={ship.postal} onChange={v => setShip(p => ({ ...p, postal: v }))} placeholder="W1S 3PR" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <InputField label="Phone" value={ship.phone} onChange={v => setShip(p => ({ ...p, phone: v }))} placeholder="+44 7700 900000" type="tel" />
              <InputField label="Email *" value={ship.email} onChange={v => setShip(p => ({ ...p, email: v }))} placeholder="james@example.com" type="email" />
            </div>
          </div>

          {/* Payment */}
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 18, fontWeight: 700 }}>Payment</div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, boxShadow: "0 1px 4px rgba(28,21,16,0.04)" }}>
              <div style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>Credit / Debit Card</div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ background: "#1A1F71", padding: "4px 10px", fontSize: 9, color: "white", fontWeight: 800, letterSpacing: 1 }}>VISA</div>
                <div style={{ background: "#333", padding: "4px 8px", fontSize: 9, fontWeight: 800, display: "flex", gap: 1 }}><span style={{ color: "#EB001B" }}>●</span><span style={{ color: "#F79E1B" }}>●</span></div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputField label="Card Number" value={card.number} onChange={v => setCard(p => ({ ...p, number: v }))} placeholder="4242 4242 4242 4242" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <InputField label="Expiry" value={card.expiry} onChange={v => setCard(p => ({ ...p, expiry: v }))} placeholder="MM / YY" />
                <InputField label="CVC" value={card.cvc} onChange={v => setCard(p => ({ ...p, cvc: v }))} placeholder="123" />
              </div>
            </div>
          </div>

          {/* Total */}
          <div style={{ background: T.bgDeep, border: `1px solid ${T.border}`, padding: "20px 24px", marginTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 9, color: T.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>Total</div>
                <div style={{ fontSize: 12, color: T.text }}>{SUIT_TYPES.find(s => s.id === config.suitType)?.name} · {DESIGNS.find(d => d.id === config.design)?.name}</div>
              </div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 28, color: T.gold, fontWeight: 600 }}>{MATERIALS.find(mm => mm.id === config.material)?.price || "$379"}</div>
            </div>
          </div>

          {!canSubmit && (ship.name !== "" || ship.email !== "" || ship.address !== "") && (
            <div style={{ marginTop: 14, fontSize: 11, color: "#B85C5C", textAlign: "center" }}>Please fill in your name, address and email to continue.</div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <BtnGhost onClick={onBack}>← Back</BtnGhost>
            <button onClick={submit} disabled={processing || !canSubmit} style={{ flex: 1, background: processing || !canSubmit ? T.border : T.gold, border: "none", color: processing || !canSubmit ? T.muted : "#FFFFFF", padding: 16, fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", cursor: processing || !canSubmit ? "default" : "pointer", fontFamily: "inherit", transition: "all 0.3s" }}>
              {processing ? "Processing..." : "Place Order"}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: T.muted }}>🔒 Secured with 256-bit SSL encryption</div>
        </Fade>
      </div>
    </div>
  );
}

/* ═══════════ APP ═══════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [config, setConfig] = useState({ suitType: "", material: "", design: "midnight", buttonType: "", buttonColor: "gold", wantInitials: null, initials: "", pantsStyle: "", pantsFit: "" });
  const [measurements, setMeasurements] = useState({});

  useEffect(() => {
    if (!document.getElementById("kfonts")) {
      const l = document.createElement("link"); l.id = "kfonts";
      l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700&display=swap";
      l.rel = "stylesheet"; document.head.appendChild(l);
    }
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100vh", fontFamily: "'Manrope',sans-serif" }}>
      <Nav current={page} onNav={setPage} />
      {page === "home" && <PageTransition key="home"><HomePage onStart={() => setPage("configure")} /></PageTransition>}
      {page === "configure" && <PageTransition key="configure"><ConfigPage config={config} setConfig={setConfig} onNext={() => setPage("measure")} /></PageTransition>}
      {page === "measure" && <PageTransition key="measure"><MeasurePage measurements={measurements} setMeasurements={setMeasurements} onNext={() => setPage("checkout")} onBack={() => setPage("configure")} /></PageTransition>}
      {page === "checkout" && <PageTransition key="checkout"><CheckoutPage config={config} onBack={() => setPage("measure")} /></PageTransition>}
    </div>
  );
}
