function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

/** CONFIG MODULABLE (client) **/
const SITE = {
  restaurant: {
    name: "Le Bistrot Doré",
    city: "Lyon",
    phone: "+33472000000",
    email: "bonjour@bistrotdore.fr",
    address: "18 Rue des Canuts, 69001 Lyon",
    mapsUrl: "https://www.google.com/maps?q=18%20Rue%20des%20Canuts%2069001%20Lyon"
  },

  openingHours: {
    display: {
      short: "Mar–Sam · 12:00–14:00 / 19:00–22:30",
      full: "Mardi à Samedi · 12:00–14:00 et 19:00–22:30 — Dimanche & Lundi fermé"
    },
    // JS getDay(): 0=Dim ... 6=Sam
    days: {
      0: [],
      1: [],
      2: [{ start: "12:00", end: "14:00" }, { start: "19:00", end: "22:30" }],
      3: [{ start: "12:00", end: "14:00" }, { start: "19:00", end: "22:30" }],
      4: [{ start: "12:00", end: "14:00" }, { start: "19:00", end: "22:30" }],
      5: [{ start: "12:00", end: "14:00" }, { start: "19:00", end: "22:30" }],
      6: [{ start: "12:00", end: "14:00" }, { start: "19:00", end: "22:30" }],
    }
  },

  menu: {
    updatedAt: "2026-02-22",
    sections: [
      { key: "Entrees", title: "Entrées", items: [
        { name: "Œuf parfait, duxelles de champignons", description: "Crème légère, noisettes torréfiées, herbes.", price: "10€" },
        { name: "Terrine de campagne maison", description: "Pickles de saison, pain au levain.", price: "11€" },
        { name: "Soupe à l’oignon gratinée", description: "Comté affiné, croûtons.", price: "9€" }
      ]},
      { key: "Plats", title: "Plats", items: [
        { name: "Faux-filet, jus au vin rouge", description: "Frites maison, salade croquante.", price: "24€" },
        { name: "Quenelles de brochet (clin d’œil lyonnais)", description: "Sauce Nantua, riz pilaf.", price: "22€" },
        { name: "Risotto de saison (végétarien)", description: "Parmesan, légumes rôtis, huile d’herbes.", price: "19€" }
      ]},
      { key: "Desserts", title: "Desserts", items: [
        { name: "Crème brûlée à la vanille", description: "Croustillante, vanille bourbon.", price: "9€" },
        { name: "Tarte fine aux pommes", description: "Caramel léger, crème crue.", price: "9€" },
        { name: "Mousse chocolat noir", description: "Fleur de sel, éclats de cacao.", price: "9€" }
      ]},
      { key: "Boissons", title: "Boissons", items: [
        { name: "Verre de vin (selon sélection)", description: "Rouge / Blanc / Rosé.", price: "6–9€" },
        { name: "Bière artisanale", description: "33cl.", price: "6€" },
        { name: "Café / Espresso", description: "", price: "2,5€" }
      ]}
    ]
  }
};
/** FIN CONFIG **/

/* ================
   THEME SWITCHER
   ================ */
const THEME_KEY = "portfolio_site_theme";
const THEMES = new Set(["bistro", "gastro", "street"]);

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved && THEMES.has(saved)) return saved;
  return "bistro";
}

function applyTheme(theme) {
  const t = THEMES.has(theme) ? theme : "bistro";
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem(THEME_KEY, t); } catch {}
}

function setupThemePicker() {
  const selects = $all("[data-theme-select]");
  if (!selects.length) return;

  const current = getInitialTheme();
  applyTheme(current);
  selects.forEach(sel => {
    sel.value = current;
    sel.addEventListener("change", () => applyTheme(sel.value));
  });
}

function setYear() {
  const y = new Date().getFullYear();
  $all("[data-year]").forEach(el => el.textContent = String(y));
}

function setupNav() {
  const nav = $("[data-nav]");
  const btn = $("[data-nav-toggle]");
  if (!nav || !btn) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  $all("a", nav).forEach(a => a.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  }));
}

function parseTimeToMinutes(t) {
  const [hh, mm] = t.split(":").map(Number);
  return (hh * 60) + (mm || 0);
}
function pad2(n) { return String(n).padStart(2, "0"); }
function minutesToHHMM(m) {
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
}

function currentOrNextBoundary(hours, now = new Date()) {
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = now.getDay();

  const todaySlots = hours.days?.[today] || [];

  for (const s of todaySlots) {
    const a = parseTimeToMinutes(s.start);
    const b = parseTimeToMinutes(s.end);
    if (nowMin >= a && nowMin < b) {
      return { state: "open", closesAt: minutesToHHMM(b) };
    }
  }

  const laterToday = todaySlots
    .map(s => parseTimeToMinutes(s.start))
    .filter(start => start > nowMin)
    .sort((x, y) => x - y)[0];

  if (laterToday !== undefined) {
    return { state: "closed", opensAt: minutesToHHMM(laterToday), dayLabel: "Aujourd’hui" };
  }

  for (let offset = 1; offset <= 7; offset++) {
    const d = (today + offset) % 7;
    const slots = hours.days?.[d] || [];
    if (slots.length) {
      const first = slots
        .map(s => parseTimeToMinutes(s.start))
        .sort((x, y) => x - y)[0];
      const label = offset === 1 ? "Demain" : dayNames[d];
      return { state: "closed", opensAt: minutesToHHMM(first), dayLabel: label };
    }
  }

  return { state: "closed", opensAt: "", dayLabel: "" };
}

function applyOpenStatus() {
  const statusEls = $all("[data-open-status]");
  const dot = $(".status-dot");
  if (!statusEls.length) return;

  const boundary = currentOrNextBoundary(SITE.openingHours);

  if (boundary.state === "open") {
    statusEls.forEach(el => el.textContent = `Ouvert — ferme à ${boundary.closesAt}`);
    if (dot) dot.classList.remove("is-closed");
  } else {
    const suffix = boundary.opensAt ? `— ouvre ${boundary.dayLabel.toLowerCase()} à ${boundary.opensAt}` : "";
    statusEls.forEach(el => el.textContent = `Fermé ${suffix}`.trim());
    if (dot) dot.classList.add("is-closed");
  }

  $all("[data-open-hours-short]").forEach(el => el.textContent = SITE.openingHours.display.short);
  $all("[data-open-hours-full]").forEach(el => el.textContent = SITE.openingHours.display.full);
}

function setupStickyCTA() {
  const bar = $("[data-sticky-cta]");
  if (!bar) return;

  const isMobile = () => window.matchMedia("(max-width: 900px)").matches;

  function updatePadding() {
    if (isMobile()) {
      document.body.classList.add("has-sticky-padding");
    } else {
      document.body.classList.remove("has-sticky-padding");
      bar.classList.remove("is-visible");
    }
  }

  function updateVisibility() {
    if (!isMobile()) return;
    const y = window.scrollY || 0;
    bar.classList.toggle("is-visible", y > 140);
  }

  updatePadding();
  updateVisibility();

  window.addEventListener("resize", () => { updatePadding(); updateVisibility(); });
  window.addEventListener("scroll", () => updateVisibility(), { passive: true });
}

/* Menu */
function renderMenuSection(section) {
  const wrap = document.createElement("section");
  wrap.className = "menu-section";
  wrap.dataset.section = section.key;

  const title = document.createElement("h2");
  title.className = "menu-section-title";
  title.textContent = section.title;

  const items = document.createElement("div");
  items.className = "menu-items";

  section.items.forEach(it => {
    const row = document.createElement("div");
    row.className = "menu-item";

    const left = document.createElement("div");
    const h = document.createElement("h3");
    h.textContent = it.name;

    left.appendChild(h);
    if (it.description) {
      const p = document.createElement("p");
      p.textContent = it.description;
      left.appendChild(p);
    }

    const price = document.createElement("div");
    price.className = "menu-price";
    price.textContent = it.price;

    row.appendChild(left);
    row.appendChild(price);
    items.appendChild(row);
  });

  wrap.appendChild(title);
  wrap.appendChild(items);
  return wrap;
}

function setupMenu() {
  const root = $("#menu-root");
  if (!root) return;

  const updated = $("[data-menu-updated]");
  if (updated) updated.textContent = SITE.menu.updatedAt;

  root.innerHTML = "";
  SITE.menu.sections.forEach(sec => root.appendChild(renderMenuSection(sec)));

  const chips = $all("[data-menu-filter]");
  if (!chips.length) return;

  function setActive(key) {
    chips.forEach(c => c.classList.toggle("is-active", c.dataset.menuFilter === key));
    $all(".menu-section", root).forEach(s => {
      s.style.display = (key === "all" || s.dataset.section === key) ? "" : "none";
    });
  }
  chips.forEach(chip => chip.addEventListener("click", () => setActive(chip.dataset.menuFilter)));
}

document.addEventListener("DOMContentLoaded", () => {
  setupThemePicker();
  setYear();
  setupNav();
  applyOpenStatus();
  setupMenu();
  setupStickyCTA();
});
