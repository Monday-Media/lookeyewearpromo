import React from "react";
import { Img, staticFile } from "remotion";
import { SITE_W, SITE_H } from "./Gallery";
import { ProductPage } from "./Product";
import { Build, easeOut, seg, lerp } from "../kit/kit";

const BG = "#f8f7f4";
const INK = "#111111";
const FONT = "'Funnel Display', system-ui, sans-serif";
const label: React.CSSProperties = { fontWeight: 600, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(17,17,17,0.4)" };
const nav: React.CSSProperties = { fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" };

/**
 * The home page hero, ported from HomeHero.jsx: the picture sits in a rectangle clipped 25% in from each edge and
 * opens to the full window as the page scrolls (`open` 0 to 1), while LOOK and EYEWEAR split to the edges. On load the
 * picture eases in from a soft enlarged blur and the letters rise out of a mask one after another. The intro is played
 * a quarter faster than the site plays it. The site's film grain is left out.
 */
const Word: React.FC<{ text: string; tau: number; delay: number }> = ({ text, tau, delay }) => (
  <span style={{ display: "inline-flex", overflow: "hidden", paddingBottom: "0.04em", color: BG, fontWeight: 500, fontSize: SITE_W * 0.0805, lineHeight: 1, letterSpacing: "-0.01em" }}>
    {text.split("").map((ch, i) => <span key={i} style={{ display: "inline-block", transform: `translateY(${105 * (1 - easeOut(seg(tau, delay + i * 0.055, delay + i * 0.055 + 1.25)))}%)` }}>{ch}</span>)}
  </span>
);
export const Hero: React.FC<{ t: number; at?: number; open?: number }> = ({ t, at = -9, open = 0 }) => {
  const tau = (t - at) * 1.25;
  const im = easeOut(seg(tau, 0, 2.2));
  const c = lerp(25, 0, open);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0d0d0d", overflow: "hidden", fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${c}% ${c}% ${c}% ${c}%)`, background: "#0d0d0d" }}>
        <Img src={staticFile("img/hero.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: im, transform: `scale(${lerp(1.14, 1, im) + 0.003 * Math.max(0, t - at)})`, filter: im < 1 ? `blur(${14 * (1 - im)}px)` : undefined }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.42) 100%)" }} />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 56, display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", padding: "0 48px", color: BG, fontWeight: 600, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: seg(tau, 0.7, 1.6) }}>
        <div>Contact</div><div style={{ justifySelf: "center", letterSpacing: "0.32em", fontWeight: 500 }}>Look Eyewear &amp; Optometry</div><div>Menu</div>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", columnGap: SITE_W * 0.04, width: `${lerp(56, 100, open)}%`, minWidth: "max-content" }}>
          <Word text="LOOK" tau={tau} delay={0.25} /><Word text="EYEWEAR" tau={tau} delay={0.45} />
        </div>
      </div>
    </div>
  );
};

const bar = (w: number | string, h = 10, mt = 0, o = 0.13): React.ReactNode => <div style={{ width: w, height: h, marginTop: mt, background: `rgba(17,17,17,${o})` }} />;
const Frame: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,0.07)", border: "1.5px solid rgba(17,17,17,0.2)" }}>
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}><path d="M0 0L100 100M100 0L0 100" stroke="rgba(17,17,17,0.14)" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" /></svg>
  </div>
);
/**
 * The full-screen menu, ported from MegaMenu.jsx. `hovers` are the times the pointer lands on Collections, Profile and
 * Journal. Each hovered item brightens, lifts and tilts 4 degrees, its neighbours dim, and the picture and caption on
 * the left change (old one out, then new one in, as the site does). The site's springs are slower than this.
 */
const NAV_ITEMS = ["Home", "Collections", "Profile", "Journal", "Contact", "Testimonials"];
const MENU: [string, string, string][] = [["img/hero.jpg", "LOOK EYEWEAR", "Eyewear & Optometry"], ["img/g3.jpg", "AKONI SS24 03", "Bold lines and warm tones, refined with subtle detail."], ["img/ph.jpg", "OUR STORY", "Eyewear curated with care in Bunbury, WA."], ["img/g16.jpg", "JOURNAL", "Stories, guides and thoughts on frames."]];
export const MENU_Y = (i: number) => 164.5 + 23.6 + 79.8 * i;
export const MENU_X = 777;
export const MegaMenu: React.FC<{ t: number; at: number; hovers?: [number, number, number]; pointer?: { x: number; y: number; o: number } }> = ({ t, at, hovers = [99, 99, 99], pointer }) => {
  const colW = (1008 - SITE_W * 0.08) / 2;
  const T = [-9, ...hovers, 999];
  const shown = (k: number) => (k === 0 ? 1 : easeOut(seg(t, T[k] + 0.1, T[k] + 0.3))) * (1 - seg(t, T[k + 1], T[k + 1] + 0.1));
  const h = [1, 2, 3].map((j) => easeOut(seg(t, T[j], T[j] + 0.24)) * (1 - easeOut(seg(t, T[j + 1], T[j + 1] + 0.24))));
  const none = 1 - Math.min(1, h[0] + h[1] + h[2]);
  const up = easeOut(seg(t, at + 0.05, at + 0.6));
  return (
    <div style={{ position: "absolute", inset: 0, background: INK, color: BG, fontFamily: FONT, display: "flex", flexDirection: "column", opacity: seg(t, at, at + 0.12) }}>
      <div style={{ height: 56, flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center", padding: "0 48px", borderBottom: "1px solid rgba(248,247,244,0.1)", ...nav }}>
        <div>Contact</div><div style={{ justifySelf: "center", whiteSpace: "nowrap" }}>Look Eyewear &amp; Optometry</div><div style={{ justifySelf: "end" }}>Close ×</div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1008, display: "grid", gridTemplateColumns: "1fr 1fr", gap: SITE_W * 0.08, alignItems: "center" }}>
          <div style={{ transform: "scale(0.85)" }}>
            <div style={{ width: colW, height: (colW * 4) / 3, position: "relative", overflow: "hidden", opacity: up, transform: `translateY(${16 * (1 - up)}px)` }}>
              {MENU.map((m, k) => <Img key={k} src={staticFile(m[0])} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: shown(k), transform: `translateY(${k ? 16 * (1 - easeOut(seg(t, T[k] + 0.1, T[k] + 0.3))) : 0}px)` }} />)}
            </div>
            <div style={{ position: "relative", marginTop: 16, height: 50, opacity: up }}>
              {MENU.map((m, k) => (
                <div key={k} style={{ position: "absolute", left: 0, top: 0, opacity: shown(k) }}>
                  <div style={{ fontWeight: 600, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: BG, marginBottom: 6 }}>{m[1]}</div>
                  <div style={{ fontSize: 13.8, color: "rgba(248,247,244,0.5)", lineHeight: 1.6, whiteSpace: "nowrap" }}>{m[2]}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.756em", fontSize: SITE_W * 0.03 }}>
            {NAV_ITEMS.map((n, i) => {
              const v = easeOut(seg(t, at + 0.08 + i * 0.05, at + 0.48 + i * 0.05));
              let o = 0.25 * none, y = 0, rot = 0;
              h.forEach((hv, j) => { const d = Math.abs(i - (j + 1)); o += hv * (d === 0 ? 1 : d === 1 ? 0.35 : 0.15); y += hv * (d === 0 ? -6 : d === 1 ? 3 : d === 2 ? 1 : 0); if (d === 0) rot = -4 * hv; });
              return <div key={n} style={{ fontWeight: 500, lineHeight: 1.1, opacity: v, transform: `translateY(${y}px)` }}><span style={{ display: "inline-block", color: `rgba(248,247,244,${o})`, transform: `rotate(${rot}deg)` }}>{n}</span></div>;
            })}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "end", padding: "24px 48px", borderTop: "1px solid rgba(248,247,244,0.1)", fontSize: 12, lineHeight: 1.8 }}>
        <div>(08) 9783 5060<br />info@lookeyewear.com.au</div><div style={{ justifySelf: "end", textAlign: "right" }}>Instagram<br />Facebook</div>
      </div>
      {pointer && <div style={{ position: "absolute", left: pointer.x - 38, top: pointer.y - 38, width: 76, height: 76, borderRadius: 38, background: "rgba(248,247,244,0.18)", border: "1px solid rgba(248,247,244,0.25)", backdropFilter: "blur(6px)", opacity: pointer.o }} />}
    </div>
  );
};

/**
 * The Journal page, ported from Journal.jsx with the three real posts read from the Wix blog (read only). Every part
 * is drawn in as a wireframe first (`plan` gives the times) and all of it resolves into the real page at `hold`.
 */
const POSTS: [string, string, string, string, string][] = [
  ["APRIL 20TH", "STORY", "j1", "Artisan Eyewear Redefined: The Craft and Philosophy Behind Unique Frames in Australia", "Eyewear has evolved beyond a simple vision aid. For many, it is a statement of identity, a piece of wearable art shaped by skilled hands and thoughtful design. In Australia, the rise of artisan eyewear..."],
  ["APRIL 20TH", "BRAND STORY", "j2", "Choosing Eyewear That Reflects Your Personality and Enhances Your Lifestyle", "Finding the right pair of glasses goes beyond vision correction. Eyewear can express who you are and support your daily activities. Selecting frames that suit your face shape and lifestyle helps you feel confident..."],
  ["APRIL 20TH", "NEW PRODUCT", "j3", "The Timeless Appeal of Independent Eyewear Over High Street Choices", "Choosing eyewear is more than a practical decision. For style-conscious professionals, it reflects taste, values, and attention to detail. The high street offers convenience and volume, but independent eyewear holds a..."],
];
const RULE = "1px solid rgba(188,190,192,0.7)";
export const Journal: React.FC<{ t: number; plan?: number[]; hold?: number; scroll?: number }> = ({ t, plan, hold = -9, scroll = 0 }) => {
  let n = 0;
  const P: React.FC<{ sk: React.ReactNode; style?: React.CSSProperties; children: React.ReactNode }> = ({ sk, style, children }) => {
    const i = n++;
    if (!plan) return <div style={style}>{children}</div>;
    return <Build at={plan[Math.min(i, plan.length - 1)] + Math.max(0, i - plan.length + 1) * 0.04} hold={hold + i * 0.022} dur={0.32} skeleton={sk} style={style}>{children}</Build>;
  };
  const line = (at: number) => <div style={{ borderBottom: RULE, transformOrigin: "0 50%", transform: `scaleX(${plan ? easeOut(seg(t, at, at + 0.3)) : 1})` }} />;
  return (
    <div style={{ position: "absolute", inset: 0, background: BG, color: INK, fontFamily: FONT, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -scroll }}>
        <div style={{ height: 56 }} />
        <div style={{ padding: "48px 48px 0" }}>
          <P sk={bar(104, 8)} style={{ marginBottom: 12, height: 12 }}><div style={label}>Design Philosophy</div></P>
          <P sk={bar(330, 72, 8, 0.2)} style={{ height: 90, marginBottom: 16 }}><div style={{ fontWeight: 600, fontSize: 90, lineHeight: 1, textTransform: "uppercase" }}>Journal</div></P>
          <P sk={bar(560, 9, 6)} style={{ height: 21, marginBottom: 48 }}><div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(17,17,17,0.5)" }}>About LOOK and what we stand for. Inspired by modern frameworks, editorial designs, and meticulous attention to detail.</div></P>
          {line(plan ? plan[2] + 0.06 : 0)}
        </div>
        <div style={{ padding: "0 48px 48px" }}>
          {POSTS.map((p, r) => (
            <div key={r}>
              <div style={{ display: "grid", gridTemplateColumns: "20% 30% 40%", gap: "5%", padding: "40px 0", alignItems: "start" }}>
                <P sk={<div>{bar(80, 9, 2, 0.24)}{bar(46, 8, 10)}</div>}>
                  <div style={{ fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", marginBottom: 6 }}>{p[0]}</div>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(17,17,17,0.4)" }}>{p[1]}</div>
                </P>
                <P sk={<Frame />} style={{ aspectRatio: "1 / 1", overflow: "hidden", background: "rgba(17,17,17,0.06)" }}><Img src={staticFile(`img/${p[2]}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></P>
                <P sk={<div>{bar("96%", 20, 6, 0.22)}{bar("62%", 20, 12, 0.22)}{bar("100%", 8, 22)}{bar("92%", 8, 12)}{bar("40%", 8, 12)}</div>}>
                  <div style={{ fontWeight: 600, fontSize: 25, lineHeight: 1.3, marginBottom: 12 }}>{p[3]}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.7, color: "rgba(17,17,17,0.6)" }}>{p[4]}</div>
                </P>
              </div>
              {line(plan ? plan[Math.min(3 + r * 3, plan.length - 1)] + 0.2 : 0)}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 56, background: BG, borderBottom: "1px solid rgba(188,190,192,0.55)" }}>
        {(!plan || t >= plan[0]) && (plan ? (
          <Build at={plan[0]} hold={hold} skeleton={<div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px" }}>{bar(70, 9)}{bar(250, 9)}{bar(48, 9)}</div>} style={{ height: 56 }}>
            <div style={{ height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 48px", ...nav }}><div>Contact</div><div>Look Eyewear &amp; Optometry</div><div style={{ justifySelf: "end" }}>Menu</div></div>
          </Build>
        ) : <div style={{ height: 56, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "0 48px", ...nav }}><div>Contact</div><div>Look Eyewear &amp; Optometry</div><div style={{ justifySelf: "end" }}>Menu</div></div>)}
      </div>
    </div>
  );
};

/**
 * The whole VAANYARD product page as one long sheet, ported from Product.jsx, ProductDescription.jsx, DragGallery.jsx,
 * ClosingImage.jsx and FeatureGrid.jsx, with the item's real wording and pictures from the CMS. `plan` says when each
 * section builds (wireframe first, then the real thing).
 */
export const LONG = { hero: 0, desc: SITE_H, descH: 372, strip: SITE_H + 372, stripH: 292, close: SITE_H + 372 + 292 + 96, closeH: 756, feat: SITE_H + 372 + 292 + 96 + 756, featH: 160, h: SITE_H + 372 + 292 + 96 + 756 + 160 };
const STRIP = ["vaanyard_hero", "v_7248a5773fe049e8ac6a76d01816da6c", "v_53cbab39b95a4691aa414106e3e29f96", "v_87805d23a9ed40968cec4db1dfa7e810", "v_131071a4c3714bc49065bac0214c06b4", "v_0f392e3e1bde45b9994bc03d44978a25", "v_1fa4dea70ef34ea0b1edb18be7b7c3e1"];
const STRIP_W = [520, 380, 620];
export type LongPlan = { desc?: number; strip?: number; close?: number; feat?: number };
export const ProductLong: React.FC<{ t: number; plan?: LongPlan; stripX?: number }> = ({ t, plan = {}, stripX = 0 }) => {
  const feats: [string, string][] = [["Craftsmanship", "300-day aged Japanese acetate construction."], ["Material", "300-day aged premium Japanese acetate."], ["Design Influence", "Sydney independent design, Japanese precision manufacturing."]];
  let x = 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SITE_W, height: LONG.h, background: BG, color: INK, fontFamily: FONT, overflow: "hidden", boxShadow: "0 80px 180px rgba(0,0,0,0.6)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SITE_W, height: SITE_H }}><ProductPage t={t} /></div>
      <div style={{ position: "absolute", left: 48, right: 48, top: LONG.desc + 96, display: "flex", gap: 96 }}>
        <Build at={plan.desc ?? -9} hold={(plan.desc ?? -9) + 0.14} skeleton={<div style={{ paddingTop: 8 }}>{bar(110, 8)}</div>} style={{ width: 192, flexShrink: 0 }}><div style={{ ...label, paddingTop: 6 }}>Design Philosophy</div></Build>
        <Build at={(plan.desc ?? -9) + 0.04} hold={(plan.desc ?? -9) + 0.18} skeleton={<div>{bar(560, 30)}{bar("100%", 9, 34)}{bar("96%", 9, 12)}{bar("58%", 9, 12)}{bar(96, 10, 40, 0.3)}</div>} style={{ width: 739 }}>
          <div style={{ fontWeight: 500, fontSize: 36, lineHeight: 1.05, textTransform: "uppercase" }}>Bold 41g frames, 300-day aged acetate.</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, marginTop: 24 }}>VAANYARD is an independent premium eyewear brand designed in Sydney and made in Japan. The bold "heavy-look" thicker profile frames only weigh 41 grams. Vaanyard has its frames manufactured from a selection of "aged" Japanese acetate. The aging process is achieved by allowing the acetate to sit for 300 days before manufacture.</div>
          <div style={{ ...nav, marginTop: 32 }}>Enquire Now</div>
        </Build>
      </div>
      <div style={{ position: "absolute", left: 0, top: LONG.strip, height: LONG.stripH, width: SITE_W }}>
        {[...STRIP, ...STRIP].map((id, i) => {
          const w = STRIP_W[i % 3];
          const left = x + stripX;
          x += w + 50;
          const at = (plan.strip ?? -9) + (i % 7) * 0.045;
          return (
            <Build key={i} at={at} hold={at + 0.16} skeleton={<Frame />} style={{ position: "absolute", left, top: 0, width: w, height: LONG.stripH }}>
              <Img src={staticFile(`img/${id}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </Build>
          );
        })}
      </div>
      <Build at={plan.close ?? -9} hold={(plan.close ?? -9) + 0.16} skeleton={<Frame />} style={{ position: "absolute", left: 48, top: LONG.close, width: SITE_W - 96, height: LONG.closeH }}>
        <Img src={staticFile("img/v_1fa4dea70ef34ea0b1edb18be7b7c3e1.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </Build>
      <div style={{ position: "absolute", left: 48, right: 48, top: LONG.feat + 48, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
        {feats.map(([l, v], i) => {
          const at = (plan.feat ?? -9) + i * 0.06;
          return (
            <Build key={l} at={at} hold={at + 0.14} skeleton={<div>{bar(90, 8)}{bar(240, 9, 14)}{bar(170, 9, 10)}</div>}>
              <div style={{ ...label, marginBottom: 8 }}>{l}</div><div style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 280 }}>{v}</div>
            </Build>
          );
        })}
      </div>
    </div>
  );
};
