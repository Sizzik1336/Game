// Simple tycoon core
const cashEl = document.getElementById('cash');
const cashBtn = document.getElementById('cash-btn');
const incomeEl = document.getElementById('income');
const itemsEl = document.getElementById('items');

let state = {
  cash: 0,
  incomePerSec: 0,
  producers: []
};

// Define shop items (id, name, baseCost, incomePerSec)
const SHOP = [
  { id:'worker', name:'Worker', baseCost: 10, ips: 2 },
  { id:'vendor', name:'Vendor', baseCost: 100, ips: 20 },
  { id:'factory', name:'Factory', baseCost: 1000, ips: 200 },
  { id:'town', name:'Town', baseCost: 10000, ips: 2000}
  { id:'city', name:'City', baseCost: 100000, ips: 20000}
  { id:'state', name:'State', baseCost: 1000000, ips: 200000}
];

// Initialize producers
SHOP.forEach(s => state.producers.push({ ...s, owned:0 }));

// Currency formatting
const fmt = n => '$' + Math.floor(n);

// Update UI
function render(){
  cashEl.textContent = `Cash: ${fmt(state.cash)}`;
  incomeEl.textContent = `Income/sec: ${fmt(state.incomePerSec)}`;
  itemsEl.innerHTML = '';
  state.producers.forEach(p => {
    const cost = Math.ceil(p.baseCost * Math.pow(1.15, p.owned));
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div>
        <div style="font-weight:600">${p.name} <span class="small">x${p.owned}</span></div>
        <div class="small">${fmt(p.ips)} / sec each</div>
      </div>
    `;
    const right = document.createElement('div');
    right.style.textAlign = 'right';
    right.innerHTML = `<div class="small">Cost: ${fmt(cost)}</div>`;
    const btn = document.createElement('button');
    btn.textContent = 'Buy';
    btn.disabled = state.cash < cost;
    btn.onclick = () => buyProducer(p.id);
    right.appendChild(btn);
    div.appendChild(right);
    itemsEl.appendChild(div);
  });
}

// Buy logic
function buyProducer(id){
  const p = state.producers.find(x => x.id === id);
  const cost = Math.ceil(p.baseCost * Math.pow(1.15, p.owned));
  if(state.cash >= cost){
    state.cash -= cost;
    p.owned += 1;
    recalcIncome();
    render();
  }
}

function recalcIncome(){
  state.incomePerSec = state.producers.reduce((s,p)=> s + p.owned * p.ips, 0);
}

// Passive income tick
let last = Date.now();
function tick(){
  const now = Date.now();
  const dt = (now - last) / 1000;
  last = now;
  state.cash += state.incomePerSec * dt;
  render();
  requestAnimationFrame(tick);
}

// Active click
cashBtn.addEventListener('click', () => {
  state.cash += 1;
  render();
});

// Save/load (localStorage)
function save(){
  localStorage.tycoonState = JSON.stringify(state);
}
function load(){
  try{
    const s = JSON.parse(localStorage.tycoonState || 'null');
    if(s){
      state = Object.assign(state, s);
      // ensure producers have ips and baseCost from SHOP
      SHOP.forEach(shopItem => {
        const prod = state.producers.find(p=>p.id===shopItem.id);
        if(prod){
          prod.baseCost = shopItem.baseCost;
          prod.ips = shopItem.ips;
        }
      });
      recalcIncome();
    }
  }catch(e){}
}
window.addEventListener('beforeunload', save);

// Init
load();
render();
requestAnimationFrame(tick);
