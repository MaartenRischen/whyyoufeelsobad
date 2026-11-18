/* util.js - small helpers. Everything is deterministic: a seeded PRNG, no clocks. */
const NS = "http://www.w3.org/2000/svg";
const W = 1080, H = 1350;

function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, u) => a + (b - a) * u;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const ss = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const sat = (x) => clamp(x, 0, 1);
const sin = Math.sin, cos = Math.cos, PI = Math.PI;
const f1 = (x) => (Math.round(x * 10) / 10);

/* svg string -> <g> element appended to parent */
function G(str, parent, cls) {
  const tmp = document.createElementNS(NS, "svg");
  tmp.innerHTML = "<g>" + str + "</g>";
  const g = tmp.firstChild;
  if (cls) g.setAttribute("class", cls);
  if (parent) parent.appendChild(g);
  return g;
}
const q = (el, sel) => el.querySelector(sel);
const qa = (el, sel) => Array.from(el.querySelectorAll(sel));
/* set an attribute only when it changed */
function SA(el, k, v) { const c = el._c || (el._c = {}); if (c[k] === v) return; c[k] = v; el.setAttribute(k, v); }
function TR(el, str) { SA(el, "transform", str); }
function OP(el, v) { SA(el, "opacity", Math.round(v * 100) / 100); }
/* place: translate, rotate, scale (sx may carry a flip) */
function place(el, x, y, r, sx, sy) {
  SA(el, "transform",
    "translate(" + f1(x) + " " + f1(y) + ") rotate(" + f1(r || 0) + ") scale(" +
    (sx === undefined ? 1 : Math.round(sx * 1000) / 1000) + " " + (sy === undefined ? (sx === undefined ? 1 : Math.abs(sx)) : Math.round(sy * 1000) / 1000) + ")");
}
function rot(el, a, px, py) { SA(el, "transform", "rotate(" + f1(a) + " " + px + " " + py + ")"); }

/* brass split pin */
function brad(x, y, r) {
  r = r || 4;
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="f-brass"/><circle cx="' + (x - r * 0.25) + '" cy="' + (y - r * 0.25) + '" r="' + r * 0.42 + '" class="f-brass2"/>';
}

/* palette: [day, night]. Night values are derived unless given. */
const PAL = {};
function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
function pal(name, day, night, lit) {
  const d = hex(day);
  let n;
  if (night) n = hex(night);
  else {
    const k = lit === undefined ? 1 : lit;
    n = [d[0] * 0.34 * k + 8, d[1] * 0.42 * k + 14, d[2] * 0.66 * k + 34];
  }
  PAL[name] = [d, n];
}
function palCSS() {
  let s = "";
  for (const k in PAL) s += ".f-" + k + "{fill:var(--" + k + ")}.s-" + k + "{stroke:var(--" + k + ")}";
  return s;
}
/* PALM: the colours of what stands in the light of the fire or the lamp (the people). They take
   their own night value m, so a face by the fire is not as dark as the meadow behind it. */
const PALM = new Set();
let _lastN = "";
function palApply(n, m) {
  n = Math.round(n * 200) / 200;
  m = m === undefined ? n : Math.round(m * 200) / 200;
  const key = n + "|" + m;
  if (key === _lastN) return;
  _lastN = key;
  const st = document.documentElement.style;
  for (const k in PAL) {
    const d = PAL[k][0], q_ = PAL[k][1], u = PALM.has(k) ? m : n;
    st.setProperty("--" + k, "rgb(" + Math.round(lerp(d[0], q_[0], u)) + "," + Math.round(lerp(d[1], q_[1], u)) + "," + Math.round(lerp(d[2], q_[2], u)) + ")");
  }
}

/* procedural hit pulses: list of hit times -> (reach 0..1, time since last hit) */
function hitReach(t, hits, lead, back) {
  let r = 0;
  for (let i = 0; i < hits.length; i++) {
    const h = hits[i];
    const L = Math.min(lead, i > 0 ? (h - hits[i - 1]) * 0.62 : lead);
    const B = Math.min(back, i + 1 < hits.length ? (hits[i + 1] - h) * 0.38 : back);
    if (t >= h - L && t <= h) { const u = (t - (h - L)) / L; r = Math.max(r, u * u * u); }
    else if (t > h && t < h + B) { const u = (t - h) / B; r = Math.max(r, (1 - u) * (1 - u)); }
  }
  return r;
}
function lastHit(t, hits) {
  let b = -1;
  for (let i = 0; i < hits.length; i++) if (hits[i] <= t) b = i;
  return b;
}
/* damped wobble summed over hits */
function wobble(t, hits, amp, freq, decay) {
  let v = 0;
  for (let i = 0; i < hits.length; i++) {
    const d = t - hits[i];
    if (d >= 0 && d < 3) v += amp * Math.exp(-decay * d) * Math.sin(freq * d);
  }
  return v;
}

/* ---- life: smooth noise, blinks ---- */
function hash1(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function noise(x, seed) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f), o = (seed || 0) * 57.31; return lerp(hash1(i + o), hash1(i + 1 + o), u) * 2 - 1; }
/* 0..1, 1 = lid down. One blink about every `per` seconds, now and then a double one. */
function blink(t, seed, per) {
  per = per || 2.7;
  const k = Math.floor(t / per);
  let v = 0;
  for (let j = k - 1; j <= k; j++) {
    const h = hash1(j * 1.73 + seed * 9.1), bt = (j + 0.12 + 0.76 * h) * per;
    for (let m = 0; m < (h > 0.72 ? 2 : 1); m++) {
      const d = t - bt - m * 0.26;
      if (d >= 0 && d < 0.17) v = Math.max(v, d < 0.055 ? d / 0.055 : 1 - (d - 0.055) / 0.115);
    }
  }
  return v;
}
/* two-bone leg: pivot p, foot target, lengths; returns [angle of bone 1, angle of bone 2 relative to it] in degrees */
function ik2(px, py, tx, ty, l1, l2, bend) {
  let dx = tx - px, dy = ty - py, d = Math.hypot(dx, dy);
  d = clamp(d, Math.abs(l1 - l2) + 0.5, l1 + l2 - 0.5);
  const phi = Math.atan2(dy, dx);
  const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const b = Math.acos(clamp((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2), -1, 1));
  return [(phi - bend * a) * 57.2958, bend * (PI - b) * 57.2958];
}

/* ---- bake: the timeline is stepped once at load, a few numbers are stored per frame, and
   follow-through (speed, lag, springs) is worked out from them. Still seek-safe: draw(t) only reads. ---- */
const Bake = {
  n: 0, fps: 30, T: {}, defs: [],
  def(name, fn) { this.defs.push([name, fn]); },
  run(end, fps, seek) {
    this.fps = fps; this.n = Math.round(end * fps) + 2;
    for (const d of this.defs) this.T[d[0]] = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) { const t = i / fps; seek(t); for (const d of this.defs) this.T[d[0]][i] = d[1](t); }
  },
  at(name, t) { const a = this.T[name], x = clamp(t * this.fps, 0, this.n - 1), i = Math.floor(x), f = x - i; return i + 1 < this.n ? a[i] + (a[i + 1] - a[i]) * f : a[i]; },
  vel(src, out) { const a = this.T[src], o = new Float32Array(this.n); for (let i = 0; i < this.n; i++) o[i] = (a[Math.min(i + 1, this.n - 1)] - a[Math.max(i - 1, 0)]) * this.fps / 2; this.T[out] = o; },
  map(out, fn) { const o = new Float32Array(this.n); for (let i = 0; i < this.n; i++) o[i] = fn(i); this.T[out] = o; },
  integ(src, out) { const a = this.T[src], o = new Float32Array(this.n); for (let i = 1; i < this.n; i++) o[i] = o[i - 1] + a[i] / this.fps; this.T[out] = o; },
  /* a mass on a spring that chases the source */
  spring(src, out, k, c) {
    const a = this.T[src], o = new Float32Array(this.n);
    let x = a[0], v = 0;
    const sub = 6, dt = 1 / this.fps / sub;
    for (let i = 0; i < this.n; i++) { for (let s = 0; s < sub; s++) { v += (k * (a[i] - x) - c * v) * dt; x += v * dt; } o[i] = x; }
    this.T[out] = o;
  },
};
