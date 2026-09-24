const data = {
  VMware:{F9IN:420000,BJPK:300000,QIQI:240000,PKBO:180000,XQV0:60000},
  Illumio:{F9IN:90000,BJPK:120000,QIQI:75000,PKBO:105000,XQV0:60000},
  Oracle:{F9IN:260000,BJPK:130000,QIQI:195000,PKBO:65000,XQV0:0},
  MongoDB:{F9IN:70000,BJPK:35000,QIQI:105000,PKBO:70000,XQV0:70000},
  SQL:{F9IN:110000,BJPK:165000,QIQI:55000,PKBO:110000,XQV0:110000},
  SAN:{F9IN:80000,BJPK:80000,QIQI:120000,PKBO:80000,XQV0:40000},
  RedHat:{F9IN:135000,BJPK:90000,QIQI:90000,PKBO:45000,XQV0:90000},
  Commvault:{F9IN:50000,BJPK:75000,QIQI:50000,PKBO:50000,XQV0:25000}
};
const spis=["F9IN","BJPK","QIQI","PKBO","XQV0"];
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);
const techTotal=t=>Object.values(data[t]).reduce((a,b)=>a+b,0);
const spiTotal=s=>Object.values(data).reduce((sum,t)=>sum+t[s],0);
const grand=Object.keys(data).reduce((sum,t)=>sum+techTotal(t),0);
document.querySelector("#grand-total").textContent=money(grand);

const cards=document.querySelector("#technology-cards");
Object.keys(data).sort((a,b)=>techTotal(b)-techTotal(a)).forEach(t=>{
  const el=document.createElement("article");
  el.className="tech-card";
  el.innerHTML=`<div class="name">${t}</div><div class="cost">${money(techTotal(t))}</div><div class="hint">Annual cost · View SPI breakdown →</div>`;
  el.onclick=()=>showTechnology(t);
  cards.appendChild(el);
});

function rows(entries,total){
 return entries.filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).map(([name,cost])=>{
   const pct=Math.round(cost/total*100);
   return `<div class="row"><strong>${name}</strong><div><div class="bar-bg"><div class="bar" style="width:${pct}%"></div></div><div class="muted">${pct}% of cost</div></div><div class="right">${money(cost)}</div></div>`;
 }).join("");
}
function showTechnology(t){
 const total=techTotal(t), el=document.querySelector("#technology-detail");
 el.classList.remove("hidden");
 el.innerHTML=`<div class="detail-header"><div><h3>${t}</h3><div class="muted">SPI cost allocation · estimated prototype data</div></div><div class="big">${money(total)}</div></div>${rows(Object.entries(data[t]),total)}`;
 el.scrollIntoView({behavior:"smooth",block:"nearest"});
}

const select=document.querySelector("#spi-select");
spis.forEach(s=>select.add(new Option(s,s)));
function showSPI(s){
 const total=spiTotal(s);
 document.querySelector("#spi-detail").innerHTML=`<div class="detail-header"><div><h3>${s}</h3><div class="muted">Technology cost ownership · estimated prototype data</div></div><div><div class="muted">Total annual cost</div><div class="big">${money(total)}</div></div></div>${rows(Object.entries(data).map(([t,v])=>[t,v[s]]),total)}`;
}
select.onchange=e=>showSPI(e.target.value);
showSPI(spis[0]);

document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{
 document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
 document.querySelector("#technology-view").classList.toggle("hidden",btn.dataset.view!=="technology");
 document.querySelector("#spi-view").classList.toggle("hidden",btn.dataset.view!=="spi");
});
