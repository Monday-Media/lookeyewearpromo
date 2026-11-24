import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { useT, Shot, shotCam, seg, easeOut, easeIn, easeInOut, lerp, rampW, io, W, H } from "../kit/kit";
import { Backdrop, BrowserWindow } from "../kit/Window";
import { Gallery, SITE_W, SITE_H, tilePos, tileRow } from "../site/Gallery";
import { Hero, MegaMenu, MENU_X, MENU_Y, ProductLong, Journal, Profile, LONG } from "../site/Pages";
import "@fontsource/outfit/700.css";
import { Img, staticFile as sf } from "remotion";
import { Dash, CmsTable, CmsItem, ITEM_IMAGE, Contacts, HomePage, Flyout, Arrow, DW, DH, navY, CMS_ROW_H, CONTACT_ROW_H } from "../dash/Dash";
import { ProductPage } from "../site/Product";

/** Pointer travel between two points on a soft arc. */
const travel = (t: number, a: number, b: number, p0: [number, number], p1: [number, number]) => { const u = easeInOut(seg(t, a, b)); return { x: lerp(p0[0], p1[0], u), y: lerp(p0[1], p1[1], u) - 26 * Math.sin(Math.PI * u) }; };

/** Markers and voice times on the film clock (seconds), measured from Paul's mix and his marker list. */
export const M = { dip2: 15.06, hit1: 15.24, hit2: 15.6, drop: 16.0, content: 16.12, customers: 17.08, marketing: 17.92, m6: 19.0, powered: 19.4, m7: 21.0, dip3: 23.0, back3: 24.0 };

/** Camera on a stage: scale about a focus point and bring that point to the middle of the frame. */
const Stage: React.FC<{ s: number; fx?: number; fy?: number; x?: number; y?: number; r?: number; rx?: number; ry?: number; children: React.ReactNode }> = ({ s, fx = W / 2, fy = H / 2, x = 0, y = 0, r = 0, rx = 0, ry = 0, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: `${fx}px ${fy}px`, transform: `translate(${W / 2 - fx + x}px, ${H / 2 - fy + y}px) ${rx || ry ? `perspective(1900px) rotateX(${rx}deg) rotateY(${ry}deg)` : ""} rotate(${r}deg) scale(${s})` }}>{children}</div>
);
/** The site filling the frame with no browser round it (macro shots). Site pixels times SK are stage pixels. */
const SK = W / SITE_W;
const SITE_BG = "#f8f7f4";
const FullSite: React.FC<{ h?: number; children: React.ReactNode }> = ({ h = SITE_H, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: SITE_W, height: h, transformOrigin: "0 0", transform: `scale(${SK})`, overflow: "hidden" }}>{children}</div>
);

const DASH_K = 0.9;
const DASH_L = (W - DW * DASH_K) / 2;
const DASH_T = (H - (DH + 44) * DASH_K) / 2;
/** A point on the dashboard (its own pixels) as a point on the stage. */
const dp = (x: number, y: number) => ({ fx: DASH_L + DASH_K * x, fy: DASH_T + DASH_K * (44 + y) });
const DashWindow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: DASH_L, top: DASH_T, transformOrigin: "0 0", transform: `scale(${DASH_K})` }}>
    <BrowserWindow w={DW} h={DH} url="manage.wix.com" dark>{children}</BrowserWindow>
  </div>
);
export const DarkRoom: React.FC<{ glow?: number }> = ({ glow = 1 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#08090c" }}>
    <div style={{ position: "absolute", inset: 0, opacity: glow, background: "radial-gradient(120% 90% at 50% 40%, #1b2030 0%, #0c0e14 55%, #07080b 100%)" }} />
  </div>
);

/** 12.4 to 15.06: the site, wide, then the window swings round as if to look behind it. */
const SiteSwing: React.FC = () => {
  const t = useT();
  const a = 12.4, b = M.dip2;
  const c = shotCam(t, a, b, { from: { s: 1.5, x: 220, y: -60 }, hold: { s: 1 }, inDur: 0.5, outDur: 0.01, drift: { s: 0.012 } });
  const hov = easeOut(seg(t, 12.95, 13.3));
  const sw = easeIn(seg(t, 13.45, b));
  const k = 1.0;
  const ww = SITE_W * k, wh = (SITE_H + 44) * k;
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.1 + 0.02 * (t - a) + 0.25 * sw} x={-40 * sw} dim={0.2 + 0.5 * sw} />
      <Stage s={c.s} x={c.x} y={c.y}>
        <div style={{ position: "absolute", inset: 0, perspective: 1900, perspectiveOrigin: "50% 50%" }}>
          <div style={{ position: "absolute", left: (W - ww) / 2, top: (H - wh) / 2, width: ww, height: wh, transformOrigin: "100% 50%", transform: `translateX(${-420 * sw}px) translateZ(${-500 * sw}px) rotateY(${-84 * sw}deg) rotateZ(${-3 * sw}deg)`, filter: `brightness(${1 - 0.45 * sw})` }}>
            <div style={{ transformOrigin: "0 0", transform: `scale(${k})` }}>
              <BrowserWindow w={SITE_W} h={SITE_H} url="lookeyewear.com.au">
                <Profile time={t} scroll={lerp(380, 980, seg(t, 12.4, 14.3))} />
              </BrowserWindow>
            </div>
          </div>
        </div>
      </Stage>
    </>
  );
};

/** 15.06 to 16.5: the dashboard snaps on in pieces on the stutter hits, resolves on the drop, and its rows cascade. */
const DashBuild: React.FC = () => {
  const t = useT();
  const a = M.dip2, b = 16.5;
  const jolt = (at: number) => 0.035 * (1 - easeOut(seg(t, at, at + 0.22))) * (t >= at ? 1 : 0);
  const push = lerp(0.9, 0.97, easeInOut(seg(t, a, M.drop))) + jolt(M.hit1) + jolt(M.hit2) + 0.05 * (1 - easeOut(seg(t, M.drop, M.drop + 0.3))) * (t >= M.drop ? 1 : 0);
  const out = easeIn(seg(t, b - 0.24, b));
  const f = dp(238 + 520, 45 + 176 + 96 + CMS_ROW_H * 9.5);
  return (
    <>
      <DarkRoom glow={seg(t, M.hit1, M.drop)} />
      <Stage s={push + 0.9 * out} fx={lerp(W / 2, f.fx, out)} fy={lerp(H / 2, f.fy, out)}>
        <div style={{ opacity: t < M.hit1 ? 0 : 1 }}><DashWindow>
          <Dash active="CMS" plan={{ side: M.hit1, top: M.hit2, head: M.hit2, panel: 15.94, hold: M.drop }} page={<CmsTable plan={{ head: M.hit2, panel: 15.94, hold: M.drop }} rowsAt={M.drop + 0.02} />} />
        </DashWindow></div>
      </Stage>
    </>
  );
};

/** 16.5 to 17.0: macro on the Home Gallery rows. */
const CmsMacro: React.FC = () => {
  const t = useT();
  const a = 16.5, b = 17.0;
  const c = shotCam(t, a, b, { from: { s: 3.6, x: -260 }, hold: { s: 2.7 }, to: { s: 2.1, x: 420 }, inDur: 0.3, outDur: 0.2, drift: { x: -46 } });
  const f = dp(238 + 46 + 148 + 300, 45 + 176 + 96 + CMS_ROW_H * 9.5);
  return (
    <>
      <DarkRoom />
      <Stage s={c.s} fx={f.fx} fy={f.fy} x={c.x} y={c.y}>
        <DashWindow><Dash active="CMS" page={<CmsTable hoverRow={t > 16.66 ? 9 : undefined} />} overlay={<Arrow {...travel(t, 16.5, 16.7, [238 + 760, 45 + 176 + 96 + CMS_ROW_H * 12.6], [238 + 46 + 148 + 262, 45 + 176 + 96 + CMS_ROW_H * 9.6])} />} /></DashWindow>
      </Stage>
    </>
  );
};

/** 17.0 to 18.0: contacts, wide then macro. */
const ContactsWide: React.FC = () => {
  const t = useT();
  const a = 17.0, b = 17.5;
  const c = shotCam(t, a, b, { from: { s: 1.5, y: 120 }, hold: { s: 1.12 }, to: { s: 1.9, y: -60 }, inDur: 0.3, outDur: 0.2, drift: { s: 0.03 } });
  const f = dp(238 + 640, 420);
  return (
    <>
      <DarkRoom />
      <Stage s={c.s} fx={f.fx} fy={f.fy} x={c.x} y={c.y}>
        <DashWindow><Dash active="Customers & Leads" open="Customers & Leads" sub="Contacts" page={<Contacts headAt={a - 0.1} rowsAt={a + 0.02} />} /></DashWindow>
      </Stage>
    </>
  );
};
const ContactsMacro: React.FC = () => {
  const t = useT();
  const a = 17.5, b = 18.0;
  const c = shotCam(t, a, b, { from: { s: 3.4, x: 300 }, hold: { s: 2.6 }, to: { s: 2.0, x: -500, y: 60 }, inDur: 0.3, outDur: 0.2, drift: { y: -40 } });
  const f = dp(238 + 46 + 330, 321 + CONTACT_ROW_H * 2.5);
  return (
    <>
      <DarkRoom />
      <Stage s={c.s} fx={f.fx} fy={f.fy} x={c.x} y={c.y}>
        <DashWindow><Dash active="Customers & Leads" open="Customers & Leads" sub="Contacts" page={<Contacts hoverRow={t > 17.66 ? 2 : undefined} />} overlay={<Arrow {...travel(t, 17.5, 17.72, [238 + 46 + 560, 321 + CONTACT_ROW_H * 4.3], [238 + 46 + 300, 321 + CONTACT_ROW_H * 2.5])} />} /></DashWindow>
      </Stage>
    </>
  );
};

/** 18.0 to 19.0: the marketing menu opens beside the sidebar and settles on Email Marketing. */
const Marketing: React.FC = () => {
  const t = useT();
  const a = 18.0, b = M.m6;
  const c = shotCam(t, a, b, { from: { s: 3.3, y: -220 }, hold: { s: 2.25 }, to: { s: 3.4, x: -240, y: -60 }, inDur: 0.34, outDur: 0.24, drift: { s: 0.02, x: -14 } });
  const f = dp(300, navY("Marketing") + 17);
  const hov = easeOut(seg(t, a + 0.02, a + 0.14));
  return (
    <>
      <DarkRoom />
      <Stage s={c.s} fx={f.fx} fy={f.fy} x={c.x} y={c.y}>
        <DashWindow>
          <Dash active="Home" hover={{ label: "Marketing", amt: hov }} page={<HomePage />} overlay={<><Flyout at={a + 0.1} active={t > 18.5 ? 4 : undefined} activeAmt={easeOut(seg(t, 18.5, 18.62))} /><Arrow {...(t < 18.28 ? { x: 150, y: navY("Marketing") + 12 } : travel(t, 18.28, 18.54, [150, navY("Marketing") + 12], [238 + 8 + 190, navY("Marketing") + 12]))} /></>} />
        </DashWindow>
      </Stage>
    </>
  );
};

const SITE_L = (W - SITE_W) / 2;
const SITE_T = (H - (SITE_H + 44)) / 2;
const SiteWindow: React.FC<{ children: React.ReactNode; lockOpen?: number }> = ({ children, lockOpen }) => (
  <div style={{ position: "absolute", left: SITE_L, top: SITE_T }}><BrowserWindow w={SITE_W} h={SITE_H} url="lookeyewear.com.au" lockOpen={lockOpen}>{children}</BrowserWindow></div>
);

/** 19.0 to 19.5: the VAANYARD item open in the CMS; the camera drives into its image. */
const ItemMacro: React.FC = () => {
  const t = useT();
  const a = M.m6, b = 19.5;
  const ui = easeOut(seg(t, a, a + 0.3));
  const uo = easeIn(seg(t, b - 0.26, b));
  const f0 = dp(238 + 332 + 300, 45 + 112 + 58 + 120), f1 = dp(ITEM_IMAGE.x, ITEM_IMAGE.y);
  const s = lerp(lerp(3.0, 2.05, ui), 6.2, uo);
  return (
    <>
      <DarkRoom />
      <Stage s={s} fx={lerp(f0.fx, f1.fx, easeInOut(seg(t, a + 0.1, b)))} fy={lerp(f0.fy - 160 * (1 - ui), f1.fy, easeInOut(seg(t, a + 0.1, b)))}>
        <DashWindow><Dash active="CMS" page={<CmsItem fieldsAt={a - 0.06} />} /></DashWindow>
      </Stage>
    </>
  );
};

/** 19.5 to 20.5: match cut. The same image is the product page's hero on the live site. */
const ProductWide: React.FC = () => {
  const t = useT();
  const a = 19.5, b = 20.5;
  const c = shotCam(t, a, b, { from: { s: 1.75 }, hold: { s: 1 }, to: { s: 1.5, x: -520, y: 40 }, inDur: 0.42, outDur: 0.24, drift: { s: 0.012 } });
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.14 + 0.02 * (t - a)} dim={0.3} />
      <Stage s={c.s} x={c.x} y={c.y} fx={W / 2} fy={SITE_T + 44 + SITE_H * 0.42}>
        <SiteWindow><ProductPage t={t} titleAt={a + 0.16} zoom={1.06 - 0.02 * (t - a)} /></SiteWindow>
      </Stage>
    </>
  );
};

/** 20.5 to 21.0: the analytics on the dashboard home, counting up. */
const AnalyticsMacro: React.FC = () => {
  const t = useT();
  const a = 20.5, b = M.m7;
  const c = shotCam(t, a, b, { from: { s: 3.1, x: 420 }, hold: { s: 2.25 }, to: { s: 3.0, x: -560 }, inDur: 0.3, outDur: 0.2, drift: { x: -60 } });
  const f = dp(238 + 222 + 330, 45 + 191 + 38);
  return (
    <>
      <DarkRoom />
      <Stage s={c.s} fx={f.fx} fy={f.fy} x={c.x} y={c.y}>
        <DashWindow><Dash active="Home" page={<HomePage count={easeOut(seg(t, a - 0.05, b + 0.3))} />} /></DashWindow>
      </Stage>
    </>
  );
};

/** 21.0 to 22.0: crash zoom into the padlock on the live site's address bar; the lock closes. */
const Padlock: React.FC = () => {
  const t = useT();
  const a = M.m7, b = 22.0;
  const ui = easeOut(seg(t, a, a + 0.34));
  const uo = easeIn(seg(t, b - 0.22, b));
  const fx = lerp(W / 2, W / 2 - 14, ui), fy = lerp(H / 2, SITE_T + 22, ui);
  const lock = 1 - easeOut(seg(t, a + 0.42, a + 0.56));
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.16} dim={0.3} />
      <Stage s={lerp(lerp(1.05, 8.2, ui), 12.5, uo) * (1 + 0.012 * (t - a))} fx={fx} fy={fy} x={-40 * (t - a)}>
        <SiteWindow lockOpen={lock}><ProductPage t={t} /></SiteWindow>
      </Stage>
    </>
  );
};

/** 22.0 to 24.0: site and dashboard come together side by side, then the move ramps down to a crawl for the dip. */
const SideBySide: React.FC = () => {
  const t = useT();
  const a = 22.0;
  const p = easeOut(seg(t, a, a + 0.9));
  const creep = t - a;
  const win = (cx: number, k: number, ry: number, w: number, h: number, node: React.ReactNode) => (
    <div style={{ position: "absolute", left: cx - w / 2, top: H / 2 - h / 2, width: w, height: h, transform: `perspective(2200px) rotateY(${ry}deg) scale(${k})` }}>{node}</div>
  );
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.2 - 0.03 * p} dim={0.3 + 0.3 * p} blur={3 + 5 * p} />
      {win(lerp(W / 2, 505, p) - 7 * creep, lerp(1.0, 0.585, p), lerp(0, 13, p), SITE_W, SITE_H + 44, <BrowserWindow w={SITE_W} h={SITE_H} url="lookeyewear.com.au"><ProductPage t={t} zoom={1.03} /></BrowserWindow>)}
      {win(lerp(W + 900, 1425, p) + 7 * creep, 0.5, lerp(-34, -13, p), DW, DH + 44, <BrowserWindow w={DW} h={DH} url="manage.wix.com" dark><Dash active="Home" page={<HomePage count={easeOut(seg(t, 20.45, 21.3))} />} /></BrowserWindow>)}
    </>
  );
};


/* ───────────────────────── 0 to 12.4 ───────────────────────── */

/** 0 to 2.0: the home page loads full frame. The picture eases in, the wordmark rises, and the move ramps out. */
const Open: React.FC = () => {
  const t = useT();
  const out = easeIn(seg(t, 1.56, 2.0));
  return (
    <Stage s={(1 + 0.03 * t) * lerp(1, 1.5, out)}>
      <FullSite><Hero t={t} at={0.04} open={0.3 * out} /></FullSite>
    </Stage>
  );
};

/** 2.0 to 3.0: the same page in its window. The picture finishes opening and the words split to the edges. */
const HeroWide: React.FC = () => {
  const t = useT();
  const a = 2.0, b = 3.0;
  const c = shotCam(t, a, b, { from: { s: 1.6 }, hold: { s: 1 }, to: { s: 1.4, y: -380 }, inDur: 0.42, outDur: 0.24, drift: { s: 0.014 } });
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.12 + 0.02 * (t - a)} dim={0.5} blur={10} />
      <Stage s={c.s} x={c.x} y={c.y}><SiteWindow><Hero t={t} at={0.04} open={lerp(0.3, 1, easeOut(seg(t, a, a + 0.75)))} /></SiteWindow></Stage>
    </>
  );
};

/** The gallery full frame at a tilt. The camera sits on one tile, then speed-ramps to the next on each beat. */
const GalleryTilt: React.FC<{ a: number; b: number; stops: [number, number][]; beats: number[]; s: number[]; d?: number }> = ({ a, b, stops, beats, s, d = 0.42 }) => {
  const t = useT();
  const ws = beats.map((bt, i) => rampW(t, bt, d, i ? beats[i - 1] : a));
  const pos = stops.map(([ci, ri]) => tilePos(t, ci, ri));
  let fx = pos[0].x, fy = pos[0].y, sc = Math.log(s[0]);
  ws.forEach((w, i) => { fx += (pos[i + 1].x - pos[i].x) * w; fy += (pos[i + 1].y - pos[i].y) * w; sc += (Math.log(s[i + 1]) - Math.log(s[i])) * w; });
  const amt = (i: number) => (i === 0 ? easeOut(seg(t, a + 0.04, a + 0.3)) : ws[i - 1]) * (i < ws.length ? 1 - ws[i] : 1);
  const turn = ws.reduce((m, w, i) => m + (i % 2 ? -w : w), 0);
  return (
    <Stage s={Math.exp(sc) * io(t, a, b, 1.5, 1.5)} fx={fx * SK} fy={fy * SK} rx={11} ry={lerp(-13, 13, turn)} r={lerp(-3, 2, turn)}>
      <FullSite h={2600}><Gallery time={t} hover={stops.map(([col, row], i) => ({ col, row, amt: amt(i) }))} /></FullSite>
    </Stage>
  );
};

/** 4.3 to 5.5: the dashboard behind it. Wide with the figures counting, then a ramp down the side menu to the CMS. */
const DashFlash: React.FC = () => {
  const t = useT();
  const a = 4.3, b = 5.5;
  const w = rampW(t, 5.0, 0.46, a);
  const f = dp(330, navY("CMS") - 70);
  return (
    <>
      <DarkRoom />
      <Stage s={Math.exp(Math.log(2.0) * w) * io(t, a, b, 1.55, 1.4) * (1 + 0.012 * (t - a))} fx={lerp(W / 2, f.fx, w)} fy={lerp(H / 2, f.fy, w)}>
        <DashWindow><Dash active="Home" hover={{ label: "CMS", amt: easeOut(seg(t, 5.08, 5.24)) }} page={<HomePage count={easeOut(seg(t, a, a + 1.0))} />} overlay={t > 4.9 ? <Arrow {...travel(t, 4.9, 5.16, [330, navY("CMS") - 120], [128, navY("CMS") + 12])} /> : undefined} /></DashWindow>
      </Stage>
    </>
  );
};

/** 5.5 to 8.0: back on the site. The gallery whips down, the camera ramps onto VAANYARD, then crawls through the dip. */
const GalleryFind: React.FC = () => {
  const t = useT();
  const a = 5.5, b = 8.0;
  const ci = 2;
  const base = tileRow(ci, "VAANYARD");
  const n = tilePos(0, ci, 0).n;
  const want = (ri: number) => tilePos(6.6, ci, ri).y - 300;
  const ri = want(base) > 250 ? base : base + n;
  const scroll = want(ri) * rampW(t, 6.0, 0.5, a);
  const w = rampW(t, 6.5, 0.44, 6.0);
  const p = tilePos(t, ci, ri, scroll);
  const fx = lerp(W / 2, SITE_L + p.x, w), fy = lerp(H / 2, SITE_T + 44 + p.y + 130, w);
  const crawl = 1 + 0.03 * Math.max(0, t - 6.72);
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.12 + 0.015 * (t - a)} dim={0.25 + 0.3 * w} />
      <Stage s={Math.exp(Math.log(2.1) * w) * crawl * io(t, a, b, 1.5, 1.4, 0.34, 0.3)} fx={fx} fy={fy}>
        <SiteWindow><Gallery time={t} scroll={scroll} hover={{ col: ci, row: ri, amt: easeOut(seg(t, 6.56, 6.95)) }} /></SiteWindow>
      </Stage>
    </>
  );
};

/** 8.0 to 9.5: a blank canvas. The Journal page is drawn on it part by part, eight parts a second, then resolves at 9.0. */
export const DRAW = [8.0, 8.125, 8.25, 8.375, 8.5, 8.625, 8.75, 8.875];
const Canvas: React.FC = () => {
  const t = useT();
  const a = 8.0, b = 9.5;
  const jolt = (at: number, k = 0.014) => k * (1 - easeOut(seg(t, at, at + 0.16))) * (t >= at ? 1 : 0);
  const out = easeIn(seg(t, b - 0.24, b));
  const w = rampW(t, 9.28, 0.36, 9.0);
  const s = lerp(0.92, 1, easeInOut(seg(t, a, 9.0))) + jolt(8.0, 0.1) + DRAW.slice(1).reduce((m, x) => m + jolt(x), 0) + jolt(9.0, 0.05) + 0.012 * Math.max(0, t - 9) + 0.5 * out;
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.14 + 0.02 * (t - a)} dim={0.42} blur={8} />
      <Stage s={s} y={-360 * out}><SiteWindow><Journal t={t} plan={DRAW} hold={9.0} scroll={330 * w} /></SiteWindow></Stage>
    </>
  );
};

/** 9.5 to 11.0: the product page as one long sheet at a tilt. Each section builds as the camera ramps down to it. */
const PX = (W - SITE_W) / 2;
const LongPage: React.FC = () => {
  const t = useT();
  const a = 9.5, b = 11.0;
  const w1 = rampW(t, 10.0, 0.44, a), w2 = rampW(t, 10.5, 0.44, 10.0);
  const k = (v: number[]) => v[0] + (v[1] - v[0]) * w1 + (v[2] - v[1]) * w2;
  const sc = Math.exp(k([1.55, 1.5, 1.02].map(Math.log)));
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.2} y={-30 * (t - a)} dim={0.6} blur={9} />
      <Stage s={sc * io(t, a, b, 1.4, 1.5)} fx={PX + k([560, 720, 720])} fy={k([LONG.desc + 190, LONG.strip + 146, LONG.close + 378])} rx={k([24, 20, 10])} r={k([-5, -3, -7])} y={90 * (1 - easeOut(seg(t, a, a + 0.34)))}>
        <div style={{ position: "absolute", left: PX, top: 0 }}><ProductLong t={t} plan={{ desc: a - 0.04, strip: 9.92, close: 10.42 }} stripX={-120 - 70 * (t - a)} /></div>
      </Stage>
    </>
  );
};

/** 11.0 to 12.4: the full-screen menu. The pointer visits Collections, Profile and Journal and each one answers. */
export const HOVERS: [number, number, number] = [11.3, 11.68, 12.04];
const Menu: React.FC = () => {
  const t = useT();
  const a = 11.0, b = 12.4;
  const c = shotCam(t, a, b, { from: { s: 1.5, x: -260 }, hold: { s: 1.1, x: -110 }, to: { s: 1.5, x: -420, y: 120 }, inDur: 0.36, outDur: 0.22, drift: { s: 0.03 } });
  const pts: [number, number][] = [[MENU_X + 330, MENU_Y(0) - 70], [MENU_X + 285, MENU_Y(1) + 8], [MENU_X + 190, MENU_Y(2) + 8], [MENU_X + 215, MENU_Y(3) + 8]];
  let px = pts[0][0], py = pts[0][1];
  HOVERS.forEach((h, i) => { const u = easeInOut(seg(t, h - 0.2, h + 0.04)); px += (pts[i + 1][0] - pts[i][0]) * u; py += (pts[i + 1][1] - pts[i][1]) * u; });
  return (
    <Stage s={c.s} x={c.x} y={c.y}><FullSite><MegaMenu t={t} at={a - 0.34} hovers={HOVERS} pointer={{ x: px, y: py, o: seg(t, a + 0.04, a + 0.2) }} /></FullSite></Stage>
  );
};

/* ───────────────────────── 24.0 to the end ───────────────────────── */

/** 24.5 to 25.0: down the CMS rows in one ramp. */
const CmsWhip: React.FC = () => {
  const t = useT();
  const a = 24.5, b = 25.0;
  const w = rampW(t, 24.75, 0.3, a);
  const row = lerp(2.5, 11.5, w);
  const f = dp(238 + 46 + 148 + 330, 45 + 176 + 96 + CMS_ROW_H * row);
  return (
    <>
      <DarkRoom />
      <Stage s={2.5 * io(t, a, b, 1.35, 1.4, 0.2, 0.16)} fx={f.fx} fy={f.fy}><DashWindow><Dash active="CMS" page={<CmsTable hoverRow={w > 0.5 ? 11 : 2} />} /></DashWindow></Stage>
    </>
  );
};

/** 25.0 to 25.8: along the product page's picture strip. */
const StripMacro: React.FC = () => {
  const t = useT();
  const a = 25.0, b = 25.8;
  const w = rampW(t, 25.4, 0.4, a);
  return (
    <Stage s={2.25 * io(t, a, b, 1.4, 1.35)} fx={PX + 720} fy={LONG.strip + 146} rx={8} ry={lerp(10, -10, w)}>
      <div style={{ position: "absolute", left: PX, top: 0 }}><ProductLong t={t} stripX={-260 - 60 * (t - a) - 1000 * w} /></div>
    </Stage>
  );
};

/**
 * 25.8 to 29.0: "Beautiful," is the home page on its own. On "with nothing missing underneath" the camera swings
 * round and the window lifts to show the dashboard, the CMS and the contacts stacked beneath it. It clears at 29.0.
 */
const Finale: React.FC = () => {
  const t = useT();
  const a = 25.8, b = 29.0;
  const e = rampW(t, 26.92, 0.7, a + 0.6);
  const clear = easeIn(seg(t, 28.72, b));
  const sIn = lerp(1.35, 1, easeOut(seg(t, a, a + 0.42)));
  const DK = SITE_W / DW;
  const layers: React.ReactNode[] = [
    <BrowserWindow w={SITE_W} h={SITE_H} url="lookeyewear.com.au"><Hero t={t} at={a - 0.5} open={0.62 * easeInOut(seg(t, a + 0.1, 27.3))} /></BrowserWindow>,
    <div style={{ transformOrigin: "0 0", transform: `scale(${DK})` }}><BrowserWindow w={DW} h={DH} url="manage.wix.com" dark><Dash active="Home" page={<HomePage />} /></BrowserWindow></div>,
    <div style={{ transformOrigin: "0 0", transform: `scale(${DK})` }}><BrowserWindow w={DW} h={DH} url="manage.wix.com" dark><Dash active="CMS" page={<CmsTable />} /></BrowserWindow></div>,
    <div style={{ transformOrigin: "0 0", transform: `scale(${DK})` }}><BrowserWindow w={DW} h={DH} url="manage.wix.com" dark><Dash active="Customers & Leads" open="Customers & Leads" sub="Contacts" page={<Contacts />} /></BrowserWindow></div>,
  ];
  const spin = t - 27.0;
  return (
    <>
      <Backdrop src="img/hero.jpg" scale={1.14 + 0.01 * (t - a)} dim={lerp(0.4, 0.78, e) + 0.22 * clear} blur={8 + 6 * e} />
      <div style={{ position: "absolute", inset: 0, perspective: 2600, perspectiveOrigin: "50% 46%", opacity: 1 - clear }}>
        <div style={{ position: "absolute", left: SITE_L, top: SITE_T, width: SITE_W, height: SITE_H + 44, transformStyle: "preserve-3d", transform: `translate(${-190 * e}px, ${lerp(0, 40, e)}px) scale(${sIn * lerp(1, 0.64, e) * (1 + 0.012 * (t - a)) * (1 + 1.6 * clear)}) rotateX(${52 * e}deg) rotateZ(${e * (-34 + 2.2 * spin)}deg)` }}>
          {layers.map((node, i) => i).reverse().map((i) => (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${i * 215 * e}px, ${i * 120 * e}px) translateZ(${(1.5 - i) * 190 * e * (1 + 2.5 * clear)}px)`, filter: i ? `brightness(${1 - 0.1 * i * e})` : undefined, opacity: i && e < 0.02 ? 0 : 1 }}>{layers[i]}</div>
          ))}
        </div>
      </div>
    </>
  );
};

/** 29.0 to the end: where we are (a pin and "perth wa", set like the logo), then the Monday Media logo, held in silence. */
const Logos: React.FC = () => {
  const t = useT();
  const piece = (at: number, until: number, node: React.ReactNode) => {
    if (t < at || t >= until) return null;
    const u = easeOut(seg(t, at, at + 0.5));
    const o = easeIn(seg(t, until - 0.22, until));
    return <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lerp(1.22, 1, u) * (1 + 0.01 * (t - at)) * lerp(1, 0.86, o)})`, opacity: seg(t, at, at + 0.1) * (1 - o), filter: u < 1 ? `blur(${10 * (1 - u)}px)` : undefined }}>{node}</div>;
  };
  const drop = easeOut(seg(t, 29.0, 29.36));
  return (
    <>
      <DarkRoom glow={0.8} />
      {piece(29.0, 31.0, (
        <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 84, letterSpacing: "-0.01em", lineHeight: 1 }}>
          <svg width="52" height="70" viewBox="0 0 62 84" style={{ transform: `translateY(${-46 * (1 - drop)}px)` }}><path d="M31 0C13.900 0 0 13.700 0 30.600 0 53.200 31 84 31 84s31-30.800 31-53.400C62 13.700 48.100 0 31 0z" fill="#fff" /><circle cx="31" cy="30.500" r="11.500" fill="#0c0e14" /></svg>
          <div>Perth</div><div>WA</div>
        </div>
      ))}
      {piece(31.0, 99, <Img src={sf("brand/mm_white.svg")} style={{ width: 660 }} />)}
    </>
  );
};

export const Film: React.FC<{ sound?: boolean }> = ({ sound = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Shot a={0} b={2.0}><Open /></Shot>
    <Shot a={2.0} b={3.0}><HeroWide /></Shot>
    <Shot a={3.0} b={4.3} bg={SITE_BG}><GalleryTilt a={3.0} b={4.3} stops={[[1, 1], [2, 2], [1, 2]]} beats={[3.5, 4.0]} s={[1.5, 1.35, 1.6]} /></Shot>
    <Shot a={4.3} b={5.5}><DashFlash /></Shot>
    <Shot a={5.5} b={8.0}><GalleryFind /></Shot>
    <Shot a={8.0} b={9.5}><Canvas /></Shot>
    <Shot a={9.5} b={11.0}><LongPage /></Shot>
    <Shot a={11.0} b={12.4} bg="#111111"><Menu /></Shot>
    <Shot a={12.4} b={M.dip2}><SiteSwing /></Shot>
    <Shot a={M.dip2} b={16.5}><DashBuild /></Shot>
    <Shot a={16.5} b={17.0}><CmsMacro /></Shot>
    <Shot a={17.0} b={17.5}><ContactsWide /></Shot>
    <Shot a={17.5} b={18.0}><ContactsMacro /></Shot>
    <Shot a={18.0} b={M.m6}><Marketing /></Shot>
    <Shot a={M.m6} b={19.5}><ItemMacro /></Shot>
    <Shot a={19.5} b={20.5}><ProductWide /></Shot>
    <Shot a={20.5} b={M.m7}><AnalyticsMacro /></Shot>
    <Shot a={M.m7} b={22.0}><Padlock /></Shot>
    <Shot a={22.0} b={M.back3}><SideBySide /></Shot>
    <Shot a={24.0} b={24.5} bg={SITE_BG}><GalleryTilt a={24.0} b={24.5} stops={[[2, 1], [3, 2]]} beats={[24.25]} s={[1.7, 1.55]} d={0.3} /></Shot>
    <Shot a={24.5} b={25.0}><CmsWhip /></Shot>
    <Shot a={25.0} b={25.8} bg={SITE_BG}><StripMacro /></Shot>
    <Shot a={25.8} b={29.0}><Finale /></Shot>
    <Shot a={29.0} b={99}><Logos /></Shot>
    {sound && <Audio src={staticFile("audio/mix_sfx.wav")} />}
  </AbsoluteFill>
);
