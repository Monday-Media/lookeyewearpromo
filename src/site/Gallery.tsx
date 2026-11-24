import React from "react";
import { Img, staticFile } from "remotion";
import items from "./gallery.json";

/**
 * The Look Eyewear home page at its gallery, ported from the app (Header.jsx, ParallaxGallery.jsx, ParallaxColumn.jsx,
 * GalleryImage.jsx): glass header, four columns of 9/16 tiles 40 px apart drifting at the site's own speeds, tiles
 * blurred 4 px until hovered, caption fading in over a dark gradient.
 */
export const SITE_W = 1440;
export const SITE_H = 810;
const BG = "#f8f7f4";
const INK = "#111111";
const FONT = "'Funnel Display', system-ui, sans-serif";
const SPEEDS = [6, 12, 3, 9]; // px a second (the site moves 0.1, 0.2, 0.05, 0.15 px a frame at 60 fps)
const GAP = 40;

export const SiteHeader: React.FC = () => (
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 56, zIndex: 5, background: "rgba(248,247,244,0.78)", backdropFilter: "blur(16px) saturate(140%)", borderBottom: "1px solid rgba(188,190,192,0.55)", color: INK, display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", padding: "0 48px", fontFamily: FONT, fontWeight: 600, textTransform: "uppercase" }}>
    <div style={{ letterSpacing: "0.18em", fontSize: 11 }}>Contact</div>
    <div style={{ justifySelf: "center", letterSpacing: "0.32em", fontSize: 11, fontWeight: 500 }}>Look Eyewear &amp; Optometry</div>
    <div style={{ letterSpacing: "0.18em", fontSize: 11 }}>Menu</div>
  </div>
);

const COL_W = (SITE_W - GAP * 3) / 4;
const TILE_H = (COL_W * 16) / 9;
const colItems = (ci: number) => (items as any[]).filter((i) => i.c === ci + 1);
const colY = (time: number, ci: number) => (time * SPEEDS[ci] + ci * 137) % (colItems(ci).length * (TILE_H + GAP));
/** Centre of a tile in site pixels at a given time. Rows count down the doubled column. */
export const tilePos = (time: number, ci: number, ri: number, scroll = 0) => ({ x: ci * (COL_W + GAP) + COL_W / 2, y: 56 + GAP - scroll - colY(time, ci) + ri * (TILE_H + GAP) + TILE_H / 2, w: COL_W, h: TILE_H, n: colItems(ci).length });
export const tileRow = (ci: number, title: string) => colItems(ci).findIndex((i) => i.t === title);
type Hover = { col: number; row: number; amt: number };

export const Gallery: React.FC<{ time: number; hover?: Hover | Hover[]; scroll?: number }> = ({ time, hover, scroll = 0 }) => {
  const colW = COL_W;
  const tileH = TILE_H;
  const hovers = hover ? (Array.isArray(hover) ? hover : [hover]) : [];
  return (
    <div style={{ position: "absolute", inset: 0, background: BG, fontFamily: FONT, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 56 + GAP - scroll, left: 0, right: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: GAP }}>
        {[1, 2, 3, 4].map((c, ci) => {
          const col = (items as any[]).filter((i) => i.c === c);
          const setH = col.length * (tileH + GAP);
          const y = (time * SPEEDS[ci] + ci * 137) % setH;
          return (
            <div key={c} style={{ display: "flex", flexDirection: "column", gap: GAP, transform: `translateY(${-y}px)` }}>
              {[...col, ...col, ...col].map((it, ri) => {
                const h = hovers.filter((x) => x.col === ci && x.row === ri).reduce((m, x) => Math.max(m, x.amt), 0);
                return (
                  <div key={ri} style={{ position: "relative", width: "100%", height: tileH, overflow: "hidden", background: BG, flexShrink: 0 }}>
                    <Img src={staticFile(`img/${it.id}.jpg`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `blur(${4 * (1 - h)}px)`, transform: `scale(${1 + 0.02 * h})` }} />
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 12px 12px", background: "linear-gradient(to top, rgba(17,17,17,0.55), rgba(17,17,17,0))", opacity: h }}>
                      <div style={{ fontWeight: 600, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: BG }}>{it.t}</div>
                      {it.s && <div style={{ fontSize: 11, color: "rgba(248,247,244,0.8)", marginTop: 4, lineHeight: 1.4 }}>{it.s}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <SiteHeader />
    </div>
  );
};
