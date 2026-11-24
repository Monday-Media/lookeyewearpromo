import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { useT, Shot, seg, easeOut, easeIn, easeInOut, lerp, rampW, io } from "../kit/kit";
import { Backdrop, BrowserWindow } from "../kit/Window";
import { Dash, CmsTable, HomePage, DW, DH, CMS_ROW_H } from "../dash/Dash";
import { ProfileR, MenuT, VIEW, Mode } from "../site/Responsive";
import { DarkRoom, M } from "./Film";

/** The vertical film: 1080 by 1920, same clock, same cuts, same sound as the 16:9 film. */
export const VW = 1080;
export const VH = 1920;
/** Everything that matters sits near the middle of the frame (Paul, 24 Nov). Nothing important above 220 or below 1500. */
const CY = VH / 2;

const VStage: React.FC<{ s: number; fx?: number; fy?: number; x?: number; y?: number; r?: number; children: React.ReactNode }> = ({ s, fx = VW / 2, fy = CY, x = 0, y = 0, r = 0, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: VW, height: VH, transformOrigin: `${fx}px ${fy}px`, transform: `translate(${VW / 2 - fx + x}px, ${CY - fy + y}px) rotate(${r}deg) scale(${s})` }}>{children}</div>
);

/**
 * One device that changes shape. `u` runs 0 (desktop browser window) to 1 (tablet) to 2 (phone). The outer size, the
 * bezel, the corner radius and the browser bar all move together, and the page inside swaps layout half way through
 * each change, so the content reflows as the frame snaps.
 */
const SHAPE = [
  { w: 1040, h: 585, bezel: 0, r: 12, bar: 32 },   // desktop: 1440 x 810 page
  { w: 570, h: 816, bezel: 19, r: 40, bar: 0 },    // tablet: 834 x 1194 page
  { w: 372, h: 805, bezel: 12, r: 52, bar: 0 },    // phone: 390 x 844 page
];
const Device: React.FC<{ u: number; children: (mode: Mode, k: number) => React.ReactNode; swing?: number }> = ({ u, children, swing = 0 }) => {
  const i = Math.min(1, Math.floor(u)), f = u - i;
  const a = SHAPE[i], b = SHAPE[i + 1];
  const g = (key: keyof typeof a) => lerp(a[key], b[key], f);
  const w = g("w"), h = g("h"), bezel = g("bezel"), bar = g("bar");
  const mode: Mode = u < 0.5 ? "d" : u < 1.5 ? "t" : "m";
  const k = w / VIEW[mode].w;
  const mid = Math.abs(f - 0.5) < 0.5 ? 1 - Math.abs(f - 0.5) * 2 : 0; // 1 at the moment the layout swaps
  const barIn = bar / 32;
  return (
    <div style={{ position: "absolute", left: (VW - w) / 2 - bezel, top: -(h + bar) / 2 - bezel, width: w + bezel * 2, height: h + bar + bezel * 2, borderRadius: g("r") + bezel * 0.4, background: bezel > 1 ? "#0e0f11" : "transparent", boxShadow: "0 50px 120px rgba(0,0,0,0.55), 0 10px 30px rgba(0,0,0,0.35)", transform: `perspective(2000px) rotateY(${-78 * swing}deg) translateX(${-260 * swing}px)`, transformOrigin: "100% 50%", filter: swing ? `brightness(${1 - 0.4 * swing})` : undefined }}>
      <div style={{ position: "absolute", left: bezel, top: bezel, width: w, height: h + bar, borderRadius: Math.max(6, g("r") - bezel * 0.6), overflow: "hidden", background: "#eceae5" }}>
        {bar > 0.5 && (
          <div style={{ height: bar, position: "relative", opacity: barIn, display: "flex", alignItems: "center", paddingLeft: 12, gap: 6 }}>
            {["#ee6a5f", "#f5bd4f", "#61c454"].map((c) => <div key={c} style={{ width: 9, height: 9, borderRadius: 5, background: c }} />)}
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 290, height: 20, borderRadius: 6, background: "rgba(17,17,17,0.06)", color: "rgba(17,17,17,0.62)", font: "500 10px 'Wix Madefor Text', system-ui", display: "flex", alignItems: "center", justifyContent: "center" }}>lookeyewear.com.au</div>
          </div>
        )}
        <div style={{ position: "absolute", left: 0, top: bar, width: w, height: h, overflow: "hidden" }}>
          <div style={{ transformOrigin: "0 0", transform: `scale(${k})`, filter: mid > 0.02 ? `blur(${5 * mid}px)` : undefined }}>{children(mode, k)}</div>
        </div>
        {bezel > 6 && u > 1.5 && <div style={{ position: "absolute", left: "50%", top: 9, width: 86, height: 24, marginLeft: -43, borderRadius: 12, background: "#0e0f11", opacity: seg(u, 1.6, 1.95) }} />}
      </div>
    </div>
  );
};

/**
 * 12.4 to 15.06: the Profile page above, the Wix dashboard below. The page keeps scrolling while its frame snaps from
 * desktop to tablet (13.0) to phone (13.5), each snap a speed ramp on the beat. Then the phone swings away and the
 * camera drops toward the dashboard for the cut.
 */
const SNAP1 = 13.0, SNAP2 = 13.5;
/** Scroll for each layout: where the page is at the start of its turn, and how fast it moves (px a second). */
const SCROLL: Record<Mode, [number, number, number]> = { d: [12.4, 380, 300], t: [13.0, 640, 190], m: [13.5, 1010, 230] };
const ProfileSnap: React.FC = () => {
  const t = useT();
  const a = 12.4, b = M.dip2;
  const u = rampW(t, SNAP1, 0.34, a) + rampW(t, SNAP2, 0.34, SNAP1);
  const punch = (at: number) => 0.05 * (1 - easeOut(seg(t, at, at + 0.3))) * (t >= at ? 1 : 0);
  const swing = easeIn(seg(t, 14.35, b));
  const drop = easeIn(seg(t, 14.5, b));
  const siteY = 640, dashY = 1500;
  const dk = 1000 / DW;
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.5 + 0.02 * (t - a)} dim={0.42 + 0.3 * drop} blur={10} />
      <VStage s={(1 + punch(SNAP1) + punch(SNAP2)) * io(t, a, b, 1.35, 1, 0.4) * lerp(1, 1.9, drop)} fy={lerp(CY, dashY, drop)} y={lerp(0, -60, drop)}>
        <div style={{ position: "absolute", left: (VW - 1000) / 2, top: dashY - ((DH + 44) * dk) / 2, transformOrigin: "0 0", transform: `scale(${dk})`, filter: `brightness(${lerp(0.82, 1, drop)})` }}>
          <BrowserWindow w={DW} h={DH} url="manage.wix.com" dark><Dash active="Home" page={<HomePage />} /></BrowserWindow>
        </div>
        <div style={{ position: "absolute", left: 0, top: siteY, width: VW, height: 0, transform: `translateY(${-140 * swing}px)`, opacity: 1 - seg(t, b - 0.14, b) }}>
          <Device u={u} swing={swing}>
            {(mode) => { const [t0, s0, v] = SCROLL[mode]; return <ProfileR mode={mode} time={t} scroll={s0 + v * (t - t0)} />; }}
          </Device>
        </div>
      </VStage>
    </>
  );
};

/** A plain tablet or phone holding a page, centred on (VW/2, cy). `w` is its on-screen width. */
const Slab: React.FC<{ mode: "t" | "m"; w: number; cy?: number; children: React.ReactNode }> = ({ mode, w, cy = CY, children }) => {
  const v = VIEW[mode], k = w / v.w, h = v.h * k, bezel = mode === "t" ? w * 0.034 : w * 0.032, r = mode === "t" ? w * 0.07 : w * 0.14;
  return (
    <div style={{ position: "absolute", left: (VW - w) / 2 - bezel, top: cy - h / 2 - bezel, width: w + bezel * 2, height: h + bezel * 2, borderRadius: r + bezel * 0.4, background: "#0e0f11", boxShadow: "0 60px 140px rgba(0,0,0,0.6), 0 12px 32px rgba(0,0,0,0.4)" }}>
      <div style={{ position: "absolute", left: bezel, top: bezel, width: w, height: h, borderRadius: r - bezel * 0.6, overflow: "hidden" }}>
        <div style={{ transformOrigin: "0 0", transform: `scale(${k})` }}>{children}</div>
      </div>
    </div>
  );
};

/** 11.0 to 12.4: the menu on a tablet. A ramp in toward the list on "No template", then a tap on Profile takes the cut. */
export const TAP = 12.18;
const MenuTablet: React.FC = () => {
  const t = useT();
  const a = 11.0, b = 12.4;
  const w = rampW(t, 11.62, 0.44, a);
  const TW = 840, k = TW / VIEW.t.w;
  const top = CY - (VIEW.t.h * k) / 2, left = (VW - TW) / 2;
  // Profile is the third item. Its place on the tablet page: the list is centred in the body.
  const bodyH = VIEW.t.h - 56 - 100, fs = VIEW.t.w * 0.03, pitch = fs * 1.1 + fs * 0.756, listH = fs * 1.1 * 6 + fs * 0.756 * 5;
  const px = VIEW.t.w * 0.075 + (VIEW.t.w * 0.85 - VIEW.t.w * 0.08) / 2 + VIEW.t.w * 0.08 + 46, py = 56 + (bodyH - listH) / 2 + pitch * 2 + fs * 0.55;
  const fx = left + px * k, fy = top + py * k;
  const press = easeOut(seg(t, TAP, TAP + 0.1)) * (1 - seg(t, TAP + 0.12, TAP + 0.3));
  const dotIn = easeOut(seg(t, TAP - 0.34, TAP - 0.04));
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.5 + 0.02 * (t - a)} dim={0.5} blur={10} />
      <VStage s={Math.exp(Math.log(1.55) * w) * io(t, a, b, 1.4, 1.5, 0.36, 0.2)} fx={lerp(VW / 2, fx - 40, w)} fy={lerp(CY, fy, w)}>
        <Slab mode="t" w={TW}><MenuT t={t} at={a - 0.3} /></Slab>
        <div style={{ position: "absolute", left: fx - 30 + 80 * (1 - dotIn), top: fy - 30 + 120 * (1 - dotIn), width: 60, height: 60, borderRadius: 30, background: "rgba(255,255,255,0.3)", border: "1.5px solid rgba(255,255,255,0.55)", opacity: dotIn, transform: `scale(${1 - 0.28 * press})`, boxShadow: press > 0.05 ? `0 0 0 ${18 * press}px rgba(255,255,255,${0.12 * (1 - press)})` : undefined }} />
      </VStage>
    </>
  );
};

/** 15.06 to 16.5: the dashboard builds on the stutter hits, framed on the side menu and the start of the table. */
const DashBuildV: React.FC = () => {
  const t = useT();
  const a = M.dip2, b = 16.5;
  const K = 1.02;
  const jolt = (at: number) => 0.035 * (1 - easeOut(seg(t, at, at + 0.22))) * (t >= at ? 1 : 0);
  const push = lerp(0.94, 1, easeInOut(seg(t, a, M.drop))) + jolt(M.hit1) + jolt(M.hit2) + 0.05 * (1 - easeOut(seg(t, M.drop, M.drop + 0.3))) * (t >= M.drop ? 1 : 0);
  const out = easeIn(seg(t, b - 0.24, b));
  const left = 30, top = CY - ((DH + 44) * K) / 2;
  const f = { fx: left + K * (238 + 420), fy: top + K * (44 + 45 + 176 + 96 + CMS_ROW_H * 9.5) };
  return (
    <>
      <DarkRoom glow={seg(t, M.hit1, M.drop)} />
      <VStage s={push + 0.9 * out} fx={lerp(VW / 2, f.fx, out)} fy={lerp(CY, f.fy, out)}>
        <div style={{ position: "absolute", left, top, transformOrigin: "0 0", transform: `scale(${K})`, opacity: t < M.hit1 ? 0 : 1 }}>
          <BrowserWindow w={DW} h={DH} url="manage.wix.com" dark>
            <Dash active="CMS" plan={{ side: M.hit1, top: M.hit2, head: M.hit2, panel: 15.94, hold: M.drop }} page={<CmsTable plan={{ head: M.hit2, panel: 15.94, hold: M.drop }} rowsAt={M.drop + 0.02} />} />
          </BrowserWindow>
        </div>
      </VStage>
    </>
  );
};

export const FilmV: React.FC<{ sound?: boolean }> = ({ sound = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Shot a={11.0} b={12.4} bg="#111"><MenuTablet /></Shot>
    <Shot a={12.4} b={M.dip2}><ProfileSnap /></Shot>
    <Shot a={M.dip2} b={16.5}><DashBuildV /></Shot>
    {sound && <Audio src={staticFile("audio/mix_sfx_v.wav")} />}
  </AbsoluteFill>
);
