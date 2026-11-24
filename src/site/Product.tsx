import React from "react";
import { Img, staticFile } from "remotion";
import { SITE_W, SITE_H } from "./Gallery";
import { easeOut, seg, lerp } from "../kit/kit";

/**
 * The VAANYARD product page at its hero, ported from ProductHero.jsx and Header.jsx: full-height image, a dark
 * gradient at the foot, the collection label and the title at 7vw (capped at 96 px), header transparent over the image.
 * `titleAt` is when the label and title rise in (the site fades them up 16 px over 0.6 s).
 */
const FONT = "'Funnel Display', system-ui, sans-serif";
export const ProductPage: React.FC<{ t: number; titleAt?: number; zoom?: number; vw?: number }> = ({ t, titleAt = -9, zoom = 1, vw = SITE_W }) => {
  const mob = vw < 768;
  const u = easeOut(seg(t, titleAt, titleAt + 0.6));
  return (
    <div style={{ position: "absolute", inset: 0, background: "#111", overflow: "hidden", fontFamily: FONT }}>
      <Img src={staticFile("img/vaanyard_hero.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(17,17,17,0.55) 0%, rgba(17,17,17,0) 55%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 56, display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", padding: mob ? "0 24px" : "0 48px", color: "#f8f7f4", fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        <div>{mob ? "Look Eyewear" : "Contact"}</div><div style={{ justifySelf: "center" }}>{mob ? "" : "Look Eyewear & Optometry"}</div><div>Menu</div>
      </div>
      <div style={{ position: "absolute", left: mob ? 24 : 40, bottom: mob ? 40 : 56, opacity: u, transform: `translateY(${lerp(16, 0, u)}px)` }}>
        <div style={{ fontWeight: 600, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(248,247,244,0.6)", marginBottom: 8 }}>Frames</div>
        <div style={{ fontWeight: 600, lineHeight: 1.05, color: "#f8f7f4", fontSize: Math.max(32, Math.min(96, vw * 0.07)) }}>VAANYARD</div>
      </div>
    </div>
  );
};
