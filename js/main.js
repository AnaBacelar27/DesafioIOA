/* ==========================================================================
   IOA | ITC São Luís — núcleo do protótipo
   Utilitários, ícones, API simulada, componentes (header, footer, cards,
   modal, lightbox, toast) e página inicial.
   ========================================================================== */

window.IOA = (function () {
  "use strict";

  const DATA = window.IOA_DATA;
  const body = document.body;
  const ROOT = body.dataset.root || "./";
  const PAGE = body.dataset.page || "";

  /* ---------------------------------------------------------------
     Ícones (traçados baseados no conjunto Lucide — licença ISC)
     --------------------------------------------------------------- */
  const ICONS = {
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
    "graduation-cap": '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "message-circle": '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    "trending-up": '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    wifi: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
    snowflake: '<path d="M2 12h20"/><path d="M12 2v20"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',
    video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    accessibility: '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',
    presentation: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
    maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    "book-open": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    "credit-card": '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    expand: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',
    "external-link": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    tiktok: '<path d="M15 3v11.5a4.5 4.5 0 1 1-4.5-4.5"/><path d="M15 3c.4 2.6 2.4 4.6 5 5"/>',
    microscope: '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
    stethoscope: '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    "bar-chart": '<path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
    "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    flask: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    "rotate-ccw": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    sliders: '<path d="M21 4h-7"/><path d="M10 4H3"/><path d="M21 12h-9"/><path d="M8 12H3"/><path d="M21 20h-5"/><path d="M12 20H3"/><path d="M14 2v4"/><path d="M8 10v4"/><path d="M16 18v4"/>',
    "door-open": '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/>',
    "alert-circle": '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>'
  };

  function icon(name, cls) {
    const paths = ICONS[name] || ICONS.info;
    return (
      '<svg class="icon ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + paths + "</svg>"
    );
  }

  function hydrateIcons(scope) {
    (scope || document).querySelectorAll("[data-icon]").forEach(function (el) {
      if (el.dataset.iconDone) return;
      el.insertAdjacentHTML(el.dataset.iconPos === "after" ? "beforeend" : "afterbegin", icon(el.dataset.icon, el.dataset.iconClass));
      el.dataset.iconDone = "1";
    });
  }

  /* ---------------------------------------------------------------
     Utilitários
     --------------------------------------------------------------- */
  const url = function (path) {
    return ROOT + path;
  };

  const routes = {
    home: url("index.html"),
    cursos: url("pages/cursos.html"),
    curso: function (id) { return url("pages/curso-detalhes.html?id=" + encodeURIComponent(id)); },
    servicos: url("pages/servicos.html"),
    servico: function (id) { return url("pages/servico-detalhes.html?id=" + encodeURIComponent(id)); },
    espacos: url("pages/espacos.html"),
    sala: function (id) { return url("pages/sala-detalhes.html?id=" + encodeURIComponent(id)); },
    sobre: url("pages/sobre.html"),
    contato: url("pages/contato.html")
  };

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const brl0 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0, minimumFractionDigits: 0 });

  function money(v, opts) {
    if (v == null) return "";
    return (opts && opts.cents ? brl : Number.isInteger(v) ? brl0 : brl).format(v);
  }

  function parseDate(iso) {
    const p = String(iso).split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }

  function fmtDate(iso, style) {
    if (!iso) return "";
    const d = parseDate(iso);
    if (style === "long") return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    if (style === "weekday") return d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(/\./g, "").replace(/ de /g, " ");
  }

  function fmtRange(a, b) {
    if (!b || a === b) return fmtDate(a);
    const da = parseDate(a), db = parseDate(b);
    if (da.getMonth() === db.getMonth() && da.getFullYear() === db.getFullYear()) {
      return String(da.getDate()).padStart(2, "0") + " a " + fmtDate(b);
    }
    return fmtDate(a) + " a " + fmtDate(b);
  }

  function today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function img(src) {
    if (!src) return "";
    return /^https?:/.test(src) ? src : url(src);
  }

  /* ---------------------------------------------------------------
     Lotação e status de inscrição
     --------------------------------------------------------------- */
  function occupancy(curso) {
    const cap = Math.max(0, curso.vagas.capacidade);
    const filled = Math.min(cap, Math.max(0, curso.vagas.preenchidas));
    const pct = cap ? (filled / cap) * 100 : 0;
    const faixas = DATA.config.lotacao.faixas;
    let faixa = faixas[faixas.length - 1];
    for (let i = 0; i < faixas.length; i++) {
      if (pct <= faixas[i].ate) {
        faixa = faixas[i];
        break;
      }
    }
    if (filled >= cap) faixa = faixas[faixas.length - 1];
    return { capacidade: cap, preenchidas: filled, restantes: cap - filled, pct: pct, pctLabel: Math.round(pct) + "%", faixa: faixa };
  }

  function courseStatus(curso) {
    const occ = occupancy(curso);
    if (curso.status === "encerradas" || parseDate(curso.dataInicio) < today()) {
      return { key: "closed", label: "Inscrições encerradas", canEnroll: false, occ: occ };
    }
    if (curso.status === "em-breve") {
      return { key: "soon", label: "Inscrições em breve", canEnroll: false, occ: occ };
    }
    if (occ.restantes <= 0) {
      return { key: "sold", label: "Esgotado", canEnroll: false, occ: occ };
    }
    return { key: occ.faixa.chave, label: occ.faixa.rotulo, canEnroll: true, occ: occ, open: true };
  }

  function occupancyHTML(curso, opts) {
    opts = opts || {};
    const st = courseStatus(curso);
    const o = st.occ;
    const state = st.key === "closed" || st.key === "soon" ? "sold" : o.faixa.chave;
    let label = st.key === "closed" || st.key === "soon" ? st.label : o.faixa.rotulo;
    return (
      '<div class="occupancy' + (opts.lg ? " occupancy--lg" : "") + '" data-state="' + state + '">' +
      '<div class="occupancy__head"><span class="occupancy__label">' + esc(label) + "</span>" +
      '<span class="occupancy__count">' + o.preenchidas + " de " + o.capacidade + " vagas preenchidas</span></div>" +
      '<div class="occupancy__track" role="progressbar" aria-label="Lotação do curso" aria-valuemin="0" aria-valuemax="' + o.capacidade + '" aria-valuenow="' + o.preenchidas + '" aria-valuetext="' + o.preenchidas + " de " + o.capacidade + ' vagas preenchidas">' +
      '<span class="occupancy__fill" data-pct="' + o.pct.toFixed(2) + '"></span></div></div>'
    );
  }

  function animateBars(scope) {
    const bars = (scope || document).querySelectorAll(".occupancy__fill[data-pct]:not([data-done])");
    if (!("IntersectionObserver" in window)) {
      bars.forEach(function (b) { b.style.width = b.dataset.pct + "%"; b.dataset.done = 1; });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.pct + "%";
          e.target.dataset.done = 1;
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    bars.forEach(function (b) { io.observe(b); });
  }

  /* ---------------------------------------------------------------
     API simulada (substituível por fetch)
     --------------------------------------------------------------- */
  const clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  const api = {
    getCursos: function () { return Promise.resolve(clone(DATA.cursos)); },
    getCurso: function (id) { return Promise.resolve(clone(DATA.cursos.find(function (c) { return c.id === id; }) || null)); },
    getProfessor: function (id) { return Promise.resolve(clone(DATA.professores.find(function (p) { return p.id === id; }) || null)); },
    getServicos: function () { return Promise.resolve(clone(DATA.servicos)); },
    getServico: function (id) { return Promise.resolve(clone(DATA.servicos.find(function (s) { return s.id === id; }) || null)); },
    getSalas: function () { return Promise.resolve(clone(DATA.salas)); },
    getSala: function (id) { return Promise.resolve(clone(DATA.salas.find(function (s) { return s.id === id; }) || null)); }
  };

  /* ---------------------------------------------------------------
     Componentes de interface
     --------------------------------------------------------------- */
  function demoFlag(text, dark) {
    return '<span class="demo-flag' + (dark ? " demo-flag--dark" : "") + '" title="Informação fictícia para demonstração">' + icon("info") + esc(text || "Demonstrativo") + "</span>";
  }

  function coverHTML(item, opts) {
    opts = opts || {};
    const pic = item.imagem || (item.fotos && item.fotos[0]);
    const green = opts.green ? " cover--green" : "";
    let inner;
    if (pic) {
      inner = '<img src="' + img(pic.src) + '" alt="' + esc(pic.alt) + '" loading="lazy" decoding="async"><span class="cover__shade"></span>';
    } else {
      inner = '<span class="cover__icon">' + icon(item.icone || "image") + "</span>";
    }
    return (
      '<div class="cover' + (pic ? "" : " cover--graphic" + green) + '">' + inner +
      (opts.flags ? '<div class="cover__flags">' + opts.flags + "</div>" : "") +
      "</div>"
    );
  }

  function statusBadge(st) {
    const cls = { open: "open", filling: "filling", last: "last", almost: "almost", sold: "sold", closed: "closed", soon: "soon" }[st.key] || "open";
    return '<span class="badge badge--' + cls + '">' + esc(st.key === "open" || st.key === "filling" || st.key === "last" || st.key === "almost" ? "Inscrições abertas" : st.label) + "</span>";
  }

  function courseCard(c) {
    const st = courseStatus(c);
    const flags = statusBadge(st) + demoFlag("Demo", true);
    return (
      '<article class="course-card reveal">' +
      coverHTML(c, { flags: flags, green: c.categoria === "Anatomia" }) +
      '<div class="course-card__body">' +
      '<span class="tag">' + esc(c.categoria) + "</span>" +
      '<h3 class="course-card__title"><a href="' + routes.curso(c.id) + '">' + esc(c.titulo) + "</a></h3>" +
      '<div class="course-card__meta">' +
      '<span class="meta-item">' + icon("calendar") + esc(fmtRange(c.dataInicio, c.dataFim)) + "</span>" +
      '<span class="meta-item">' + icon("clock") + c.cargaHoraria + "h</span>" +
      '<span class="meta-item">' + icon("map-pin") + esc(c.modalidade) + "</span>" +
      "</div>" +
      occupancyHTML(c) +
      '<div class="course-card__foot">' +
      '<div class="price"><span class="price__label">Investimento*</span><span class="price__value">' + money(c.preco) + "</span>" +
      (c.parcelas > 1 ? '<span class="price__note">ou ' + c.parcelas + "x de " + money(c.preco / c.parcelas, { cents: true }) + "</span>" : "") +
      "</div>" +
      '<a class="btn btn--dark btn--sm" href="' + routes.curso(c.id) + '" aria-label="Ver detalhes de ' + esc(c.titulo) + '">Ver detalhes</a>' +
      "</div></div></article>"
    );
  }

  function servicePrice(s) {
    switch (s.tipoPreco) {
      case "gratuito": return { label: "Triagem", value: "Gratuita", suffix: "" };
      case "fixo": return { label: "Valor", value: money(s.preco), suffix: "" };
      case "inicial": return { label: "A partir de", value: money(s.preco), suffix: "" };
      case "hora": return { label: "Valor por hora", value: money(s.preco), suffix: "/hora" };
      case "sessao": return { label: "Valor por sessão", value: money(s.preco), suffix: "/sessão" };
      default: return { label: "Investimento", value: "Sob orçamento", suffix: "" };
    }
  }

  function serviceCard(s, opts) {
    opts = opts || {};
    const p = servicePrice(s);
    return (
      '<article class="service-card reveal">' +
      '<div class="service-card__top"><span class="service-card__icon">' + icon(s.icone) + "</span>" + demoFlag("Demo") + "</div>" +
      '<span class="tag">' + esc(s.categoria) + "</span>" +
      '<h3 style="margin-top:.5rem">' + esc(s.nome) + "</h3>" +
      '<p class="service-card__desc">' + esc(s.resumo) + "</p>" +
      (opts.compact ? "" :
        '<div class="service-card__list"><p class="label small" style="font-weight:700;margin-bottom:.6rem">O atendimento inclui</p><ul class="check-list">' +
        s.incluso.map(function (i) { return "<li>" + icon("check") + "<span>" + esc(i) + "</span></li>"; }).join("") +
        "</ul></div>" +
        (s.prazo ? '<p class="small muted" style="margin-top:1rem">' + icon("clock") + " Duração: " + esc(s.prazo) + "</p>" : "")) +
      '<div class="service-card__foot">' +
      '<div class="service-card__price-row"><div class="price"><span class="price__label">' + p.label + '*</span><span class="price__value">' + p.value + '<small style="font-size:.8rem;font-weight:600;color:var(--graphite-400)">' + p.suffix + "</small></span></div></div>" +
      '<div class="service-card__actions">' +
      '<a class="btn btn--outline btn--sm" href="' + routes.servico(s.id) + '">Conhecer</a>' +
      '<button type="button" class="btn btn--sm" data-schedule="' + esc(s.id) + '">Agendar triagem</button>' +
      "</div></div></article>"
    );
  }

  function roomCard(r) {
    const preco = r.precoHora != null ? { l: "A partir de", v: money(r.precoHora) + '<small style="font-size:.8rem;color:var(--graphite-400)">/hora</small>' } :
      r.precos.find(function (p) { return p.valor != null; }) ? { l: "A partir de", v: money(r.precos.find(function (p) { return p.valor != null; }).valor) } : { l: "Valor", v: r.precoNota || "Sob consulta" };
    const flags = (r.fotos.length ? '<span class="badge badge--plain" style="background:rgba(249,247,243,.92)">Foto oficial</span>' : '<span class="badge badge--plain badge--soon">Foto pendente</span>') + demoFlag("Demo", true);
    return (
      '<article class="room-card reveal">' +
      coverHTML(r, { flags: flags }) +
      '<div class="room-card__body">' +
      '<span class="tag">' + esc(r.tipo) + "</span>" +
      "<h3>" + esc(r.nome) + "</h3>" +
      '<p class="small muted">' + esc(r.resumo) + "</p>" +
      '<div class="room-card__specs">' +
      '<div class="spec"><span class="spec__k">Capacidade</span><span class="spec__v">até ' + r.capacidade + " pessoas</span></div>" +
      '<div class="spec"><span class="spec__k">Metragem</span><span class="spec__v">' + (r.metragem ? r.metragem + " m²" : "A confirmar") + "</span></div>" +
      '<div class="spec"><span class="spec__k">Reserva</span><span class="spec__v">' + esc(r.modalidade[0]) + "</span></div>" +
      '<div class="spec"><span class="spec__k">Recursos</span><span class="spec__v">' + r.equipamentos.length + " itens</span></div>" +
      "</div>" +
      '<ul class="chip-list">' + r.equipamentos.slice(0, 3).map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>" +
      '<div class="room-card__foot"><div class="price"><span class="price__label">' + preco.l + '*</span><span class="price__value">' + preco.v + "</span></div>" +
      '<a class="btn btn--dark btn--sm" href="' + routes.sala(r.id) + '">Conhecer sala</a></div>' +
      "</div></article>"
    );
  }

  /* ---------------------------------------------------------------
     Header e footer (componentes compartilhados)
     --------------------------------------------------------------- */
  const NAV = [
    { key: "home", label: "Início", href: routes.home },
    { key: "cursos", label: "Cursos", href: routes.cursos },
    { key: "servicos", label: "Serviços", href: routes.servicos },
    { key: "espacos", label: "Nossos espaços", href: routes.espacos },
    { key: "sobre", label: "Sobre", href: routes.sobre },
    { key: "contato", label: "Contato", href: routes.contato }
  ];

  function renderHeader() {
    const mount = document.querySelector("[data-component='header']");
    if (!mount) return;
    const section = body.dataset.section || PAGE;
    mount.outerHTML =
      '<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>' +
      '<div class="demo-banner" role="note"><strong>Protótipo de demonstração.</strong> Preços, vagas, docentes, serviços e recursos das salas são fictícios até validação da unidade.</div>' +
      '<header class="site-header" id="topo">' +
      '<div class="container site-header__inner">' +
      '<a class="brand" href="' + routes.home + '" aria-label="IOA | ITC São Luís — página inicial">' +
      '<img src="' + url("assets/logos/ioa-itc-white.png") + '" alt="IOA | ITC São Luís" width="200" height="62"></a>' +
      '<nav class="nav" id="menu-principal" aria-label="Menu principal">' +
      '<ul class="nav__list">' +
      NAV.map(function (n) {
        return '<li><a class="nav__link" href="' + n.href + '"' + (n.key === section ? ' aria-current="page"' : "") + ">" + n.label + "</a></li>";
      }).join("") +
      "</ul>" +
      '<a class="btn btn--sm nav__cta" href="' + routes.cursos + '">Conheça os cursos</a>' +
      '<div class="nav__mobile-extra">' +
      '<a href="' + DATA.config.unidade.telefoneHref + '">' + icon("phone") + DATA.config.unidade.telefone + "</a>" +
      '<a href="' + DATA.config.unidade.whatsapp + '" target="_blank" rel="noopener">' + icon("message-circle") + "WhatsApp da unidade</a>" +
      "</div>" +
      "</nav>" +
      '<button class="nav-toggle" type="button" aria-controls="menu-principal" aria-expanded="false" aria-label="Abrir menu"><span></span><span></span><span></span></button>' +
      "</div></header>";
  }

  function renderFooter() {
    const mount = document.querySelector("[data-component='footer']");
    if (!mount) return;
    const u = DATA.config.unidade;
    mount.outerHTML =
      '<footer class="site-footer">' +
      '<div class="container footer__top">' +
      '<div class="footer__brand">' +
      '<img src="' + url("assets/logos/ioa-itc-white.png") + '" alt="IOA | ITC São Luís" width="230" height="71" loading="lazy">' +
      "<p>Unidade da Rede IOA em São Luís, reunindo o Instituto Orofacial das Américas e o Instituto de Treinamento em Cadáveres: cursos, serviços e infraestrutura para o desenvolvimento profissional.</p>" +
      '<div class="socials">' +
      u.redes.map(function (r) {
        return '<a href="' + r.url + '" target="_blank" rel="noopener" aria-label="' + r.nome + ' da Rede IOA">' + icon(r.icone) + "</a>";
      }).join("") +
      "</div></div>" +
      '<div><p class="footer__title">Navegação</p><ul class="footer__links">' +
      NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.label + "</a></li>"; }).join("") +
      "</ul></div>" +
      '<div><p class="footer__title">Frentes</p><ul class="footer__links">' +
      '<li><a href="' + routes.cursos + '">IOA Cursos</a></li>' +
      '<li><a href="' + routes.servicos + '">Seja um paciente</a></li>' +
      '<li><a href="' + routes.espacos + '">IOA Espaços</a></li>' +
      '<li><a href="' + u.siteRede + '" target="_blank" rel="noopener">Rede IOA ' + icon("external-link") + "</a></li>" +
      "</ul></div>" +
      '<div><p class="footer__title">Contato</p><address class="footer__contact">' +
      '<div class="footer__contact-item">' + icon("map-pin") + '<a href="' + u.mapaLink + '" target="_blank" rel="noopener">' + u.endereco + "<br>" + u.cidade + " · CEP " + u.cep + "</a></div>" +
      '<div class="footer__contact-item">' + icon("phone") + '<a href="' + u.telefoneHref + '">' + u.telefone + "</a></div>" +
      '<div class="footer__contact-item">' + icon("message-circle") + '<a href="' + u.whatsapp + '" target="_blank" rel="noopener">WhatsApp da unidade</a></div>' +
      '<div class="footer__contact-item">' + icon("clock") + "<span>" + u.horarios.map(function (h) { return h.dias + ": " + h.horas; }).join("<br>") + "</span></div>" +
      "</address></div>" +
      "</div>" +
      '<div class="container footer__bottom"><span>© ' + new Date().getFullYear() + " Rede IOA. Todos os direitos reservados. IOA | ITC São Luís.</span>" +
      "<span>Protótipo de demonstração — conteúdos comerciais fictícios.</span></div>" +
      "</footer>" +
      '<div class="toast-region" aria-live="polite" aria-atomic="false"></div>';
  }

  function initHeaderBehavior() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("menu-principal");
    if (!header) return;

    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!toggle || !nav) return;
    const close = function () {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      nav.classList.remove("is-open");
      body.classList.remove("is-locked");
    };
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      if (open) nav.style.setProperty("--nav-top", Math.max(0, header.getBoundingClientRect().bottom) + "px");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      nav.classList.toggle("is-open", open);
      body.classList.toggle("is-locked", open);
      if (open) {
        const first = nav.querySelector("a");
        if (first) first.focus();
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        close();
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) close();
    });
  }

  /* ---------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------- */
  let revealObserver = null;
  function reveal(scope) {
    const els = (scope || document).querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            revealObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    }
    els.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
      revealObserver.observe(el);
    });
  }

  function refresh(scope) {
    hydrateIcons(scope);
    animateBars(scope);
    reveal(scope);
  }

  /* ---------------------------------------------------------------
     Modal
     --------------------------------------------------------------- */
  let activeModal = null;
  let lastFocus = null;

  function focusables(el) {
    return Array.prototype.slice.call(
      el.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter(function (n) { return n.offsetParent !== null; });
  }

  function trap(e, el) {
    if (e.key !== "Tab") return;
    const f = focusables(el);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  const modal = {
    open: function (opts) {
      modal.close(true);
      lastFocus = document.activeElement;
      const el = document.createElement("div");
      el.className = "modal";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-labelledby", "modal-title");
      el.innerHTML =
        '<div class="modal__backdrop" data-close></div>' +
        '<div class="modal__dialog' + (opts.size === "sm" ? " modal__dialog--sm" : "") + '">' +
        '<div class="modal__head"><div><h2 class="modal__title" id="modal-title">' + esc(opts.title) + "</h2>" +
        (opts.subtitle ? '<p class="modal__subtitle">' + esc(opts.subtitle) + "</p>" : "") +
        '</div><button type="button" class="modal__close" data-close aria-label="Fechar">' + icon("x") + "</button></div>" +
        '<div class="modal__content">' + (opts.html || "") + "</div></div>";
      document.body.appendChild(el);
      body.classList.add("is-locked");
      el.addEventListener("click", function (e) {
        if (e.target.closest("[data-close]")) modal.close();
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Escape") modal.close();
        trap(e, el);
      });
      activeModal = el;
      hydrateIcons(el);
      requestAnimationFrame(function () {
        el.classList.add("is-open");
        const f = el.querySelector("[autofocus]") || focusables(el.querySelector(".modal__content"))[0] || el.querySelector(".modal__close");
        if (f) f.focus();
      });
      if (opts.onOpen) opts.onOpen(el);
      return el;
    },
    setContent: function (html, title, subtitle) {
      if (!activeModal) return;
      if (title) activeModal.querySelector(".modal__title").textContent = title;
      const sub = activeModal.querySelector(".modal__subtitle");
      if (sub && subtitle != null) sub.textContent = subtitle;
      const c = activeModal.querySelector(".modal__content");
      c.innerHTML = html;
      hydrateIcons(c);
      activeModal.querySelector(".modal__dialog").scrollTop = 0;
      const f = focusables(c)[0];
      if (f) f.focus();
    },
    close: function (silent) {
      if (!activeModal) return;
      const el = activeModal;
      activeModal = null;
      el.classList.remove("is-open");
      if (!document.querySelector(".lightbox.is-open")) body.classList.remove("is-locked");
      setTimeout(function () { el.remove(); }, silent ? 0 : 350);
      if (!silent && lastFocus && lastFocus.focus) lastFocus.focus();
    },
    get el() { return activeModal; }
  };

  /* ---------------------------------------------------------------
     Lightbox (galeria)
     --------------------------------------------------------------- */
  const lightbox = (function () {
    let el, items = [], index = 0, opener = null;
    function build() {
      el = document.createElement("div");
      el.className = "lightbox";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-label", "Galeria de fotografias");
      el.innerHTML =
        '<div class="lightbox__bar"><span class="lightbox__count" aria-live="polite"></span>' +
        '<button type="button" class="modal__close lightbox__close" aria-label="Fechar galeria">' + icon("x") + "</button></div>" +
        '<div class="lightbox__stage">' +
        '<button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Foto anterior">' + icon("chevron-left") + "</button>" +
        '<div class="lightbox__media"></div>' +
        '<button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Próxima foto">' + icon("chevron-right") + "</button>" +
        "</div>" +
        '<p class="lightbox__caption"></p>';
      document.body.appendChild(el);
      el.querySelector(".lightbox__close").addEventListener("click", close);
      el.querySelector(".lightbox__nav--prev").addEventListener("click", function () { go(-1); });
      el.querySelector(".lightbox__nav--next").addEventListener("click", function () { go(1); });
      el.addEventListener("click", function (e) { if (e.target === el || e.target.classList.contains("lightbox__stage")) close(); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
        trap(e, el);
      });
      let sx = null;
      el.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
      el.addEventListener("touchend", function (e) {
        if (sx == null) return;
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        sx = null;
      });
    }
    function render() {
      const it = items[index];
      const media = el.querySelector(".lightbox__media");
      media.innerHTML = it.src
        ? '<img src="' + img(it.src) + '" alt="' + esc(it.alt) + '">'
        : '<div class="cover cover--graphic"><span class="cover__icon">' + icon(it.icone || "image") + "</span></div>";
      el.querySelector(".lightbox__caption").textContent = it.caption || it.alt || "";
      el.querySelector(".lightbox__count").textContent = index + 1 + " / " + items.length;
      const multi = items.length > 1;
      el.querySelectorAll(".lightbox__nav").forEach(function (b) { b.hidden = !multi; });
    }
    function go(d) {
      index = (index + d + items.length) % items.length;
      render();
    }
    function open(list, i) {
      if (!el) build();
      opener = document.activeElement;
      items = list;
      index = i || 0;
      render();
      el.classList.add("is-open");
      body.classList.add("is-locked");
      setTimeout(function () { el.querySelector(".lightbox__close").focus(); }, 30);
    }
    function close() {
      if (!el) return;
      el.classList.remove("is-open");
      if (!activeModal) body.classList.remove("is-locked");
      if (opener && opener.focus) opener.focus();
    }
    return { open: open, close: close };
  })();

  function bindGallery(container, list) {
    if (!container) return;
    container.addEventListener("click", function (e) {
      const b = e.target.closest("[data-gallery-index]");
      if (!b) return;
      lightbox.open(list, Number(b.dataset.galleryIndex));
    });
  }

  /* ---------------------------------------------------------------
     Toast
     --------------------------------------------------------------- */
  function toast(msg, ic) {
    const region = document.querySelector(".toast-region");
    if (!region) return;
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.innerHTML = icon(ic || "check") + "<span>" + esc(msg) + "</span>";
    region.appendChild(t);
    setTimeout(function () {
      t.classList.add("is-leaving");
      setTimeout(function () { t.remove(); }, 320);
    }, 4200);
  }

  /* ---------------------------------------------------------------
     Página inicial
     --------------------------------------------------------------- */
  function initHome() {
    const coursesEl = document.getElementById("home-cursos");
    if (coursesEl) {
      api.getCursos().then(function (list) {
        const feat = list.filter(function (c) { return c.destaque; }).slice(0, 4);
        coursesEl.innerHTML = feat.map(courseCard).join("");
        refresh(coursesEl);
      });
    }
    const servEl = document.getElementById("home-servicos");
    if (servEl) {
      api.getServicos().then(function (list) {
        servEl.innerHTML = list.slice(0, 3).map(function (s) { return serviceCard(s, { compact: true }); }).join("");
        refresh(servEl);
      });
    }
    const gal = document.getElementById("home-galeria");
    if (gal) {
      const list = [
        { src: DATA.imagens.laboratorio.src, alt: DATA.imagens.laboratorio.alt, caption: "Laboratório ITC — fotografia oficial" },
        { src: DATA.imagens.clinica.src, alt: DATA.imagens.clinica.alt, caption: "Clínica IOA — fotografia oficial" },
        { src: DATA.imagens.fachada.src, alt: DATA.imagens.fachada.alt, caption: "Fachada da unidade — fotografia oficial" }
      ];
      bindGallery(gal, list);
    }
  }

  /* ---------------------------------------------------------------
     Inicialização
     --------------------------------------------------------------- */
  function init() {
    renderHeader();
    renderFooter();
    initHeaderBehavior();
    if (PAGE === "home") initHome();
    refresh(document);
    // Delegação global: botões "Agendar triagem"
    document.addEventListener("click", function (e) {
      const b = e.target.closest("[data-schedule]");
      if (b && window.IOA_SERVICOS) {
        e.preventDefault();
        window.IOA_SERVICOS.openSchedule(b.dataset.schedule);
      }
    });
  }

  const pub = {
    DATA: DATA,
    ROOT: ROOT,
    PAGE: PAGE,
    icon: icon,
    url: url,
    img: img,
    routes: routes,
    esc: esc,
    money: money,
    fmtDate: fmtDate,
    fmtRange: fmtRange,
    parseDate: parseDate,
    today: today,
    qs: qs,
    occupancy: occupancy,
    courseStatus: courseStatus,
    occupancyHTML: occupancyHTML,
    statusBadge: statusBadge,
    demoFlag: demoFlag,
    coverHTML: coverHTML,
    courseCard: courseCard,
    serviceCard: serviceCard,
    servicePrice: servicePrice,
    roomCard: roomCard,
    api: api,
    modal: modal,
    lightbox: lightbox,
    bindGallery: bindGallery,
    toast: toast,
    refresh: refresh
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return pub;
})();
