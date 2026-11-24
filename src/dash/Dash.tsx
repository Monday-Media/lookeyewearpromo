import React from "react";
import { Img, staticFile } from "remotion";
import { Build, useT, seg, easeOut, lerp } from "../kit/kit";
import rows from "./cms.json";

/**
 * The Wix Studio dashboard, rebuilt from Paul's nine screenshots (24 Nov 2026) at 1728 x 972. Colours are sampled from
 * the screenshots. Removed on Paul's instruction: NEW and SALE badges, the Upgrade button and banner, the "Let's set up
 * your business" panel, the Free plan row, notification counts and the Base44 card. Contacts and figures are invented.
 * The CMS rows are the site's real Home Gallery items. Icons are simple stand-ins (see docs/APPROXIMATIONS.md).
 */
export const DW = 1728;
export const DH = 972;
const F = "'Wix Madefor Text', system-ui, sans-serif";
const C = { bar: "#14171f", active: "#43454b", sub: "#20222a", hover: "#2c2e35", bg: "#edeff3", card: "#ffffff", blue: "#326bf6", ink: "#010622", line: "#dfe5eb", th: "#e9f0fe", pub: "#51a361", draft: "#878aa3", side: "#e8e9ea", muted: "#6e7481" };
const TOP = 45;
const SIDE = 238;

export type BuildPlan = { top?: number; side?: number; head?: number; panel?: number; hold?: number };
const B: React.FC<{ at?: number; hold?: number; sk?: React.ReactNode; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, hold, sk, style, children }) =>
  at === undefined ? <div style={style}>{children}</div> : <Build at={at} hold={hold} skeleton={sk} style={style}>{children}</Build>;

/* Wireframes: each region of the dashboard reduced to plain bars in its own colours. */
const Bar: React.FC<{ w: number | string; h?: number; c: string; r?: number; style?: React.CSSProperties }> = ({ w, h = 9, c, r, style }) => <div style={{ width: w, height: h, borderRadius: r ?? h / 2, background: c, flexShrink: 0, ...style }} />;
const SkSide: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: C.bar, paddingTop: 62 }}>
    {[70, 52, 86, 104, 50, 46, 44, 48, -1, 128, 86, 52, 136, 82, 104, -1, 76, 44, 122].map((w, i) => w < 0 ? <div key={i} style={{ height: 1, background: "#2c2f38", margin: "10px 18px" }} /> : (
      <div key={i} style={{ height: ITEM_H, display: "flex", alignItems: "center", gap: 17, padding: "0 20px 0 17px" }}><Bar w={15} h={15} r={4} c="#343843" /><Bar w={w} c="#343843" /></div>
    ))}
  </div>
);
const SkTop: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: C.bar, display: "flex", alignItems: "center", gap: 22, padding: "0 16px", borderBottom: "1px solid #2a2d35" }}>
    <Bar w={84} h={12} c="#3a3e4a" /><Bar w={30} h={26} r={6} c="#3a3e4a" /><Bar w={190} c="#343843" /><Bar w={70} c="#343843" /><Bar w={78} c="#343843" /><Bar w={44} c="#343843" /><div style={{ flex: 1 }} /><Bar w={470} h={28} c="#20222a" /><Bar w={16} h={16} c="#343843" /><Bar w={16} h={16} c="#343843" /><Bar w={16} h={16} c="#343843" /><Bar w={28} h={28} c="#3a3e4a" /><Bar w={55} h={34} r={4} c="#2a4fb0" />
  </div>
);
const SkHead: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: C.bg, padding: "30px 44px 0 52px" }}>
    <Bar w={150} h={8} c="#d3d9e3" />
    <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}><Bar w={196} h={20} r={5} c="#c5ccd9" /><div style={{ flex: 1 }} /><Bar w={136} h={34} c="#dfe4ec" /><div style={{ width: 12 }} /><Bar w={116} h={34} c="#aebfe9" /></div>
    <div style={{ display: "flex", gap: 12, marginTop: 22 }}><Bar w={132} h={46} r={4} c="#dfe4ec" /><Bar w={117} h={46} r={4} c="#e4e8ef" /></div>
  </div>
);
const SkPanel: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
    <div style={{ height: 62, display: "flex", alignItems: "center", padding: "0 44px 0 46px", gap: 12 }}><Bar w={110} h={13} c="#c5ccd9" /><Bar w={96} h={28} c="#e8ecf2" /><div style={{ flex: 1 }} /><Bar w={128} h={28} c="#e8ecf2" /><Bar w={66} h={28} c="#e8ecf2" /><Bar w={72} h={28} c="#e8ecf2" /><Bar w={170} h={28} c="#e8ecf2" /><Bar w={176} h={28} c="#eef1f5" /></div>
    <div style={{ height: 34, background: C.th }} />
    {Array.from({ length: 18 }, (_, i) => (
      <div key={i} style={{ height: CMS_ROW_H, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 0 }}>
        <div style={{ width: 46 }} /><div style={{ width: 148 }}><Bar w={72} h={16} r={2} c="#cfe3d3" /></div><div style={{ width: 279 }}><Bar w={90 + ((i * 53) % 120)} c="#dfe4ec" /></div><div style={{ width: 139 }}><Bar w={96} c="#e8ecf2" /></div><div style={{ width: 128 }}><Bar w={46} h={24} r={3} c="#dfe4ec" /></div><div style={{ width: 176 }}><Bar w={130} c="#e8ecf2" /></div><div style={{ width: 188 }}><Bar w={150} c="#e8ecf2" /></div><div style={{ width: 120 }}><Bar w={84} c="#e8ecf2" /></div><Bar w={140} c="#e8ecf2" />
      </div>
    ))}
  </div>
);

const Glyph: React.FC<{ k: number; c?: string }> = ({ k, c = "#c9cbd0" }) => {
  const p = [
    <path d="M3 13l4-9 6 3-4 6zM3 13l2 0" />, <path d="M2.5 8L8 3l5.5 5v5.5h-11z" />, <path d="M8 2l1.6 4.4L14 8l-4.4 1.6L8 14l-1.6-4.4L2 8l4.4-1.6z" />,
    <path d="M4 2.5h6l2 2v9H4zM6.5 9.5h3" />, <><circle cx="8" cy="8" r="5.5" /><path d="M8 5v6M6.2 6.6h2.6a1.2 1.2 0 010 2.4H7a1.2 1.2 0 000 2.4h2.6" /></>, <><circle cx="8" cy="5.5" r="2.5" /><path d="M3 13.5c0-2.6 2.2-4.2 5-4.2s5 1.6 5 4.2" /></>,
    <path d="M8 2.5c2 2.5 3 4.3 3 6.2a3 3 0 01-6 0c0-1.9 1-3.7 3-6.2z" />, <><rect x="2.5" y="2.5" width="4.5" height="4.5" /><rect x="9" y="2.5" width="4.5" height="4.5" /><rect x="2.5" y="9" width="4.5" height="4.5" /><rect x="9" y="9" width="4.5" height="4.5" /></>,
    <><rect x="2" y="3" width="9" height="7" /><rect x="10" y="7.5" width="4" height="6" /></>, <path d="M2.5 6.5v3l7 3v-9zM9.5 5.5c2 0 3.5 1 3.5 2.5s-1.5 2.5-3.5 2.5" />, <path d="M2.5 5.5l2-2.5h7l2 2.5v7h-11zM2.5 8h3.2l.8 1.5h3l.8-1.5h3.2" />,
    <><circle cx="6.5" cy="5.5" r="2.3" /><path d="M2 13c0-2.4 2-3.8 4.5-3.8S11 10.600 11 13M11 3.6a2.300 2.300 0 010 4M12.2 9.6c1.200.5 1.800 1.700 1.800 3.400" /></>, <path d="M2.500 13.500V3M2.500 13.500H14M4.500 10.500l3-3.500 2.500 2 3.500-4.500" />, <path d="M9 2L4 9h3.500l-1 5 5.500-7.500H8.500z" />,
    <><circle cx="8" cy="8" r="2.2" /><path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.800 3.800l1.400 1.400M10.800 10.800l1.400 1.400M3.800 12.200l1.400-1.400M10.800 5.200l1.400-1.400" /></>, <><rect x="2.500" y="3" width="11" height="10" /><path d="M2.500 6.300h11M2.500 9.600h11M6 6.300V13" /></>, <path d="M5.500 4.500L2 8l3.500 3.500M10.500 4.500L14 8l-3.500 3.500M9 3l-2 10" />,
  ][k];
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">{p}</svg>;
};

const NAV: [string, boolean, number][] = [["Setup", false, 0], ["Home", false, 1], ["AI Agents", true, 2], ["Getting Paid", true, 3], ["Sales", true, 4], ["Staff", true, 5], ["Blog", true, 6], ["Apps", true, 7]];
const NAV2: [string, boolean, number][] = [["Site & Mobile App", true, 8], ["Marketing", true, 9], ["Inbox", false, 10], ["Customers & Leads", true, 11], ["Analytics", true, 12], ["Automations", false, 13]];
const NAV3: [string, boolean, number][] = [["Settings", false, 14], ["CMS", false, 15], ["Developer Tools", true, 16]];
const ITEM_H = 34;
export const navY = (label: string, open?: string) => {
  let y = TOP + 62;
  const groups = [NAV, NAV2, NAV3];
  for (let g = 0; g < groups.length; g++) {
    for (const [l] of groups[g]) { if (l === label) return y; y += ITEM_H; if (open === l) y += SUBS[l].length * 26 + 6; }
    y += 21;
  }
  return y;
};
const SUBS: Record<string, string[]> = { "Customers & Leads": ["Contacts", "Leads", "Forms & Submissions", "Meetings", "Pipelines", "Community", "Loyalty Program", "Business Email"] };
export const FLYOUT = ["Marketing Home", "SEO & GEO", "Google Ads", "Facebook & Instagram Ads", "Email Marketing", "Messaging Campaigns", "Social Media Marketing", "Referral Program", "Google Business Profile"];

const Chevron: React.FC<{ c?: string; r?: number }> = ({ c = "#c9cbd0", r = 0 }) => <svg width="9" height="9" viewBox="0 0 9 9" style={{ transform: `rotate(${r}deg)` }}><path d="M3 1.500l3 3-3 3" stroke={c} strokeWidth="1.200" fill="none" strokeLinecap="round" /></svg>;

/** The "m" and its two squares, cropped from Monday Media's own logo file (never redrawn). */
const MMark: React.FC<{ w: number }> = ({ w }) => {
  const k = w / 126; // the m spans the first 126 units of the 899.53-unit wordmark
  return <div style={{ width: w, height: 141.67 * k, overflow: "hidden", position: "relative" }}><Img src={staticFile("brand/mm_dark.svg")} style={{ position: "absolute", left: 0, top: 0, width: 899.53 * k, height: 141.67 * k, maxWidth: "none" }} /></div>;
};

const TopBar: React.FC<{}> = () => (
  <div style={{ height: TOP, background: C.bar, display: "flex", alignItems: "center", color: "#fff", font: `500 13.500px ${F}`, borderBottom: "1px solid #2a2d35" }}>
    <div style={{ width: 117, display: "flex", justifyContent: "center" }}><Img src={staticFile("brand/wix_studio_landscape.svg")} style={{ height: 15 }} /></div>
    <div style={{ width: 73, height: TOP, borderLeft: "1px solid #2f323a", borderRight: "1px solid #2f323a", display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: "#fff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <MMark w={20} />
      </div>
      <Chevron r={90} />
    </div>
    <div style={{ height: TOP, padding: "0 14px", background: C.hover, display: "flex", alignItems: "center", gap: 9 }}>Look Eyewear &amp; Optometry <Chevron r={90} c="#fff" /></div>
    {["Resources", "Community", "Help"].map((x) => <div key={x} style={{ padding: "0 13px", display: "flex", alignItems: "center", gap: 8 }}>{x} <Chevron r={90} c="#fff" /></div>)}
    <div style={{ flex: 1 }} />
    <div style={{ width: 470, height: 28, borderRadius: 14, background: C.sub, border: "1px solid #3a3d45", display: "flex", alignItems: "center", gap: 9, padding: "0 12px", color: "#c9cbd0", fontWeight: 400 }}>
      <svg width="13" height="13" viewBox="0 0 13 13"><circle cx="5.500" cy="5.500" r="4" stroke="#c9cbd0" strokeWidth="1.200" fill="none" /><path d="M8.500 8.500l3 3" stroke="#c9cbd0" strokeWidth="1.200" /></svg>Search for tools, apps, help &amp; more...
    </div>
    <div style={{ display: "flex", gap: 26, padding: "0 22px 0 30px", alignItems: "center" }}>
      {[10, 13, 15].map((k) => <Glyph key={k} k={k} c="#fff" />)}
      <div style={{ width: 28, height: 28, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><MMark w={16} /></div>
    </div>
    <div style={{ width: 55, height: 34, borderRadius: 4, marginRight: 14, background: "linear-gradient(100deg, #2b5cf0, #2f7df6 60%, #49c4b4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontWeight: 600 }}><Glyph k={2} c="#fff" />AI</div>
  </div>
);

const NavItem: React.FC<{ it: [string, boolean, number]; active?: boolean; hover?: number; open?: boolean; reveal?: number; i: number }> = ({ it, active, hover = 0, open, reveal, i }) => {
  const t = useT();
  const u = reveal === undefined ? 1 : easeOut(seg(t, reveal + i * 0.018, reveal + i * 0.018 + 0.22));
  return (
    <div style={{ height: ITEM_H, display: "flex", alignItems: "center", gap: 17, padding: "0 20px 0 17px", background: active ? C.active : hover ? `rgba(67,69,75,${hover})` : "transparent", color: C.side, font: `500 14.500px ${F}`, opacity: u, transform: `translateX(${lerp(-14, 0, u)}px)` }}>
      <Glyph k={it[2]} /><div style={{ flex: 1 }}>{it[0]}</div>{it[1] && <Chevron r={open ? -90 : 0} />}
    </div>
  );
};

const Sidebar: React.FC<{ active?: string; sub?: string; open?: string; hover?: { label: string; amt: number }; reveal?: number }> = ({ active, sub, open, hover, reveal }) => {
  let i = 0;
  const group = (g: [string, boolean, number][]) => g.map((it) => (
    <React.Fragment key={it[0]}>
      <NavItem it={it} i={i++} reveal={reveal} active={active === it[0] && !sub} open={open === it[0]} hover={hover && hover.label === it[0] ? hover.amt : 0} />
      {open === it[0] && <div style={{ background: C.sub, padding: "3px 0" }}>{SUBS[it[0]].map((s) => <div key={s} style={{ height: 26, display: "flex", alignItems: "center", paddingLeft: 48, background: sub === s ? C.active : "transparent", color: C.side, font: `400 12.500px ${F}` }}>{s}</div>)}</div>}
    </React.Fragment>
  ));
  const rule = <div style={{ height: 1, background: "#3a3d45", margin: "10px 18px" }} />;
  return (
    <div style={{ width: SIDE, height: DH - TOP, background: C.bar, position: "relative", flexShrink: 0 }}>
      <div style={{ height: 46, borderBottom: "1px solid #2a2d35", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 17 }}>
        <div style={{ width: 23, height: 23, borderRadius: 12, border: "1px solid #8a8d94", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.400"><path d="M8 2l1.800 3.900 4.200.5-3.100 2.900.8 4.200L8 11.400 4.300 13.500l.8-4.200L2 6.400l4.200-.5z" /></svg></div>
      </div>
      <div style={{ paddingTop: 16, height: DH - TOP - 46 - 81, overflow: "hidden", boxSizing: "border-box" }}>{group(NAV)}{rule}{group(NAV2)}{rule}{group(NAV3)}</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <div style={{ height: 30, borderTop: "1px solid #2a2d35", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#fff", font: `400 11px ${F}` }}>Built on <Img src={staticFile("brand/wix_studio_landscape.svg")} style={{ height: 9, clipPath: "inset(0 0 0 19%)", marginLeft: -12 }} /></div>
        <div style={{ height: 50, borderTop: "1px solid #2a2d35", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, color: "#fff", font: `500 14px ${F}` }}><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.100"><path d="M2 10l.6-2.600L8.500 1.500l2 2-5.900 5.900z" /></svg>Edit Site</div>
      </div>
    </div>
  );
};

const Pill: React.FC<{ children: React.ReactNode; solid?: boolean; h?: number; px?: number }> = ({ children, solid, h = 34, px = 18 }) => (
  <div style={{ height: h, padding: `0 ${px}px`, borderRadius: h / 2, background: solid ? C.blue : "#fff", border: solid ? "none" : "1px solid #cfdcfb", color: solid ? "#fff" : C.blue, font: `500 14.500px ${F}`, display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>{children}</div>
);

/** A row that cascades in, soft then sharp: used for table rows, list rows and cards. No colour is added. */
export const Cascade: React.FC<{ at?: number; i: number; step?: number; children: React.ReactNode; style?: React.CSSProperties; tint?: string }> = ({ at, i, step = 0.028, children, style }) => {
  const t = useT();
  if (at === undefined) return <div style={style}>{children}</div>;
  const a = at + i * step;
  if (t < a) return <div style={{ ...style, visibility: "hidden" }}>{children}</div>;
  const u = easeOut(seg(t, a, a + 0.26));
  return <div style={{ ...style, transform: `translateY(${lerp(12, 0, u)}px)`, opacity: lerp(0, 1, seg(t, a, a + 0.09)), filter: u < 0.98 ? `blur(${6 * (1 - u)}px)` : undefined }}>{children}</div>;
};

/* ------------------------------------------------ pages ------------------------------------------------ */
const COLS: [string, number, string][] = [["Status", 148, ""], ["Title", 279, "T"], ["Text", 139, "T"], ["Image", 128, "I"], ["Image Alt Text", 176, "T"], ["Design Influence", 188, "T"], ["Slug", 120, "T"], ["Comfort And Fit", 184, "T"], ["Craftsma", 90, "T"]];
export const CMS_ROW_H = 35;
export const CmsTable: React.FC<{ plan?: BuildPlan; rowsAt?: number; hoverRow?: number }> = ({ plan = {}, rowsAt, hoverRow }) => (
  <div style={{ flex: 1, background: plan.hold !== undefined ? "transparent" : C.bg, position: "relative", overflow: "hidden", fontFamily: F, color: C.ink }}>
    <B at={plan.head} hold={plan.hold} sk={<SkHead />} style={{ padding: "26px 44px 0 52px", height: 176, background: C.bg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, font: `400 13.500px ${F}` }}>CMS <Chevron c="#8a94a6" /> Home Gallery</div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
        <div style={{ font: `700 26px ${F}`, borderBottom: "1px dashed #8a94a6", paddingBottom: 2 }}>Home Gallery</div>
        <div style={{ flex: 1 }} /><Pill>More Actions <Chevron c={C.blue} r={90} /></Pill><div style={{ width: 12 }} /><Pill solid>+&nbsp; Add Item</Pill>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <div style={{ width: 132, height: 46, borderRadius: 4, border: `2px solid ${C.blue}`, background: "#fff", padding: "5px 10px", font: `500 13.500px ${F}` }}>Default view<div style={{ font: `400 11.500px ${F}`, color: C.muted, marginTop: 3 }}>27 items</div></div>
        <div style={{ width: 117, height: 46, borderRadius: 4, border: "1px solid #d6e1f8", display: "flex", alignItems: "center", justifyContent: "center", color: C.blue, font: `500 13.500px ${F}` }}>+&nbsp; New View</div>
      </div>
    </B>
    <B at={plan.panel} hold={plan.hold} sk={<SkPanel />} style={{ position: "absolute", top: 176, left: 0, right: 0, bottom: 0, background: "#fff" }}>
      <div style={{ height: 62, display: "flex", alignItems: "center", padding: "0 44px 0 46px", gap: 12 }}>
        <div style={{ font: `700 17px ${F}` }}>Default view</div>
        <div style={{ height: 28, padding: "0 12px", borderRadius: 14, border: "1px solid #cfdcfb", display: "flex", alignItems: "center", gap: 8, font: `400 13.500px ${F}` }}><Glyph k={15} c={C.blue} />Table <Chevron c={C.blue} r={90} /></div>
        <div style={{ color: "#a8b0bd", font: `400 14.500px ${F}`, marginLeft: 8 }}>Refresh order</div>
        <div style={{ flex: 1 }} />
        {["Manage Fields", "Sort", "Filter", "Apply Order to Site"].map((x) => <Pill key={x} h={28} px={17}>{x}</Pill>)}
        <div style={{ width: 176, height: 28, borderRadius: 14, border: "1px solid #cfdcfb", display: "flex", alignItems: "center", padding: "0 14px", color: "#8a94a6", font: `400 13.500px ${F}` }}>Search</div>
      </div>
      <div style={{ display: "flex", height: 34, background: C.th, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, font: `400 13.500px ${F}` }}>
        <div style={{ width: 46, borderRight: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 14, height: 14, borderRadius: 3, border: `1.500px solid ${C.blue}`, background: "#fff" }} /></div>
        {COLS.map(([n, w, k]) => <div key={n} style={{ width: w, flexShrink: 0, borderRight: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", whiteSpace: "nowrap", overflow: "hidden" }}>{k && <span style={{ color: C.muted, font: `400 11px ${F}` }}>{k === "I" ? "▣" : "T"}</span>}{n}</div>)}
      </div>
      {(rows as any[]).map((r, i) => {
        const hov = hoverRow === i;
        const cell = (w: number, v: React.ReactNode, key: string) => <div key={key} style={{ width: w, flexShrink: 0, borderRight: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span></div>;
        return (
          <Cascade key={i} at={rowsAt} i={i} style={{ height: CMS_ROW_H }}>
            <div style={{ display: "flex", height: CMS_ROW_H, borderBottom: `1px solid ${C.line}`, font: `400 13.500px ${F}`, background: hov ? "#eef3fe" : "#fff" }}>
              <div style={{ width: 46, borderRight: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, font: `400 12px ${F}` }}>{i + 1}</div>
              <div style={{ width: 148, flexShrink: 0, borderRight: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 12px" }}><div style={{ background: C.pub, color: "#fff", borderRadius: 2, padding: "1px 7px", font: `400 13px ${F}` }}>Published</div></div>
              <div style={{ width: 279, flexShrink: 0, borderRight: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 12px", whiteSpace: "nowrap", overflow: "hidden" }}><span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{r.t}</span>{hov && <div style={{ background: "#2c60de", color: "#fff", borderRadius: 12, padding: "3px 13px", font: `500 12px ${F}` }}>Open</div>}</div>
              {cell(139, r.text, "x")}
              <div style={{ width: 128, flexShrink: 0, borderRight: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 12px" }}><Img src={staticFile(`img/${r.id}.jpg`)} style={{ width: 46, height: 27, objectFit: "cover", borderRadius: 3 }} /></div>
              {cell(176, r.alt, "a")}{cell(188, r.di, "d")}{cell(120, r.slug, "s")}{cell(184, r.cf, "c")}{cell(90, "—", "k")}
            </div>
          </Cascade>
        );
      })}
    </B>
  </div>
);

/** One CMS item open for editing (the real VAANYARD item), from screenshots 6 and 7. */
export const CmsItem: React.FC<{ fieldsAt?: number }> = ({ fieldsAt }) => {
  const field = (label: string, value: string, i: number) => (
    <Cascade at={fieldsAt} i={i} step={0.05} style={{ marginBottom: 26 }}>
      <div style={{ font: `400 13.500px ${F}`, color: "#3a4050", marginBottom: 8 }}>{label}</div>
      <div style={{ height: 36, border: "1px solid #cfdcfb", borderRadius: 4, display: "flex", alignItems: "center", padding: "0 12px", font: `400 15.500px ${F}` }}>{value}</div>
    </Cascade>
  );
  return (
    <div style={{ flex: 1, background: C.bg, position: "relative", overflow: "hidden", fontFamily: F, color: C.ink }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 146, overflow: "hidden", background: "#8d8f99" }}>
        <Img src={staticFile("img/93040a85010a432a98ce5f71e72d30fe.jpg")} style={{ position: "absolute", inset: -80, width: "calc(100% + 160px)", height: "calc(100% + 160px)", objectFit: "cover", filter: "blur(46px) brightness(0.62) saturate(1.2)" }} />
        <div style={{ position: "absolute", left: 152, top: 30, display: "flex", gap: 14, alignItems: "center", color: "#fff", font: `400 13.500px ${F}` }}>CMS <Chevron c="#fff" /> Home Gallery <Chevron c="#fff" /> VAANYARD</div>
        <div style={{ position: "absolute", left: 152, top: 60, display: "flex", gap: 16, alignItems: "center" }}><div style={{ color: "#fff", font: `700 27px ${F}` }}>VAANYARD</div><div style={{ background: C.pub, color: "#fff", borderRadius: 2, padding: "3px 11px", font: `500 13.500px ${F}`, display: "flex", gap: 8, alignItems: "center" }}>Published <Chevron c="#fff" r={90} /></div></div>
        <div style={{ position: "absolute", right: 160, top: 56, display: "flex", gap: 12, alignItems: "center" }}><div style={{ width: 34, height: 34, borderRadius: 17, border: "1px solid #fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", font: `700 12px ${F}` }}>···</div><div style={{ height: 34, padding: "0 22px", borderRadius: 17, border: "1px solid #fff", color: "#fff", font: `500 14.500px ${F}`, display: "flex", alignItems: "center" }}>Cancel</div><div style={{ height: 34, padding: "0 24px", borderRadius: 17, background: "#fff", color: C.blue, font: `500 14.500px ${F}`, display: "flex", alignItems: "center" }}>Save</div></div>
      </div>
      <div style={{ position: "absolute", left: 332, width: 820, top: 112, bottom: 0, background: "#fff", borderRadius: "6px 6px 0 0" }}>
        <div style={{ height: 58, display: "flex", alignItems: "center", padding: "0 22px", borderBottom: `1px solid ${C.line}`, font: `700 17px ${F}` }}>Item content<div style={{ flex: 1 }} /><span style={{ color: C.blue, font: `500 15px ${F}` }}>Manage Fields</span></div>
        <div style={{ padding: "26px 22px 0" }}>
          {field("Title", "VAANYARD", 0)}
          {field("Text", "Bold 41g frames, 300-day aged acetate.", 1)}
          <Cascade at={fieldsAt} i={2} step={0.05} style={{ marginBottom: 26 }}>
            <div style={{ font: `400 13.500px ${F}`, color: "#3a4050", marginBottom: 8 }}>Image</div>
            <Img src={staticFile("img/vaanyard_hero.jpg")} style={{ width: 176, height: 176, objectFit: "cover", borderRadius: 6, display: "block" }} />
          </Cascade>
          {field("Image Alt Text", "Vaanyard bold thick-profile frames in 300-day aged Japanese acetate.", 3)}
          {field("Design Influence", "Sydney independent design, Japanese precision manufacturing.", 4)}
        </div>
      </div>
    </div>
  );
};
/** Where the item's image sits on the dashboard (its centre and size), for the match cut to the site. */
export const ITEM_IMAGE = { x: 238 + 332 + 22 + 88, y: 45 + 112 + 58 + 26 + (21.5 + 36 + 26) * 2 + 21.5 + 88, size: 176 };

/** Invented contacts. Phone numbers are from the ACMA range reserved for fiction. */
export const CONTACTS: [string, string, string, string, string, string][] = [
  ["Harriet Vance", "HV", "#c04b8e", "harriet@vanceandro…", "0491 570 156", "SITE MEMBER"],
  ["Tomas Lindqvist", "TL", "#f2b440", "tomas.lindqvist@nor…", "0491 571 804", ""],
  ["Priya Raman", "PR", "#52addd", "priya@ramanstud…", "0491 572 665", "SITE MEMBER"],
  ["Declan Okafor", "DO", "#6045f0", "declan.okafor@harb…", "0491 574 118", ""],
  ["Mia Castellano", "MC", "#3fb28f", "mia@castella…", "0491 575 254", "SITE MEMBER"],
  ["Jonah Whitfield", "JW", "#e0663c", "jonah@whitfieldbu…", "0491 577 426", ""],
  ["Aroha Tane", "AT", "#c04b8e", "aroha.tane@saltan…", "0491 578 148", "SITE MEMBER"],
];
export const CONTACT_ROW_H = 66;
export const Contacts: React.FC<{ rowsAt?: number; hoverRow?: number; headAt?: number }> = ({ rowsAt, hoverRow, headAt }) => (
  <div style={{ flex: 1, background: C.bg, position: "relative", overflow: "hidden", fontFamily: F, color: C.ink, padding: "30px 60px 0 46px" }}>
    <Cascade at={headAt} i={0}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div><div style={{ font: `700 26px ${F}` }}>Contacts</div><div style={{ font: `400 15px ${F}`, marginTop: 6, color: "#2b3040" }}>Manage and track your customers, leads and site members. <span style={{ color: C.blue }}>Learn more</span></div></div>
        <div style={{ flex: 1 }} /><div style={{ width: 34, height: 34, borderRadius: 17, border: "1px solid #cfdcfb", background: "#fff", color: C.blue, display: "flex", alignItems: "center", justifyContent: "center", font: `700 14px ${F}` }}>···</div><div style={{ width: 12 }} /><Pill>Manage Segments</Pill><div style={{ width: 12 }} /><Pill solid>Create New &nbsp;<Chevron c="#fff" r={90} /></Pill>
      </div>
    </Cascade>
    <Cascade at={headAt} i={2} style={{ marginTop: 18 }}>
      <div style={{ height: 48, background: "#fff", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 24px", font: `600 14.500px ${F}` }}><Glyph k={5} c={C.ink} />&nbsp;&nbsp; 214 site members<div style={{ flex: 1 }} /><span style={{ color: C.blue, fontWeight: 500 }}>View and Manage &nbsp;›</span></div>
    </Cascade>
    <div style={{ marginTop: 22, background: "#fff", borderRadius: 6, overflow: "hidden" }}>
      <Cascade at={headAt} i={4}>
        <div style={{ height: 58, display: "flex", alignItems: "center", padding: "0 22px", gap: 12 }}>
          <div style={{ width: 188, height: 28, borderRadius: 14, border: "1px solid #cfdcfb", display: "flex", alignItems: "center", padding: "0 13px", font: `400 14px ${F}` }}>All contacts<div style={{ flex: 1 }} /><span style={{ color: C.muted }}>(1,286)</span>&nbsp; <Chevron c={C.blue} r={90} /></div>
          <span style={{ color: C.blue, font: `500 14px ${F}` }}>Manage View &nbsp;<Chevron c={C.blue} r={90} /></span><div style={{ flex: 1 }} /><Pill h={28} px={16}>Filter</Pill>
          <div style={{ width: 226, height: 28, borderRadius: 14, border: "1px solid #cfdcfb", display: "flex", alignItems: "center", padding: "0 14px", color: "#8a94a6", font: `400 13.500px ${F}` }}>Search...</div><Pill h={28} px={16}>Import / Export &nbsp;<Chevron c={C.blue} r={90} /></Pill>
        </div>
        <div style={{ height: 38, background: "#f4f6fa", borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", font: `400 13.500px ${F}` }}>
          <div style={{ width: 118, paddingLeft: 22 }}><div style={{ width: 14, height: 14, borderRadius: 3, border: `1.500px solid ${C.blue}`, background: "#fff" }} /></div><div style={{ width: 300 }}>Name</div><div style={{ width: 330 }}>Email</div><div style={{ width: 240 }}>Phone</div><div style={{ width: 230 }}>Member status</div><div>Labels</div>
        </div>
      </Cascade>
      {CONTACTS.map((c, i) => (
        <Cascade key={i} at={rowsAt} i={i} step={0.045} style={{ height: CONTACT_ROW_H }}>
          <div style={{ height: CONTACT_ROW_H, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", background: hoverRow === i ? "#f4f7fe" : "#fff" }}>
            <div style={{ width: 56, paddingLeft: 22 }}><div style={{ width: 14, height: 14, borderRadius: 3, border: `1.500px solid ${C.blue}` }} /></div>
            <div style={{ width: 62 }}><div style={{ width: 34, height: 34, borderRadius: 17, background: c[2], color: "#fff", font: `600 11px ${F}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{c[1]}</div></div>
            <div style={{ width: 300, font: `500 15.500px ${F}` }}>{c[0]}</div>
            <div style={{ width: 330, font: `400 13.500px ${F}` }}>{c[3]}<div style={{ marginTop: 5 }}><span style={{ background: "#f4f5f7", border: "1px solid #e3e6ea", borderRadius: 2, padding: "1px 6px", font: `400 10.500px ${F}`, letterSpacing: "0.02em", color: "#3a4050" }}>NEVER SUBSCRIBED</span></div></div>
            <div style={{ width: 240, font: `400 14px ${F}` }}>{c[4]}</div>
            <div style={{ width: 230 }}>{c[5] && <span style={{ background: "#dff0e3", color: "#2c6a3c", borderRadius: 2, padding: "2px 6px", font: `500 10.500px ${F}`, letterSpacing: "0.03em" }}>{c[5]}</span>}</div>
            <div style={{ flex: 1 }} />{hoverRow === i && <div style={{ background: C.blue, color: "#fff", borderRadius: 17, padding: "7px 22px", font: `500 14px ${F}`, marginRight: 12 }}>View</div>}
            <div style={{ width: 34, height: 34, borderRadius: 17, border: "1px solid #cfdcfb", color: C.blue, display: "flex", alignItems: "center", justifyContent: "center", font: `700 12px ${F}`, marginRight: 26 }}>···</div>
          </div>
        </Cascade>
      ))}
    </div>
  </div>
);

const STATS: [string, string, string][] = [["Site sessions", "4,812", "186 today"], ["Form submissions", "96", "7 today"], ["Unique visitors", "3,274", "141 today"], ["Clicks to contact", "412", "19 today"]];
const grow = (v: string, u: number) => { const n = Number(v.replace(/,/g, "")); return Math.round(n * (0.62 + 0.38 * u)).toLocaleString("en-AU"); };
const Spark: React.FC<{ u: number; seed: number }> = ({ u, seed }) => {
  const pts = Array.from({ length: 14 }, (_, i) => [i * 7, 20 - (4 + 13 * (0.5 + 0.5 * Math.sin(i * 1.3 + seed)) * (0.35 + 0.65 * i / 13))]);
  const n = Math.max(2, Math.round(pts.length * (0.25 + 0.75 * u)));
  return <svg width="92" height="24" viewBox="0 0 92 24"><polyline points={pts.slice(0, n).map((p) => p.join(",")).join(" ")} fill="none" stroke={C.blue} strokeWidth="1.600" strokeLinejoin="round" strokeLinecap="round" /></svg>;
};
export const HomePage: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <div style={{ flex: 1, background: C.bg, position: "relative", overflow: "hidden", fontFamily: F, color: C.ink, padding: "26px 232px 0 222px" }}>
    <div style={{ display: "flex", alignItems: "center" }}><div style={{ font: `700 28px ${F}` }}>Welcome back, Paul</div><div style={{ flex: 1 }} /><Pill>More Actions</Pill><div style={{ width: 12 }} /><Pill>View Live Site</Pill><div style={{ width: 12 }} /><Pill solid>Edit Site &nbsp;<Chevron c="#fff" r={90} /></Pill></div>
    <div style={{ marginTop: 26, background: "#fff", borderRadius: 6 }}>
      <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 22px", borderBottom: `1px solid ${C.line}`, font: `700 17px ${F}` }}>Analytics<div style={{ flex: 1 }} /><span style={{ color: C.blue, font: `500 13px ${F}` }}>View Your Site Analytics</span></div>
      <div style={{ padding: "18px 22px 26px" }}>
        <div style={{ font: `400 14px ${F}` }}>Your key stats for the <span style={{ color: C.blue }}>last 30 days</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 14 }}>
          {STATS.map((s, i) => <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 4, padding: "10px 12px", height: 76 }}><div style={{ font: `500 12px ${F}` }}>{s[0]}</div><div style={{ display: "flex", alignItems: "flex-end" }}><div style={{ font: `700 19px ${F}`, marginTop: 5, flex: 1, fontVariantNumeric: "tabular-nums" }}>{grow(s[1], count)}</div><Spark u={count} seed={i * 1.7} /></div><div style={{ font: `400 11.500px ${F}`, marginTop: 5, color: "#3a4050" }}>{s[2]}</div></div>)}
        </div>
      </div>
    </div>
    <div style={{ marginTop: 22, background: "#fff", borderRadius: 6, height: 400, padding: "20px 22px" }}><div style={{ font: `700 17px ${F}` }}>Activity feed</div><div style={{ font: `400 12px ${F}`, marginTop: 4 }}>Your most recent updates.</div></div>
  </div>
);

/** A plain arrow pointer, placed in dashboard pixels. */
export const Arrow: React.FC<{ x: number; y: number; press?: number }> = ({ x, y, press = 0 }) => (
  <svg width="22" height="30" viewBox="0 0 22 30" style={{ position: "absolute", left: x, top: y, zIndex: 40, transformOrigin: "2px 2px", transform: `scale(${1 - 0.14 * press})`, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }}>
    <path d="M2 2v22.500l5.600-5.200 3.700 8.500 3.600-1.600-3.700-8.300h7.800z" fill="#111" stroke="#fff" strokeWidth="1.600" strokeLinejoin="round" />
  </svg>
);

/** The marketing menu that opens beside the sidebar. */
export const Flyout: React.FC<{ at: number; active?: number; activeAmt?: number }> = ({ at, active, activeAmt = 1 }) => {
  const t = useT();
  if (t < at) return null;
  const u = easeOut(seg(t, at, at + 0.2));
  const h = FLYOUT.length * 38 + 28;
  return (
    <div style={{ position: "absolute", left: SIDE + 8, top: navY("Marketing") + ITEM_H / 2 - (14 + 38 * 4.5), width: 300, height: h, borderRadius: 10, background: C.sub, boxShadow: "0 18px 50px rgba(0,0,0,0.45)", padding: "14px 0", transformOrigin: "0% 50%", transform: `scale(${lerp(0.86, 1, u)})`, opacity: seg(t, at, at + 0.07), zIndex: 20 }}>
      {FLYOUT.map((x, i) => {
        const a = at + 0.05 + i * 0.03;
        const v = easeOut(seg(t, a, a + 0.2));
        return <div key={x} style={{ height: 38, display: "flex", alignItems: "center", paddingLeft: 34, color: C.side, font: `400 15px ${F}`, opacity: v, transform: `translateX(${lerp(-10, 0, v)}px)`, background: active === i ? `rgba(44,46,53,${activeAmt})` : "transparent" }}>{x}</div>;
      })}
    </div>
  );
};

export const Dash: React.FC<{ page: React.ReactNode; active?: string; sub?: string; open?: string; hover?: { label: string; amt: number }; plan?: BuildPlan; overlay?: React.ReactNode }> = ({ page, active, sub, open, hover, plan = {}, overlay }) => (
  <div style={{ width: DW, height: DH, position: "relative", background: plan.hold !== undefined ? "#0d0f14" : C.bg, overflow: "hidden" }}>
    <B at={plan.top} hold={plan.hold} sk={<SkTop />} style={{ position: "relative", zIndex: 3 }}><TopBar /></B>
    <div style={{ display: "flex", height: DH - TOP }}>
      <B at={plan.side} hold={plan.hold} sk={<SkSide />} style={{ height: DH - TOP }}><Sidebar active={active} sub={sub} open={open} hover={hover} reveal={plan.side !== undefined ? plan.hold : undefined} /></B>
      {page}
    </div>
    {overlay}
  </div>
);
