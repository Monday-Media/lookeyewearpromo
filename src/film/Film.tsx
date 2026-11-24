import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { useT, Shot, shotCam, seg, easeOut, easeIn, easeInOut, lerp, W, H } from "../kit/kit";
import { Backdrop, BrowserWindow } from "../kit/Window";
import { Gallery, SITE_W, SITE_H } from "../site/Gallery";
import { Dash, CmsTable, Contacts, HomePage, Flyout, Arrow, DW, DH, navY, CMS_ROW_H, CONTACT_ROW_H } from "../dash/Dash";

/** Pointer travel between two points on a soft arc. */
const travel = (t: number, a: number, b: number, p0: [number, number], p1: [number, number]) => { const u = easeInOut(seg(t, a, b)); return { x: lerp(p0[0], p1[0], u), y: lerp(p0[1], p1[1], u) - 26 * Math.sin(Math.PI * u) }; };

/** Markers and voice times on the film clock (seconds), measured from Paul's mix and his marker list. */
export const M = { dip2: 15.06, hit1: 15.24, hit2: 15.6, drop: 16.0, content: 16.12, customers: 17.08, marketing: 17.92, m6: 19.0 };

/** Camera on a stage: scale about a focus point and bring that point to the middle of the frame. */
const Stage: React.FC<{ s: number; fx?: number; fy?: number; x?: number; y?: number; r?: number; children: React.ReactNode }> = ({ s, fx = W / 2, fy = H / 2, x = 0, y = 0, r = 0, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: `${fx}px ${fy}px`, transform: `translate(${W / 2 - fx + x}px, ${H / 2 - fy + y}px) rotate(${r}deg) scale(${s})` }}>{children}</div>
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
const DarkRoom: React.FC<{ glow?: number }> = ({ glow = 1 }) => (
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
                <Gallery time={t} hover={{ col: 1, row: 0, amt: hov }} />
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

export const Film: React.FC<{ sound?: boolean }> = ({ sound = true }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Shot a={12.4} b={M.dip2}><SiteSwing /></Shot>
    <Shot a={M.dip2} b={16.5}><DashBuild /></Shot>
    <Shot a={16.5} b={17.0}><CmsMacro /></Shot>
    <Shot a={17.0} b={17.5}><ContactsWide /></Shot>
    <Shot a={17.5} b={18.0}><ContactsMacro /></Shot>
    <Shot a={18.0} b={M.m6}><Marketing /></Shot>
    {sound && <Audio src={staticFile("audio/mix.wav")} />}
  </AbsoluteFill>
);
