/* ==========================================================================
   Módulo de espaços — galeria, catálogo de salas e página da sala
   ========================================================================== */

(function () {
  "use strict";

  const I = window.IOA;
  const DATA = I.DATA;
  const esc = I.esc;
  const icon = I.icon;

  const INFRA_ICON = {
    "Ar-condicionado": "snowflake",
    "Wi-Fi": "wifi",
    Acessibilidade: "accessibility",
    "Apoio técnico": "users",
    "Copa de apoio": "door-open"
  };

  function galleryItems() {
    const list = [];
    DATA.salas.forEach(function (s) {
      s.fotos.forEach(function (f) {
        list.push({ src: f.src, alt: f.alt, caption: s.nome + " — fotografia oficial", sala: s });
      });
    });
    list.push({ src: DATA.imagens.fachada.src, alt: DATA.imagens.fachada.alt, caption: "Fachada da unidade — fotografia oficial" });
    DATA.salas.filter(function (s) { return !s.fotos.length; }).forEach(function (s) {
      list.push({ src: null, icone: s.icone, alt: s.nome, caption: s.nome + " — fotografia oficial pendente", sala: s });
    });
    return list;
  }

  function galleryHTML(list) {
    const layout = ["gallery__item--wide gallery__item--tall", "gallery__item--wide", "", "", "", "", ""];
    return list.map(function (it, i) {
      const media = it.src
        ? '<img src="' + I.img(it.src) + '" alt="' + esc(it.alt) + '" loading="lazy">'
        : '<div class="cover cover--graphic"><span class="cover__icon">' + icon(it.icone) + "</span></div>";
      return '<button type="button" class="gallery__item ' + (layout[i] || "") + '" data-gallery-index="' + i + '" aria-label="Ampliar: ' + esc(it.caption) + '">' + media +
        '<span class="gallery__caption"><span>' + esc(it.caption.split(" — ")[0]) + "</span>" + icon("expand") + "</span></button>";
    }).join("");
  }

  function initEspacos() {
    const gal = document.getElementById("galeria-espacos");
    if (gal) {
      const items = galleryItems();
      gal.innerHTML = galleryHTML(items);
      I.bindGallery(gal, items);
      I.refresh(gal);
    }
    const grid = document.getElementById("grid-salas");
    if (grid) {
      I.api.getSalas().then(function (salas) {
        grid.innerHTML = salas.map(I.roomCard).join("");
        I.refresh(grid);
      });
    }
  }

  function initSala() {
    const root = document.getElementById("sala-root");
    if (!root) return;
    I.api.getSala(I.qs("id")).then(function (s) {
      if (!s) {
        root.innerHTML =
          '<section class="section"><div class="container"><div class="empty">' + icon("search") +
          '<h1 class="h3">Sala não encontrada</h1><p>O ambiente solicitado não existe ou não está disponível.</p>' +
          '<a class="btn" href="' + I.routes.espacos + '">Ver espaços</a></div></div></section>';
        return;
      }
      document.title = s.nome + " · Espaços · IOA | ITC São Luís";
      const photos = s.fotos.length
        ? s.fotos.map(function (f) { return { src: f.src, alt: f.alt, caption: s.nome + " — fotografia oficial" }; })
        : [{ src: null, icone: s.icone, alt: s.nome, caption: s.nome + " — fotografia oficial pendente" }];
      // Ambientes complementares da unidade (fotografias oficiais) para a galeria
      const extra = [DATA.imagens.fachada, DATA.imagens.clinica, DATA.imagens.laboratorio]
        .filter(function (f) { return !s.fotos.some(function (p) { return p.src === f.src; }); })
        .map(function (f) { return { src: f.src, alt: f.alt, caption: "Unidade IOA | ITC São Luís — " + f.alt }; });
      const all = photos.concat(extra);
      const others = DATA.salas.filter(function (x) { return x.id !== s.id; }).slice(0, 3);
      const fromPrice = s.precoHora != null ? I.money(s.precoHora) + "<small>/hora</small>" : (s.precos.find(function (p) { return p.valor != null; }) ? I.money(s.precos.find(function (p) { return p.valor != null; }).valor) : esc(s.precoNota || "Sob consulta"));

      root.innerHTML =
        '<section class="room-hero"><div class="container">' +
        '<nav aria-label="Trilha de navegação"><ol class="breadcrumb breadcrumb--dark"><li><a href="' + I.routes.home + '">Início</a></li><li><a href="' + I.routes.espacos + '">Espaços</a></li><li><span aria-current="page">' + esc(s.nome) + "</span></li></ol></nav>" +
        '<div class="room-gallery" id="sala-galeria">' +
        all.slice(0, 3).map(function (it, i) {
          const media = it.src ? '<img src="' + I.img(it.src) + '" alt="' + esc(it.alt) + '"' + (i ? ' loading="lazy"' : "") + ">" : '<div class="cover cover--graphic"><span class="cover__icon">' + icon(it.icone) + "</span></div>";
          return '<button type="button" class="gallery__item' + (i === 0 ? " room-gallery__main" : "") + '" data-gallery-index="' + i + '" aria-label="Ampliar: ' + esc(it.caption) + '">' + media +
            (i === 0 ? '<span class="gallery__caption"><span>' + esc(it.caption) + "</span>" + icon("expand") + "</span>" : "") + "</button>";
        }).join("") +
        '<button type="button" class="room-gallery__all btn btn--sm btn--dark" data-gallery-index="0">' + icon("image") + "Ver galeria (" + all.length + ")</button>" +
        "</div>" +
        (s.fotos.length ? "" : '<p class="small muted" style="margin-top:.75rem">' + icon("info") + " Fotografias oficiais desta sala pendentes — imagens complementares mostram outros ambientes da unidade.</p>") +
        "</div></section>" +

        '<div class="container course-layout">' +
        '<div class="course-main">' +
        '<section class="course-section"><div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1rem"><span class="tag">' + esc(s.tipo) + "</span>" + I.demoFlag("Dados a confirmar") + "</div>" +
        '<h1 class="h2">' + esc(s.nome) + "</h1>" +
        '<p class="lead" style="margin-top:1rem">' + esc(s.descricao) + "</p></section>" +

        '<section class="course-section reveal"><div class="info-grid info-grid--3">' +
        '<div class="info-card">' + icon("users") + '<span class="info-card__k">Capacidade</span><span class="info-card__v">até ' + s.capacidade + " pessoas</span></div>" +
        '<div class="info-card">' + icon("maximize") + '<span class="info-card__k">Metragem</span><span class="info-card__v">' + (s.metragem ? s.metragem + " m²" : "A confirmar") + "</span></div>" +
        '<div class="info-card">' + icon("calendar") + '<span class="info-card__k">Modalidade</span><span class="info-card__v">' + esc(s.modalidade.join(" · ")) + "</span></div>" +
        "</div></section>" +

        '<section class="course-section reveal"><span class="eyebrow">Equipamentos</span><h2 class="h3">Equipamentos disponíveis</h2>' +
        '<ul class="tools">' + s.equipamentos.map(function (e) { return '<li class="tool">' + icon("check") + "<span>" + esc(e) + "</span></li>"; }).join("") + "</ul></section>" +

        '<section class="course-section reveal"><span class="eyebrow">Infraestrutura</span><h2 class="h3">Recursos do ambiente</h2>' +
        '<ul class="tools">' + s.infraestrutura.map(function (e) { return '<li class="tool">' + icon(INFRA_ICON[e] || "check") + "<span>" + esc(e) + "</span></li>"; }).join("") + "</ul>" +
        '<div class="notice" style="margin-top:1.25rem">' + icon("info") + "<span>Equipamentos e recursos são <strong>demonstrativos</strong> e devem ser confirmados com a unidade antes de serem divulgados.</span></div></section>" +

        '<section class="course-section reveal"><span class="eyebrow">Valores</span><h2 class="h3">Modalidades e preços</h2>' +
        '<div class="table-wrap"><table class="table"><thead><tr><th scope="col">Modalidade</th><th scope="col">Valor (demonstrativo)</th></tr></thead><tbody>' +
        s.precos.map(function (p) { return "<tr><th scope='row'>" + esc(p.rotulo) + "</th><td><strong>" + (p.valor != null ? I.money(p.valor) : "Sob consulta") + "</strong></td></tr>"; }).join("") +
        "</tbody></table></div></section>" +
        "</div>" +

        '<aside class="course-aside" aria-label="Reserva"><div class="enroll">' +
        '<div class="enroll__top"><span class="tag">' + esc(s.tipo) + "</span>" + I.demoFlag("Valor fictício") + "</div>" +
        '<p class="price__label">A partir de</p><p class="enroll__price">' + fromPrice + "</p>" +
        '<p class="small muted" style="margin-bottom:1.25rem">Sujeito à disponibilidade e validação da unidade.</p>' +
        '<button type="button" class="btn btn--lg btn--block" data-reserve="' + esc(s.id) + '">' + icon("calendar") + "Reservar sala</button>" +
        '<a class="btn btn--block btn--outline" style="margin-top:.75rem" href="' + DATA.config.unidade.whatsapp + '" target="_blank" rel="noopener">' + icon("message-circle") + "Falar com a unidade</a>" +
        '<ul class="enroll__list">' +
        "<li>" + icon("users") + "Até " + s.capacidade + " pessoas</li>" +
        "<li>" + icon("clock") + DATA.config.unidade.horarios.map(function (h) { return h.dias + " " + h.horas; }).join("<br>") + "</li>" +
        "<li>" + icon("map-pin") + esc(DATA.config.unidade.endereco) + "</li>" +
        "</ul></div></aside>" +
        "</div>" +
        '<div class="mobile-buy"><div><span class="price__label">A partir de*</span><strong>' + fromPrice + '</strong></div><button type="button" class="btn" data-reserve="' + esc(s.id) + '">Reservar sala</button></div>' +

        '<section class="section section--ivory"><div class="container">' +
        '<div class="section-head section-head--split"><div><span class="eyebrow">Outros ambientes</span><h2 class="h3" style="margin-top:.75rem">Conheça outras salas</h2></div>' +
        '<a class="link-arrow" href="' + I.routes.espacos + '">Ver todos ' + icon("arrow-right") + "</a></div>" +
        '<div class="grid-cards">' + others.map(I.roomCard).join("") + "</div></div></section>";

      I.bindGallery(document.getElementById("sala-galeria"), all);
      I.refresh(root);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initEspacos();
    initSala();
  });
})();
