// Rendert een carrousel-pagina (window.N slides, window.render(i)) naar losse JPG-banners
// en maakt er een swipe-video van met geluid.
// Gebruik: node carrousel.js <pagina.html> <uitmap>
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path'), fs = require('fs');
(async () => {
  const [, , file, out] = process.argv;
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(file));
  await p.evaluate(() => document.fonts.ready);
  const n = await p.evaluate(() => window.N);
  const slides = [];
  for (let i = 0; i < n; i++) {
    await p.evaluate(i => window.render(i), i);
    const f = path.join(out, `slide-${i + 1}.jpg`);
    await p.screenshot({ path: f, type: 'jpeg', quality: 92 });
    slides.push(f);
  }
  await b.close();
  // swipe-video: elke slide 2,4 s, slide-overgang van 0,35 s
  const D = 2.4, T = 0.35;
  const inputs = slides.flatMap(f => ['-loop', '1', '-t', String(D + T), '-i', f]);
  let chain = '', last = '[0:v]';
  for (let i = 1; i < n; i++) {
    const o = i === n - 1 ? ',format=yuv420p[v]' : `[x${i}]`;
    chain += `${last}[${i}:v]xfade=transition=slideleft:duration=${T}:offset=${(i * D).toFixed(2)}${o};`;
    last = `[x${i}]`;
  }
  const dur = n * D + T;
  const stil = path.join(out, 'stil.mp4');
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', chain.slice(0, -1),'-map', '[v]', '-r', '30', '-t', String(dur), '-c:v', 'libx264', '-crf', '18', stil]);
  const ev = [['pop', 0.2, 1.0]];
  for (let i = 1; i < n; i++) ev.push(['whoosh', i * D - 0.05], ['pop', i * D + 0.3, 0.9 + 0.08 * i]);
  ev.push(['ding', (n - 1) * D + 0.6]);
  const evf = path.join(out, 'events.json'); fs.writeFileSync(evf, JSON.stringify(ev));
  const wav = path.join(out, 'geluid.wav');
  execFileSync('python3', [path.join(__dirname, 'audio.py'), evf, String(dur), wav]);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', stil, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(out, 'video.mp4')]);
  fs.unlinkSync(stil); fs.unlinkSync(wav);
  console.log(JSON.stringify({ slides: slides.length, duur: dur }));
})();
