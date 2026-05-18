// Simple tycoon core with Cookie Clicker features
const cashEl = document.getElementById('cash');
const cashBtn = document.getElementById('cash-btn');
const incomeEl = document.getElementById('income');
const itemsEl = document.getElementById('items');
const upgradesListEl = document.getElementById('upgrades-list');
const clickAnimEl = document.getElementById('click-anim');

let state = {
  cash: 0,
  incomePerSec: 0,
  totalCashEarned: 0,
  totalClicks: 0,
  producers: [],
  upgrades: {},
  // Auto-clicker
  autoClickerLevel: 0,
  autoClickerUnlocked: false,
  autoClickRate: 0,
  // Prestige
  prestigeLevel: 0,
  totalCashEarnedAllTime: 0,
  // Offline
  lastSaveTime: Date.now(),
  offlineEarnings: 0
};

// Define shop items (id, name, baseCost, incomePerSec)
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
const UPGRADES = [
  { id:'upgrade-1', name:'Better Tools', baseCost: 50, multiplier: 1.5 },
  { id:'upgrade-2', name:'Automation', baseCost: 500, multiplier: 1.5 },
  { id:'upgrade-3', name:'Efficiency', baseCost: 5000, multiplier: 1.5 },
  { id:'upgrade-4', name:'Computerization', baseCost: 50000, multiplier: 1.5 },
  { id:'upgrade-5', name:'AI Integration', baseCost: 500000, multiplier: 1.5 },
  { id:'upgrade-6', name:'Quantum Computing', baseCost: 5000000, multiplier: 1.5 },
  { id:'upgrade-7', name:'Neural Network', baseCost: 50000000, multiplier: 1.5 },
  { id:'upgrade-8', name:'Consciousness Upload', baseCost: 500000000, multiplier: 1.5 },
  { id:'upgrade-9', name:'Dimensional Gateway', baseCost: 5000000000, multiplier: 1.5 },
  { id:'upgrade-10', name:'Time Manipulation', baseCost: 50000000000, multiplier: 1.5 }
];

// Auto-clicker upgrades
const AUTO_CLICKER_UPGRADES = [
  { id: 'auto-clicker-1', name: 'Auto-Clicker LV1', baseCost: 5000, rate: 1 },
  { id: 'auto-clicker-2', name: 'Auto-Clicker LV2', baseCost: 50000, rate: 5 },
  { id: 'auto-clicker-3', name: 'Auto-Clicker LV3', baseCost: 500000, rate: 10 },
  { id: 'auto-clicker-4', name: 'Auto-Clicker LV4', baseCost: 5000000, rate: 25 },
  { id: 'auto-clicker-5', name: 'Auto-Clicker LV5', baseCost: 50000000, rate: 50 }
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
  incomeEl.textContent = `Income/sec: ${fmt(state.incomePerSec)} (Click: $1) | Prestige Lvl: ${state.prestigeLevel}`;
  
  // Render shop items
  itemsEl.innerHTML = '';
  
  // Auto-clicker section
  const autoClickerDiv = document.createElement('div');
  autoClickerDiv.className = 'item';
  autoClickerDiv.style.backgroundColor = '#1a3a52';
  autoClickerDiv.innerHTML = `
    <div>
      <div style="font-weight:600">🤖 Auto-Clicker <span class="small">LV${state.autoClickerLevel}</span></div>
      <div class="small">${state.autoClickRate} clicks/sec</div>
    </div>
  `;
  
  const autoRight = document.createElement('div');
  autoRight.style.textAlign = 'right';
  
  if (state.autoClickerLevel < AUTO_CLICKER_UPGRADES.length) {
    const nextUpgrade = AUTO_CLICKER_UPGRADES[state.autoClickerLevel];
    autoRight.innerHTML = `<div class="small">Cost: ${fmt(nextUpgrade.baseCost)}</div>`;
    const autoBtn = document.createElement('button');
    autoBtn.textContent = 'Upgrade';
    autoBtn.disabled = state.cash < nextUpgrade.baseCost;
    autoBtn.onclick = () => buyAutoClicker();
    autoRight.appendChild(autoBtn);
  } else {
    autoRight.innerHTML = `<div class="small" style="color: #ffd166;">Max Level</div>`;
  }
  autoClickerDiv.appendChild(autoRight);
  itemsEl.appendChild(autoClickerDiv);
  
  // Prestige button
  const prestigeCost = Math.max(1000, Math.floor(state.totalCashEarned * 0.1));
  const prestigeDiv = document.createElement('div');
  prestigeDiv.className = 'item';
  prestigeDiv.style.backgroundColor = '#523a1a';
  prestigeDiv.innerHTML = `
    <div>
      <div style="font-weight:600">✨ Prestige Reset</div>
      <div class="small">Next multiplier: +${(1 + state.prestigeLevel * 0.1).toFixed(1)}x all income</div>
    </div>
  `;
  const prestigeRight = document.createElement('div');
  prestigeRight.style.textAlign = 'right';
  prestigeRight.innerHTML = `<div class="small">Requires: ${fmt(prestigeCost)}</div>`;
  const prestigeBtn = document.createElement('button');
  prestigeBtn.textContent = 'Prestige';
  prestigeBtn.disabled = state.totalCashEarned < prestigeCost;
  prestigeBtn.onclick = () => prestige();
  prestigeRight.appendChild(prestigeBtn);
  prestigeDiv.appendChild(prestigeRight);
  itemsEl.appendChild(prestigeDiv);
  
  // Regular producers
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
      div.innerHTML = `<div style="color: #ffd166; font-weight: 600">✓ ${u.name}</div>`;
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
    playSound('cash');
  }
}

function buyUpgrade(id){
  const u = UPGRADES.find(x => x.id === id);
  if(state.cash >= u.baseCost && !state.upgrades[id]){
    state.cash -= u.baseCost;
    state.upgrades[id] = true;
    recalcIncome();
    render();
    playSound('cash');
  }
}

function buyAutoClicker(){
  if (state.autoClickerLevel < AUTO_CLICKER_UPGRADES.length) {
    const upgrade = AUTO_CLICKER_UPGRADES[state.autoClickerLevel];
    if (state.cash >= upgrade.baseCost) {
      state.cash -= upgrade.baseCost;
      state.autoClickerLevel += 1;
      state.autoClickRate += upgrade.rate;
      recalcIncome();
      render();
      playSound('cash');
    }
  }
}

function prestige(){
  const prestigeCost = Math.max(1000, Math.floor(state.totalCashEarned * 0.1));
  if (state.totalCashEarned >= prestigeCost) {
    state.prestigeLevel += 1;
    // Store total earnings before reset
    state.totalCashEarnedAllTime += state.totalCashEarned;
    
    // Reset game but keep prestige
    const prestigeBonus = 1 + (state.prestigeLevel * 0.1);
    state.cash = 0;
    state.totalCashEarned = 0;
    state.totalClicks = 0;
    state.autoClickerLevel = 0;
    state.autoClickRate = 0;
    state.producers.forEach(p => p.owned = 0);
    UPGRADES.forEach(u => state.upgrades[u.id] = false);
    
    recalcIncome();
    render();
    alert(`Prestige! You are now level ${state.prestigeLevel} with ${prestigeBonus.toFixed(1)}x multiplier!`);
  }
}

function recalcIncome(){
  let baseIncome = state.producers.reduce((s,p)=> s + p.owned * p.ips, 0);
  let multiplier = 1 + (state.prestigeLevel * 0.1);
  UPGRADES.forEach(u => {
    if(state.upgrades[u.id]){
      multiplier *= u.multiplier;
    }
  });
  state.incomePerSec = baseIncome * multiplier;
}

// Offline earnings on load
function processOfflineEarnings() {
  const now = Date.now();
  const timeDiff = (now - state.lastSaveTime) / 1000; // seconds
  const offlineEarned = state.incomePerSec * Math.min(timeDiff, 3600); // Cap at 1 hour
  if (offlineEarned > 0) {
    state.cash += offlineEarned;
    state.totalCashEarned += offlineEarned;
    console.log(`Offline earnings: ${fmt(offlineEarned)} (${Math.min(timeDiff, 3600)}s)`);
  }
  state.lastSaveTime = now;
}

// Passive income tick
let last = Date.now();
function tick(){
  const now = Date.now();
  const dt = (now - last) / 1000;
  last = now;
  
  // Passive income
  state.cash += state.incomePerSec * dt;
  state.totalCashEarned += state.incomePerSec * dt;
  
  // Auto-clicker
  if (state.autoClickRate > 0) {
    const autoClicks = state.autoClickRate * dt;
    state.cash += autoClicks;
    state.totalCashEarned += autoClicks;
    state.totalClicks += autoClicks;
  }
  
  render();
  requestAnimationFrame(tick);
}

// Active click
let clickCount = 0;
cashBtn.addEventListener('click', () => {
  state.cash += 1;
  state.totalCashEarned += 1;
  state.totalClicks += 1;
  clickCount += 1;
  
  // Visual feedback
  const pop = document.createElement('div');
  pop.className = 'cash-pop';
  pop.textContent = '+$1';
  pop.style.left = (Math.random() * 100) + 'px';
  clickAnimEl.appendChild(pop);
  
  setTimeout(() => pop.remove(), 700);
  
  // Play sound every 5 clicks
  if (clickCount % 5 === 0) {
    playSound('click');
    clickCount = 0;
  }
  
  render();
});

// Simple sound effect (can be silent if not available)
function playSound(type) {
  try {
    const sfx = document.getElementById(`sfx-${type}`);
    if (sfx) sfx.currentTime = 0;
    sfx?.play?.();
  } catch(e) {}
}

// Save/load (localStorage)
function save(){
  state.lastSaveTime = Date.now();
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
      processOfflineEarnings();
    }
  }catch(e){
    console.error('Load error:', e);
  }
}

window.addEventListener('beforeunload', save);

// Init
load();
render();
requestAnimationFrame(tick);
