// Kleine deterministische tijdlijn: render(t) zet alle stijlen voor tijdstip t (seconden).
const cl = x => Math.max(0, Math.min(1, x));
const P = (t, a, b) => cl((t - a) / (b - a));
const eo = x => 1 - Math.pow(1 - x, 3);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const eb = x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const lerp = (a, b, x) => a + (b - a) * x;
const $ = id => document.getElementById(id);

// zet transform/opacity van element
function S(el, { x = 0, y = 0, s = 1, r = 0, o = 1, sx, sy } = {}) {
  if (typeof el === 'string') el = $(el);
  if (!el) return;
  const scx = sx ?? s, scy = sy ?? s;
  el.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${scx},${scy})`;
  el.style.opacity = o;
}
// in-uit venster: 0..1 voor in, 1, dan 1..0 voor uit
function win(t, a, b, c, d) { return Math.min(P(t, a, b), 1 - P(t, c, d)); }

// pop-in van woorden in een kop: elk .w-element krijgt een eigen vertraging
function words(id, t, start, step = 0.09, dur = 0.45, out0 = 99, out1 = 100) {
  const el = $(id); if (!el) return;
  const ws = el.querySelectorAll('.w');
  ws.forEach((w, i) => {
    const k = P(t, start + i * step, start + i * step + dur);
    const ko = P(t, out0 + i * 0.04, out1 + i * 0.04);
    S(w, { y: lerp(90, 0, eo(k)) - ko * 60, s: lerp(.6, 1, eb(k)), o: Math.min(k * 1.6, 1) * (1 - ko) });
  });
}

// zachte zwevende achtergrondbollen
function blobs(t) {
  document.querySelectorAll('.blob').forEach((b, i) => {
    const ph = i * 1.7;
    S(b, { x: Math.sin(t * .6 + ph) * 40, y: Math.cos(t * .5 + ph) * 50, s: 1 + Math.sin(t * .8 + ph) * .05 });
  });
}

// confetti / sparkles, deterministisch uit seed
function makeParticles(n, colors, seed = 1, before = null) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const host = $('stage'); const arr = [];
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div'); d.className = 'a';
    const sz = 14 + rnd() * 22, round = rnd() > .5;
    Object.assign(d.style, { left: '540px', top: '900px', width: sz + 'px', height: (round ? sz : sz * .45) + 'px', borderRadius: round ? '50%' : '4px', background: colors[i % colors.length], opacity: 0 });
    before ? host.insertBefore(d, $(before)) : host.appendChild(d);
    arr.push({ d, ang: rnd() * Math.PI * 2, sp: 500 + rnd() * 700, rot: rnd() * 720 - 360, delay: rnd() * .15 });
  }
  return arr;
}
function burst(arr, t, t0, cx, cy, life = 1.6) {
  arr.forEach(p => {
    const k = (t - t0 - p.delay) / life;
    if (k < 0 || k > 1) { p.d.style.opacity = 0; return; }
    const e = eo(k);
    const x = cx - 540 + Math.cos(p.ang) * p.sp * e, y = cy - 900 + Math.sin(p.ang) * p.sp * e + 700 * k * k;
    S(p.d, { x, y, r: p.rot * k, o: 1 - P(k, .65, 1) });
  });
}

// eindkaart, gedeeld door alle video's
function endCardHTML(line1, line2) {
  return `
  <div id="ec" class="a" style="inset:0;background:var(--ink)"></div>
  <div id="ecN" class="a" style="left:250px;top:560px;width:300px;height:300px;border-radius:50%;overflow:hidden;border:10px solid #fff">${SVG.noahHead2}</div>
  <div id="ecE" class="a" style="left:530px;top:560px;width:300px;height:300px;border-radius:50%;overflow:hidden;border:10px solid #fff">${SVG.emmaHead2}</div>
  <div id="ecL" class="a logo" style="top:930px;color:#fff;font-size:120px">Noah <span>&amp;</span> Emma</div>
  <div id="ecT" class="a h" style="top:1070px;color:#fff;font-size:60px;font-weight:700;padding:0 110px;line-height:1.15">${line1}</div>
  <div id="ecC" class="a" style="left:0;right:0;top:1260px;text-align:center"><span class="pill" style="background:var(--pink);font-size:60px">${line2}</span></div>
  <div id="ecF" class="a" style="left:0;right:0;top:1420px;text-align:center;font:600 42px Inter;color:#E9DDF0">Gratis account · gratis kopen en verkopen</div>`;
}
function endCard(t, t0) {
  const k = P(t, t0, t0 + .5);
  // cirkel-reveal vanuit het midden
  $('ec').style.clipPath = `circle(${eio(k) * 1200}px at 540px 960px)`;
  $('ec').style.opacity = k > 0 ? 1 : 0;
  const a = P(t, t0 + .3, t0 + .8), b = P(t, t0 + .4, t0 + .9);
  S('ecN', { s: eb(a), r: lerp(-30, -6, eo(a)) + Math.sin((t - t0) * 3) * 3, o: a > 0 ? 1 : 0 });
  S('ecE', { s: eb(b), r: lerp(30, 6, eo(b)) - Math.sin((t - t0) * 3) * 3, o: b > 0 ? 1 : 0 });
  const c = P(t, t0 + .6, t0 + 1.05); S('ecL', { y: lerp(60, 0, eo(c)), o: c });
  const d = P(t, t0 + .8, t0 + 1.25); S('ecT', { y: lerp(60, 0, eo(d)), o: d });
  const e = P(t, t0 + 1.0, t0 + 1.5); const pulse = 1 + Math.max(0, Math.sin((t - t0 - 1.5) * 5)) * .04 * (t > t0 + 1.5 ? 1 : 0);
  S('ecC', { s: eb(e) * pulse, o: e > 0 ? 1 : 0 });
  const f = P(t, t0 + 1.2, t0 + 1.6); S('ecF', { y: lerp(40, 0, eo(f)), o: f });
}

// simpel shirt-icoon (kledingstuk)
function shirtSVG(c, c2, deco = '') {
  return `<svg viewBox="0 0 200 200" style="width:100%;height:100%;display:block"><path d="M70 30 Q100 52 130 30 L178 56 L160 98 L140 88 L140 178 Q100 186 60 178 L60 88 L40 98 L22 56 Z" fill="${c}" stroke="${c2}" stroke-width="5" stroke-linejoin="round"/><path d="M70 30 Q100 52 130 30" fill="none" stroke="${c2}" stroke-width="5"/>${deco}</svg>`;
}
const star = (x, y, r, c) => { let p = ''; for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .45 : r; p += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ' ' + (y + Math.sin(a) * rr).toFixed(1); } return `<path d="${p}Z" fill="${c}"/>`; };

// kindergoed-iconen (eigen tekeningen, 200x200)
const ICON = {
  wagen: (c = '#1C7FA8', c2 = '#14607F') => `<svg viewBox="0 0 200 200" style="width:100%;height:100%;display:block"><path d="M40 70 Q40 40 75 40 L100 40 L100 100 L170 100 Q170 140 125 140 L80 140 Q40 140 40 100 Z" fill="${c}" stroke="${c2}" stroke-width="6" stroke-linejoin="round"/><path d="M100 40 Q150 40 165 95 L100 100 Z" fill="#fff" stroke="${c2}" stroke-width="6" stroke-linejoin="round"/><path d="M170 100 L185 60" stroke="#241A2E" stroke-width="8" stroke-linecap="round"/><circle cx="70" cy="165" r="18" fill="#241A2E"/><circle cx="70" cy="165" r="7" fill="#fff"/><circle cx="140" cy="165" r="18" fill="#241A2E"/><circle cx="140" cy="165" r="7" fill="#fff"/></svg>`,
  stoel: (c = '#D63D74', c2 = '#A82C59') => `<svg viewBox="0 0 200 200" style="width:100%;height:100%;display:block"><path d="M38 112 Q100 0 162 112" fill="none" stroke="#241A2E" stroke-width="12" stroke-linecap="round"/><path d="M22 105 Q22 172 100 172 Q178 172 178 105 Z" fill="${c}" stroke="${c2}" stroke-width="6" stroke-linejoin="round"/><path d="M52 110 Q56 150 100 152 Q144 150 148 110 Z" fill="#FFEAF1"/><rect x="40" y="172" width="120" height="12" rx="6" fill="#241A2E"/></svg>`,
  beer: (c = '#C98B55', c2 = '#9A6436') => `<svg viewBox="0 0 200 200" style="width:100%;height:100%;display:block"><circle cx="62" cy="48" r="20" fill="${c}" stroke="${c2}" stroke-width="5"/><circle cx="138" cy="48" r="20" fill="${c}" stroke="${c2}" stroke-width="5"/><ellipse cx="100" cy="140" rx="55" ry="48" fill="${c}" stroke="${c2}" stroke-width="5"/><circle cx="100" cy="75" r="45" fill="${c}" stroke="${c2}" stroke-width="5"/><ellipse cx="100" cy="90" rx="18" ry="13" fill="#F3D3B1"/><circle cx="100" cy="85" r="6" fill="#241A2E"/><circle cx="83" cy="68" r="5" fill="#241A2E"/><circle cx="117" cy="68" r="5" fill="#241A2E"/><ellipse cx="100" cy="145" rx="28" ry="24" fill="#F3D3B1"/><path d="M80 112 L100 124 L120 112 L120 132 L100 124 L80 132 Z" fill="#D63D74"/></svg>`,
  bed: (c = '#FFD166', c2 = '#D9A21B') => `<svg viewBox="0 0 200 200" style="width:100%;height:100%;display:block"><rect x="25" y="60" width="150" height="90" rx="12" fill="none" stroke="${c2}" stroke-width="8"/>${[50, 75, 100, 125, 150].map(x => `<line x1="${x}" y1="64" x2="${x}" y2="146" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`).join('')}<rect x="25" y="118" width="150" height="26" rx="8" fill="#FFEAF1" stroke="${c2}" stroke-width="4"/><line x1="25" y1="40" x2="25" y2="175" stroke="${c2}" stroke-width="10" stroke-linecap="round"/><line x1="175" y1="40" x2="175" y2="175" stroke="${c2}" stroke-width="10" stroke-linecap="round"/></svg>`,
  stoeltje: (c = '#8FD3B6', c2 = '#3E9C74') => `<svg viewBox="0 0 200 200" style="width:100%;height:100%;display:block"><rect x="60" y="25" width="80" height="70" rx="16" fill="${c}" stroke="${c2}" stroke-width="6"/><rect x="45" y="95" width="110" height="22" rx="8" fill="${c}" stroke="${c2}" stroke-width="6"/><path d="M60 117 L40 185 M140 117 L160 185 M58 160 L142 160" stroke="${c2}" stroke-width="9" stroke-linecap="round"/></svg>`
};
