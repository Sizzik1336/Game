// Cookie Clicker-inspired Tycoon with comprehensive features
const cashEl = document.getElementById('cash');
const cashBtn = document.getElementById('cash-btn');
const incomeEl = document.getElementById('income');
const itemsEl = document.getElementById('items');
const upgradesListEl = document.getElementById('upgrades-list');
const clickAnimEl = document.getElementById('click-anim');

let state = {
  // Core economy
  cash: 0,
  incomePerSec: 0,
  totalCashEarned: 0,
  totalClicks: 0,
  producers: [],
  upgrades: {},
  
  // Auto-clicker
  autoClickerLevel: 0,
  autoClickRate: 0,
  
  // Prestige
  prestigeLevel: 0,
  totalCashEarnedAllTime: 0,
  
  // Offline
  lastSaveTime: Date.now(),
  
  // Achievements
  achievements: {},
  
  // Daily rewards
  lastDailyReward: 0,
  dailyStreakDays: 0,
  
  // Statistics
  sessionStartTime: Date.now(),
  timePlayedMs: 0,
  purchasesMade: 0,
  avgIncomePerMin: 0,
  
  // Milestones
  milestoneProgress: {},
  
  // Events
  currentEvent: null,
  eventEndTime: 0,
  eventMultiplier: 1,
  
  // Gambling
  totalGambled: 0,
  totalWon: 0,
  gamblingStreak: 0,
  gamblingWins: 0,
};

// Define shop items - 20 total
const SHOP = [
  { id:'worker', name:'Worker', baseCost: 10, ips: 2, emoji: '👷' },
  { id:'apprentice', name:'Apprentice', baseCost: 100, ips: 20, emoji: '👨‍🎓' },
  { id:'craftsman', name:'Craftsman', baseCost: 1000, ips: 200, emoji: '👨‍🔧' },
  { id:'vendor', name:'Vendor', baseCost: 10000, ips: 2000, emoji: '🏪' },
  { id:'merchant', name:'Merchant', baseCost: 100000, ips: 20000, emoji: '🧑‍💼' },
  { id:'trader', name:'Trader', baseCost: 1000000, ips: 200000, emoji: '📊' },
  { id:'businessman', name:'Businessman', baseCost: 10000000, ips: 2000000, emoji: '💼' },
  { id:'tycoon', name:'Tycoon', baseCost: 100000000, ips: 20000000, emoji: '🎩' },
  { id:'magnate', name:'Magnate', baseCost: 1000000000, ips: 200000000, emoji: '👑' },
  { id:'baron', name:'Baron', baseCost: 10000000000, ips: 2000000000, emoji: '🏰' },
  // NEW 10 ITEMS
  { id:'duke', name:'Duke', baseCost: 100000000000, ips: 20000000000, emoji: '👧' },
  { id:'emperor', name:'Emperor', baseCost: 1000000000000, ips: 200000000000, emoji: '👨‍⚖️' },
  { id:'pharaoh', name:'Pharaoh', baseCost: 10000000000000, ips: 2000000000000, emoji: '🐪' },
  { id:'god', name:'God', baseCost: 100000000000000, ips: 20000000000000, emoji: '⚡' },
  { id:'titan', name:'Titan', baseCost: 1000000000000000, ips: 200000000000000, emoji: '🗻' },
  { id:'cosmic', name:'Cosmic Entity', baseCost: 10000000000000000, ips: 2000000000000000, emoji: '🌌' },
  { id:'nexus', name:'Nexus Prime', baseCost: 100000000000000000, ips: 20000000000000000, emoji: '🔮' },
  { id:'infinity', name:'Infinity Engine', baseCost: 1000000000000000000, ips: 200000000000000000, emoji: '♾️' },
  { id:'omnipotence', name:'Omnipotence', baseCost: 10000000000000000000, ips: 2000000000000000000, emoji: '🌟' },
  { id:'reality', name:'Reality Warper', baseCost: 100000000000000000000, ips: 20000000000000000000, emoji: '🌀' },
];

// Define upgrades - 15 total (5 original + 10 new)
const UPGRADES = [
  { id:'upgrade-1', name:'Better Tools', baseCost: 50, multiplier: 1.5 },
  { id:'upgrade-2', name:'Automation', baseCost: 500, multiplier: 1.5 },
  { id:'upgrade-3', name:'Efficiency', baseCost: 5000, multiplier: 1.5 },
  { id:'upgrade-4', name:'Computerization', baseCost: 50000, multiplier: 1.5 },
  { id:'upgrade-5', name:'AI Integration', baseCost: 500000, multiplier: 1.5 },
  // NEW UPGRADES
  { id:'upgrade-6', name:'Quantum Processing', baseCost: 5000000, multiplier: 2 },
  { id:'upgrade-7', name:'Neural Networks', baseCost: 50000000, multiplier: 2 },
  { id:'upgrade-8', name:'Dimensional Shift', baseCost: 500000000, multiplier: 2.5 },
  { id:'upgrade-9', name:'Reality Manipulation', baseCost: 5000000000, multiplier: 3 },
  { id:'upgrade-10', name:'Cosmic Power', baseCost: 50000000000, multiplier: 3.5 },
  { id:'upgrade-11', name:'Infinite Loop', baseCost: 500000000000, multiplier: 4 },
  { id:'upgrade-12', name:'Time Control', baseCost: 5000000000000, multiplier: 4.5 },
  { id:'upgrade-13', name:'Universal Domination', baseCost: 50000000000000, multiplier: 5 },
  { id:'upgrade-14', name:'Godlike Power', baseCost: 500000000000000, multiplier: 5 },
  { id:'upgrade-15', name:'Ultimate Power', baseCost: 5000000000000000, multiplier: 5 },
];

// Auto-clicker upgrades
const AUTO_CLICKER_UPGRADES = [
  { id: 'auto-clicker-1', name: 'Auto-Clicker LV1', baseCost: 5000, rate: 1 },
  { id: 'auto-clicker-2', name: 'Auto-Clicker LV2', baseCost: 50000, rate: 5 },
  { id: 'auto-clicker-3', name: 'Auto-Clicker LV3', baseCost: 500000, rate: 10 },
  { id: 'auto-clicker-4', name: 'Auto-Clicker LV4', baseCost: 5000000, rate: 25 },
  { id: 'auto-clicker-5', name: 'Auto-Clicker LV5', baseCost: 50000000, rate: 50 }
];

// Achievements system - with gambling achievements
const ACHIEVEMENTS = [
  { id: 'first-click', name: 'First Click', description: 'Click once', check: () => state.totalClicks >= 1 },
  { id: 'earn-100', name: 'Century', description: 'Earn $100', check: () => state.totalCashEarned >= 100 },
  { id: 'earn-1k', name: 'Rich', description: 'Earn $1,000', check: () => state.totalCashEarned >= 1000 },
  { id: 'earn-1m', name: 'Millionaire', description: 'Earn $1,000,000', check: () => state.totalCashEarned >= 1000000 },
  { id: 'earn-1b', name: 'Billionaire', description: 'Earn $1,000,000,000', check: () => state.totalCashEarned >= 1000000000 },
  { id: 'buy-10', name: 'Collector', description: 'Buy 10 producers', check: () => state.producers.reduce((s,p) => s + p.owned, 0) >= 10 },
  { id: 'buy-100', name: 'Hoarder', description: 'Buy 100 producers', check: () => state.producers.reduce((s,p) => s + p.owned, 0) >= 100 },
  { id: 'prestige-1', name: 'Rebirth', description: 'Prestige once', check: () => state.prestigeLevel >= 1 },
  { id: 'prestige-5', name: 'Ascended', description: 'Prestige 5 times', check: () => state.prestigeLevel >= 5 },
  { id: 'auto-clicker', name: 'Automation', description: 'Buy auto-clicker', check: () => state.autoClickerLevel >= 1 },
  { id: 'daily-reward', name: 'Dedicated', description: 'Claim daily reward', check: () => state.dailyStreakDays >= 1 },
  { id: 'gambler', name: 'High Roller', description: 'Gamble 10 times', check: () => state.totalGambled >= 10 },
  { id: 'lucky-win', name: 'Lucky', description: 'Win 5 gambles', check: () => state.gamblingWins >= 5 },
  { id: 'jackpot', name: 'Jackpot!', description: 'Hit roulette green', check: () => state.achievements['jackpot'] },
];

// Milestones
const MILESTONES = [
  { id: 'worker-10', producers: 'worker', count: 10, bonus: { cash: 100, multiplier: 1.1 } },
  { id: 'worker-50', producers: 'worker', count: 50, bonus: { cash: 500, multiplier: 1.15 } },
  { id: 'any-50', any: true, count: 50, bonus: { cash: 1000, multiplier: 1.2 } },
  { id: 'any-100', any: true, count: 100, bonus: { cash: 5000, multiplier: 1.3 } },
];

// Random events
const EVENTS = [
  { name: 'Lucky Find!', multiplier: 2, duration: 30, chance: 0.05, description: '+100% income for 30 seconds' },
  { name: 'Market Surge', multiplier: 1.5, duration: 60, chance: 0.03, description: '+50% income for 60 seconds' },
  { name: 'Crash!', multiplier: 0.5, duration: 20, chance: 0.02, description: '-50% income for 20 seconds' },
];

// Initialize
SHOP.forEach(s => state.producers.push({ ...s, owned:0 }));
UPGRADES.forEach(u => state.upgrades[u.id] = false);
ACHIEVEMENTS.forEach(a => state.achievements[a.id] = false);
state.milestoneProgress = {};
MILESTONES.forEach(m => state.milestoneProgress[m.id] = 0);

// Currency formatting - extended to Novendecillion
const fmt = n => {
  if (n >= 1e57) return (n / 1e57).toFixed(2) + 'Nd';
  if (n >= 1e54) return (n / 1e54).toFixed(2) + 'Oc';
  if (n >= 1e51) return (n / 1e51).toFixed(2) + 'Sp';
  if (n >= 1e48) return (n / 1e48).toFixed(2) + 'Sx';
  if (n >= 1e45) return (n / 1e45).toFixed(2) + 'Qi';
  if (n >= 1e42) return (n / 1e42).toFixed(2) + 'FSh';
  if (n >= 1e39) return (n / 1e39).toFixed(2) + 'USh';
  if (n >= 1e36) return (n / 1e36).toFixed(2) + 'De';
  if (n >= 1e33) return (n / 1e33).toFixed(2) + 'Du';
  if (n >= 1e30) return (n / 1e30).toFixed(2) + 'No';
  if (n >= 1e27) return (n / 1e27).toFixed(2) + 'Oc';
  if (n >= 1e24) return (n / 1e24).toFixed(2) + 'Sp';
  if (n >= 1e21) return (n / 1e21).toFixed(2) + 'Sx';
  if (n >= 1e18) return (n / 1e18).toFixed(2) + 'Qi';
  if (n >= 1e15) return (n / 1e15).toFixed(2) + 'Q';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return '$' + Math.floor(n);
};

// Gambling functions
function playSlots() {
  const betAmount = 100;
  if (state.cash < betAmount) return alert('Not enough cash!');
  
  state.cash -= betAmount;
  state.totalGambled += betAmount;
  
  const results = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
  const msg = `🎰 Slots: [${results[0]}][${results[1]}][${results[2]}]`;
  
  if (results[0] === results[1] && results[1] === results[2]) {
    // Triple match - 50x
    const winnings = betAmount * 50;
    state.cash += winnings;
    state.totalCashEarned += winnings;
    state.totalWon += winnings;
    state.gamblingWins += 1;
    alert(`${msg}\n🎉 JACKPOT! Won $${fmt(winnings)}`);
  } else if (results[0] === results[1] || results[1] === results[2]) {
    // Double match - 5x
    const winnings = betAmount * 5;
    state.cash += winnings;
    state.totalCashEarned += winnings;
    state.totalWon += winnings;
    state.gamblingWins += 1;
    alert(`${msg}\n💰 Won $${fmt(winnings)}`);
  } else {
    alert(`${msg}\n😞 Better luck next time!`);
  }
  
  checkAchievements();
  render();
  playSound('cash');
}

function playDice() {
  const betAmount = 50;
  if (state.cash < betAmount) return alert('Not enough cash!');
  
  state.cash -= betAmount;
  state.totalGambled += betAmount;
  
  const roll = Math.floor(Math.random() * 6) + 1;
  
  if (roll === 6) {
    const winnings = betAmount * 6;
    state.cash += winnings;
    state.totalCashEarned += winnings;
    state.totalWon += winnings;
    state.gamblingWins += 1;
    alert(`🎲 Rolled a ${roll}!\n🎉 Won $${fmt(winnings)}`);
  } else if (roll >= 4) {
    const winnings = Math.floor(betAmount * 1.5);
    state.cash += winnings;
    state.totalCashEarned += winnings;
    state.totalWon += winnings;
    state.gamblingWins += 1;
    alert(`🎲 Rolled a ${roll}!\n💰 Won $${fmt(winnings)}`);
  } else {
    alert(`🎲 Rolled a ${roll}...\n😞 Better luck next time!`);
  }
  
  checkAchievements();
  render();
  playSound('cash');
}

function playRoulette() {
  const betAmount = 200;
  if (state.cash < betAmount) return alert('Not enough cash!');
  
  state.cash -= betAmount;
  state.totalGambled += betAmount;
  
  const spin = Math.random();
  
  if (spin < 0.45) {
    alert('🎡 Landed on RED!\n😞 Lost!');
  } else if (spin < 0.9) {
    const winnings = betAmount * 2;
    state.cash += winnings;
    state.totalCashEarned += winnings;
    state.totalWon += winnings;
    state.gamblingWins += 1;
    alert(`🎡 Landed on BLACK!\n💰 Won $${fmt(winnings)}`);
  } else {
    const winnings = betAmount * 36;
    state.cash += winnings;
    state.totalCashEarned += winnings;
    state.totalWon += winnings;
    state.gamblingWins += 1;
    state.achievements['jackpot'] = true;
    alert(`🎡 Landed on GREEN!\n🎉🎉🎉 JACKPOT!!! Won $${fmt(winnings)}`);
  }
  
  checkAchievements();
  render();
  playSound('cash');
}

// Calculate prestige multiplier
function calculatePrestigeMultiplier() {
  const baseMultiplier = 1 + (state.prestigeLevel * 0.5);
  let moneyBonus = 0;
  if (state.totalCashEarned >= 1e12) moneyBonus = 10;
  else if (state.totalCashEarned >= 1e9) moneyBonus = 0.4;
  else if (state.totalCashEarned >= 1e6) moneyBonus = 0.3;
  else if (state.totalCashEarned >= 1e3) moneyBonus = 0.2;
  else if (state.totalCashEarned >= 100) moneyBonus = 0.1;
  
  return baseMultiplier * (1 + moneyBonus);
}

function getMoneyBracket() {
  if (state.totalCashEarned >= 1e12) return 'Trillion+ wealth (10x bonus)';
  else if (state.totalCashEarned >= 1e9) return 'Billionaire (40% bonus)';
  else if (state.totalCashEarned >= 1e6) return 'Millionaire (30% bonus)';
  else if (state.totalCashEarned >= 1e3) return 'Wealthy (20% bonus)';
  else if (state.totalCashEarned >= 100) return 'Comfortable (10% bonus)';
  else return 'Starting out (0% bonus)';
}

// Render UI
function render(){
  const playTime = Date.now() - state.sessionStartTime + state.timePlayedMs;
  const playTimeMin = playTime / 60000;
  state.avgIncomePerMin = playTimeMin > 0 ? state.totalCashEarned / playTimeMin : 0;
  
  cashEl.textContent = `Cash: ${fmt(state.cash)}`;
  incomeEl.textContent = `Income/sec: ${fmt(state.incomePerSec * state.eventMultiplier)} | Prestige Lvl: ${state.prestigeLevel} | Clicks: ${fmt(state.totalClicks)}`;
  
  // Render items
  itemsEl.innerHTML = '';
  
  // Daily reward button
  const dailyDiv = document.createElement('div');
  dailyDiv.className = 'item';
  dailyDiv.style.backgroundColor = '#2a522a';
  const canClaimDaily = Date.now() - state.lastDailyReward >= 86400000;
  const dailyBonus = 1000 * Math.max(1, state.prestigeLevel);
  dailyDiv.innerHTML = `
    <div>
      <div style="font-weight:600">🎁 Daily Reward</div>
      <div class="small">Streak: ${state.dailyStreakDays} days | Reward: ${fmt(dailyBonus)}</div>
    </div>
  `;
  const dailyRight = document.createElement('div');
  dailyRight.style.textAlign = 'right';
  const dailyBtn = document.createElement('button');
  dailyBtn.textContent = canClaimDaily ? 'Claim' : 'Return Tomorrow';
  dailyBtn.disabled = !canClaimDaily;
  dailyBtn.onclick = () => claimDailyReward();
  dailyRight.appendChild(dailyBtn);
  dailyDiv.appendChild(dailyRight);
  itemsEl.appendChild(dailyDiv);
  
  // Gambling section
  const gamblingDiv = document.createElement('div');
  gamblingDiv.className = 'item';
  gamblingDiv.style.backgroundColor = '#4a2a2a';
  gamblingDiv.innerHTML = `
    <div>
      <div style="font-weight:600">🎰 Gambling</div>
      <div class="small">Gambled: ${fmt(state.totalGambled)} | Won: ${fmt(state.totalWon)} | Wins: ${state.gamblingWins}</div>
    </div>
  `;
  const gamblingRight = document.createElement('div');
  gamblingRight.style.textAlign = 'right';
  gamblingRight.style.display = 'flex';
  gamblingRight.style.gap = '4px';
  gamblingRight.style.flexDirection = 'column';
  
  const slots = document.createElement('button');
  slots.textContent = '🎰 Slots ($100)';
  slots.onclick = playSlots;
  slots.style.padding = '4px 8px';
  slots.style.fontSize = '0.8rem';
  gamblingRight.appendChild(slots);
  
  const dice = document.createElement('button');
  dice.textContent = '🎲 Dice ($50)';
  dice.onclick = playDice;
  dice.style.padding = '4px 8px';
  dice.style.fontSize = '0.8rem';
  gamblingRight.appendChild(dice);
  
  const roulette = document.createElement('button');
  roulette.textContent = '🎡 Roulette ($200)';
  roulette.onclick = playRoulette;
  roulette.style.padding = '4px 8px';
  roulette.style.fontSize = '0.8rem';
  gamblingRight.appendChild(roulette);
  
  gamblingDiv.appendChild(gamblingRight);
  itemsEl.appendChild(gamblingDiv);
  
  // Auto-clicker
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
  const prestigeCost = Math.max(1000, Math.floor(state.totalCashEarned * 0.5));
  const prestigeMultiplier = calculatePrestigeMultiplier();
  const prestigeDiv = document.createElement('div');
  prestigeDiv.className = 'item';
  prestigeDiv.style.backgroundColor = '#523a1a';
  prestigeDiv.innerHTML = `
    <div>
      <div style="font-weight:600">✨ Prestige Reset</div>
      <div class="small">Next multiplier: ${prestigeMultiplier.toFixed(2)}x all income</div>
      <div class="small" style="color: #ffd166; margin-top: 4px;">${getMoneyBracket()}</div>
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
  
  // Active event display
  if (state.currentEvent && state.eventEndTime > Date.now()) {
    const timeLeft = Math.ceil((state.eventEndTime - Date.now()) / 1000);
    const eventDiv = document.createElement('div');
    eventDiv.className = 'item';
    eventDiv.style.backgroundColor = '#4a2a1a';
    eventDiv.innerHTML = `
      <div>
        <div style="font-weight:600;color:#ff6b6b">⚡ ${state.currentEvent.name}</div>
        <div class="small">${state.currentEvent.description} (${timeLeft}s)</div>
      </div>
    `;
    itemsEl.appendChild(eventDiv);
  }
  
  // Producers with bulk buying
  state.producers.forEach(p => {
    const cost = Math.ceil(p.baseCost * Math.pow(1.15, p.owned));
    const cost10 = Math.ceil(p.baseCost * Math.pow(1.15, p.owned + 10));
    const cost100 = Math.ceil(p.baseCost * Math.pow(1.15, p.owned + 100));
    
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div>
        <div style="font-weight:600">${p.emoji} ${p.name} <span class="small">x${p.owned}</span></div>
        <div class="small">${fmt(p.ips)} / sec each</div>
      </div>
    `;
    
    const right = document.createElement('div');
    right.style.textAlign = 'right';
    right.style.display = 'flex';
    right.style.flexDirection = 'column';
    right.style.gap = '4px';
    
    right.innerHTML = `<div class="small">Cost: ${fmt(cost)}</div>`;
    
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '4px';
    
    const btn1 = document.createElement('button');
    btn1.textContent = '1x';
    btn1.disabled = state.cash < cost;
    btn1.style.padding = '4px 8px';
    btn1.style.fontSize = '0.75rem';
    btn1.onclick = () => { buyProducerBulk(p.id, 1); };
    btnContainer.appendChild(btn1);
    
    const btn10 = document.createElement('button');
    btn10.textContent = '10x';
    btn10.disabled = state.cash < cost10;
    btn10.style.padding = '4px 8px';
    btn10.style.fontSize = '0.75rem';
    btn10.onclick = () => { buyProducerBulk(p.id, 10); };
    btnContainer.appendChild(btn10);
    
    const btn100 = document.createElement('button');
    btn100.textContent = '100x';
    btn100.disabled = state.cash < cost100;
    btn100.style.padding = '4px 8px';
    btn100.style.fontSize = '0.75rem';
    btn100.onclick = () => { buyProducerBulk(p.id, 100); };
    btnContainer.appendChild(btn100);
    
    const btnMax = document.createElement('button');
    btnMax.textContent = 'Max';
    btnMax.style.padding = '4px 8px';
    btnMax.style.fontSize = '0.75rem';
    btnMax.onclick = () => { buyProducerBulk(p.id, 999999); };
    btnContainer.appendChild(btnMax);
    
    right.appendChild(btnContainer);
    div.appendChild(right);
    itemsEl.appendChild(div);
  });

  // Render upgrades
  upgradesListEl.innerHTML = '<h3>Upgrades</h3>';
  UPGRADES.forEach(u => {
    const alreadyOwned = state.upgrades[u.id];
    if (alreadyOwned) {
      const div = document.createElement('div');
      div.style.padding = '8px';
      div.innerHTML = `<div style="color: #ffd166; font-weight: 600">✓ ${u.name} (${u.multiplier}x)</div>`;
      upgradesListEl.appendChild(div);
    } else {
      const cost = u.baseCost;
      const div = document.createElement('div');
      div.style.padding = '8px';
      const btn = document.createElement('button');
      btn.className = 'upgrade-btn';
      btn.textContent = `${u.name} (${u.multiplier}x) - ${fmt(cost)}`;
      btn.disabled = state.cash < cost;
      btn.onclick = () => buyUpgrade(u.id);
      div.appendChild(btn);
      upgradesListEl.appendChild(div);
    }
  });
  
  // Add achievements section
  upgradesListEl.innerHTML += '<h3 style="margin-top:16px">Achievements</h3>';
  const unlockedAchievements = ACHIEVEMENTS.filter(a => state.achievements[a.id]);
  const totalAchievements = ACHIEVEMENTS.length;
  upgradesListEl.innerHTML += `<div class="small" style="padding:8px">Unlocked: ${unlockedAchievements.length}/${totalAchievements}</div>`;
  
  unlockedAchievements.forEach(a => {
    const div = document.createElement('div');
    div.style.padding = '4px 8px';
    div.innerHTML = `<div style="color: #ffd166; font-size: 0.9rem">🏆 ${a.name}</div>`;
    upgradesListEl.appendChild(div);
  });
}

// Buy logic with bulk
function buyProducerBulk(id, quantity){
  const p = state.producers.find(x => x.id === id);
  let totalCost = 0;
  let count = 0;
  
  for (let i = 0; i < quantity; i++) {
    const cost = Math.ceil(p.baseCost * Math.pow(1.15, p.owned + i));
    if (state.cash >= totalCost + cost) {
      totalCost += cost;
      count += 1;
    } else {
      break;
    }
  }
  
  if (count > 0) {
    state.cash -= totalCost;
    p.owned += count;
    state.purchasesMade += count;
    checkMilestones();
    checkAchievements();
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
    state.purchasesMade += 1;
    checkAchievements();
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
      state.purchasesMade += 1;
      checkAchievements();
      recalcIncome();
      render();
      playSound('cash');
    }
  }
}

function prestige(){
  const prestigeCost = Math.max(1000, Math.floor(state.totalCashEarned * 0.1));
  if (state.totalCashEarned >= prestigeCost) {
    const currentMultiplier = calculatePrestigeMultiplier();
    state.prestigeLevel += 1;
    state.totalCashEarnedAllTime += state.totalCashEarned;
    
    // Reset game
    state.cash = 0;
    state.totalCashEarned = 0;
    state.totalClicks = 0;
    state.autoClickerLevel = 0;
    state.autoClickRate = 0;
    state.purchasesMade = 0;
    state.currentEvent = null;
    state.eventMultiplier = 1;
    state.producers.forEach(p => p.owned = 0);
    UPGRADES.forEach(u => state.upgrades[u.id] = false);
    state.sessionStartTime = Date.now();
    state.timePlayedMs = 0;
    
    checkAchievements();
    recalcIncome();
    render();
    alert(`Prestige! You are now level ${state.prestigeLevel} with ${currentMultiplier.toFixed(2)}x multiplier!`);
  }
}

function claimDailyReward(){
  const now = Date.now();
  if (now - state.lastDailyReward >= 86400000) {
    const bonus = 1000 * Math.max(1, state.prestigeLevel);
    state.cash += bonus;
    state.totalCashEarned += bonus;
    state.lastDailyReward = now;
    state.dailyStreakDays += 1;
    checkAchievements();
    render();
    alert(`Daily reward claimed! +${fmt(bonus)}\nStreak: ${state.dailyStreakDays} days`);
    playSound('cash');
  }
}

function triggerRandomEvent(){
  if (Math.random() < 0.001) {
    const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    state.currentEvent = event;
    state.eventMultiplier = event.multiplier;
    state.eventEndTime = Date.now() + (event.duration * 1000);
    playSound('cash');
    render();
  }
}

function checkMilestones(){
  MILESTONES.forEach(m => {
    if (m.any) {
      const total = state.producers.reduce((s,p) => s + p.owned, 0);
      if (total >= m.count && state.milestoneProgress[m.id] < m.count) {
        state.milestoneProgress[m.id] = m.count;
        state.cash += m.bonus.cash;
        state.totalCashEarned += m.bonus.cash;
        alert(`🎉 Milestone: ${m.id}\n+${fmt(m.bonus.cash)} cash\n+${(m.bonus.multiplier - 1) * 100}% multiplier`);
      }
    } else {
      const producer = state.producers.find(p => p.id === m.producers);
      if (producer && producer.owned >= m.count && state.milestoneProgress[m.id] < m.count) {
        state.milestoneProgress[m.id] = m.count;
        state.cash += m.bonus.cash;
        state.totalCashEarned += m.bonus.cash;
        alert(`🎉 Milestone: ${m.id}\n+${fmt(m.bonus.cash)} cash`);
      }
    }
  });
}

function checkAchievements(){
  ACHIEVEMENTS.forEach(a => {
    if (!state.achievements[a.id] && a.check()) {
      state.achievements[a.id] = true;
      alert(`🏆 Achievement Unlocked: ${a.name}\n${a.description}`);
      playSound('cash');
    }
  });
}

function recalcIncome(){
  let baseIncome = state.producers.reduce((s,p)=> s + p.owned * p.ips, 0);
  let multiplier = calculatePrestigeMultiplier();
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
  
  // Passive income with event multiplier
  const incomeThisTick = state.incomePerSec * dt * state.eventMultiplier;
  state.cash += incomeThisTick;
  state.totalCashEarned += incomeThisTick;
  
  // Auto-clicker
  if (state.autoClickRate > 0) {
    const autoClicks = state.autoClickRate * dt * state.eventMultiplier;
    state.cash += autoClicks;
    state.totalCashEarned += autoClicks;
    state.totalClicks += autoClicks;
  }
  
  // Event management
  if (state.currentEvent && state.eventEndTime <= now) {
    state.currentEvent = null;
    state.eventMultiplier = 1;
  }
  
  // Random events
  triggerRandomEvent();
  
  // Check achievements periodically
  if (Math.random() < 0.01) checkAchievements();
  
  render();
  requestAnimationFrame(tick);
}

// Active click
let clickCount = 0;
cashBtn.addEventListener('click', () => {
  const clickValue = 1 * state.eventMultiplier;
  state.cash += clickValue;
  state.totalCashEarned += clickValue;
  state.totalClicks += 1;
  clickCount += 1;
  
  // Visual feedback
  const pop = document.createElement('div');
  pop.className = 'cash-pop';
  pop.textContent = `+$${Math.floor(clickValue)}`;
  pop.style.left = (Math.random() * 100) + 'px';
  clickAnimEl.appendChild(pop);
  setTimeout(() => pop.remove(), 700);
  
  if (clickCount % 5 === 0) {
    playSound('click');
    clickCount = 0;
  }
  
  checkAchievements();
  render();
});

function playSound(type) {
  try {
    const sfx = document.getElementById(`sfx-${type}`);
    if (sfx) sfx.currentTime = 0;
    sfx?.play?.();
  } catch(e) {}
}

function processOfflineEarnings() {
  const now = Date.now();
  const timeDiff = (now - state.lastSaveTime) / 1000;
  const offlineEarned = state.incomePerSec * Math.min(timeDiff, 3600);
  if (offlineEarned > 0) {
    state.cash += offlineEarned;
    state.totalCashEarned += offlineEarned;
    console.log(`Offline earnings: ${fmt(offlineEarned)} (${Math.min(timeDiff, 3600)}s)`);
  }
  state.lastSaveTime = now;
}

// Save/load
function save(){
  state.lastSaveTime = Date.now();
  state.timePlayedMs += Date.now() - state.sessionStartTime;
  state.sessionStartTime = Date.now();
  localStorage.tycoonState = JSON.stringify(state);
}

function load(){
  try{
    const s = JSON.parse(localStorage.tycoonState || 'null');
    if(s){
      state = Object.assign(state, s);
      SHOP.forEach(shopItem => {
        const prod = state.producers.find(p=>p.id===shopItem.id);
        if(prod){
          prod.baseCost = shopItem.baseCost;
          prod.ips = shopItem.ips;
          prod.emoji = shopItem.emoji;
        }
      });
      recalcIncome();
      processOfflineEarnings();
    }
  }catch(e){
    console.error('Load error:', e);
  }
}

// Auto-save every 30 seconds
setInterval(save, 30000);
window.addEventListener('beforeunload', save);

// Init
load();
render();
requestAnimationFrame(tick);
