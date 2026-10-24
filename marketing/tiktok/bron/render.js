const {chromium}=require('playwright');const {spawn}=require('child_process');const path=require('path');
(async()=>{const [,,file,out,stills='']=process.argv;const fps=30;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.resolve(file));await p.evaluate(()=>document.fonts.ready);
const dur=await p.evaluate(()=>window.DUR);const n=Math.round(dur*fps);
if(out.endsWith('.mp4')){
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',''+fps,'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','12','-preset','slow','-tune','animation','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
for(let i=0;i<n;i++){await p.evaluate(t=>window.render(t),i/fps);ff.stdin.write(await p.screenshot({type:'png'}));}
ff.stdin.end();await new Promise(r=>ff.on('close',r));}
for(const s of stills.split(',').filter(Boolean)){await p.evaluate(t=>window.render(t),+s);await p.screenshot({path:`${out.replace(/\.mp4$/,'')}-t${s}.png`});}
await b.close();})();
