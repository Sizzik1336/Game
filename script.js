// Simple tycoon core
const cashEl = document.getElementById('cash');
const cashBtn = document.getElementById('cash-btn');
const incomeEl = document.getElementById('income');
const itemsEl = document.getElementById('items');
const upgradesListEl = document.getElementById('upgrades-list');

let state = {
  cash: 0,
  incomePerSec: 0,
  producers: [],
  upgrades: {}
};

// Define shop items (id, name, baseCost, incomePerSec)
// Each item costs 10x and earns 10x the previous one
const SHOP = [
  { id:'worker', name:'Worker', baseCost: 10, ips: 2 },
  { id:'apprentice', name:'Apprentice', baseCost: 100, ips: 20 },
  { id:'craftsman', name:'Craftsman', baseCost: 1000, ips: 200 },
  { id:'vendor', name:'Vendor', baseCost: 10000, ips: 2000 },
  { id:'merchant', name:'Merchant', baseCost: 100000, ips: 20000 },
  { id:'trader', name:'Trader', baseCost: 1000000, ips: 200000 },
  { id:'businessman', name:'Businessman', baseCost: 10000000, ips: 2000000 },
  { id:'tycoon', name:'Tycoon', baseCost: 100000000, ips: 20000000 },
  { id:'magnate', name:'Magnate', baseCost: 1000000000, ips: 200000000 },
  { id:'baron', name:'Baron', baseCost: 10000000000, ips: 2000000000 },
  { id:'duke', name:'Duke', baseCost: 100000000000, ips: 20000000000 },
  { id:'marquis', name:'Marquis', baseCost: 1000000000000, ips: 200000000000 },
  { id:'count', name:'Count', baseCost: 10000000000000, ips: 2000000000000 },
  { id:'viscount', name:'Viscount', baseCost: 100000000000000, ips: 20000000000000 },
  { id:'earl', name:'Earl', baseCost: 1000000000000000, ips: 200000000000000 },
  { id:'prince', name:'Prince', baseCost: 10000000000000000, ips: 2000000000000000 },
  { id:'king', name:'King', baseCost: 100000000000000000, ips: 20000000000000000 },
  { id:'emperor', name:'Emperor', baseCost: 1000000000000000000, ips: 200000000000000000 },
  { id:'pharaoh', name:'Pharaoh', baseCost: 10000000000000000000, ips: 2000000000000000000 },
  { id:'sovereign', name:'Sovereign', baseCost: 100000000000000000000, ips: 20000000000000000000 },
  { id:'titan', name:'Titan', baseCost: 1000000000000000000000, ips: 200000000000000000000 },
  { id:'colossus', name:'Colossus', baseCost: 10000000000000000000000, ips: 2000000000000000000000 },
  { id:'leviathan', name:'Leviathan', baseCost: 100000000000000000000000, ips: 20000000000000000000000 },
  { id:'goliath', name:'Goliath', baseCost: 1000000000000000000000000, ips: 200000000000000000000000 },
  { id:'behemoth', name:'Behemoth', baseCost: 10000000000000000000000000, ips: 2000000000000000000000000 },
  { id:'hydra', name:'Hydra', baseCost: 100000000000000000000000000, ips: 20000000000000000000000000 },
  { id:'chimera', name:'Chimera', baseCost: 1000000000000000000000000000, ips: 200000000000000000000000000 },
  { id:'cerberus', name:'Cerberus', baseCost: 10000000000000000000000000000, ips: 2000000000000000000000000000 },
  { id:'kraken', name:'Kraken', baseCost: 100000000000000000000000000000, ips: 20000000000000000000000000000 },
  { id:'phoenix', name:'Phoenix', baseCost: 1000000000000000000000000000000, ips: 200000000000000000000000000000 },
  { id:'dragon', name:'Dragon', baseCost: 10000000000000000000000000000000, ips: 2000000000000000000000000000000 },
  { id:'god', name:'God', baseCost: 100000000000000000000000000000000, ips: 20000000000000000000000000000000 },
  { id:'titan-god', name:'Titan God', baseCost: 1000000000000000000000000000000000, ips: 200000000000000000000000000000000 },
  { id:'elder-god', name:'Elder God', baseCost: 10000000000000000000000000000000000, ips: 2000000000000000000000000000000000 },
  { id:'cosmic-entity', name:'Cosmic Entity', baseCost: 100000000000000000000000000000000000, ips: 20000000000000000000000000000000000 },
  { id:'omnipotent', name:'Omnipotent', baseCost: 1000000000000000000000000000000000000, ips: 200000000000000000000000000000000000 },
  { id:'reality-shaper', name:'Reality Shaper', baseCost: 10000000000000000000000000000000000000, ips: 2000000000000000000000000000000000000 },
  { id:'universe-builder', name:'Universe Builder', baseCost: 100000000000000000000000000000000000000, ips: 20000000000000000000000000000000000000 },
  { id:'multiversal', name:'Multiversal', baseCost: 1000000000000000000000000000000000000000, ips: 200000000000000000000000000000000000000 },
  { id:'infinite', name:'Infinite', baseCost: 10000000000000000000000000000000000000000, ips: 2000000000000000000000000000000000000000 },
  { id:'transcendent', name:'Transcendent', baseCost: 100000000000000000000000000000000000000000, ips: 20000000000000000000000000000000000000000 },
  { id:'absolute', name:'Absolute', baseCost: 1000000000000000000000000000000000000000000, ips: 200000000000000000000000000000000000000000 },
  { id:'supreme', name:'Supreme', baseCost: 10000000000000000000000000000000000000000000, ips: 2000000000000000000000000000000000000000000 },
  { id:'eternal', name:'Eternal', baseCost: 100000000000000000000000000000000000000000000, ips: 20000000000000000000000000000000000000000000 },
  { id:'immortal', name:'Immortal', baseCost: 1000000000000000000000000000000000000000000000, ips: 200000000000000000000000000000000000000000000 },
  { id:'legendary', name:'Legendary', baseCost: 10000000000000000000000000000000000000000000000, ips: 2000000000000000000000000000000000000000000000 },
  { id:'mythical', name:'Mythical', baseCost: 100000000000000000000000000000000000000000000000, ips: 20000000000000000000000000000000000000000000000 },
  { id:'divine', name:'Divine', baseCost: 1000000000000000000000000000000000000000000000000, ips: 200000000000000000000000000000000000000000000000 }
];

// Define upgrades (id, name, baseCost, multiplier)
// Each upgrade multiplies cost and income by 10
const UPGRADES = [
  { id:'upgrade-1', name:'Better Tools', baseCost: 50, multiplier: 10 },
  { id:'upgrade-2', name:'Automation', baseCost: 500, multiplier: 10 },
  { id:'upgrade-3', name:'Efficiency', baseCost: 5000, multiplier: 10 },
  { id:'upgrade-4', name:'Computerization', baseCost: 50000, multiplier: 10 },
  { id:'upgrade-5', name:'AI Integration', baseCost: 500000, multiplier: 10 },
  { id:'upgrade-6', name:'Quantum Computing', baseCost: 5000000, multiplier: 10 },
  { id:'upgrade-7', name:'Neural Network', baseCost: 50000000, multiplier: 10 },
  { id:'upgrade-8', name:'Consciousness Upload', baseCost: 500000000, multiplier: 10 },
  { id:'upgrade-9', name:'Dimensional Gateway', baseCost: 5000000000, multiplier: 10 },
  { id:'upgrade-10', name:'Time Manipulation', baseCost: 50000000000, multiplier: 10 },
  { id:'upgrade-11', name:'Space Folding', baseCost: 500000000000, multiplier: 10 },
  { id:'upgrade-12', name:'Reality Bending', baseCost: 5000000000000, multiplier: 10 },
  { id:'upgrade-13', name:'Matter Creation', baseCost: 50000000000000, multiplier: 10 },
  { id:'upgrade-14', name:'Energy Manipulation', baseCost: 500000000000000, multiplier: 10 },
  { id:'upgrade-15', name:'Force Projection', baseCost: 5000000000000000, multiplier: 10 },
  { id:'upgrade-16', name:'Gravity Control', baseCost: 50000000000000000, multiplier: 10 },
  { id:'upgrade-17', name:'Atom Splitting', baseCost: 500000000000000000, multiplier: 10 },
  { id:'upgrade-18', name:'Star Harnessing', baseCost: 5000000000000000000, multiplier: 10 },
  { id:'upgrade-19', name:'Black Hole Tapping', baseCost: 50000000000000000000, multiplier: 10 },
  { id:'upgrade-20', name:'Universe Expansion', baseCost: 500000000000000000000, multiplier: 10 },
  { id:'upgrade-21', name:'Multiverse Access', baseCost: 5000000000000000000000, multiplier: 10 },
  { id:'upgrade-22', name:'Parallel Dimension', baseCost: 50000000000000000000000, multiplier: 10 },
  { id:'upgrade-23', name:'Infinite Energy', baseCost: 500000000000000000000000, multiplier: 10 },
  { id:'upgrade-24', name:'Reality Duplication', baseCost: 5000000000000000000000000, multiplier: 10 },
  { id:'upgrade-25', name:'Godlike Powers', baseCost: 50000000000000000000000000, multiplier: 10 },
  { id:'upgrade-26', name:'Omniscience', baseCost: 500000000000000000000000000, multiplier: 10 },
  { id:'upgrade-27', name:'Omnipotence', baseCost: 5000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-28', name:'Transcendence', baseCost: 50000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-29', name:'Ascension', baseCost: 500000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-30', name:'Apotheosis', baseCost: 5000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-31', name:'Absoluteness', baseCost: 50000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-32', name:'Eternality', baseCost: 500000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-33', name:'Infinity Embrace', baseCost: 5000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-34', name:'Totality', baseCost: 50000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-35', name:'Supreme Order', baseCost: 500000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-36', name:'Cosmic Harmony', baseCost: 5000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-37', name:'Unified Field', baseCost: 50000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-38', name:'Perfect Synthesis', baseCost: 500000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-39', name:'Meta Existence', baseCost: 5000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-40', name:'Hyper Reality', baseCost: 50000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-41', name:'Ultra Dimension', baseCost: 500000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-42', name:'Mega Structure', baseCost: 5000000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-43', name:'Giga Force', baseCost: 50000000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-44', name:'Tera Expansion', baseCost: 500000000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-45', name:'Peta Evolution', baseCost: 5000000000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-46', name:'Exa Revolution', baseCost: 50000000000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-47', name:'Zetta Supremacy', baseCost: 500000000000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-48', name:'Yotta Domination', baseCost: 5000000000000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-49', name:'Ronna Infinity', baseCost: 50000000000000000000000000000000000000000000000000, multiplier: 10 },
  { id:'upgrade-50', name:'Quetta Eternity', baseCost: 500000000000000000000000000000000000000000000000000, multiplier: 10 }
];

// Initialize producers
SHOP.forEach(s => state.producers.push({ ...s, owned:0 }));

// Initialize upgrades
UPGRADES.forEach(u => state.upgrades[u.id] = false);

// Currency formatting
const fmt = n => {
  if (n >= 1e15) return (n / 1e15).toFixed(2) + 'Q';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return '$' + Math.floor(n);
};

// Update UI
function render(){
  cashEl.textContent = `Cash: ${fmt(state.cash)}`;
  incomeEl.textContent = `Income/sec: ${fmt(state.incomePerSec)}`;
  
  // Render shop items
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

  // Render upgrades
  upgradesListEl.innerHTML = '';
  UPGRADES.forEach(u => {
    const alreadyOwned = state.upgrades[u.id];
    if (alreadyOwned) {
      const div = document.createElement('div');
      div.style.padding = '8px';
      div.innerHTML = `<div style="color: var(--accent); font-weight: 600">✓ ${u.name}</div>`;
      upgradesListEl.appendChild(div);
    } else {
      const cost = u.baseCost;
      const div = document.createElement('div');
      div.style.padding = '8px';
      const btn = document.createElement('button');
      btn.className = 'upgrade-btn';
      btn.textContent = `${u.name} - ${fmt(cost)}`;
      btn.disabled = state.cash < cost;
      btn.onclick = () => buyUpgrade(u.id);
      div.appendChild(btn);
      upgradesListEl.appendChild(div);
    }
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

function buyUpgrade(id){
  const u = UPGRADES.find(x => x.id === id);
  if(state.cash >= u.baseCost && !state.upgrades[id]){
    state.cash -= u.baseCost;
    state.upgrades[id] = true;
    recalcIncome();
    render();
  }
}

function recalcIncome(){
  let baseIncome = state.producers.reduce((s,p)=> s + p.owned * p.ips, 0);
  let multiplier = 1;
  UPGRADES.forEach(u => {
    if(state.upgrades[u.id]){
      multiplier *= u.multiplier;
    }
  });
  state.incomePerSec = baseIncome * multiplier;
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
