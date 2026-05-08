import { useState, useEffect, useRef } from "react";

/* ═══════════ TOKENS — Forest Green · Parchment · Brass ═══════════ */
const T = {
  brass: "#B07C28",
  brassLight: "#C8962E",
  brassDim: "rgba(176,124,40,0.12)",
  forest: "#0E2318",
  forestMid: "#162E1E",
  forestLight: "#1E4028",
  parchment: "#F0EAE0",
  parchmentDeep: "#E4DAC8",
  card: "#FFFFFF",
  cardHover: "#FAF8F4",
  ink: "#0E1A0E",
  text: "#4A5A48",
  muted: "#8A9A86",
  border: "#D8CEBC",
  borderDark: "rgba(255,255,255,0.1)",
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

const DEMO_CONFIG = { suitType: "classic", material: "premium", design: "midnight", buttonType: "metal", buttonColor: "gold", initials: "", pantsFit: "slim", pantsStyle: "classic" };

/* ═══════════ UTILS ═══════════ */
function Fade({ children, delay = 0, y = 20, style = {} }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div style={{ opacity: v ? 1 : 0, transform: v ? "none" : `translateY(${y}px)`, transition: "opacity 0.75s cubic-bezier(.22,1,.36,1), transform 0.75s cubic-bezier(.22,1,.36,1)", ...style }}>{children}</div>;
}

function CountUp({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1500;
        const startTime = performance.now();
        const animate = (now) => {
          const p = Math.min((now - startTime) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(animate); else setCount(end);
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
  return <div style={{ opacity: v ? 1 : 0, transition: "opacity 0.4s ease" }}>{children}</div>;
}

/* ═══════════ NAV ═══════════ */
function Nav({ current, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);

  const isHome = current === "home";
  const navBg = isHome
    ? (scrolled ? "rgba(14,35,24,0.97)" : "transparent")
    : "rgba(14,35,24,0.98)";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 60,
      background: navBg,
      backdropFilter: scrolled || !isHome ? "blur(20px)" : "none",
      borderBottom: `1px solid ${scrolled || !isHome ? "rgba(255,255,255,0.08)" : "transparent"}`,
      padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all 0.4s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => onNav("home")}>
        <div style={{ width: 32, height: 32, border: `1.5px solid ${T.brass}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: 16, color: T.brass, fontWeight: 700, fontStyle: "italic" }}>K</div>
        <span style={{ fontFamily: "Georgia,serif", fontSize: 15, color: "#F0EAE0", fontWeight: 500, letterSpacing: 3 }}>KINGSMAN</span>
      </div>
      {isHome ? (
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {[["Collection", "section-collection"], ["Process", "section-bespoke"], ["About", "section-about"]].map(([label, id]) => (
            <span key={label} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontSize: 10, color: "rgba(240,234,224,0.5)", letterSpacing: 2.5, textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#F0EAE0"} onMouseLeave={e => e.target.style.color = "rgba(240,234,224,0.5)"}>{label}</span>
          ))}
          <button onClick={() => onNav("configure")} style={{ background: T.brass, border: "none", color: T.forest, padding: "9px 22px", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = T.brassLight}
            onMouseLeave={e => e.currentTarget.style.background = T.brass}>
            Bespoke
          </button>
        </div>
      ) : (
        <span style={{ fontSize: 10, letterSpacing: 3, color: "rgba(240,234,224,0.5)", textTransform: "uppercase" }}>
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
      <div style={{ position: "absolute", top: "15%", left: "10%", right: "10%", bottom: "5%", background: "radial-gradient(ellipse, rgba(176,124,40,0.12), transparent 70%)", filter: "blur(24px)", pointerEvents: "none" }} />
      <svg viewBox="0 0 240 380" style={{ width: size, filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.5))", position: "relative", transition: "all 0.4s ease" }}>
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={lt(color, 15)} /><stop offset="100%" stopColor={color} /></linearGradient>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={lt(color, 30)} /><stop offset="100%" stopColor={lt(color, 8)} /></linearGradient>
          <linearGradient id="shim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="3 0" dur="3.5s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
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
            <path d={`M${lx1},265 L${lx1 - 3},372 L${lx2},372 L${lx2 + 2},265 Z`} fill="url(#shim)" opacity="0.6" />
            <path d={`M${rx1},265 L${rx1 - 2},372 L${rx2 + 3},372 L${rx2},265 Z`} fill="url(#shim)" opacity="0.6" />
          </>);
        })()}
        <path d="M72,92 L30,102 L24,98 L65,82 Z" fill={color} opacity="0.85" />
        <path d="M168,92 L210,102 L216,98 L175,82 Z" fill={color} opacity="0.85" />
        <path d="M30,102 L22,220 L38,222 L45,110 Z" fill={color} opacity="0.6" />
        <path d="M210,102 L218,220 L202,222 L195,110 Z" fill={color} opacity="0.6" />
        <rect x="20" y="218" width="20" height="12" rx="1" fill="#E8E0D0" opacity="0.6" />
        <rect x="200" y="218" width="20" height="12" rx="1" fill="#E8E0D0" opacity="0.6" />
        <path d={isD ? "M65,92 L57,260 L183,260 L175,92 L148,74 L132,88 L120,68 L108,88 L92,74 Z" : "M68,92 L60,260 L180,260 L172,92 L146,74 L130,88 L120,66 L110,88 L94,74 Z"} fill="url(#sg)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        <path d={isD ? "M65,92 L57,260 L183,260 L175,92 L148,74 L132,88 L120,68 L108,88 L92,74 Z" : "M68,92 L60,260 L180,260 L172,92 L146,74 L130,88 L120,66 L110,88 L94,74 Z"} fill="url(#shim)" />
        <line x1="120" y1="130" x2="120" y2="260" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        {isD ? (<>
          <path d="M92,74 L108,88 L85,168 L62,112 Z" fill="url(#lg)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <path d="M148,74 L132,88 L155,168 L178,112 Z" fill="url(#lg)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <path d="M62,112 L54,100 L68,104 Z" fill="url(#lg)" />
          <path d="M178,112 L186,100 L172,104 Z" fill="url(#lg)" />
        </>) : (<>
          <path d="M94,74 L110,88 L90,155 L66,108 Z" fill="url(#lg)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <path d="M146,74 L130,88 L150,155 L174,108 Z" fill="url(#lg)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <path d="M66,108 L60,102 L68,100 Z" fill={T.forest} opacity="0.5" />
          <path d="M174,108 L180,102 L172,100 Z" fill={T.forest} opacity="0.5" />
        </>)}
        <path d="M110,88 L120,66 L130,88 L124,150 L120,155 L116,150 Z" fill="#EDE6D6" opacity="0.9" />
        <path d="M118,82 L120,70 L122,82 L121,158 L120,160 L119,158 Z" fill={T.brass} opacity="0.7" />
        <path d="M117,80 L120,72 L123,80 L121,86 L119,86 Z" fill={T.brass} opacity="0.85" />
        <ellipse cx="120" cy="64" rx="14" ry="5" fill="#D8D0C0" opacity="0.25" />
        {isD ? [170, 200, 230].map((y, i) => (
          <g key={i}><circle cx="105" cy={y} r="4" fill={bc} opacity="0.9" /><circle cx="105" cy={y} r="2" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" /><circle cx="135" cy={y} r="3.5" fill={bc} opacity="0.2" /></g>
        )) : [165, 200].map((y, i) => (
          <g key={i}><circle cx="120" cy={y} r="4" fill={bc} opacity="0.9" /><circle cx="120" cy={y} r="2" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" /></g>
        ))}
        <path d="M139,124 L143,118 L147,120 L151,126 L139,128 Z" fill={T.brass} opacity="0.3" />
        <path d="M72,200 L98,198 L97,204 L71,206 Z" fill={color} stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" style={{ filter: "brightness(0.88)" }} />
        <path d="M142,198 L168,200 L169,206 L143,204 Z" fill={color} stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" style={{ filter: "brightness(0.88)" }} />
        <path d={isD ? "M85,168 L79,260" : "M90,155 L83,260"} stroke="rgba(255,255,255,0.025)" strokeWidth="0.4" strokeDasharray="4 3" />
        <path d={isD ? "M155,168 L161,260" : "M150,155 L157,260"} stroke="rgba(255,255,255,0.025)" strokeWidth="0.4" strokeDasharray="4 3" />
        {config.initials && <text x="120" y="230" textAnchor="middle" fill={T.brass} fontSize="11" fontFamily="Georgia,serif" opacity="0.6" fontStyle="italic" letterSpacing="2">{config.initials}</text>}
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
        background: sel ? T.brassDim : h ? T.cardHover : T.card,
        border: `1px solid ${sel ? T.brass : h ? T.border : T.border}`,
        padding: "20px 22px", cursor: "pointer", transition: "all 0.25s", position: "relative",
        boxShadow: sel ? `0 0 0 1px ${T.brass}` : h ? "0 2px 12px rgba(14,26,14,0.08)" : "0 1px 3px rgba(14,26,14,0.04)",
        ...style
      }}>
      {sel && <div style={{ position: "absolute", top: 10, right: 12, width: 20, height: 20, background: T.brass, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#FFF", fontWeight: 700 }}>✓</div>}
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  const [f, setF] = useState(false);
  return (
    <div>
      <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 7, fontWeight: 600 }}>{label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ width: "100%", padding: "12px 16px", background: T.card, border: `1px solid ${f ? T.brass : T.border}`, color: T.ink, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "all 0.2s", boxShadow: f ? `0 0 0 3px ${T.brassDim}` : "none" }} />
    </div>
  );
}

function BtnPrimary({ children, onClick, disabled, style = {} }) {
  return <button onClick={onClick} disabled={disabled} style={{ background: disabled ? T.border : T.forest, border: "none", color: disabled ? T.muted : "#F0EAE0", padding: "14px 32px", cursor: disabled ? "default" : "pointer", fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "inherit", transition: "all 0.25s", ...style }}>{children}</button>;
}

function BtnGhost({ children, onClick }) {
  return <button onClick={onClick}
    style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.text, padding: "13px 24px", cursor: "pointer", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "inherit", transition: "all 0.2s" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = T.forest; e.currentTarget.style.color = T.forest; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}>
    {children}
  </button>;
}

/* ═══════════ HOME PAGE ═══════════ */
function HomePage({ onStart }) {
  return (
    <div style={{ background: T.parchment }}>

      {/* ── HERO ── Split layout */}
      <section style={{ minHeight: "100vh", display: "flex", flexWrap: "wrap" }}>

        {/* Left — Text */}
        <div style={{ flex: "1 1 480px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px 64px 80px", background: T.parchment, position: "relative" }}>
          {/* Top-left corner mark */}
          <div style={{ position: "absolute", top: 80, left: 40, width: 40, height: 40, borderTop: `1px solid ${T.border}`, borderLeft: `1px solid ${T.border}` }} />

          <Fade delay={200}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
              <div style={{ width: 32, height: 1, background: T.brass }} />
              <span style={{ fontSize: 9, color: T.brass, letterSpacing: 5, textTransform: "uppercase", fontWeight: 700 }}>Est. 2019 · London</span>
            </div>
          </Fade>

          <Fade delay={380}>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(44px,6vw,80px)", fontWeight: 400, color: T.ink, lineHeight: 1.0, marginBottom: 0 }}>
              Dressed
            </h1>
          </Fade>
          <Fade delay={480}>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(44px,6vw,80px)", fontWeight: 700, color: T.forest, lineHeight: 1.0, fontStyle: "italic", marginBottom: 8 }}>
              to Conquer.
            </h1>
          </Fade>

          <Fade delay={600}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "28px 0" }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <div style={{ width: 6, height: 6, background: T.brass, transform: "rotate(45deg)" }} />
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>
          </Fade>

          <Fade delay={720}>
            <p style={{ fontSize: 15, color: T.text, maxWidth: 380, lineHeight: 2, fontWeight: 300, marginBottom: 44 }}>
              The finest bespoke tailoring, designed by you. Italian wool, hand-stitched to your exact measurements. Delivered in 14 days.
            </p>
          </Fade>

          <Fade delay={860}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={onStart}
                style={{ background: T.forest, border: "none", color: "#F0EAE0", padding: "16px 40px", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.forestLight}
                onMouseLeave={e => e.currentTarget.style.background = T.forest}>
                Start Designing
              </button>
              <button onClick={() => document.getElementById("section-bespoke")?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.text, padding: "16px 32px", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.forest; e.currentTarget.style.color = T.forest; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}>
                How It Works
              </button>
            </div>
          </Fade>

          <Fade delay={1050}>
            <div style={{ marginTop: 56, paddingTop: 40, borderTop: `1px solid ${T.border}`, display: "flex", gap: 32 }}>
              {[["150+", "Fabrics"], ["14", "Day Delivery"], ["100%", "Fit Guaranteed"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: T.forest, fontWeight: 600 }}>{n}</div>
                  <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Fade>
        </div>

        {/* Right — Visual */}
        <div style={{ flex: "1 1 420px", minHeight: 520, background: T.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {/* Pattern overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(176,124,40,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
          {/* Glow */}
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(176,124,40,0.15), transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
          {/* Corner lines */}
          <div style={{ position: "absolute", top: 40, left: 40, width: 50, height: 50, borderTop: "1px solid rgba(176,124,40,0.3)", borderLeft: "1px solid rgba(176,124,40,0.3)" }} />
          <div style={{ position: "absolute", bottom: 40, right: 40, width: 50, height: 50, borderBottom: "1px solid rgba(176,124,40,0.3)", borderRight: "1px solid rgba(176,124,40,0.3)" }} />

          <Fade delay={600} style={{ position: "relative", zIndex: 1 }}>
            <SuitVisual config={DEMO_CONFIG} size={280} />
          </Fade>
          <Fade delay={900} style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: 24 }}>
            <div style={{ fontSize: 9, color: "rgba(176,124,40,0.7)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 6 }}>Live Preview</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 14, color: "rgba(240,234,224,0.5)", fontStyle: "italic" }}>Configure yours →</div>
          </Fade>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section id="section-collection" style={{ background: T.forestMid, padding: "56px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 0 }}>
          {[{ end: 150, suffix: "+", l: "Fabric Options" }, { end: 6, suffix: "", l: "Design Steps" }, { end: 14, suffix: "", l: "Day Delivery" }, { end: 100, suffix: "%", l: "Fit Guarantee" }].map((f, i) => (
            <Fade key={i} delay={i * 120}>
              <div style={{ textAlign: "center", padding: "16px 8px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 44, color: T.brass, fontWeight: 400, lineHeight: 1 }}>
                  <CountUp end={f.end} suffix={f.suffix} />
                </div>
                <div style={{ fontSize: 10, color: "rgba(240,234,224,0.45)", letterSpacing: 2, textTransform: "uppercase", marginTop: 8, fontWeight: 600 }}>{f.l}</div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="section-bespoke" style={{ padding: "96px 40px", background: T.card }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Fade>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 64 }}>
              <div style={{ height: 1, flex: 1, background: T.border }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: T.brass, letterSpacing: 5, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>The Process</div>
                <h2 style={{ fontFamily: "Georgia,serif", fontSize: 38, color: T.ink, fontWeight: 400 }}>How It <em style={{ color: T.forest, fontStyle: "italic" }}>Works</em></h2>
              </div>
              <div style={{ height: 1, flex: 1, background: T.border }} />
            </div>
          </Fade>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0, position: "relative" }}>
            {[
              { n: "01", t: "Design", d: "Choose your silhouette, fabric, colour, buttons, and monogram across 6 guided steps." },
              { n: "02", t: "Measure", d: "Our smart estimator pre-fills your measurements. Fine-tune with a tape for perfection." },
              { n: "03", t: "Order", d: "Secure checkout. Instant WhatsApp confirmation sent directly to you." },
              { n: "04", t: "Receive", d: "Your bespoke suit arrives in 14 days. Perfect fit — or we remake it free." },
            ].map((s, i) => (
              <Fade key={i} delay={200 + i * 140}>
                <div style={{ padding: "36px 32px", borderRight: i < 3 ? `1px solid ${T.border}` : "none", borderTop: `3px solid ${i === 0 ? T.brass : "transparent"}`, transition: "border-top-color 0.3s", position: "relative" }}
                  onMouseEnter={e => e.currentTarget.style.borderTopColor = T.brass}
                  onMouseLeave={e => { if (i !== 0) e.currentTarget.style.borderTopColor = "transparent"; }}>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 56, color: T.forest, opacity: 0.06, fontWeight: 700, lineHeight: 1, marginBottom: 20 }}>{s.n}</div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: T.ink, fontWeight: 600, marginBottom: 12 }}>{s.t}</div>
                  <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.85 }}>{s.d}</div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── MATERIALS HIGHLIGHT ── */}
      <section style={{ padding: "80px 40px", background: T.parchmentDeep }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 2, alignItems: "stretch" }}>
          <Fade style={{ flex: "1 1 300px" }}>
            <div style={{ background: T.forest, padding: "48px 40px", height: "100%" }}>
              <div style={{ fontSize: 9, color: "rgba(176,124,40,0.7)", letterSpacing: 5, textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>Our Fabrics</div>
              <h3 style={{ fontFamily: "Georgia,serif", fontSize: 28, color: "#F0EAE0", fontWeight: 400, lineHeight: 1.3, marginBottom: 20 }}>Italian Wool<br /><em>Sourced from the Finest Mills</em></h3>
              <p style={{ fontSize: 13, color: "rgba(240,234,224,0.55)", lineHeight: 1.9 }}>Every Kingsman suit begins with Super 130s Italian wool from Vitale Barberis Canonico — the same mill trusted by the world's greatest tailors for over three centuries.</p>
            </div>
          </Fade>
          {[
            { label: "Smart Collection", price: "$379", desc: "Wrinkle-resistant wool blend for the gentleman who moves." },
            { label: "Premium Collection", price: "$499", desc: "Super 130s Italian wool. Uncompromising luxury." },
          ].map((m, i) => (
            <Fade key={i} delay={200 + i * 150} style={{ flex: "1 1 200px" }}>
              <div style={{ background: T.card, padding: "40px 32px", borderTop: `3px solid ${i === 1 ? T.brass : T.border}`, height: "100%" }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.brass, fontWeight: 500, marginBottom: 8 }}>{m.price}</div>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 17, color: T.ink, fontWeight: 600, marginBottom: 12 }}>{m.label}</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.85 }}>{m.desc}</div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section id="section-about" style={{ background: T.forest, padding: "96px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontFamily: "Georgia,serif", fontSize: 280, color: "rgba(176,124,40,0.05)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>"</div>
        <Fade>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ width: 32, height: 1, background: T.brass, margin: "0 auto 32px", opacity: 0.6 }} />
            <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(22px,3.5vw,34px)", color: "#F0EAE0", fontWeight: 400, fontStyle: "italic", maxWidth: 600, margin: "0 auto", lineHeight: 1.65 }}>
              "The suit is the modern gentleman's armour,<br />and the Kingsman agents are the new knights."
            </p>
            <div style={{ fontSize: 9, color: "rgba(176,124,40,0.6)", letterSpacing: 4, textTransform: "uppercase", marginTop: 32, fontWeight: 700 }}>— Kingsman: The Secret Service</div>
          </div>
        </Fade>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "96px 40px", background: T.parchment, textAlign: "center" }}>
        <Fade>
          <div style={{ fontSize: 9, color: T.brass, letterSpacing: 5, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Begin Your Journey</div>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(28px,4vw,48px)", color: T.ink, fontWeight: 400, marginBottom: 40, lineHeight: 1.2 }}>
            Your Suit.<br /><em style={{ color: T.forest }}>Your Story.</em>
          </h2>
          <button onClick={onStart}
            style={{ background: T.brass, border: "none", color: "#FFFFFF", padding: "18px 64px", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s", marginBottom: 20 }}
            onMouseEnter={e => e.currentTarget.style.background = T.brassLight}
            onMouseLeave={e => e.currentTarget.style.background = T.brass}>
            Configure Your Bespoke Suit
          </button>
          <div style={{ fontSize: 11, color: T.muted }}>14-day delivery · 100% fit guarantee · Free remake if needed</div>
        </Fade>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: T.ink, padding: "48px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 28, border: `1px solid rgba(176,124,40,0.5)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: 14, color: T.brass, fontWeight: 700, fontStyle: "italic" }}>K</div>
            <span style={{ fontFamily: "Georgia,serif", fontSize: 13, color: "rgba(240,234,224,0.5)", letterSpacing: 3 }}>KINGSMAN</span>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {["Hand-Stitched", "Italian Fabrics", "Perfect Fit Guaranteed"].map(t => (
              <span key={t} style={{ fontSize: 9, color: "rgba(240,234,224,0.25)", letterSpacing: 2, textTransform: "uppercase" }}>{t}</span>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "rgba(240,234,224,0.2)" }}>© 2025 Kingsman Atelier</div>
        </div>
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
  const FABRIC_TEXTURE = { backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 1px, transparent 0, transparent 50%)", backgroundSize: "5px 5px" };

  const renderStep = () => {
    if (step === 1) return (
      <Fade key="s1">
        <div style={{ fontSize: 9, color: T.brass, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Step 01 of 06</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Select Suit Type</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 28, lineHeight: 1.7 }}>Choose the silhouette that defines your presence.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SUIT_TYPES.map(t => (
            <OptCard key={t.id} sel={config.suitType === t.id} onClick={() => up("suitType", t.id)}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: T.brass, opacity: 0.4, fontWeight: 700, minWidth: 28 }}>{t.icon}</div>
                <div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 17, color: T.ink, fontWeight: 600 }}>{t.name} <span style={{ fontSize: 11, color: T.muted, fontStyle: "normal" }}>— {t.sub}</span></div>
                  <div style={{ fontSize: 12, color: T.text, lineHeight: 1.7, marginTop: 5 }}>{t.desc}</div>
                </div>
              </div>
            </OptCard>
          ))}
        </div>
      </Fade>
    );
    if (step === 2) return (
      <Fade key="s2">
        <div style={{ fontSize: 9, color: T.brass, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Step 02 of 06</div>
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
                  <div style={{ fontSize: 8, letterSpacing: 2, color: T.brass, textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>{m.tag}</div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 24, color: T.forest, fontWeight: 600 }}>{m.price}</div>
                </div>
              </div>
            </OptCard>
          ))}
        </div>
      </Fade>
    );
    if (step === 3) return (
      <Fade key="s3">
        <div style={{ fontSize: 9, color: T.brass, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Step 03 of 06</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Design Colour</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 28, lineHeight: 1.7 }}>Select from our curated collection.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {DESIGNS.map(d => (
            <OptCard key={d.id} sel={config.design === d.id} onClick={() => up("design", d.id)} style={{ padding: 14, textAlign: "center" }}>
              <div style={{ width: "100%", height: 52, background: d.hex, marginBottom: 10, position: "relative", overflow: "hidden", border: `1px solid ${T.border}` }}>
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
        <div style={{ fontSize: 9, color: T.brass, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Step 04 of 06</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Button Details</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 24, lineHeight: 1.7 }}>Choose material and finish.</p>
        <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Material</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          {BTN_TYPES.map(b => (<OptCard key={b.id} sel={config.buttonType === b.id} onClick={() => up("buttonType", b.id)} style={{ flex: 1, textAlign: "center", padding: 16 }}><div style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>{b.name}</div></OptCard>))}
        </div>
        <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>Colour</div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          {BTN_COLORS.map(c => (
            <div key={c.id} onClick={() => up("buttonColor", c.id)} style={{ cursor: "pointer", textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: c.hex, margin: "0 auto 8px", border: config.buttonColor === c.id ? `2.5px solid ${T.brass}` : `2px solid ${T.border}`, boxShadow: config.buttonColor === c.id ? `0 0 0 3px ${T.brassDim}` : "none", transition: "all 0.25s" }} />
              <div style={{ fontSize: 10, color: config.buttonColor === c.id ? T.ink : T.muted, fontWeight: config.buttonColor === c.id ? 700 : 400 }}>{c.name}</div>
            </div>
          ))}
        </div>
      </Fade>
    );
    if (step === 5) return (
      <Fade key="s5">
        <div style={{ fontSize: 9, color: T.brass, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Step 05 of 06</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Personal Monogram</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 28, lineHeight: 1.7 }}>Add your initials embroidered inside the jacket.</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <OptCard sel={config.wantInitials === true} onClick={() => up("wantInitials", true)} style={{ flex: 1, textAlign: "center", padding: 16 }}><div style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>Add Initials</div></OptCard>
          <OptCard sel={config.wantInitials === false} onClick={() => { up("wantInitials", false); up("initials", ""); }} style={{ flex: 1, textAlign: "center", padding: 16 }}><div style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>Skip</div></OptCard>
        </div>
        {config.wantInitials && (
          <Fade>
            <div style={{ background: T.parchmentDeep, border: `1px solid ${T.border}`, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>Enter Your Initials</div>
              <input type="text" maxLength={5} value={config.initials || ""} onChange={e => up("initials", e.target.value.toUpperCase())} placeholder="e.g. J.H.R."
                style={{ width: 180, padding: 14, background: T.card, border: `1px solid ${T.border}`, color: T.brass, fontSize: 22, fontFamily: "Georgia,serif", letterSpacing: 4, textAlign: "center", outline: "none", fontStyle: "italic" }}
                onFocus={e => e.target.style.borderColor = T.brass} onBlur={e => e.target.style.borderColor = T.border} />
              <div style={{ fontSize: 11, color: T.muted, marginTop: 12 }}>Brass thread on the inner lining</div>
            </div>
          </Fade>
        )}
      </Fade>
    );
    if (step === 6) return (
      <Fade key="s6">
        <div style={{ fontSize: 9, color: T.brass, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Step 06 of 06</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Trousers</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 24, lineHeight: 1.7 }}>Complete your look.</p>
        <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Style</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {PANTS_STYLES.map(p => (<OptCard key={p.id} sel={config.pantsStyle === p.id} onClick={() => up("pantsStyle", p.id)}><div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: T.ink, fontWeight: 600, marginBottom: 2 }}>{p.name}</div><div style={{ fontSize: 12, color: T.muted }}>{p.desc}</div></OptCard>))}
        </div>
        <div style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 }}>Fit</div>
        <div style={{ display: "flex", gap: 10 }}>
          {PANTS_FIT.map(f => (<OptCard key={f.id} sel={config.pantsFit === f.id} onClick={() => up("pantsFit", f.id)} style={{ flex: 1, textAlign: "center", padding: 16 }}><div style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>{f.name}</div></OptCard>))}
        </div>
      </Fade>
    );
  };

  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", background: T.parchment }}>
      <div style={{ height: 3, background: T.border }}><div style={{ height: 3, background: `linear-gradient(90deg, ${T.forest}, ${T.forestLight})`, width: `${(step / total) * 100}%`, transition: "width 0.5s cubic-bezier(.22,1,.36,1)" }} /></div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "14px 24px", borderBottom: `1px solid ${T.border}`, background: T.card }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} onClick={() => i + 1 < step && setStep(i + 1)} style={{
            width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700,
            color: i + 1 === step ? "#FFF" : i + 1 < step ? T.brass : T.muted,
            background: i + 1 === step ? T.forest : i + 1 < step ? T.brassDim : "transparent",
            border: `1px solid ${i + 1 === step ? T.forest : i + 1 < step ? T.brass : T.border}`,
            cursor: i + 1 < step ? "pointer" : "default", transition: "all 0.3s",
          }}>{i + 1 < step ? "✓" : i + 1}</div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", minHeight: "calc(100vh - 113px)" }}>
        <div style={{ flex: "1 1 300px", minWidth: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: T.forest, borderRight: `1px solid rgba(255,255,255,0.06)` }}>
          <SuitVisual config={config} size={260} />
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "rgba(176,124,40,0.6)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6, fontWeight: 700 }}>Preview</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 18, color: "#F0EAE0", fontWeight: 500 }}>{DESIGNS.find(d => d.id === config.design)?.name || "Your Suit"}</div>
            {config.suitType && <div style={{ fontSize: 11, color: "rgba(240,234,224,0.4)", marginTop: 4 }}>{SUIT_TYPES.find(s => s.id === config.suitType)?.name}{config.material && ` · ${MATERIALS.find(m => m.id === config.material)?.name}`}</div>}
          </div>
        </div>
        <div style={{ flex: "1 1 380px", padding: "40px 36px", maxWidth: 520, background: T.parchment }}>
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
    <div style={{ paddingTop: 60, minHeight: "100vh", background: T.parchment }}>
      <div style={{ height: 3, background: T.border }}><div style={{ height: 3, background: T.forest, width: phase === "body" ? "50%" : "100%", transition: "width 0.5s" }} /></div>
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "52px 24px" }}>
        {phase === "body" && (
          <Fade key="body">
            <div style={{ fontSize: 9, color: T.brass, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Step A</div>
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
                <div style={{ width: 28, height: 28, border: `2px solid ${T.border}`, borderTopColor: T.forest, borderRadius: "50%", margin: "0 auto", animation: "kspin 0.8s linear infinite" }} />
                <style>{`@keyframes kspin{to{transform:rotate(360deg)}}`}</style>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 12 }}>Analysing your body profile...</div>
              </div>
            )}
          </Fade>
        )}
        {phase === "refine" && (
          <Fade key="refine">
            <div style={{ fontSize: 9, color: T.brass, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Step B</div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 26, color: T.ink, marginBottom: 6, fontWeight: 500 }}>Fine-Tune Measurements</h2>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 12, lineHeight: 1.7 }}>Adjust with a tape measure for the perfect fit.</p>
            <div style={{ background: T.brassDim, border: `1px solid rgba(176,124,40,0.2)`, padding: "12px 16px", marginBottom: 28, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: T.brass }}>✦</span>
              <span style={{ fontSize: 12, color: T.brass, lineHeight: 1.6 }}>Estimated based on your profile. Fine-tune with a tape measure.</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {MEASURE_FIELDS.map(f => (
                <div key={f.id} style={{ background: T.card, border: `1px solid ${T.border}`, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 10, color: T.text, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>{f.label}</span>
                    <span style={{ fontSize: 12, color: T.muted, opacity: 0.4 }}>{f.icon}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="number" value={m[f.id] || ""} onChange={e => setM(p => ({ ...p, [f.id]: e.target.value }))} placeholder={f.range}
                      style={{ width: "100%", padding: 10, background: T.parchmentDeep, border: `1px solid ${T.border}`, color: T.ink, fontSize: 17, fontFamily: "Georgia,serif", textAlign: "center", outline: "none" }}
                      onFocus={e => e.target.style.borderColor = T.brass} onBlur={e => e.target.style.borderColor = T.border} />
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
  const submit = () => { if (!canSubmit) return; setProcessing(true); setTimeout(() => { setProcessing(false); setDone(true); }, 1800); };

  if (done) return (
    <div style={{ paddingTop: 60, minHeight: "100vh", background: T.parchment, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <Fade delay={200}>
          <div style={{ width: 80, height: 80, border: `2px solid ${T.forest}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", fontSize: 34, color: T.forest, animation: "kpulse 2s ease-in-out infinite" }}>✓</div>
          <style>{`@keyframes kpulse { 0%,100%{box-shadow:0 0 0 0 rgba(14,35,24,0)} 50%{box-shadow:0 0 0 16px rgba(14,35,24,0.06)} }`}</style>
        </Fade>
        <Fade delay={400}><h2 style={{ fontFamily: "Georgia,serif", fontSize: 36, color: T.ink, fontWeight: 500, marginBottom: 12 }}>Order Confirmed</h2></Fade>
        <Fade delay={600}><p style={{ fontSize: 14, color: T.text, lineHeight: 1.9, marginBottom: 36 }}>Thank you for choosing bespoke. You'll receive a WhatsApp confirmation shortly.</p></Fade>
        <Fade delay={800}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, padding: "24px 28px", textAlign: "left" }}>
            <div style={{ fontSize: 9, color: T.brass, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>Order Summary</div>
            {[["Suit", SUIT_TYPES.find(s => s.id === config.suitType)?.name], ["Material", MATERIALS.find(mm => mm.id === config.material)?.name], ["Design", DESIGNS.find(d => d.id === config.design)?.name], ["Buttons", `${config.buttonType} — ${config.buttonColor}`], ...(config.initials ? [["Monogram", config.initials]] : []), ["Trousers", `${PANTS_STYLES.find(p => p.id === config.pantsStyle)?.name} · ${config.pantsFit}`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
                <span style={{ color: T.muted }}>{k}</span><span style={{ color: T.ink, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: `2px solid ${T.forest}` }}>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 18, color: T.ink }}>Total</span>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 28, color: T.forest, fontWeight: 700 }}>{MATERIALS.find(mm => mm.id === config.material)?.price || "$379"}</span>
            </div>
          </div>
        </Fade>
        <Fade delay={1000}><div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#25D366" }} /><span style={{ fontSize: 12, color: "#25D366", fontWeight: 600 }}>WhatsApp confirmation sent</span></div></Fade>
        <Fade delay={1200}><div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: T.brass }} /><span style={{ fontSize: 12, color: T.brass, fontWeight: 600 }}>Admin notification delivered</span></div></Fade>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", background: T.parchment }}>
      <div style={{ height: 3, background: T.brass }} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "52px 24px" }}>
        <Fade>
          <div style={{ fontSize: 9, color: T.brass, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Final Step</div>
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
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 9, color: T.brass, letterSpacing: 3, textTransform: "uppercase", marginBottom: 18, fontWeight: 700 }}>Payment</div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
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
          <div style={{ background: T.parchmentDeep, border: `1px solid ${T.border}`, padding: "20px 24px", marginTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 9, color: T.brass, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>Total</div>
                <div style={{ fontSize: 12, color: T.text }}>{SUIT_TYPES.find(s => s.id === config.suitType)?.name} · {DESIGNS.find(d => d.id === config.design)?.name}</div>
              </div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 28, color: T.forest, fontWeight: 700 }}>{MATERIALS.find(mm => mm.id === config.material)?.price || "$379"}</div>
            </div>
          </div>
          {!canSubmit && (ship.name !== "" || ship.email !== "" || ship.address !== "") && (
            <div style={{ marginTop: 14, fontSize: 11, color: "#A04040", textAlign: "center" }}>Please fill in your name, address and email to continue.</div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <BtnGhost onClick={onBack}>← Back</BtnGhost>
            <button onClick={submit} disabled={processing || !canSubmit} style={{ flex: 1, background: processing || !canSubmit ? T.border : T.forest, border: "none", color: processing || !canSubmit ? T.muted : "#F0EAE0", padding: 16, fontSize: 12, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", cursor: processing || !canSubmit ? "default" : "pointer", fontFamily: "inherit", transition: "all 0.3s" }}>
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
      l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Manrope:wght@300;400;500;600;700&display=swap";
      l.rel = "stylesheet"; document.head.appendChild(l);
    }
  }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);
  return (
    <div style={{ background: T.parchment, color: T.text, minHeight: "100vh", fontFamily: "'Manrope',sans-serif" }}>
      <Nav current={page} onNav={setPage} />
      {page === "home" && <PageTransition key="home"><HomePage onStart={() => setPage("configure")} /></PageTransition>}
      {page === "configure" && <PageTransition key="configure"><ConfigPage config={config} setConfig={setConfig} onNext={() => setPage("measure")} /></PageTransition>}
      {page === "measure" && <PageTransition key="measure"><MeasurePage measurements={measurements} setMeasurements={setMeasurements} onNext={() => setPage("checkout")} onBack={() => setPage("configure")} /></PageTransition>}
      {page === "checkout" && <PageTransition key="checkout"><CheckoutPage config={config} onBack={() => setPage("measure")} /></PageTransition>}
    </div>
  );
}
