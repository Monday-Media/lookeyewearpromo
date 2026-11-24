import React from "react";
import { Img, staticFile } from "remotion";

/** Full-frame photo behind a wide shot. */
export const Backdrop: React.FC<{ src: string; scale?: number; x?: number; y?: number; dim?: number; blur?: number }> = ({ src, scale = 1.08, x = 0, y = 0, dim = 0.18, blur = 3 }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#0c0d0c" }}>
    <Img src={staticFile(src)} style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", transform: `translate(${x}px, ${y}px) scale(${scale})`, filter: `blur(${blur}px)` }} />
    <div style={{ position: "absolute", inset: 0, background: `rgba(8,9,8,${dim})` }} />
  </div>
);

/** A browser window drawn in code: light chrome, padlock and address. */
export const BrowserWindow: React.FC<{ w: number; h: number; url: string; children: React.ReactNode; dark?: boolean; lockOpen?: number }> = ({ w, h, url, children, dark, lockOpen = 0 }) => {
  const bar = 44;
  const chrome = dark ? "#1d1f24" : "#eceae5";
  const ink = dark ? "rgba(255,255,255,0.72)" : "rgba(17,17,17,0.62)";
  return (
    <div style={{ width: w, height: h + bar, borderRadius: 14, overflow: "hidden", boxShadow: "0 60px 140px rgba(0,0,0,0.55), 0 12px 32px rgba(0,0,0,0.35)", background: chrome }}>
      <div style={{ height: bar, display: "flex", alignItems: "center", padding: "0 16px", gap: 8, position: "relative" }}>
        {["#ee6a5f", "#f5bd4f", "#61c454"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 420, height: 28, borderRadius: 8, background: dark ? "rgba(255,255,255,0.08)" : "rgba(17,17,17,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, font: "500 13px 'Wix Madefor Text', system-ui", color: ink }}>
          <svg width="11" height="13" viewBox="0 0 11 13" style={{ overflow: "visible" }}><rect x="0.5" y="5.5" width="10" height="7" rx="1.6" fill={ink} /><path d="M2.8 5.5V3.6a2.7 2.7 0 0 1 5.4 0v1.9" stroke={ink} strokeWidth="1.4" fill="none" style={{ transformOrigin: "8.2px 5.5px", transform: `translateY(${-1.6 * lockOpen}px) rotate(${28 * lockOpen}deg)` }} /></svg>
          {url}
        </div>
      </div>
      <div style={{ width: w, height: h, position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
};
