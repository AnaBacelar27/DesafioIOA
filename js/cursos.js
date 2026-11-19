/* ==========================================================================
   Módulo de cursos — catálogo, filtros, página individual e inscrição
   ========================================================================== */

(function () {
  "use strict";

  const I = window.IOA;
  const F = window.IOA_FORMS;
  const DATA = I.DATA;
  const esc = I.esc;
  const icon = I.icon;

  /* ---------------------------------------------------------------
     Catálogo
     --------------------------------------------------------------- */
  const PRICE_RANGES = [
    { v: "", l: "Qualquer valor" },
    { v: "0-1000", l: "Até R$ 1.000" },
    { v: "1000-3000", l: "R$ 1.000 a R$ 3.000" },
    { v: "3000-999999", l: "Acima de R$ 3.000" }
  ];
  const AVAIL = [
    { v: "", l: "Todas" },
    { v: "abertas", l: "Inscrições abertas" },
    { v: "ultimas", l: "Últimas vagas" },
    { v: "indisponivel", l: "Esgotados / encerrados / em breve" }
  ];
  const SORTS = [
    { v: "relevancia", l: "Destaques" },
    { v: "data", l: "Data mais próxima" },
    { v: "menor", l: "Menor preço" },
    { v: "maior", l: "Maior preço" },
    { v: "procura", l: "Mais procurados" }
  ];

  function monthKey(iso) { return iso.slice(0, 7); }
  function monthLabel(key) {
    const d = I.parseDate(key + "-01");
    const s = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function options(list, sel) {
    return list.map(function (o) { return '<option value="' + esc(o.v) + '"' + (o.v === sel ? " selected" : "") + ">" + esc(o.l) + "</option>"; }).join("");
  }

  function initCatalog() {
    const root = document.getElementById("catalogo");
    if (!root) return;

    I.api.getCursos().then(function (cursos) {
      const params = new URLSearchParams(location.search);
      const state = {
        q: params.get("q") || "",
        categoria: params.get("categoria") || "",
        modalidade: params.get("modalidade") || "",
        periodo: params.get("periodo") || "",
        preco: params.get("preco") || "",
        disp: params.get("disp") || "",
        ordem: params.get("ordem") || "relevancia"
      };

      const months = Array.from(new Set(cursos.map(function (c) { return monthKey(c.dataInicio); }))).sort();
      const els = {
        q: document.getElementById("f-busca"),
        chips: document.getElementById("f-categorias"),
        modalidade: document.getElementById("f-modalidade"),
        periodo: document.getElementById("f-periodo"),
        preco: document.getElementById("f-preco"),
        disp: document.getElementById("f-disp"),
        ordem: document.getElementById("f-ordem"),
        grid: document.getElementById("grid-cursos"),
        count: document.getElementById("resultado-contagem"),
        clear: document.getElementById("f-limpar"),
        toggle: document.getElementById("f-toggle"),
        panel: document.getElementById("f-painel")
      };

      els.q.value = state.q;
      els.modalidade.innerHTML = options([{ v: "", l: "Todas" }].concat(DATA.config.modalidades.map(function (m) { return { v: m, l: m }; })), state.modalidade);
      els.periodo.innerHTML = options([{ v: "", l: "Qualquer data" }].concat(months.map(function (m) { return { v: m, l: monthLabel(m) }; })), state.periodo);
      els.preco.innerHTML = options(PRICE_RANGES, state.preco);
      els.disp.innerHTML = options(AVAIL, state.disp);
      els.ordem.innerHTML = options(SORTS, state.ordem);

      function renderChips() {
        const cats = [""].concat(DATA.config.categorias);
        els.chips.innerHTML = cats.map(function (c) {
          const n = c ? cursos.filter(function (x) { return x.categoria === c; }).length : cursos.length;
          return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (state.categoria === c) + '">' + esc(c || "Todos") + ' <span class="chip__count">' + n + "</span></button>";
        }).join("");
      }

      function matches(c) {
        const st = I.courseStatus(c);
        if (state.q) {
          const hay = norm([c.titulo, c.categoria, c.resumo, c.modalidade, (c.conhecimentos || []).join(" ")].join(" "));
          const terms = norm(state.q).split(/\s+/).filter(Boolean);
          if (!terms.every(function (t) { return hay.indexOf(t) > -1; })) return false;
        }
        if (state.categoria && c.categoria !== state.categoria) return false;
        if (state.modalidade && c.modalidade !== state.modalidade) return false;
        if (state.periodo && monthKey(c.dataInicio) !== state.periodo) return false;
        if (state.preco) {
          const r = state.preco.split("-").map(Number);
          if (c.preco < r[0] || c.preco > r[1]) return false;
        }
        if (state.disp === "abertas" && !st.canEnroll) return false;
        if (state.disp === "ultimas" && !(st.canEnroll && (st.key === "last" || st.key === "almost"))) return false;
        if (state.disp === "indisponivel" && st.canEnroll) return false;
        return true;
      }

      function sort(list) {
        const rank = function (c) { return I.courseStatus(c).canEnroll ? 0 : 1; };
        const by = {
          relevancia: function (a, b) { return rank(a) - rank(b) || (b.destaque - a.destaque) || a.dataInicio.localeCompare(b.dataInicio); },
          data: function (a, b) { return rank(a) - rank(b) || a.dataInicio.localeCompare(b.dataInicio); },
          menor: function (a, b) { return a.preco - b.preco; },
          maior: function (a, b) { return b.preco - a.preco; },
          procura: function (a, b) { return I.occupancy(b).pct - I.occupancy(a).pct; }
        }[state.ordem] || function () { return 0; };
        return list.slice().sort(by);
      }

      function activeCount() {
        return ["modalidade", "periodo", "preco", "disp"].filter(function (k) { return state[k]; }).length;
      }

      function syncURL() {
        const p = new URLSearchParams();
        Object.keys(state).forEach(function (k) {
          if (state[k] && !(k === "ordem" && state[k] === "relevancia")) p.set(k, state[k]);
        });
        const qs = p.toString();
        history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
      }

      function render() {
        const list = sort(cursos.filter(matches));
        els.count.textContent = list.length === 1 ? "1 curso encontrado" : list.length + " cursos encontrados";
        const n = activeCount() + (state.q ? 1 : 0) + (state.categoria ? 1 : 0);
        els.clear.hidden = n === 0;
        els.toggle.querySelector(".f-count").textContent = activeCount() ? "(" + activeCount() + ")" : "";
        if (!list.length) {
          els.grid.innerHTML =
            '<div class="empty" style="grid-column:1/-1">' + icon("search") +
            "<p><strong>Nenhum curso encontrado.</strong><br>Ajuste a busca ou os filtros para ver outras opções.</p>" +
            '<button type="button" class="btn btn--outline btn--sm" data-clear>Limpar filtros</button></div>';
        } else {
          els.grid.innerHTML = list.map(I.courseCard).join("");
        }
        I.refresh(els.grid);
        syncURL();
      }

      function clearAll() {
        Object.assign(state, { q: "", categoria: "", modalidade: "", periodo: "", preco: "", disp: "" });
        els.q.value = "";
        ["modalidade", "periodo", "preco", "disp"].forEach(function (k) { els[k].value = ""; });
        renderChips();
        render();
      }

      let t;
      els.q.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () { state.q = els.q.value.trim(); render(); }, 180);
      });
      document.getElementById("form-busca").addEventListener("submit", function (e) {
        e.preventDefault();
        state.q = els.q.value.trim();
        render();
        els.grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      els.chips.addEventListener("click", function (e) {
        const b = e.target.closest("[data-cat]");
        if (!b) return;
        state.categoria = b.dataset.cat;
        renderChips();
        render();
      });
      ["modalidade", "periodo", "preco", "disp", "ordem"].forEach(function (k) {
        els[k].addEventListener("change", function () { state[k] = els[k].value; render(); });
      });
      els.clear.addEventListener("click", clearAll);
      els.grid.addEventListener("click", function (e) { if (e.target.closest("[data-clear]")) clearAll(); });
      els.toggle.addEventListener("click", function () {
        const open = els.toggle.getAttribute("aria-expanded") !== "true";
        els.toggle.setAttribute("aria-expanded", String(open));
        els.panel.classList.toggle("is-open", open);
      });

      renderChips();
      render();
    });
  }

  /* ---------------------------------------------------------------
     Página individual
     --------------------------------------------------------------- */
  function notFound(root) {
    root.innerHTML =
      '<section class="section"><div class="container"><div class="empty">' + icon("search") +
      '<h1 class="h3">Curso não encontrado</h1><p>O curso solicitado não existe ou não está mais disponível.</p>' +
      '<a class="btn" href="' + I.routes.cursos + '">Ver catálogo de cursos</a></div></div></section>';
  }

  function infoCard(ic, k, v) {
    return '<div class="info-card">' + icon(ic) + '<span class="info-card__k">' + esc(k) + '</span><span class="info-card__v">' + v + "</span></div>";
  }

  function enrollBox(c, st) {
    const parcel = c.parcelas > 1 ? '<p class="enroll__parcel">ou <strong>' + c.parcelas + "x de " + I.money(c.preco / c.parcelas, { cents: true }) + "</strong> sem juros*</p>" : "";
    let cta;
    if (st.canEnroll) {
      cta = '<button type="button" class="btn btn--lg btn--block" data-enroll>' + icon("ticket") + "Garantir minha vaga</button>";
    } else if (st.key === "soon") {
      cta = '<a class="btn btn--lg btn--block btn--outline" href="' + DATA.config.unidade.whatsapp + '" target="_blank" rel="noopener">' + icon("message-circle") + "Avise-me quando abrir</a>";
    } else if (st.key === "sold") {
      cta = '<button type="button" class="btn btn--lg btn--block" disabled>Esgotado</button><a class="btn btn--block btn--outline" style="margin-top:.75rem" href="' + DATA.config.unidade.whatsapp + '" target="_blank" rel="noopener">Entrar na lista de espera</a>';
    } else {
      cta = '<button type="button" class="btn btn--lg btn--block" disabled>Inscrições encerradas</button><a class="btn btn--block btn--outline" style="margin-top:.75rem" href="' + I.routes.cursos + '">Ver outros cursos</a>';
    }
    return (
      '<div class="enroll">' +
      '<div class="enroll__top">' + I.statusBadge(st) + I.demoFlag("Valores fictícios") + "</div>" +
      '<p class="price__label">Investimento</p>' +
      '<p class="enroll__price">' + I.money(c.preco) + "</p>" + parcel +
      '<div class="enroll__occ">' + I.occupancyHTML(c, { lg: true }) +
      '<p class="small muted" style="margin-top:.5rem">' + (st.occ.restantes > 0 ? "<strong>" + st.occ.restantes + "</strong> " + (st.occ.restantes === 1 ? "vaga restante" : "vagas restantes") + " · " : "") + st.occ.pctLabel + " de ocupação</p></div>" +
      cta +
      '<ul class="enroll__list">' +
      "<li>" + icon("calendar") + esc(I.fmtRange(c.dataInicio, c.dataFim)) + "</li>" +
      "<li>" + icon("clock") + esc(c.horario) + "</li>" +
      "<li>" + icon("map-pin") + esc(c.local) + "</li>" +
      "<li>" + icon("award") + (c.certificacao.oferece ? "Certificado incluso" : "Sem certificado") + "</li>" +
      "</ul>" +
      '<p class="enroll__safe">' + icon("lock") + "Simulação — nenhum pagamento é processado neste protótipo.</p>" +
      "</div>"
    );
  }

  function renderDetail(root, c, prof, related) {
    const st = I.courseStatus(c);
    document.title = c.titulo + " · Cursos · IOA | ITC São Luís";
    const pic = c.imagem;

    root.innerHTML =
      /* A. Apresentação */
      '<section class="course-hero">' +
      '<div class="container course-hero__grid">' +
      '<div class="course-hero__text">' +
      '<nav aria-label="Trilha de navegação"><ol class="breadcrumb"><li><a href="' + I.routes.home + '">Início</a></li><li><a href="' + I.routes.cursos + '">Cursos</a></li><li><span aria-current="page">' + esc(c.categoria) + "</span></li></ol></nav>" +
      '<div class="course-hero__badges">' + I.statusBadge(st) + '<span class="badge badge--plain" style="background:rgba(255,255,255,.08);color:#fff">' + esc(c.modalidade) + "</span>" + I.demoFlag("Curso demonstrativo", true) + "</div>" +
      '<span class="eyebrow">' + esc(c.categoria) + "</span>" +
      '<h1 class="h2">' + esc(c.titulo) + "</h1>" +
      '<p class="lead">' + esc(c.resumo) + "</p>" +
      '<ul class="course-hero__meta">' +
      "<li>" + icon("calendar") + esc(I.fmtRange(c.dataInicio, c.dataFim)) + "</li>" +
      "<li>" + icon("map-pin") + esc(c.local) + "</li>" +
      "<li>" + icon("clock") + c.cargaHoraria + " horas</li>" +
      "</ul></div>" +
      '<div class="course-hero__media">' + I.coverHTML(c, { green: c.categoria === "Anatomia" }) +
      I.profCutout(prof, "hero") +
      '<span class="course-hero__credit">' + (pic ? "Fotografia oficial da unidade" : "Capa ilustrativa — fotografia pendente") +
      (prof ? '<span class="course-hero__prof">Docente responsável: <strong>' + esc(prof.nome) + "</strong>" + (prof.demo ? " (perfil fictício)" : "") + "</span>" : "") + "</span>" +
      "</div></div></section>" +

      /* B. Informações principais */
      '<section class="info-strip"><div class="container"><div class="info-grid">' +
      infoCard("clock", "Carga horária", c.cargaHoraria + "h") +
      infoCard("calendar", "Realização", esc(I.fmtRange(c.dataInicio, c.dataFim))) +
      infoCard("monitor", "Modalidade", esc(c.modalidade)) +
      infoCard("users", "Vagas", c.vagas.capacidade + " no total") +
      infoCard("award", "Certificação", c.certificacao.oferece ? "Sim" : "Não") +
      infoCard("credit-card", "Investimento", I.money(c.preco) + "*") +
      "</div></div></section>" +

      '<div class="container course-layout">' +
      '<div class="course-main">' +

      /* C. Descrição */
      '<section class="course-section reveal" id="sobre-curso"><span class="eyebrow">Sobre o curso</span><h2 class="h3">Proposta e público</h2>' +
      '<p class="lead">' + esc(c.sobre) + "</p>" +
      '<div class="desc-grid">' +
      '<div class="desc-item"><h3>Necessidade que atende</h3><p>' + esc(c.problema) + "</p></div>" +
      '<div class="desc-item"><h3>Público-alvo</h3><p>' + esc(c.publico) + "</p></div>" +
      '<div class="desc-item"><h3>Pré-requisitos</h3><p>' + esc(c.prerequisitos || "Não há.") + "</p></div>" +
      '<div class="desc-item"><h3>Conhecimentos desenvolvidos</h3><ul class="chip-list">' + (c.conhecimentos || []).map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul></div>" +
      "</div></section>" +

      /* D. Aprendizado */
      '<section class="course-section reveal"><span class="eyebrow">Resultados</span><h2 class="h3">O que você irá aprender</h2>' +
      '<ol class="learn-list">' + c.aprendizado.map(function (a, i) { return '<li><span class="learn-list__n">' + String(i + 1).padStart(2, "0") + "</span><span>" + esc(a) + "</span></li>"; }).join("") + "</ol></section>" +

      /* E. Ementa */
      '<section class="course-section reveal"><div class="section-head--inline"><div><span class="eyebrow">Conteúdo programático</span><h2 class="h3">Ementa</h2></div>' +
      '<p class="small muted">' + c.ementa.length + " módulos · " + c.cargaHoraria + "h</p></div>" +
      '<div class="accordion" id="ementa">' +
      c.ementa.map(function (m, i) {
        return '<div class="accordion__item">' +
          '<h3 style="margin:0"><button type="button" class="accordion__trigger" aria-expanded="' + (i === 0) + '" aria-controls="mod-' + i + '" id="mod-btn-' + i + '">' +
          '<span class="accordion__index">' + String(i + 1).padStart(2, "0") + '</span><span class="accordion__title">' + esc(m.titulo) + "</span>" +
          '<span class="accordion__hours">' + (m.horas ? m.horas + "h" : "") + '</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>' +
          '<div class="accordion__panel' + (i === 0 ? " is-open" : "") + '" id="mod-' + i + '" role="region" aria-labelledby="mod-btn-' + i + '"><div><div class="accordion__content">' +
          "<p>" + esc(m.descricao) + "</p><ul>" + m.conteudos.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div></div></div>";
      }).join("") +
      "</div></section>" +

      /* F. Professor */
      (prof ?
        '<section class="course-section reveal"><span class="eyebrow">Docente</span><h2 class="h3">Quem conduz o curso</h2>' +
        '<div class="teacher">' +
        (prof.foto
          ? '<div class="teacher__photo teacher__photo--img"><img src="' + I.img(prof.foto) + '" alt="' + esc(prof.nome) + '"></div>'
          : '<div class="teacher__photo" aria-hidden="true"><span>' + esc(prof.iniciais) + "</span></div>") +
        '<div class="teacher__body">' +
        '<div class="teacher__head"><div><h3 class="h4">' + esc(prof.nome) + '</h3><p class="small muted">' + esc(prof.titulo) + "</p></div>" + (prof.demo ? I.demoFlag("Perfil fictício") : prof.curriculoPendente ? I.demoFlag("Currículo a confirmar") : "") + "</div>" +
        '<dl class="teacher__facts">' +
        "<div><dt>Formação</dt><dd>" + esc(prof.formacao) + "</dd></div>" +
        "<div><dt>Especializações</dt><dd>" + esc(prof.especializacoes.length ? prof.especializacoes.join(" · ") : "A confirmar com a unidade") + "</dd></div>" +
        "<div><dt>Experiência</dt><dd>" + esc(prof.experiencia) + "</dd></div>" +
        "</dl>" +
        '<p class="small">' + esc(prof.bio) + "</p>" +
        (prof.linkedin
          ? '<a class="link-arrow" href="' + esc(prof.linkedin) + '" target="_blank" rel="noopener">' + icon("linkedin") + "LinkedIn</a>"
          : '<p class="small muted">' + icon("linkedin") + " LinkedIn: a informar</p>") +
        "</div></div></section>"
        : "") +

      /* G. Materiais */
      '<section class="course-section reveal"><span class="eyebrow">Recursos</span><h2 class="h3">Materiais e ferramentas utilizados</h2>' +
      '<ul class="tools">' + c.materiais.map(function (m) { return '<li class="tool">' + icon(m.icone) + "<span>" + esc(m.nome) + "</span></li>"; }).join("") + "</ul>" +
      '<p class="small muted" style="margin-top:1rem">Lista demonstrativa — confirmar materiais e equipamentos com a coordenação do curso.</p></section>' +

      /* H. Certificação */
      '<section class="course-section reveal"><span class="eyebrow">Certificação</span><h2 class="h3">Certificado de conclusão</h2>' +
      '<div class="cert"><span class="cert__icon">' + icon("award") + "</span><dl>" +
      "<div><dt>Oferece certificado</dt><dd>" + (c.certificacao.oferece ? "Sim" : "Não") + "</dd></div>" +
      "<div><dt>Critérios</dt><dd>" + esc(c.certificacao.criterios) + "</dd></div>" +
      "<div><dt>Emissão</dt><dd>" + esc(c.certificacao.emissor) + "</dd></div>" +
      "</dl></div></section>" +

      "</div>" +

      /* I + J. Lotação e inscrição */
      '<aside class="course-aside" aria-label="Inscrição">' + enrollBox(c, st) + "</aside>" +
      "</div>" +

      /* Barra fixa mobile */
      '<div class="mobile-buy" aria-hidden="false"><div><span class="price__label">Investimento*</span><strong>' + I.money(c.preco) + "</strong></div>" +
      (st.canEnroll ? '<button type="button" class="btn" data-enroll>Garantir vaga</button>' : '<span class="badge badge--' + (st.key === "soon" ? "soon" : "sold") + '">' + esc(st.label) + "</span>") + "</div>" +

      /* Relacionados */
      (related.length ?
        '<section class="section section--ivory"><div class="container">' +
        '<div class="section-head section-head--split"><div><span class="eyebrow">Continue explorando</span><h2 class="h3" style="margin-top:.75rem">Outros cursos</h2></div>' +
        '<a class="link-arrow" href="' + I.routes.cursos + '">Ver catálogo ' + icon("arrow-right") + "</a></div>" +
        '<div class="grid-cards">' + related.map(I.courseCard).join("") + "</div></div></section>" : "");

    // Accordion
    root.querySelectorAll(".accordion__trigger").forEach(function (b) {
      b.addEventListener("click", function () {
        const open = b.getAttribute("aria-expanded") !== "true";
        b.setAttribute("aria-expanded", String(open));
        document.getElementById(b.getAttribute("aria-controls")).classList.toggle("is-open", open);
      });
    });

    root.addEventListener("click", function (e) {
      if (e.target.closest("[data-enroll]")) openEnrollment(c);
    });

    I.refresh(root);
  }

  function initDetail() {
    const root = document.getElementById("curso-root");
    if (!root) return;
    const id = I.qs("id");
    I.api.getCurso(id).then(function (c) {
      if (!c) return notFound(root);
      return Promise.all([I.api.getProfessor(c.professorId), I.api.getCursos()]).then(function (r) {
        const others = r[1].filter(function (x) { return x.id !== c.id && I.courseStatus(x).canEnroll; });
        others.sort(function (a, b) { return (b.categoria === c.categoria) - (a.categoria === c.categoria); });
        renderDetail(root, c, r[0], others.slice(0, 3));
      });
    });
  }

  /* ---------------------------------------------------------------
     Inscrição (simulação em 3 etapas)
     --------------------------------------------------------------- */
  function stepsHTML(n) {
    const labels = ["Dados", "Pagamento", "Confirmação"];
    return '<ol class="steps">' + labels.map(function (l, i) {
      return '<li class="' + (i + 1 < n ? "is-done" : i + 1 === n ? "is-active" : "") + '"' + (i + 1 === n ? ' aria-current="step"' : "") + ">" + (i + 1) + ". " + l + "</li>";
    }).join("") + "</ol>";
  }

  function openEnrollment(c) {
    const st = I.courseStatus(c);
    if (!st.canEnroll) return;
    const data = {};

    const step1 =
      '<form class="modal__body" id="form-inscricao" novalidate>' + stepsHTML(1) +
      '<div class="enroll-mini">' + I.coverHTML(c, { green: c.categoria === "Anatomia" }) + "<div><p class='tag'>" + esc(c.categoria) + "</p><p><strong>" + esc(c.titulo) + "</strong></p><p class='small muted'>" + esc(I.fmtRange(c.dataInicio, c.dataFim)) + " · " + esc(c.modalidade) + "</p></div></div>" +
      '<div class="form-alert" role="alert"></div>' +
      '<div class="form-grid">' +
      '<div class="field span-2"><label for="i-nome">Nome completo <span class="req">*</span></label><input class="input" id="i-nome" name="nome" required data-validate="name" autocomplete="name"></div>' +
      '<div class="field"><label for="i-email">E-mail <span class="req">*</span></label><input class="input" id="i-email" name="email" type="email" required autocomplete="email"></div>' +
      '<div class="field"><label for="i-tel">Telefone / WhatsApp <span class="req">*</span></label><input class="input" id="i-tel" name="telefone" type="tel" required data-validate="phone" autocomplete="tel" placeholder="(98) 90000-0000"></div>' +
      '<div class="field"><label for="i-form">Formação / área de atuação <span class="req">*</span></label><input class="input" id="i-form" name="formacao" required placeholder="Ex.: Odontologia"></div>' +
      '<div class="field"><label for="i-cidade">Cidade / UF</label><input class="input" id="i-cidade" name="cidade" autocomplete="address-level2" placeholder="São Luís – MA"></div>' +
      "</div>" +
      '<div class="modal__foot" style="padding:1.5rem 0 0"><button type="button" class="btn btn--outline" data-close>Cancelar</button><button type="submit" class="btn">Continuar ' + icon("arrow-right", "icon-arrow") + "</button></div>" +
      "</form>";

    function step2() {
      const parc = c.parcelas;
      const opts = [{ v: "avista", l: "À vista", d: I.money(c.preco) + " em parcela única" }];
      if (parc > 1) opts.push({ v: "parcelado", l: "Cartão de crédito parcelado", d: parc + "x de " + I.money(c.preco / parc, { cents: true }) + " sem juros" });
      return (
        '<form class="modal__body" id="form-pagamento" novalidate>' + stepsHTML(2) +
        '<fieldset class="pay-options"><legend class="label small" style="font-weight:700;margin-bottom:.75rem">Forma de pagamento (simulação)</legend>' +
        opts.map(function (o, i) {
          return '<label class="pay-option"><input type="radio" name="pagamento" value="' + o.v + '"' + (i === 0 ? " checked" : "") + "><span><strong>" + o.l + "</strong><small>" + o.d + "</small></span></label>";
        }).join("") +
        "</fieldset>" +
        F.summaryHTML([
          ["Curso", esc(c.titulo)],
          ["Participante", esc(data.nome)],
          ["E-mail", esc(data.email)],
          ["Total", I.money(c.preco, { cents: true }), true]
        ]) +
        '<div class="notice" style="margin-top:1.25rem">' + icon("lock") + "<span><strong>Nenhum pagamento será processado.</strong> Na versão final, esta etapa direcionará ao checkout seguro do gateway de pagamento integrado.</span></div>" +
        '<label class="checkbox" style="margin-top:1.25rem"><input type="checkbox" name="termos" required><span>Li e concordo com as condições de inscrição (texto a ser fornecido pela unidade).</span></label>' +
        '<div class="modal__foot" style="padding:1.5rem 0 0"><button type="button" class="btn btn--outline" data-back>Voltar</button><button type="submit" class="btn">Confirmar pré-inscrição</button></div>' +
        "</form>"
      );
    }

    function step3() {
      const pg = data.pagamento === "parcelado" ? c.parcelas + "x de " + I.money(c.preco / c.parcelas, { cents: true }) : "À vista — " + I.money(c.preco, { cents: true });
      return (
        '<div class="modal__body">' + stepsHTML(3) +
        '<div class="confirm-hero"><span class="confirm-hero__icon">' + icon("check") + "</span>" +
        '<h3 class="h4">Pré-inscrição simulada com sucesso</h3>' +
        '<p class="muted small">Protocolo de demonstração <strong>' + F.protocol("INS") + "</strong></p></div>" +
        F.summaryHTML([
          ["Curso", esc(c.titulo)],
          ["Data", esc(I.fmtRange(c.dataInicio, c.dataFim))],
          ["Local", esc(c.local)],
          ["Participante", esc(data.nome)],
          ["E-mail", esc(data.email)],
          ["Telefone", esc(data.telefone)],
          ["Formação", esc(data.formacao)],
          ["Pagamento", esc(pg), true]
        ]) +
        '<div class="notice" style="margin-top:1.25rem">' + icon("info") + "<span><strong>Vaga não reservada.</strong> Este protótipo não registra inscrições nem altera a lotação exibida. Em produção, a vaga seria confirmada após o pagamento.</span></div>" +
        '<div class="modal__foot" style="padding:1.5rem 0 0"><a class="btn btn--outline" href="' + I.routes.cursos + '">Ver outros cursos</a><button type="button" class="btn" data-close>Concluir</button></div>' +
        "</div>"
      );
    }

    function bindStep1(el) {
      const form = el.querySelector("#form-inscricao");
      Object.keys(data).forEach(function (k) { if (form.elements[k]) form.elements[k].value = data[k]; });
      F.liveValidation(form);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!F.validate(form)) return;
        Object.assign(data, F.serialize(form));
        I.modal.setContent(step2(), "Inscrição", c.titulo);
        bindStep2(I.modal.el);
      });
    }

    function bindStep2(el) {
      const form = el.querySelector("#form-pagamento");
      form.querySelector("[data-back]").addEventListener("click", function () {
        I.modal.setContent(step1, "Inscrição", c.titulo);
        bindStep1(I.modal.el);
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!F.validate(form)) return;
        data.pagamento = form.elements.pagamento.value;
        I.modal.setContent(step3(), "Inscrição", c.titulo);
        I.toast("Pré-inscrição simulada — nenhum pagamento processado.");
      });
    }

    I.modal.open({ title: "Inscrição", subtitle: c.titulo, html: step1, onOpen: bindStep1 });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCatalog();
    initDetail();
  });
})();
