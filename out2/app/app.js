// Platinum Road — GTA VI trophy guide & tracker. Static, offline: the only
// fetch is the trophy data file sitting beside this script. Progress lives in
// localStorage and can be exported / imported as JSON. URL params (for the
// screenshots and for sharing a view): ?demo=1 seeds 13 earned trophies,
// ?view=roadmap|missables|save, ?open=<id>, ?filter=<chip>, ?spoiler=1,
// ?theme=night.
const KEY = 'gta6-platinum-road-v1';
const DEMO_EARNED = [2, 3, 8, 15, 16, 19, 21, 28, 33, 35, 42, 44, 46];
const params = new URLSearchParams(location.search);

const FILTERS = [
  ['all', 'All 55'],
  ['story', 'Story'],
  ['missable', 'Missable'],
  ['collectibles', 'Collectibles'],
  ['activities', 'Activities'],
  ['strangers', 'Strangers'],
  ['crime', 'Crime'],
  ['misc', 'Misc'],
];
const FILTER_CATS = {
  story: ['story', 'mission', 'platinum', 'completion'],
  collectibles: ['collectible'],
  activities: ['activity'],
  strangers: ['stranger'],
  crime: ['crime'],
  misc: ['misc'],
};

const PHASES = [
  { n: 1, title: 'Story first', blurb: 'Play Chapters 1–4 and every named mission in order. Chapter trophies are progress markers — nothing to grind, just finish the story beats.', ids: [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 44, 47] },
  { n: 2, title: 'Partners & strangers', blurb: 'Finish the stranger strands while partners are still around. The two partner trophies are missable — do them now, not after the finale.', ids: [22, 23, 24, 26, 27, 25, 29, 33, 34] },
  { n: 3, title: 'Activities & skills', blurb: 'One attempt at each activity type, then the skill grinds: gold medals at the range, drone races, and the stunt counter.', ids: [16, 21, 46, 20, 28, 18, 19, 15, 17, 32, 36, 51] },
  { n: 4, title: 'Collectibles & exploration', blurb: 'Sweep the map region by region: cards, WAiNK points, vehicles, areas, garages, and the Scooter Bros registrations — all in the same trips.', ids: [30, 31, 35, 42, 54, 55] },
  { n: 5, title: 'Crime spree & cleanup', blurb: 'Heists, vaults and gang operations, the money trophies, the one-off oddities — then the finale, 100% completion, and the platinum.', ids: [39, 37, 45, 40, 41, 43, 52, 53, 48, 49, 50, 38, 14, 7, 1] },
];
const PHASE_NOTES = {
  2: 'Opening mission — pops in the first hour.',
  3: 'Finish Chapter 1.',
  4: 'Finish Chapter 2.',
  5: 'Finish Chapter 3.',
  6: 'Finish Chapter 4 — last chapter before the finale.',
  8: 'Mission: Breakfast Run.',
  9: 'Mission: The Cartel Heist.',
  10: 'Mission: Child’s Play.',
  11: 'Mission: Headliners.',
  12: 'Mission: VCIA Takedown.',
  13: 'Mission: Operation Savage Glory.',
  44: 'Cocktail on Ocean Beach — do it the first time you are there.',
  47: 'Partnership beat — keep a save around partner story moments.',
  22: 'Andy’s final mission.',
  23: 'Kenton’s final mission.',
  24: 'Billy’s final mission.',
  26: 'Randy’s final mission.',
  27: 'Tyrone’s final mission.',
  25: 'Finish any 8 stranger strands in total.',
  29: 'Hunt Bret’s unique animal.',
  33: 'MISSABLE — 4-star wanted level with your partner.',
  34: 'MISSABLE — rob 3 shops in a row with your partner.',
  16: 'Try all 9 activity types once.',
  21: 'Finish one arcade game.',
  46: 'A game of bowling at Kolt & Associates.',
  20: 'Out-fish Cal.',
  28: 'Meditate at all 18 spots.',
  18: 'Win a drone race at all 14 locations.',
  19: 'Win 20 different races.',
  15: 'Land 250 stunts.',
  17: 'Gold all 42 Shooting Range challenges.',
  32: 'Complete 50 challenges.',
  36: '5 takedowns in one Combat Focus.',
  51: 'A melee drive-by takedown.',
  30: 'Complete 3 card sets.',
  31: 'WAiNK It at 100 locations.',
  35: 'Discover 100 vehicles.',
  42: 'Explore all 52 areas.',
  54: 'Buy all 8 garages.',
  55: 'Register 10 vehicles in the Scooter Bros app.',
  39: 'MISSABLE — undetected jewelry store robbery; save first.',
  37: 'Unscheduled departure from VCIA.',
  45: 'Smash out of a vehicle showroom.',
  40: 'Rob 5 bank vaults and escape.',
  41: 'Rob an armored truck and escape.',
  43: 'One illegal operation per gang (9 gangs).',
  52: 'Launder $250,000 in Marked Bills.',
  53: 'Spend $100,000 across shops.',
  48: 'MISSABLE — 500 choices, some one-time.',
  49: 'MISSABLE — succeed on the second attempt.',
  50: 'MISSABLE — witness the strange event.',
  38: 'Deal with the Rhino tanks.',
  14: 'Reach 100% completion.',
  7: 'MISSABLE — the final mission; do cleanup first.',
  1: 'The platinum — earned when the other 54 are done.',
};

let doc;
try {
  doc = await (await fetch('data/trophies.json')).json();
} catch {
  document.getElementById('trophyList').innerHTML =
    '<li class="empty">Could not load data/trophies.json. Serve app/ over HTTP (node serve.ts) — file:// blocks the local fetch.</li>';
  throw new Error('trophies.json failed to load');
}
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const missable = trophies.filter((t) => t.missable);

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (saved && Array.isArray(saved.earned)) return saved;
  } catch { /* corrupted save: start fresh */ }
  return { earned: [], spoiler: false, theme: 'paper' };
}
let state = loadState();
if (params.get('demo') === '1' && state.earned.length === 0) state.earned = [...DEMO_EARNED];
if (params.get('spoiler') === '1') state.spoiler = true;
if (params.get('theme') === 'night') state.theme = 'night';
let earned = new Set(state.earned);
let filter = params.get('filter') || 'all';
if (!FILTERS.some(([f]) => f === filter)) filter = 'all';
let gradeFilter = 'all';
let hideEarned = false;
let query = '';
let view = params.get('view') || 'checklist';
if (!['checklist', 'roadmap', 'missables', 'save'].includes(view)) view = 'checklist';
let selectedId = Number(params.get('open') || '') || (trophies.find((t) => !earned.has(t.id))?.id ?? 1);

function save() {
  state.earned = [...earned].sort((a, b) => a - b);
  state.spoiler = spoilerOn;
  state.theme = theme;
  localStorage.setItem(KEY, JSON.stringify(state));
}

let spoilerOn = state.spoiler;
let theme = state.theme || 'paper';

const CAT_LABEL = { platinum: 'goal', completion: '100%', story: 'story', mission: 'mission', stranger: 'stranger', collectible: 'collectible', activity: 'activity', crime: 'crime', misc: 'misc' };
const catLabel = (t) => CAT_LABEL[t.category] ?? t.category;
const $ = (id) => document.getElementById(id);
const isStory = (t) => t.category === 'story' || t.category === 'mission';
const hiddenBySpoiler = (t) => spoilerOn && isStory(t) && !earned.has(t.id);
const displayName = (t) => (hiddenBySpoiler(t) ? 'Hidden story trophy' : t.name);
const displayDesc = (t) =>
  hiddenBySpoiler(t)
    ? 'Spoiler-safe: earn this trophy to reveal its official name and description.'
    : t.description;

function gradeLabel(g) { return g[0].toUpperCase() + g.slice(1); }

function renderDashboard() {
  const total = trophies.length;
  const n = earned.size;
  const pct = Math.round((n / total) * 100);
  $('ring').style.setProperty('--p', pct);
  $('ringText').textContent = `${pct}%`;
  $('progressText').textContent = `${n} of ${total} earned`;
  $('progressSub').textContent =
    n === 0 ? 'Your road to the platinum starts with the story.'
    : n === total ? 'Platinum earned. Leonida Legend.'
    : `${total - n} to go — next: ${trophies.find((t) => !earned.has(t.id))?.name ?? ''}.`;
  $('missableCount').textContent = `${missable.length} missable`;
  const counts = {};
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    counts[g] = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
  }
  $('gradeCounts').innerHTML = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => {
      const tot = trophies.filter((t) => t.grade === g).length;
      return `<div class="grade-chip ${g}"><b>${counts[g]}/${tot}</b>${gradeLabel(g)}</div>`;
    })
    .join('');
  $('saveState').textContent = `${earned.size} trophies earned · saved in this browser · ${new Date().toLocaleDateString()}`;
}

function visibleTrophies() {
  return trophies.filter((t) => {
    if (filter === 'missable' && !t.missable) return false;
    if (filter !== 'all' && filter !== 'missable' && !FILTER_CATS[filter].includes(t.category)) return false;
    if (gradeFilter !== 'all' && t.grade !== gradeFilter) return false;
    if (hideEarned && earned.has(t.id)) return false;
    if (query) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

function renderChips() {
  $('chips').innerHTML = FILTERS.map(([f, label]) => {
    const n = f === 'all' ? trophies.length
      : f === 'missable' ? missable.length
      : trophies.filter((t) => FILTER_CATS[f].includes(t.category)).length;
    return `<button type="button" class="chip${filter === f ? ' active' : ''}" data-filter="${f}">${label} · ${n}</button>`;
  }).join('');
  document.querySelectorAll('#chips .chip').forEach((b) =>
    b.addEventListener('click', () => { filter = b.dataset.filter; renderChips(); renderList(); }));
}

function renderList() {
  const list = visibleTrophies();
  $('listMeta').textContent = `Showing ${list.length} of ${trophies.length} trophies` +
    (spoilerOn ? ' · spoiler-safe on: unrevealed story trophies are hidden until earned' : '');
  const ul = $('trophyList');
  ul.replaceChildren();
  if (!list.length) {
    ul.innerHTML = '<li class="empty">No trophies match these filters. Clear the search or pick another filter.</li>';
  }
  for (const t of list) {
    const li = document.createElement('li');
    li.className = `trophy${earned.has(t.id) ? ' earned' : ''}${selectedId === t.id ? ' selected' : ''}`;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${displayName(t)} earned`);
    box.addEventListener('change', (e) => {
      e.stopPropagation();
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save(); renderDashboard(); renderList(); renderDetail();
    });
    const main = document.createElement('div');
    const name = document.createElement('div');
    name.className = 't-name';
    name.textContent = displayName(t);
    const desc = document.createElement('div');
    desc.className = 't-desc';
    desc.textContent = displayDesc(t);
    const tags = document.createElement('div');
    tags.className = 't-tags';
    tags.innerHTML =
      `<span class="tag grade-${t.grade}">${t.grade}</span>` +
      (t.missable ? '<span class="tag miss">⚑ Missable</span>' : '') +
      `<span class="tag">${catLabel(t)}</span>`;
    main.append(name, desc, tags);
    const grade = document.createElement('div');
    grade.className = 't-grade';
    grade.textContent = `#${t.id}`;
    li.append(box, main, grade);
    li.addEventListener('click', (e) => {
      if (e.target === box) return;
      selectedId = t.id;
      renderList(); renderDetail();
    });
    ul.append(li);
  }
}

function renderDetail() {
  const t = byId.get(selectedId) ?? trophies[0];
  const d = $('detail');
  const hidden = hiddenBySpoiler(t);
  d.innerHTML = '';
  const h = document.createElement('h2');
  h.textContent = displayName(t);
  const meta = document.createElement('p');
  meta.className = 'muted';
  meta.textContent = `#${t.id} · ${gradeLabel(t.grade)} trophy · ${t.category}${t.missable ? ' · ⚑ Missable' : ''}`;
  d.append(h, meta);
  if (t.missable) {
    const banner = document.createElement('div');
    banner.className = 'miss-banner';
    banner.textContent = `⚑ Missable — ${t.missable_reason ?? 'tied to a one-time story beat. Keep a manual save first.'}`;
    d.append(banner);
  }
  const off = document.createElement('div');
  off.className = 'official';
  off.innerHTML = '<div class="label">Official description</div>';
  const od = document.createElement('p');
  od.textContent = displayDesc(t);
  off.append(od);
  d.append(off);
  if (!hidden) {
    const gl = document.createElement('div');
    gl.className = 'label';
    gl.textContent = 'Guide — our words';
    const g = document.createElement('p');
    g.className = 'guide-text';
    g.textContent = t.guide;
    const src = document.createElement('div');
    src.className = 'sources';
    src.innerHTML = '<div class="label">Sources cited</div>';
    const ul = document.createElement('ul');
    for (const s of t.sources) {
      const li = document.createElement('li');
      li.textContent = s;
      ul.append(li);
    }
    src.append(ul);
    d.append(gl, g, src);
  } else {
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'Spoiler-safe is on. Tick this trophy earned (or turn spoiler-safe off) to reveal its guide and sources.';
    d.append(p);
  }
  const row = document.createElement('div');
  row.className = 'btn-row';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn';
  btn.textContent = earned.has(t.id) ? '✓ Earned — unmark' : 'Mark as earned';
  btn.addEventListener('click', () => {
    if (earned.has(t.id)) earned.delete(t.id); else earned.add(t.id);
    save(); renderDashboard(); renderList(); renderDetail();
  });
  row.append(btn);
  d.append(row);
}

function renderRoadmap() {
  $('phases').innerHTML = PHASES.map((ph) => {
    const steps = ph.ids.map((id) => {
      const t = byId.get(id);
      const note = PHASE_NOTES[id] ?? '';
      const flag = t.missable ? ' <span class="warn">⚑ Missable</span>' : '';
      return `<li><b>${t.name}</b> — ${note}${flag}</li>`;
    }).join('');
    return `<li class="phase"><div class="phase-num">Phase<span>${ph.n}</span></div><div><h3>${ph.title} · ${ph.ids.length} trophies</h3><p class="muted">${ph.blurb}</p><ul>${steps}</ul></div></li>`;
  }).join('');
}

function renderMissables() {
  $('missGrid').innerHTML = missable.map((t) => {
    const li = t.sources.map((s) => `<li>${s}</li>`).join('');
    return `<article class="miss-card"><h3>${t.name}</h3><p class="why">⚑ ${t.missable_reason ?? ''}</p><p>${t.description}</p><p class="muted">${t.guide}</p><div class="sources"><div class="label">Sources</div><ul>${li}</ul></div></article>`;
  }).join('');
}

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $('themeBtn').textContent = theme === 'night' ? 'Paper theme' : 'Night theme';
}
function applySpoiler() {
  $('spoilerBtn').setAttribute('aria-pressed', String(spoilerOn));
  $('spoilerBtn').textContent = spoilerOn ? 'Spoiler-safe: on' : 'Spoiler-safe: off';
}
function setView(v) {
  view = v;
  document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
  document.querySelectorAll('.view').forEach((s) => s.classList.toggle('active', s.id === `view-${v}`));
}

document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
$('themeBtn').addEventListener('click', () => { theme = theme === 'night' ? 'paper' : 'night'; applyTheme(); save(); });
$('spoilerBtn').addEventListener('click', () => { spoilerOn = !spoilerOn; applySpoiler(); save(); renderList(); renderDetail(); });
$('search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); renderList(); });
$('gradeSel').addEventListener('change', (e) => { gradeFilter = e.target.value; renderList(); });
$('hideEarned').addEventListener('change', (e) => { hideEarned = e.target.checked; renderList(); });
$('exportBtn').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ game: 'GTA VI', earned: [...earned].sort((x, y) => x - y) }, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-platinum-road-progress.json';
  a.click();
});
$('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const next = new Set(ids.filter((id) => byId.has(Number(id))).map(Number));
    earned = next;
    save(); renderDashboard(); renderList(); renderDetail();
  } catch {
    alert('That file is not a valid Platinum Road progress export.');
  }
  e.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset all 55 trophies to unearned?')) return;
  earned = new Set();
  save(); renderDashboard(); renderList(); renderDetail();
});

applyTheme();
applySpoiler();
renderDashboard();
renderChips();
renderList();
renderDetail();
renderRoadmap();
renderMissables();
setView(view);
save();
