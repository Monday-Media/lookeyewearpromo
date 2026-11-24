import React from "react";
import { useCurrentFrame } from "remotion";
import "@fontsource/funnel-display/300.css";
import "@fontsource/funnel-display/400.css";
import "@fontsource/funnel-display/500.css";
import "@fontsource/funnel-display/600.css";
import "@fontsource/wix-madefor-text/400.css";
import "@fontsource/wix-madefor-text/500.css";
import "@fontsource/wix-madefor-text/600.css";
import "@fontsource/wix-madefor-text/700.css";

/** The film runs at 25 fps (Paul's Premiere sequence). Everything is written in film seconds. */
export const FPS = 25;
export const W = 1920;
export const H = 1080;
export const LENGTH = 32.44;
/** Monday Media logo colours, used to tint elements as they build. */
export const MM_RED = "#ee1d45";
export const MM_BLUE = "#38c3dc";

/** Film time in seconds. Fractional frames are fine: nothing here indexes by whole frames. */
export const useT = () => useCurrentFrame() / FPS;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
/** Fast start, long soft landing (the site's own signature curve, cubic-bezier(0.16, 1, 0.3, 1), near enough). */
export const easeOut = (u: number) => 1 - Math.pow(1 - clamp01(u), 4);
/** Slow start that keeps accelerating: the move out of a shot. */
export const easeIn = (u: number) => Math.pow(clamp01(u), 3);
export const easeInOut = (u: number) => { const x = clamp01(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

export type Cam = { s?: number; x?: number; y?: number; r?: number };
/**
 * The camera for one shot. A shot decelerates in from `from`, sits on `hold` with a slow drift, then accelerates out
 * to `to`, so a hard cut lands at peak speed on both sides (the references' "fast out, fast in").
 */
export const shotCam = (t: number, a: number, b: number, o: { from?: Cam; hold?: Cam; to?: Cam; inDur?: number; outDur?: number; drift?: Cam }) => {
  const hold = { s: 1, x: 0, y: 0, r: 0, ...(o.hold || {}) };
  const from = { ...hold, ...(o.from || {}) };
  const to = { ...hold, ...(o.to || {}) };
  const drift = { s: 0, x: 0, y: 0, r: 0, ...(o.drift || {}) };
  const ui = easeOut(seg(t, a, a + (o.inDur ?? 0.36)));
  const uo = easeIn(seg(t, b - (o.outDur ?? 0.3), b));
  const d = t - a;
  const k = (key: "s" | "x" | "y" | "r") => lerp(lerp(from[key]!, hold[key]!, ui), to[key]!, uo) + (key === "s" ? 0 : drift[key]! * d);
  return { s: k("s") * (1 + drift.s! * d), x: k("x"), y: k("y"), r: k("r") };
};
export const camCss = (c: Cam, origin = "50% 50%"): React.CSSProperties => ({
  transform: `translate(${c.x || 0}px, ${c.y || 0}px) rotate(${c.r || 0}deg) scale(${c.s || 1})`,
  transformOrigin: origin,
});

/** Hard-cut shot: its children exist only between a and b. */
export const Shot: React.FC<{ a: number; b: number; children: React.ReactNode; bg?: string }> = ({ a, b, children, bg }) => {
  const t = useT();
  if (t < a || t >= b) return null;
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: bg }}>{children}</div>;
};

/**
 * An element that builds: it arrives at `at` blurred, tinted and slightly large, then sharpens and settles.
 * `hold` keeps it as a blurred tinted block until that time (the stutter build), then it resolves.
 */
export const Build: React.FC<{ at: number; hold?: number; dur?: number; tint?: string; blur?: number; style?: React.CSSProperties; children: React.ReactNode; radius?: number }> = ({ at, hold, dur = 0.34, tint = MM_BLUE, blur = 22, style, children, radius = 0 }) => {
  const t = useT();
  if (t < at) return <div style={{ ...style, visibility: "hidden" }}>{children}</div>;
  const pop = easeOut(seg(t, at, at + 0.18));
  const res = easeOut(seg(t, hold ?? at, (hold ?? at) + dur));
  const b = blur * (1 - res);
  const other = tint === MM_RED ? "#ff8a5c" : "#7b8cff";
  return (
    <div style={{ ...style, position: style?.position || "relative", transform: `${style?.transform || ""} scale(${lerp(1.06, 1, pop)})`, opacity: lerp(0, 1, seg(t, at, at + 0.05)) }}>
      <div style={{ filter: b > 0.2 ? `blur(${b}px) saturate(${1 + 0.8 * (1 - res)})` : undefined, height: "100%" }}>{children}</div>
      {res < 1 && <div style={{ position: "absolute", inset: 0, borderRadius: radius, background: `linear-gradient(125deg, ${tint} 0%, ${other} 55%, ${tint === MM_RED ? MM_BLUE : MM_RED} 130%)`, opacity: 0.62 * (1 - res), filter: `blur(${10 * (1 - res)}px)`, pointerEvents: "none" }} />}
    </div>
  );
};
