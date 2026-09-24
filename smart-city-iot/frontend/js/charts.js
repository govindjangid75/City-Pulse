/* charts.js */
Chart.defaults.color = "#94a3b8";
Chart.defaults.borderColor = "#f1f5f9";
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.plugins.tooltip.backgroundColor = "#ffffff";
Chart.defaults.plugins.tooltip.titleColor = "#0f172a";
Chart.defaults.plugins.tooltip.bodyColor = "#334155";
Chart.defaults.plugins.tooltip.borderColor = "#e8eaed";
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

const PAL = {
  blue:"#3b82f6", green:"#10b981", yellow:"#f59e0b",
  red:"#ef4444", purple:"#8b5cf6", orange:"#f97316", cyan:"#06b6d4",
};

const ZONE_COLORS = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#f97316"];

const reg = {};
function kill(id){ if(reg[id]){ reg[id].destroy(); delete reg[id]; } }
function a(hex, alpha){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const SCALE = {
  x:{ grid:{color:"#f8fafc",drawBorder:false}, ticks:{color:"#94a3b8",maxRotation:0,maxTicksLimit:8}, border:{display:false} },
  y:{ grid:{color:"#f8fafc",drawBorder:false}, ticks:{color:"#94a3b8",maxTicksLimit:5}, border:{display:false} },
};
const BASE_OPTS = {
  responsive:true, maintainAspectRatio:true,
  interaction:{mode:"index",intersect:false},
  plugins:{ legend:{labels:{boxWidth:8,padding:14,font:{size:11},color:"#64748b"}} },
  scales: SCALE,
};

function mkLine(id, labels, datasets, opts={}){
  kill(id);
  const ctx = document.getElementById(id);
  if(!ctx) return null;
  reg[id] = new Chart(ctx,{type:"line",data:{labels,datasets},options:{...BASE_OPTS,...opts}});
  return reg[id];
}
function mkBar(id, labels, datasets, horizontal=false, opts={}){
  kill(id);
  const ctx = document.getElementById(id);
  if(!ctx) return null;
  reg[id] = new Chart(ctx,{type:"bar",data:{labels,datasets},
    options:{...BASE_OPTS,indexAxis:horizontal?"y":"x",...opts}});
  return reg[id];
}
function trimTs(l){ const s=String(l||""); return s.length>16?s.substring(5,16):s; }
function sparsify(arr,max=10){
  if(arr.length<=max) return arr.map(trimTs);
  const step=Math.ceil(arr.length/max);
  return arr.map((l,i)=>i%step===0?trimTs(l):"");
}
function wowLabel(pct){
  if(pct === null || pct === undefined || isNaN(pct)) return "-- vs last week";
  const sign = pct > 0 ? "▲" : pct < 0 ? "▼" : "–";
  return `${sign} ${Math.abs(pct)}% vs last week`;
}
