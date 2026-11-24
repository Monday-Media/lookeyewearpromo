import React from "react";
import { Img, staticFile } from "remotion";

/**
 * The Profile page at the site's three layouts, from the media queries in ProfileHeader, BrandStorySection and
 * FounderSection (desktop above 1024, tablet at or below 1024, phone at or below 640) and Header.jsx (the centre title
 * and Contact hide below 768, where the left side reads "Look Eyewear"). The strip is InfiniteDragStrip: 386 px square
 * tiles 48 apart, drifting right to left at 32 px a second, 24 on phones.
 */
export type Mode = "d" | "t" | "m";
export const VIEW: Record<Mode, { w: number; h: number }> = { d: { w: 1440, h: 810 }, t: { w: 834, h: 1194 }, m: { w: 390, h: 844 } };
const BG = "#f8f7f4", INK = "#111111", FONT = "'Funnel Display', system-ui, sans-serif", RULE = "1px solid rgba(188,190,192,0.7)";
const nav: React.CSSProperties = { fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" };
const P: React.CSSProperties = { fontSize: 13, lineHeight: 1.7 };
const small: React.CSSProperties = { fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" };

export const ProfileR: React.FC<{ mode: Mode; scroll: number; time: number }> = ({ mode, scroll, time }) => {
  const { w, h } = VIEW[mode];
  const d = mode === "d", m = mode === "m";
  const pad = d ? "64px 48px" : m ? "32px 20px" : "40px 24px";
  const h2 = d ? 35 : 26;
  const grid: React.CSSProperties = d ? { display: "grid", gridTemplateColumns: "20% 1fr 1fr", gap: 48, alignItems: "start" } : { display: "grid", gridTemplateColumns: "1fr", gap: m ? 24 : 24 };
  const span = 10 * 434;
  const off = ((time * (m ? 24 : 32)) % span + span) % span;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, background: BG, color: INK, fontFamily: FONT, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -scroll }}>
        <div style={{ height: 56 }} />
        <div style={{ padding: d ? "48px 48px 64px" : m ? "24px 20px 36px" : "32px 24px 48px", maxWidth: d ? "85%" : "100%" }}>
          <div style={{ fontWeight: 600, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(17,17,17,0.4)", marginBottom: 16 }}>Design Philosophy</div>
          <div style={{ fontWeight: 600, fontSize: d ? 88 : m ? 38 : 56, lineHeight: 0.95, marginBottom: 24, textTransform: "uppercase" }}>Profile</div>
          <div style={{ ...P, maxWidth: 800 }}>Every frame in this room was chosen deliberately. LOOK Eyewear &amp; Optometry exists at the intersection of clinical excellence and design, Bunbury's destination for those who understand that what sits on their face is as considered a decision as anything else they wear.</div>
        </div>
        <div style={{ borderTop: RULE, padding: pad, ...grid }}>
          <div style={small}>The Home of Unique Eyewear.</div>
          <div style={d ? { gridColumn: "2 / 4" } : undefined}>
            <div style={{ fontWeight: 600, fontSize: h2, lineHeight: 1.15, marginBottom: 24 }}>40 Years. 4 Australian Optical Laboratories. 1 Passion.</div>
            <div style={{ ...P, maxWidth: 800 }}>
              LOOK Eyewear &amp; Optometry was founded on a simple belief: eyewear should be more than functional. Located in the heart of Bunbury CBD, LOOK is a boutique eyewear destination unlike anything else in the South West. Warm, independent, and uncompromisingly curated.<br /><br />
              Bhargav Davé brings over 40 years of optical experience and direct relationships with four independent Australian laboratories. He meets designers face-to-face, selecting every frame by design integrity, material quality and craftsmanship. Not volume. Not margin.<br /><br />
              LOOK also offers clinical excellence. Comprehensive eye examinations including Children's, Binocular, and Diabetic, backed by advanced diagnostic capability. Bhargav is one of only two optometrists in the South West offering advanced contact lens fitting for Keratoconus.
            </div>
          </div>
        </div>
        <div data-strip style={{ height: 386, position: "relative", overflow: "hidden" }}>
          {Array.from({ length: 30 }, (_, i) => <Img key={i} src={staticFile(`img/pg${i % 10}.jpg`)} style={{ position: "absolute", top: 0, left: 48 + (i - 10) * 434 - off + span, width: 386, height: 386, objectFit: "cover" }} />)}
        </div>
        <div style={{ borderTop: RULE, padding: pad, ...grid, gap: d ? 48 : 32 }}>
          <div style={small}>An Eye for the Extraordinary.</div>
          <div style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "rgba(17,17,17,0.06)" }}><Img src={staticFile("img/founder.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div>
          <div>
            <div style={{ fontWeight: 600, fontSize: h2, lineHeight: 1.15, marginBottom: 20 }}>The Curator Behind the Collection.</div>
            <div style={P}>Bhargav Davé founded LOOK Eyewear with a single conviction: the right frame is never an accident. With 40 years of experience and direct relationships with independent designers around the world, he has built Western Australia's most distinctive collection of boutique and designer frames, chosen because they reflect the same sensibility he brings to every eye examination.</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 56, background: BG, borderBottom: "1px solid rgba(188,190,192,0.55)", display: "grid", gridTemplateColumns: m ? "auto 1fr auto" : "1fr auto 1fr", alignItems: "center", padding: m ? "0 24px" : "0 48px", ...nav }}>
        <div>{m ? "Look Eyewear" : "Contact"}</div><div>{m ? "" : "Look Eyewear & Optometry"}</div><div style={{ justifySelf: "end" }}>Menu</div>
      </div>
    </div>
  );
};

/**
 * The full-screen menu at tablet width (834 px), from MegaMenu.jsx's tablet branch: the two-column body is 85% wide,
 * the nav type is 3vw, captions 13.8 and 16.6 px, footer 14.4 px. Hover does not exist on touch, so nothing reacts
 * until an item is tapped, and a tap opens that page.
 */
const NAV_ITEMS = ["Home", "Collections", "Profile", "Journal", "Contact", "Testimonials"];
export const MenuT: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const w = VIEW.t.w, h = VIEW.t.h;
  const eo = (u: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, u)), 4);
  const cw = w * 0.85, gap = w * 0.08, colW = (cw - gap) / 2;
  const up = eo((t - at - 0.05) / 0.55);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, background: INK, color: BG, fontFamily: FONT, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 56, flexShrink: 0, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 48px", borderBottom: "1px solid rgba(248,247,244,0.1)", ...nav }}>
        <div>Contact</div><div style={{ whiteSpace: "nowrap" }}>Look Eyewear &amp; Optometry</div><div style={{ justifySelf: "end" }}>Close ×</div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: cw, display: "grid", gridTemplateColumns: "1fr 1fr", gap, alignItems: "center" }}>
          <div style={{ transform: "scale(0.85)", opacity: up }}>
            <Img src={staticFile("img/hero.jpg")} style={{ width: colW, height: (colW * 4) / 3, objectFit: "cover", display: "block", transform: `translateY(${16 * (1 - up)}px)` }} />
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 13.8, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Look Eyewear</div>
              <div style={{ fontSize: 16.6, color: "rgba(248,247,244,0.5)", lineHeight: 1.6 }}>Eyewear &amp; Optometry</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.756em", fontSize: w * 0.03 }} data-nav>
            {NAV_ITEMS.map((n, i) => <div key={n} style={{ fontWeight: 500, lineHeight: 1.1, color: "rgba(248,247,244,0.25)", opacity: eo((t - at - 0.08 - i * 0.05) / 0.4) }}>{n}</div>)}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "end", padding: "24px 48px", borderTop: "1px solid rgba(248,247,244,0.1)", fontSize: 14.4, lineHeight: 1.8 }}>
        <div>(08) 9783 5060<br />info@lookeyewear.com.au</div><div style={{ justifySelf: "end", textAlign: "right" }}>Instagram<br />Facebook</div>
      </div>
    </div>
  );
};

/* ───── Gallery at any width. Four columns from 768 px up; two below that (ParallaxGallery.jsx). ───── */
import items from "./gallery.json";
const gset = (vw: number) => { const mob = vw < 768; const n = mob ? 2 : 4; const gap = mob ? 24 : 40; const colW = (vw - gap * (n - 1)) / n; return { mob, n, gap, colW, tileH: (colW * 16) / 9, speeds: mob ? [9.36, 14.04] : [6, 12, 3, 9] }; };
/** On phones, items tagged for columns 1 and 2 keep them; the rest are dealt out alternately, as the site does. */
const gcols = (vw: number): any[][] => {
  const g = gset(vw); const cols: any[][] = Array.from({ length: g.n }, () => []); const rest: any[] = [];
  for (const it of items as any[]) (it.c <= g.n ? cols[it.c - 1] : rest).push(it);
  rest.forEach((it, i) => cols[i % g.n].push(it));
  return cols;
};
const gy = (vw: number, time: number, ci: number) => { const g = gset(vw); return (time * g.speeds[ci] + ci * 137) % (gcols(vw)[ci].length * (g.tileH + g.gap)); };
export const gTile = (vw: number, time: number, ci: number, ri: number, scroll = 0) => { const g = gset(vw); return { x: ci * (g.colW + g.gap) + g.colW / 2, y: 56 + g.gap - scroll - gy(vw, time, ci) + ri * (g.tileH + g.gap) + g.tileH / 2, w: g.colW, h: g.tileH }; };
export const gFind = (vw: number, title: string) => { const cols = gcols(vw); for (let ci = 0; ci < cols.length; ci++) { const ri = cols[ci].findIndex((i) => i.t === title); if (ri >= 0) return { ci, ri, n: cols[ci].length }; } return { ci: 0, ri: 0, n: 1 }; };
export const GalleryR: React.FC<{ vw: number; time: number; scroll?: number; hover?: { col: number; row: number; amt: number }[] }> = ({ vw, time, scroll = 0, hover = [] }) => {
  const g = gset(vw); const cols = gcols(vw);
  return (
    <div style={{ position: "absolute", inset: 0, background: BG, fontFamily: FONT, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 56 + g.gap - scroll, left: 0, right: 0, display: "grid", gridTemplateColumns: `repeat(${g.n}, 1fr)`, gap: g.gap }}>
        {cols.map((col, ci) => (
          <div key={ci} style={{ display: "flex", flexDirection: "column", gap: g.gap, transform: `translateY(${-gy(vw, time, ci)}px)` }}>
            {[...col, ...col, ...col].map((it, ri) => {
              const hv = hover.filter((x) => x.col === ci && x.row === ri).reduce((mx, x) => Math.max(mx, x.amt), 0);
              return (
                <div key={ri} style={{ position: "relative", width: "100%", height: g.tileH, overflow: "hidden", flexShrink: 0 }}>
                  <Img src={staticFile(`img/${it.id}.jpg`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `blur(${4 * (1 - hv)}px)`, transform: `scale(${1 + 0.02 * hv})` }} />
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 12px 12px", background: "linear-gradient(to top, rgba(17,17,17,0.55), rgba(17,17,17,0))", opacity: hv }}>
                    <div style={{ fontWeight: 600, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: BG }}>{it.t}</div>
                    {it.s && <div style={{ fontSize: 11, color: "rgba(248,247,244,0.8)", marginTop: 4, lineHeight: 1.4 }}>{it.s}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 56, background: "rgba(248,247,244,0.78)", backdropFilter: "blur(16px) saturate(140%)", borderBottom: "1px solid rgba(188,190,192,0.55)", display: "grid", gridTemplateColumns: g.mob ? "auto 1fr auto" : "1fr auto 1fr", alignItems: "center", padding: g.mob ? "0 24px" : "0 48px", fontWeight: 600, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: INK }}>
        <div>{g.mob ? "Look Eyewear" : "Contact"}</div><div style={{ letterSpacing: "0.32em", fontWeight: 500 }}>{g.mob ? "" : "Look Eyewear & Optometry"}</div><div style={{ justifySelf: "end" }}>Menu</div>
      </div>
    </div>
  );
};

/**
 * The VAANYARD product page at phone width as one long sheet, from the mobile branches of ProductHero,
 * ProductDescription, DragGallery (57.6vw square tiles, 24 px apart), ClosingImage (square) and FeatureGrid (one column).
 */
const MW = 390;
export const LM = { heroH: 693, desc: 693, descH: 372, strip: 1065, stripH: 225, close: 1065 + 225 + 48, closeH: 342, feat: 1065 + 225 + 48 + 342, h: 1065 + 225 + 48 + 342 + 300 };
const STRIPM = ["vaanyard_hero", "v_7248a5773fe049e8ac6a76d01816da6c", "v_53cbab39b95a4691aa414106e3e29f96", "v_87805d23a9ed40968cec4db1dfa7e810", "v_131071a4c3714bc49065bac0214c06b4", "v_0f392e3e1bde45b9994bc03d44978a25", "v_1fa4dea70ef34ea0b1edb18be7b7c3e1"];
export const ProductLongM: React.FC<{ hero: React.ReactNode; reveal?: (i: number) => number; stripX?: number }> = ({ hero, reveal = () => 1, stripX = 0 }) => {
  const sec = (i: number, style: React.CSSProperties, node: React.ReactNode) => { const u = reveal(i); return <div style={{ position: "absolute", ...style, opacity: Math.min(1, u * 1.6), transform: `translateY(${28 * (1 - u)}px) scale(${1.04 - 0.04 * u})`, filter: u < 1 ? `blur(${8 * (1 - u)}px)` : undefined }}>{node}</div>; };
  const tw = MW * 0.576;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: MW, height: LM.h, background: BG, color: INK, fontFamily: FONT, overflow: "hidden", boxShadow: "0 80px 180px rgba(0,0,0,0.6)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: MW, height: LM.heroH }}>{hero}</div>
      {sec(0, { left: 24, right: 24, top: LM.desc + 48 }, (
        <div>
          <div style={{ fontWeight: 600, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(17,17,17,0.4)", paddingTop: 6, marginBottom: 24 }}>Design Philosophy</div>
          <div style={{ fontWeight: 500, fontSize: 22, lineHeight: 1.05, textTransform: "uppercase" }}>Bold 41g frames, 300-day aged acetate.</div>
          <div style={{ ...P, marginTop: 24 }}>VAANYARD is an independent premium eyewear brand designed in Sydney and made in Japan. The bold "heavy-look" thicker profile frames only weigh 41 grams. Vaanyard has its frames manufactured from a selection of "aged" Japanese acetate.</div>
          <div style={{ ...nav, marginTop: 32 }}>Enquire Now</div>
        </div>
      ))}
      {sec(1, { left: 0, top: LM.strip, width: MW, height: LM.stripH }, [...STRIPM, ...STRIPM, ...STRIPM].map((id, i) => <Img key={i} src={staticFile(`img/${id}.jpg`)} style={{ position: "absolute", top: 0, left: i * (tw + 24) + stripX, width: tw, height: tw, objectFit: "cover" }} />))}
      {sec(2, { left: 24, top: LM.close, width: MW - 48, height: LM.closeH }, <Img src={staticFile("img/v_1fa4dea70ef34ea0b1edb18be7b7c3e1.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />)}
      {sec(3, { left: 24, right: 24, top: LM.feat + 32 }, [["Craftsmanship", "300-day aged Japanese acetate construction."], ["Material", "300-day aged premium Japanese acetate."], ["Design Influence", "Sydney independent design, Japanese precision manufacturing."]].map(([l, v]) => (
        <div key={l} style={{ marginBottom: 24 }}><div style={{ fontWeight: 600, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(17,17,17,0.4)", marginBottom: 8 }}>{l}</div><div style={{ fontSize: 13, lineHeight: 1.6 }}>{v}</div></div>
      )))}
    </div>
  );
};
