import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { useT, Shot, shotCam, seg, easeOut, easeIn, easeInOut, lerp, rampW, io } from "../kit/kit";
import { Img } from "remotion";
import { Backdrop, BrowserWindow } from "../kit/Window";
import { Dash, CmsTable, CmsItem, ITEM_IMAGE, Contacts, HomePage, Flyout, Arrow, DW, DH, navY, CMS_ROW_H, CONTACT_ROW_H } from "../dash/Dash";
import { Hero, Journal } from "../site/Pages";
import { ProductPage } from "../site/Product";
import { ProfileR, MenuT, GalleryR, gTile, gFind, ProductLongM, LM, VIEW, Mode } from "../site/Responsive";
import { DarkRoom, M } from "./Film";

/** The vertical film: 1080 by 1920, same clock, same cuts, same sound as the 16:9 film. */
export const VW = 1080;
export const VH = 1920;
/** Everything that matters sits near the middle of the frame (Paul, 24 Nov). Nothing important above 220 or below 1500. */
const CY = VH / 2;

const VStage: React.FC<{ s: number; fx?: number; fy?: number; x?: number; y?: number; r?: number; rx?: number; ry?: number; children: React.ReactNode }> = ({ s, fx = VW / 2, fy = CY, x = 0, y = 0, r = 0, rx = 0, ry = 0, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: VW, height: VH, transformOrigin: `${fx}px ${fy}px`, transform: `translate(${VW / 2 - fx + x}px, ${CY - fy + y}px) ${rx || ry ? `perspective(1900px) rotateX(${rx}deg) rotateY(${ry}deg)` : ""} rotate(${r}deg) scale(${s})` }}>{children}</div>
);
/** Backdrop for the tall frame: darker and softer than the 16:9 one, so it never competes with the screens (Paul, 24 Nov). */
const VB: React.FC<{ t: number; a: number; dim?: number }> = ({ t, a, dim = 0.74 }) => <Backdrop src="img/hero.jpg" scale={1.5 + 0.02 * (t - a)} dim={dim} blur={18} />;
const travel = (t: number, a: number, b: number, p0: [number, number], p1: [number, number]) => { const u = easeInOut(seg(t, a, b)); return { x: lerp(p0[0], p1[0], u), y: lerp(p0[1], p1[1], u) - 26 * Math.sin(Math.PI * u) }; };
/** The desktop dashboard at full size, centred on the frame's height. Only the part the camera is on is in frame. */
const DT = CY - (DH + 44) / 2;
const dv = (x: number, y: number) => ({ fx: x, fy: DT + 44 + y });
const DashV: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", left: 0, top: DT }}><BrowserWindow w={DW} h={DH} url="manage.wix.com" dark>{children}</BrowserWindow></div>;

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
      <VB t={t} a={a} dim={0.74 + 0.1 * drop} />
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

/** A plain tablet or phone holding a page, centred on (VW/2, cy). `w` is its on-screen width. `lock` adds a browser address bar with a padlock. */
const Slab: React.FC<{ mode: "t" | "m"; w: number; cy?: number; lock?: number; children: React.ReactNode }> = ({ mode, w, cy = CY, lock, children }) => {
  const v = VIEW[mode], k = w / v.w, h = v.h * k, bezel = mode === "t" ? w * 0.034 : w * 0.032, r = mode === "t" ? w * 0.07 : w * 0.14;
  const bar = lock !== undefined ? 50 : 0;
  const ink = "rgba(17,17,17,0.7)";
  return (
    <div style={{ position: "absolute", left: (VW - w) / 2 - bezel, top: cy - h / 2 - bezel, width: w + bezel * 2, height: h + bezel * 2, borderRadius: r + bezel * 0.4, background: "#0e0f11", boxShadow: "0 60px 140px rgba(0,0,0,0.6), 0 12px 32px rgba(0,0,0,0.4)" }}>
      <div style={{ position: "absolute", left: bezel, top: bezel, width: w, height: h, borderRadius: r - bezel * 0.6, overflow: "hidden", background: "#eceae5" }}>
        <div style={{ transformOrigin: "0 0", transform: `scale(${k})`, width: v.w, height: v.h, position: "relative" }}>
          {bar > 0 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: bar, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 7 }}>
              <div style={{ width: 250, height: 28, borderRadius: 9, background: "rgba(17,17,17,0.07)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, font: "500 12px 'Wix Madefor Text', system-ui", color: ink }}>
                <svg width="10" height="12" viewBox="0 0 11 13" style={{ overflow: "visible" }}><rect x="0.5" y="5.5" width="10" height="7" rx="1.6" fill={ink} /><path d="M2.8 5.5V3.6a2.7 2.7 0 0 1 5.4 0v1.9" stroke={ink} strokeWidth="1.4" fill="none" style={{ transformOrigin: "8.2px 5.5px", transform: `translateY(${-1.6 * (lock || 0)}px) rotate(${28 * (lock || 0)}deg)` }} /></svg>
                lookeyewear.com.au
              </div>
            </div>
          )}
          <div style={{ position: "absolute", left: 0, top: bar, width: v.w, height: v.h - bar, overflow: "hidden" }}>{children}</div>
        </div>
      </div>
    </div>
  );
};
/** Where a point on a device's page lands on the stage. */
const sp = (mode: "t" | "m", w: number, x: number, y: number, cy = CY) => { const k = w / VIEW[mode].w; return { fx: (VW - w) / 2 + x * k, fy: cy - (VIEW[mode].h * k) / 2 + y * k }; };

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
      <VB t={t} a={a} />
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


/* ───────────────────────── the rest of the vertical film ───────────────────────── */
const PW = 560; // phone width on screen for the single-device shots
const TW2 = 860; // tablet width on screen

/** 0 to 3.0: the home page on a phone. It loads, the wordmark rises, then the picture opens as the page scrolls. */
const OpenV: React.FC = () => {
  const t = useT();
  const out = easeIn(seg(t, 1.56, 2.0));
  return (<><VB t={t} a={0} dim={0.8} /><VStage s={(1.22 + 0.04 * t) * lerp(1, 1.5, out)}><Slab mode="m" w={PW}><Hero t={t} at={0.04} open={0.3 * out} vw={390} /></Slab></VStage></>);
};
const HeroWideV: React.FC = () => {
  const t = useT();
  const c = shotCam(t, 2.0, 3.0, { from: { s: 1.7 }, hold: { s: 1.05 }, to: { s: 1.4, y: -420 }, inDur: 0.42, outDur: 0.24, drift: { s: 0.014 } });
  return (<><VB t={t} a={2} /><VStage s={c.s} y={c.y}><Slab mode="m" w={PW}><Hero t={t} at={0.04} open={lerp(0.3, 1, easeOut(seg(t, 2.0, 2.75)))} vw={390} /></Slab></VStage></>);
};

/** The gallery on a tablet: the camera sits on one tile and speed-ramps to the next on the beat. */
const GalleryTab: React.FC<{ a: number; b: number; stops: [number, number][]; beats: number[]; s: number[]; d?: number }> = ({ a, b, stops, beats, s, d = 0.42 }) => {
  const t = useT();
  const ws = beats.map((bt, i) => rampW(t, bt, d, i ? beats[i - 1] : a));
  const pos = stops.map(([ci, ri]) => { const p = gTile(834, t, ci, ri); return sp("t", TW2, p.x, p.y); });
  let fx = pos[0].fx, fy = pos[0].fy, sc = Math.log(s[0]);
  ws.forEach((w, i) => { fx += (pos[i + 1].fx - pos[i].fx) * w; fy += (pos[i + 1].fy - pos[i].fy) * w; sc += (Math.log(s[i + 1]) - Math.log(s[i])) * w; });
  const amt = (i: number) => (i === 0 ? easeOut(seg(t, a + 0.04, a + 0.3)) : ws[i - 1]) * (i < ws.length ? 1 - ws[i] : 1);
  const turn = ws.reduce((m, w, i) => m + (i % 2 ? -w : w), 0);
  return (<><VB t={t} a={a} /><VStage s={Math.exp(sc) * io(t, a, b, 1.4, 1.45)} fx={fx} fy={fy} rx={7} ry={lerp(-7, 7, turn)} r={lerp(-2, 1.5, turn)}><Slab mode="t" w={TW2}><GalleryR vw={834} time={t} hover={stops.map(([col, row], i) => ({ col, row, amt: amt(i) }))} /></Slab></VStage></>);
};

/** 4.3 to 5.5: the dashboard. The figures count, then a ramp down the side menu to the CMS. */
const DashFlashV: React.FC = () => {
  const t = useT();
  const a = 4.3, b = 5.5;
  const w = rampW(t, 5.0, 0.46, a);
  const f0 = dv(238 + 222 + 300, 230), f1 = dv(300, navY("CMS") - 70);
  return (<><DarkRoom /><VStage s={Math.exp(Math.log(1.75) * w) * 0.98 * io(t, a, b, 1.5, 1.4) * (1 + 0.012 * (t - a))} fx={lerp(f0.fx, f1.fx, w)} fy={lerp(f0.fy, f1.fy, w)}>
    <DashV><Dash active="Home" hover={{ label: "CMS", amt: easeOut(seg(t, 5.08, 5.24)) }} page={<HomePage count={easeOut(seg(t, a, a + 1.0))} />} overlay={t > 4.9 ? <Arrow {...travel(t, 4.9, 5.16, [330, navY("CMS") - 120], [128, navY("CMS") + 12])} /> : undefined} /></DashV>
  </VStage></>);
};

/** 5.5 to 8.0: the gallery on a phone. It whips down, the camera ramps onto VAANYARD, then crawls through the dip. */
const GalleryFindV: React.FC = () => {
  const t = useT();
  const a = 5.5, b = 8.0;
  const g = gFind(390, "VAANYARD");
  const want = (ri: number) => gTile(390, 6.6, g.ci, ri).y - 420;
  const ri = want(g.ri) > 200 ? g.ri : g.ri + g.n;
  const scroll = want(ri) * rampW(t, 6.0, 0.5, a);
  const w = rampW(t, 6.5, 0.44, 6.0);
  const p = gTile(390, t, g.ci, ri, scroll);
  const f = sp("m", PW, p.x, p.y + 40);
  return (<><VB t={t} a={a} /><VStage s={Math.exp(Math.log(1.9) * w) * (1 + 0.03 * Math.max(0, t - 6.72)) * io(t, a, b, 1.5, 1.4, 0.34, 0.3)} fx={lerp(VW / 2, f.fx, w)} fy={lerp(CY, f.fy, w)}>
    <Slab mode="m" w={PW}><GalleryR vw={390} time={t} scroll={scroll} hover={[{ col: g.ci, row: ri, amt: easeOut(seg(t, 6.56, 6.95)) }]} /></Slab>
  </VStage></>);
};

/** 8.0 to 9.5: a blank tablet. The Journal page is drawn on it part by part and resolves at 9.0. */
const DRAWV = [8.0, 8.125, 8.25, 8.375, 8.5, 8.625, 8.75, 8.875];
const CanvasV: React.FC = () => {
  const t = useT();
  const a = 8.0, b = 9.5;
  const jolt = (at: number, k = 0.014) => k * (1 - easeOut(seg(t, at, at + 0.16))) * (t >= at ? 1 : 0);
  const out = easeIn(seg(t, b - 0.24, b));
  const s = lerp(0.94, 1.02, easeInOut(seg(t, a, 9.0))) + jolt(8.0, 0.1) + DRAWV.slice(1).reduce((m, x) => m + jolt(x), 0) + jolt(9.0, 0.05) + 0.012 * Math.max(0, t - 9) + 0.5 * out;
  return (<><VB t={t} a={a} /><VStage s={s} y={-360 * out}><Slab mode="t" w={TW2}><Journal t={t} plan={DRAWV} hold={9.0} scroll={300 * rampW(t, 9.28, 0.36, 9.0)} h1={62.5} /></Slab></VStage></>);
};

/** 9.5 to 11.0: the product page at phone width as one long sheet at a tilt; sections arrive as the camera ramps down. */
const LK = 2.3;
const LongV: React.FC = () => {
  const t = useT();
  const a = 9.5, b = 11.0;
  const w1 = rampW(t, 10.0, 0.44, a), w2 = rampW(t, 10.5, 0.44, 10.0);
  const k = (v: number[]) => v[0] + (v[1] - v[0]) * w1 + (v[2] - v[1]) * w2;
  const left = (VW - 390 * LK) / 2;
  const rv = (i: number) => easeOut(seg(t, [a - 0.05, 9.9, 10.4, 10.55][i], [a - 0.05, 9.9, 10.4, 10.55][i] + 0.34));
  return (<><VB t={t} a={a} /><VStage s={k([1.0, 1.25, 0.86]) * io(t, a, b, 1.35, 1.5)} fx={VW / 2} fy={LK * k([LM.desc + 150, LM.strip + 112, LM.close + 180])} rx={k([16, 12, 8])} r={k([-4, -2, -5])} y={90 * (1 - easeOut(seg(t, a, a + 0.34)))}>
    <div style={{ position: "absolute", left, top: 0, transformOrigin: "0 0", transform: `scale(${LK})` }}><ProductLongM hero={<ProductPage t={t} vw={390} />} reveal={rv} stripX={-60 - 24 * (t - a)} /></div>
  </VStage></>);
};

const CmsMacroV: React.FC = () => {
  const t = useT();
  const c = shotCam(t, 16.5, 17.0, { from: { s: 1.9, x: -160 }, hold: { s: 1.42 }, to: { s: 1.1, x: 260 }, inDur: 0.3, outDur: 0.2, drift: { x: -30 } });
  const f = dv(238 + 46 + 148 + 270, 45 + 176 + 96 + CMS_ROW_H * 9.5);
  return (<><DarkRoom /><VStage s={c.s} fx={f.fx} fy={f.fy} x={c.x}><DashV><Dash active="CMS" page={<CmsTable hoverRow={t > 16.66 ? 9 : undefined} />} overlay={<Arrow {...travel(t, 16.5, 16.7, [238 + 760, 45 + 176 + 96 + CMS_ROW_H * 12.6], [238 + 46 + 148 + 262, 45 + 176 + 96 + CMS_ROW_H * 9.6])} />} /></DashV></VStage></>);
};
const ContactsWideV: React.FC = () => {
  const t = useT();
  const c = shotCam(t, 17.0, 17.5, { from: { s: 1.3, y: 120 }, hold: { s: 0.98 }, to: { s: 1.5, y: -60 }, inDur: 0.3, outDur: 0.2, drift: { s: 0.03 } });
  const f = dv(238 + 46 + 480, 430);
  return (<><DarkRoom /><VStage s={c.s} fx={f.fx} fy={f.fy} y={c.y}><DashV><Dash active="Customers & Leads" open="Customers & Leads" sub="Contacts" page={<Contacts headAt={16.9} rowsAt={17.02} />} /></DashV></VStage></>);
};
const ContactsMacroV: React.FC = () => {
  const t = useT();
  const c = shotCam(t, 17.5, 18.0, { from: { s: 1.9, x: 200 }, hold: { s: 1.4 }, to: { s: 1.1, x: -300, y: 60 }, inDur: 0.3, outDur: 0.2, drift: { y: -30 } });
  const f = dv(238 + 46 + 400, 321 + CONTACT_ROW_H * 2.5);
  return (<><DarkRoom /><VStage s={c.s} fx={f.fx} fy={f.fy} x={c.x} y={c.y}><DashV><Dash active="Customers & Leads" open="Customers & Leads" sub="Contacts" page={<Contacts hoverRow={t > 17.66 ? 2 : undefined} />} overlay={<Arrow {...travel(t, 17.5, 17.72, [238 + 46 + 560, 321 + CONTACT_ROW_H * 4.3], [238 + 46 + 300, 321 + CONTACT_ROW_H * 2.5])} />} /></DashV></VStage></>);
};
const MarketingV: React.FC = () => {
  const t = useT();
  const a = 18.0;
  const c = shotCam(t, a, M.m6, { from: { s: 2.2, y: -200 }, hold: { s: 1.62 }, to: { s: 2.3, x: -160, y: -60 }, inDur: 0.34, outDur: 0.24, drift: { s: 0.02, x: -10 } });
  const f = dv(310, navY("Marketing") + 17);
  return (<><DarkRoom /><VStage s={c.s} fx={f.fx} fy={f.fy} x={c.x} y={c.y}><DashV>
    <Dash active="Home" hover={{ label: "Marketing", amt: easeOut(seg(t, a + 0.02, a + 0.14)) }} page={<HomePage />} overlay={<><Flyout at={a + 0.1} active={t > 18.5 ? 4 : undefined} activeAmt={easeOut(seg(t, 18.5, 18.62))} /><Arrow {...(t < 18.28 ? { x: 150, y: navY("Marketing") + 12 } : travel(t, 18.28, 18.54, [150, navY("Marketing") + 12], [238 + 8 + 190, navY("Marketing") + 12]))} /></>} />
  </DashV></VStage></>);
};
const ItemMacroV: React.FC = () => {
  const t = useT();
  const a = M.m6, b = 19.5;
  const ui = easeOut(seg(t, a, a + 0.3)), uo = easeIn(seg(t, b - 0.26, b));
  const f0 = dv(238 + 332 + 330, 45 + 112 + 58 + 250), f1 = dv(ITEM_IMAGE.x, ITEM_IMAGE.y);
  const mv = easeInOut(seg(t, a + 0.1, b));
  return (<><DarkRoom /><VStage s={lerp(lerp(1.7, 1.2, ui), 5.2, uo)} fx={lerp(f0.fx, f1.fx, mv)} fy={lerp(f0.fy - 120 * (1 - ui), f1.fy, mv)}><DashV><Dash active="CMS" page={<CmsItem fieldsAt={a - 0.06} />} /></DashV></VStage></>);
};

/** 19.5 to 20.5: match cut. The same picture is the product page's hero, here on a tablet. */
const ProductTabV: React.FC = () => {
  const t = useT();
  const a = 19.5, b = 20.5;
  const c = shotCam(t, a, b, { from: { s: 1.75 }, hold: { s: 1 }, to: { s: 1.5, x: -300, y: 40 }, inDur: 0.42, outDur: 0.24, drift: { s: 0.012 } });
  return (<><VB t={t} a={a} /><VStage s={c.s} x={c.x} y={c.y}><Slab mode="t" w={TW2}><ProductPage t={t} titleAt={a + 0.16} zoom={1.06 - 0.02 * (t - a)} vw={834} /></Slab></VStage></>);
};

/** 20.5 to 21.0: the analytics counting up. The frame holds two figures, then ramps across to the other two. */
const AnalyticsV: React.FC = () => {
  const t = useT();
  const a = 20.5, b = M.m7;
  const w = rampW(t, 20.75, 0.3, a);
  const f = dv(238 + 222 + 22 + lerp(300, 930, w), 45 + 191 + 38);
  return (<><DarkRoom /><VStage s={1.62 * io(t, a, b, 1.35, 1.35, 0.26, 0.18)} fx={f.fx} fy={f.fy}><DashV><Dash active="Home" page={<HomePage count={easeOut(seg(t, a - 0.05, b + 0.3))} />} /></DashV></VStage></>);
};

/** 21.0 to 22.0: crash zoom to the padlock in the phone's address bar; the lock closes. */
const PadlockV: React.FC = () => {
  const t = useT();
  const a = M.m7, b = 22.0;
  const ui = easeOut(seg(t, a, a + 0.34)), uo = easeIn(seg(t, b - 0.22, b));
  const f = sp("m", PW, 195 - 8, 29);
  return (<><VB t={t} a={a} /><VStage s={lerp(lerp(1.05, 4.6, ui), 7, uo) * (1 + 0.012 * (t - a))} fx={lerp(VW / 2, f.fx, ui)} fy={lerp(CY, f.fy, ui)} x={-24 * (t - a)}>
    <Slab mode="m" w={PW} lock={1 - easeOut(seg(t, a + 0.42, a + 0.56))}><ProductPage t={t} vw={390} /></Slab>
  </VStage></>);
};

/** 22.0 to 24.0: the phone above and the dashboard below come together, then the move slows to a crawl for the dip. */
const StackedV: React.FC = () => {
  const t = useT();
  const a = 22.0;
  const p = easeOut(seg(t, a, a + 0.9));
  const dk = 1000 / DW, dashY = 1500;
  return (<><VB t={t} a={a} />
    <VStage s={1 + 0.012 * (t - a)}>
      <div style={{ position: "absolute", left: (VW - 1000) / 2, top: dashY - ((DH + 44) * dk) / 2 + 900 * (1 - p), transformOrigin: "0 0", transform: `scale(${dk})`, filter: "brightness(0.9)" }}>
        <BrowserWindow w={DW} h={DH} url="manage.wix.com" dark><Dash active="Home" page={<HomePage count={easeOut(seg(t, 20.45, 21.3))} />} /></BrowserWindow>
      </div>
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${VW / 2}px 640px`, transform: `translateY(${lerp(CY - 640, 0, p)}px) scale(${lerp(1.5, 1, p)})` }}><Slab mode="m" w={372} cy={640}><ProductPage t={t} vw={390} zoom={1.03} /></Slab></div>
    </VStage></>);
};

const CmsWhipV: React.FC = () => {
  const t = useT();
  const a = 24.5, b = 25.0;
  const w = rampW(t, 24.75, 0.3, a);
  const f = dv(238 + 46 + 148 + 300, 45 + 176 + 96 + CMS_ROW_H * lerp(2.5, 11.5, w));
  return (<><DarkRoom /><VStage s={1.45 * io(t, a, b, 1.35, 1.4, 0.2, 0.16)} fx={f.fx} fy={f.fy}><DashV><Dash active="CMS" page={<CmsTable hoverRow={w > 0.5 ? 11 : 2} />} /></DashV></VStage></>);
};

/** 25.0 to 25.8: along the product page's picture strip, at phone width. */
const StripV: React.FC = () => {
  const t = useT();
  const a = 25.0, b = 25.8;
  const w = rampW(t, 25.4, 0.4, a);
  const K = 3.4, left = (VW - 390 * K) / 2;
  return (<VStage s={io(t, a, b, 1.4, 1.35)} fx={VW / 2} fy={K * (LM.strip + 112)} ry={lerp(8, -8, w)}>
    <div style={{ position: "absolute", left, top: 0, transformOrigin: "0 0", transform: `scale(${K})` }}><ProductLongM hero={<ProductPage t={t} vw={390} />} stripX={-140 - 24 * (t - a) - 500 * w} /></div>
  </VStage>);
};

/** 25.8 to 29.0: the home page on a phone. On "with nothing missing underneath" it lifts off the dashboard, CMS and contacts. */
const FinaleV: React.FC = () => {
  const t = useT();
  const a = 25.8, b = 29.0;
  const e = rampW(t, 26.92, 0.7, a + 0.6);
  const clear = easeIn(seg(t, 28.72, b));
  const sIn = lerp(1.4, 1, easeOut(seg(t, a, a + 0.42)));
  const pw = 470, ph = pw * (844 / 390), dk = 900 / DW;
  const dash = (node: React.ReactNode) => <div style={{ position: "absolute", left: (pw - 900) / 2, top: (ph - (DH + 44) * dk) / 2, transformOrigin: "0 0", transform: `scale(${dk})` }}><BrowserWindow w={DW} h={DH} url="manage.wix.com" dark>{node}</BrowserWindow></div>;
  const layers: React.ReactNode[] = [
    <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph }}><div style={{ position: "absolute", left: pw / 2 - VW / 2, top: ph / 2 - CY, width: VW, height: VH }}><Slab mode="m" w={pw}><Hero t={t} at={a - 0.5} open={0.62 * easeInOut(seg(t, a + 0.1, 27.3))} vw={390} /></Slab></div></div>,
    dash(<Dash active="Home" page={<HomePage />} />),
    dash(<Dash active="CMS" page={<CmsTable />} />),
    dash(<Dash active="Customers & Leads" open="Customers & Leads" sub="Contacts" page={<Contacts />} />),
  ];
  return (<><VB t={t} a={a} dim={lerp(0.74, 0.86, e) + 0.14 * clear} />
    <div style={{ position: "absolute", inset: 0, perspective: 2600, perspectiveOrigin: "50% 50%", opacity: 1 - clear }}>
      <div style={{ position: "absolute", left: (VW - pw) / 2, top: CY - ph / 2, width: pw, height: ph, transformStyle: "preserve-3d", transform: `translate(${-40 * e}px, ${-120 * e}px) scale(${sIn * lerp(1.12, 0.78, e) * (1 + 0.012 * (t - a)) * (1 + 1.6 * clear)}) rotateX(${50 * e}deg) rotateZ(${e * (-30 + 2.2 * (t - 27))}deg)` }}>
        {[3, 2, 1, 0].map((i) => <div key={i} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `translate(${i * 70 * e}px, ${i * 150 * e}px) translateZ(${(1.5 - i) * 200 * e * (1 + 2.5 * clear)}px)`, filter: i ? `brightness(${1 - 0.1 * i * e})` : undefined, opacity: i && e < 0.02 ? 0 : 1 }}>{layers[i]}</div>)}
      </div>
    </div></>);
};

/** 29.0 to the end: Perth WA, then the logo. Both sit dead centre, well inside the side margins. */
const LogosV: React.FC = () => {
  const t = useT();
  const piece = (at: number, until: number, node: React.ReactNode) => {
    if (t < at || t >= until) return null;
    const u = easeOut(seg(t, at, at + 0.5)), o = easeIn(seg(t, until - 0.22, until));
    return <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lerp(1.22, 1, u) * (1 + 0.01 * (t - at)) * lerp(1, 0.86, o)})`, opacity: seg(t, at, at + 0.1) * (1 - o), filter: u < 1 ? `blur(${10 * (1 - u)}px)` : undefined }}>{node}</div>;
  };
  const drop = easeOut(seg(t, 29.0, 29.36));
  return (<><DarkRoom glow={0.8} />
    {piece(29.0, 31.0, <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 92, letterSpacing: "-0.01em", lineHeight: 1 }}>
      <svg width="57" height="77" viewBox="0 0 62 84" style={{ transform: `translateY(${-46 * (1 - drop)}px)` }}><path d="M31 0C13.900 0 0 13.700 0 30.600 0 53.200 31 84 31 84s31-30.800 31-53.400C62 13.700 48.100 0 31 0z" fill="#fff" /><circle cx="31" cy="30.500" r="11.500" fill="#0c0e14" /></svg><div>Perth</div><div>WA</div></div>)}
    {piece(31.0, 99, <Img src={staticFile("brand/mm_white.svg")} style={{ width: 760 }} />)}
  </>);
};

export const FilmV: React.FC<{ sound?: boolean }> = ({ sound = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Shot a={0} b={2.0}><OpenV /></Shot>
    <Shot a={2.0} b={3.0}><HeroWideV /></Shot>
    <Shot a={3.0} b={4.3}><GalleryTab a={3.0} b={4.3} stops={[[1, 1], [2, 2], [1, 2]]} beats={[3.5, 4.0]} s={[1.75, 1.55, 1.9]} /></Shot>
    <Shot a={4.3} b={5.5}><DashFlashV /></Shot>
    <Shot a={5.5} b={8.0}><GalleryFindV /></Shot>
    <Shot a={8.0} b={9.5}><CanvasV /></Shot>
    <Shot a={9.5} b={11.0}><LongV /></Shot>
    <Shot a={11.0} b={12.4} bg="#111"><MenuTablet /></Shot>
    <Shot a={12.4} b={M.dip2}><ProfileSnap /></Shot>
    <Shot a={M.dip2} b={16.5}><DashBuildV /></Shot>
    <Shot a={16.5} b={17.0}><CmsMacroV /></Shot>
    <Shot a={17.0} b={17.5}><ContactsWideV /></Shot>
    <Shot a={17.5} b={18.0}><ContactsMacroV /></Shot>
    <Shot a={18.0} b={M.m6}><MarketingV /></Shot>
    <Shot a={M.m6} b={19.5}><ItemMacroV /></Shot>
    <Shot a={19.5} b={20.5}><ProductTabV /></Shot>
    <Shot a={20.5} b={M.m7}><AnalyticsV /></Shot>
    <Shot a={M.m7} b={22.0}><PadlockV /></Shot>
    <Shot a={22.0} b={M.back3}><StackedV /></Shot>
    <Shot a={24.0} b={24.5}><GalleryTab a={24.0} b={24.5} stops={[[2, 1], [3, 2]]} beats={[24.25]} s={[2.0, 1.8]} d={0.3} /></Shot>
    <Shot a={24.5} b={25.0}><CmsWhipV /></Shot>
    <Shot a={25.0} b={25.8} bg="#f8f7f4"><StripV /></Shot>
    <Shot a={25.8} b={29.0}><FinaleV /></Shot>
    <Shot a={29.0} b={99}><LogosV /></Shot>
    {sound && <Audio src={staticFile("audio/mix_sfx_v.wav")} />}
  </AbsoluteFill>
);
