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

/** The full-screen menu, ported from MegaMenu.jsx. `hover` is how far the pointer has settled on Collections. */
const NAV_ITEMS = ["Home", "Collections", "Profile", "Journal", "Contact", "Testimonials"];
export const MegaMenu: React.FC<{ t: number; at: number; hover?: number }> = ({ t, at, hover = 0 }) => {
  const colW = (1008 - SITE_W * 0.08) / 2;
  const cap = (l: string, s: string, o: number) => (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      <div style={{ fontWeight: 600, fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: BG, marginBottom: 6 }}>{l}</div>
      <div style={{ fontSize: 13.8, color: "rgba(248,247,244,0.5)", lineHeight: 1.6 }}>{s}</div>
    </div>
  );
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
              <Img src={staticFile("img/hero.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 - hover }} />
              <Img src={staticFile("img/g3.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: hover, transform: `translateY(${16 * (1 - hover)}px)` }} />
            </div>
            <div style={{ position: "relative", marginTop: 16, height: 50, opacity: up }}>
              {cap("LOOK EYEWEAR", "Eyewear & Optometry", 1 - hover)}
              {cap("AKONI SS24 03", "Bold lines and warm tones, refined with subtle detail.", hover)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.756em", fontSize: SITE_W * 0.03 }}>
            {NAV_ITEMS.map((n, i) => {
              const v = easeOut(seg(t, at + 0.08 + i * 0.05, at + 0.48 + i * 0.05));
              const d = Math.abs(i - 1);
              const o = lerp(0.25, d === 0 ? 1 : d === 1 ? 0.35 : 0.15, hover);
              const y = lerp(0, d === 0 ? -6 : d === 1 ? 3 : d === 2 ? 1 : 0, hover);
              return <div key={n} style={{ fontWeight: 500, lineHeight: 1.1, opacity: v, transform: `translateY(${y}px)` }}><span style={{ display: "inline-block", color: `rgba(248,247,244,${o})`, transform: `rotate(${d === 0 ? -4 * hover : 0}deg)` }}>{n}</span></div>;
            })}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "end", padding: "24px 48px", borderTop: "1px solid rgba(248,247,244,0.1)", fontSize: 12, lineHeight: 1.8 }}>
        <div>(08) 9783 5060<br />info@lookeyewear.com.au</div><div style={{ justifySelf: "end", textAlign: "right" }}>Instagram<br />Facebook</div>
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
const bar = (w: number | string, h = 10, mt = 0, o = 0.13): React.ReactNode => <div style={{ width: w, height: h, marginTop: mt, background: `rgba(17,17,17,${o})` }} />;
const Frame: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "rgba(17,17,17,0.07)", border: "1.5px solid rgba(17,17,17,0.2)" }}>
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}><path d="M0 0L100 100M100 0L0 100" stroke="rgba(17,17,17,0.14)" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" /></svg>
  </div>
);
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

/** The product hero as it is drawn from a blank canvas: wireframe pieces land on the beats, then the page resolves. */
export const CanvasBuild: React.FC<{ t: number; beats: [number, number, number, number]; hold: number }> = ({ t, beats, hold }) => {
  const res = easeOut(seg(t, hold, hold + 0.34));
  const piece = (at: number, style: React.CSSProperties, node: React.ReactNode) => {
    if (t < at) return null;
    const p = easeOut(seg(t, at, at + 0.2));
    return <div style={{ position: "absolute", ...style, opacity: seg(t, at, at + 0.05), transform: `scale(${lerp(1.05, 1, p)})`, filter: p < 1 ? `blur(${7 * (1 - p)}px)` : undefined }}>{node}</div>;
  };
  return (
    <div style={{ position: "absolute", inset: 0, background: BG, overflow: "hidden" }}>
      {t >= hold && <div style={{ position: "absolute", inset: 0, opacity: res, filter: res < 1 ? `blur(${10 * (1 - res)}px)` : undefined }}><ProductPage t={t} titleAt={hold + 0.05} zoom={lerp(1.1, 1.04, res) - 0.01 * (t - hold)} /></div>}
      {res < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - res }}>
          {piece(beats[0], { left: 0, right: 0, top: 0, height: 56 }, <div style={{ height: 56, borderBottom: "1.5px solid rgba(17,17,17,0.16)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px" }}>{bar(70, 9)}{bar(250, 9)}{bar(48, 9)}</div>)}
          {piece(beats[1], { left: 40, right: 40, top: 96, bottom: 40 }, <Frame />)}
          {piece(beats[2], { left: 80, bottom: 170 }, bar(60, 8, 0, 0.22))}
          {piece(beats[3], { left: 80, bottom: 88 }, bar(520, 68, 0, 0.22))}
        </div>
      )}
    </div>
  );
};
