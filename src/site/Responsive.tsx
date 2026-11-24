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
