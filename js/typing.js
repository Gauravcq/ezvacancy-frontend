const TEXTS = {
  en: [
    "Government jobs offer stability, growth and a chance to serve the nation.",
    "Practice typing daily to improve accuracy, speed and confidence.",
    "Read instructions carefully before submitting applications online."
  ],
  hi: [
    "सरकारी नौकरी स्थिरता और सेवा का अवसर देती है।",
    "दैनिक टाइपिंग अभ्यास से सटीकता और गति बढ़ती है।",
    "आवेदन भरने से पहले निर्देश ध्यान से पढ़ें।"
  ]
};
const els = {
  text: document.getElementById('text'),
  timeLeft: document.getElementById('timeLeft'),
  wpm: document.getElementById('wpm'),
  acc: document.getElementById('acc'),
  errors: document.getElementById('errors'),
  mode: document.getElementById('mode'),
  lang: document.getElementById('lang'),
  examMode: document.getElementById('examMode'),
  restart: document.getElementById('restartBtn'),
  input: document.getElementById('hiddenInput'),
  history: document.getElementById('history')
};
let state, chart;
const beep = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=');

function newText() {
  const lang = els.lang.value;
  const base = TEXTS[lang][Math.floor(Math.random()*TEXTS[lang].length)];
  const mode = els.mode.value;
  if (mode.startsWith('words')) {
    const words = base.split(/\s+/);
    const target = parseInt(mode.split('-')[1],10);
    return Array.from({length:target},()=>words[Math.floor(Math.random()*words.length)]).join(' ');
  }
  return base;
}
function init(){
  state={started:false,finished:false,text:newText(),chars:[],index:0,correct:0,errors:0,startTime:0,timeLimit: els.mode.value.startsWith('time')?parseInt(els.mode.value.split('-')[1],10):null,timer:null,wpmSeries:[]};
  els.text.innerHTML = renderText(state.text,0);
  els.errors.textContent='0'; els.wpm.textContent='0'; els.acc.textContent='100%'; els.timeLeft.textContent=state.timeLimit??'∞';
  els.input.value=''; els.input.focus();
  buildChart();
}
function renderText(text,index){ return text.split('').map((ch,i)=>`<span class="${i<index?(state.chars[i]?'text-emerald-600':'text-red-600'):i===index?'caret':''}">${escapeHtml(ch)}</span>`).join(''); }
function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
function start(){ state.started=true; state.startTime=performance.now();
  if(state.timeLimit){ const end=Date.now()+state.timeLimit*1000; state.timer=setInterval(()=>{ const left=Math.max(0,Math.round((end-Date.now())/1000)); els.timeLeft.textContent=left; if(left<=0) finish(); },250); }
  tickWpm();
}
function tickWpm(){ if(state.finished) return; const w=calcWPM(); state.wpmSeries.push(w); updateChart(); setTimeout(tickWpm,1000); }
function calcWPM(){ const m=Math.max(1/60,(performance.now()-state.startTime)/60000); const gross=(state.index/5)/m; const net=Math.max(0,gross-(state.errors/m)/5); els.wpm.textContent=Math.round(net); const acc=state.index?Math.round((state.correct/state.index)*100):100; els.acc.textContent=`${acc}%`; return Math.round(net); }
function onKey(e){ if(state.finished) return; if(!state.started) start(); const examMode=els.examMode.value==='on';
  if(e.key==='Backspace'){ if(examMode){ e.preventDefault(); return; } if(state.index>0){ state.index--; if(!state.chars[state.index]) state.errors=Math.max(0,state.errors-1); state.chars[state.index]=undefined; els.errors.textContent=state.errors; els.text.innerHTML=renderText(state.text,state.index);} return; }
  if(e.key.length===1){ const expected=state.text[state.index]; const got=e.key; const ok=got===expected; state.chars[state.index]=ok; state.index++; if(ok) state.correct++; else { state.errors++; els.errors.textContent=state.errors; if(document.getElementById('sound').checked) beep.play().catch(()=>{}); } els.text.innerHTML=renderText(state.text,state.index); calcWPM(); if(state.index>=state.text.length) finish(); }
}
function finish(){ state.finished=true; clearInterval(state.timer); const score={date:new Date().toLocaleString(), wpm:calcWPM(), acc:parseInt(els.acc.textContent,10), errors:state.errors, mode:els.mode.value, lang:els.lang.value}; saveHistory(score); renderHistory(); }
function saveHistory(s){ const key='ez_typing_history'; const data=JSON.parse(localStorage.getItem(key)||'[]'); data.unshift(s); if(data.length>15) data.pop(); localStorage.setItem(key,JSON.stringify(data)); }
function renderHistory(){ const key='ez_typing_history'; const data=JSON.parse(localStorage.getItem(key)||'[]'); els.history.innerHTML = data.map(d=>`<div class="flex items-center justify-between rounded border border-slate-200 dark:border-slate-800 px-3 py-2"><div class="text-xs text-slate-500">${d.date}</div><div class="text-sm">WPM <b>${d.wpm}</b> • Acc <b>${d.acc}%</b> • Errors <b>${d.errors}</b> • ${d.lang.toUpperCase()} • ${d.mode}</div></div>`).join('') || `<div class="text-sm text-slate-500">No attempts yet.</div>`; }
function buildChart(){ const ctx=document.getElementById('wpmChart'); if(window._chart) window._chart.destroy(); window._chart=new Chart(ctx,{type:'line',data:{labels:[],datasets:[{label:'WPM',data:[],borderColor:'#2563eb',tension:.3,fill:false}]},options:{responsive:true,scales:{y:{beginAtZero:true}},plugins:{legend:{display:false}}}}); chart=window._chart; }
function updateChart(){ const t=state.wpmSeries.length; chart.data.labels=[...Array(t)].map((_,i)=>i+1); chart.data.datasets[0].data=state.wpmSeries; chart.update('none'); }

document.addEventListener('keydown', e => { const key=e.key.toLowerCase(); document.querySelectorAll('#kb .key').forEach(k=>{ if(k.textContent===key){ k.classList.add('bg-amber-100','dark:bg-amber-900'); setTimeout(()=>k.classList.remove('bg-amber-100','dark:bg-amber-900'),120); } }); });
document.addEventListener('keydown', onKey);
document.getElementById('text').addEventListener('click', ()=> els.input.focus());
document.getElementById('restartBtn').addEventListener('click', init);
els.mode.addEventListener('change', init); els.lang.addEventListener('change', init); els.examMode.addEventListener('change', ()=> els.input.focus());

const themeToggle=document.getElementById('themeToggle');
if(localStorage.theme==='dark'||(!('theme' in localStorage)&&window.matchMedia('(prefers-color-scheme:dark)').matches)) document.documentElement.classList.add('dark');
themeToggle.addEventListener('click',()=>{ document.documentElement.classList.toggle('dark'); localStorage.theme=document.documentElement.classList.contains('dark')?'dark':'light'; themeToggle.textContent=document.documentElement.classList.contains('dark')?'🌞':'🌙'; });
themeToggle.textContent=document.documentElement.classList.contains('dark')?'🌞':'🌙';

init(); renderHistory();