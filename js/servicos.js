/* ==========================================================================
   Módulo de serviços — catálogo, detalhe e agendamento de triagem
   ========================================================================== */

window.IOA_SERVICOS = (function () {
  "use strict";

  const I = window.IOA;
  const DATA = I.DATA;
  const esc = I.esc;
  const icon = I.icon;

  /* Link de agendamento (Google Agenda), em ordem de prioridade:
     1. agendaUrl do serviço  2. config.agenda.urlPadrao  3. evento-modelo (demo) */
  function scheduleLink(s) {
    if (s.agendaUrl) return { url: s.agendaUrl, demo: false };
    if (DATA.config.agenda.urlPadrao) return { url: DATA.config.agenda.urlPadrao, demo: false };
    const u = DATA.config.unidade;
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: "Triagem — " + s.nome + " | IOA ITC São Luís",
      details:
        "Triagem odontológica de " + DATA.config.agenda.duracaoTriagemMin + " minutos — " + s.nome + " (" + s.especialidade + ").\n" +
        "Link demonstrativo gerado pelo protótipo IOA | ITC São Luís — substituir pela página de agendamento oficial do Google Agenda.",
      location: u.endereco + ", " + u.cidade + ", " + u.cep
    });
    return { url: "https://calendar.google.com/calendar/render?" + p.toString(), demo: true };
  }

  function openSchedule(id) {
    const s = DATA.servicos.find(function (x) { return x.id === id; });
    if (!s) return;
    const link = scheduleLink(s);
    const p = I.servicePrice(s);
    I.modal.open({
      title: "Agendar triagem",
      subtitle: s.nome,
      size: "sm",
      html:
        '<div class="modal__body">' +
        '<div class="schedule-head"><span class="service-card__icon">' + icon(s.icone) + "</span><div><p class='tag'>" + esc(s.categoria) + "</p><p><strong>" + esc(s.nome) + "</strong></p>" +
        '<p class="small muted">' + p.label + ": " + p.value + p.suffix + " (demonstrativo)</p></div></div>" +
        '<ol class="flow">' +
        "<li><span>1</span><div><strong>Abra o Google Agenda</strong><p>Você será direcionado em uma nova aba.</p></div></li>" +
        "<li><span>2</span><div><strong>Escolha um horário disponível</strong><p>Triagem de " + DATA.config.agenda.duracaoTriagemMin + " minutos na clínica da unidade.</p></div></li>" +
        "<li><span>3</span><div><strong>Compareça à triagem</strong><p>Se o seu caso for compatível, você é convidado para a turma prática.</p></div></li>" +
        "</ol>" +
        (link.demo
          ? '<div class="notice">' + icon("info") + "<span><strong>Link demonstrativo.</strong> Abre um evento-modelo do Google Agenda. Configure a página de agendamento oficial em <code>js/data.js</code> (<code>agendaUrl</code> ou <code>config.agenda.urlPadrao</code>).</span></div>"
          : "") +
        '<div class="modal__foot" style="padding:1.5rem 0 0">' +
        '<button type="button" class="btn btn--outline" data-close>Cancelar</button>' +
        '<a class="btn" href="' + esc(link.url) + '" target="_blank" rel="noopener" data-go-agenda>' + icon("calendar") + "Abrir Google Agenda</a>" +
        "</div></div>",
      onOpen: function (el) {
        el.querySelector("[data-go-agenda]").addEventListener("click", function () {
          setTimeout(function () {
            I.modal.close();
            I.toast("Google Agenda aberto em nova aba.", "calendar");
          }, 150);
        });
      }
    });
  }

  /* ---------------------------------------------------------------
     Catálogo
     --------------------------------------------------------------- */
  function initCatalog() {
    const grid = document.getElementById("grid-servicos");
    if (!grid) return;
    const chips = document.getElementById("s-categorias");
    I.api.getServicos().then(function (list) {
      let cat = "";
      const cats = [""].concat(Array.from(new Set(list.map(function (s) { return s.categoria; }))));
      function render() {
        chips.innerHTML = cats.map(function (c) {
          return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (c === cat) + '">' + esc(c || "Todos") + "</button>";
        }).join("");
        const items = list.filter(function (s) { return !cat || s.categoria === cat; });
        grid.innerHTML = items.map(function (s) { return I.serviceCard(s); }).join("");
        I.refresh(grid);
      }
      chips.addEventListener("click", function (e) {
        const b = e.target.closest("[data-cat]");
        if (!b) return;
        cat = b.dataset.cat;
        render();
      });
      render();
    });

    const table = document.getElementById("tabela-precos");
    if (table) {
      table.innerHTML = DATA.servicos.map(function (s) {
        const p = I.servicePrice(s);
        return "<tr><th scope='row'><a href='" + I.routes.servico(s.id) + "'>" + esc(s.nome) + "</a></th><td>" + esc(s.categoria) + "</td><td>" + esc(p.label) + "</td><td><strong>" + p.value + p.suffix + "</strong></td>" +
          "<td><button type='button' class='btn btn--sm btn--outline' data-schedule='" + esc(s.id) + "'>Agendar</button></td></tr>";
      }).join("");
    }
  }

  /* ---------------------------------------------------------------
     Detalhe
     --------------------------------------------------------------- */
  function initDetail() {
    const root = document.getElementById("servico-root");
    if (!root) return;
    I.api.getServico(I.qs("id")).then(function (s) {
      if (!s) {
        root.innerHTML =
          '<section class="section"><div class="container"><div class="empty">' + icon("search") +
          '<h1 class="h3">Serviço não encontrado</h1><p>O serviço solicitado não existe ou foi removido.</p>' +
          '<a class="btn" href="' + I.routes.servicos + '">Ver serviços</a></div></div></section>';
        return;
      }
      document.title = s.nome + " · Serviços · IOA | ITC São Luís";
      const p = I.servicePrice(s);
      const others = DATA.servicos.filter(function (x) { return x.id !== s.id; }).slice(0, 3);
      root.innerHTML =
        '<section class="page-hero"><div class="container"><div class="page-hero__inner">' +
        '<nav aria-label="Trilha de navegação"><ol class="breadcrumb"><li><a href="' + I.routes.home + '">Início</a></li><li><a href="' + I.routes.servicos + '">Serviços</a></li><li><span aria-current="page">' + esc(s.categoria) + "</span></li></ol></nav>" +
        '<div style="display:flex;gap:.6rem;flex-wrap:wrap">' + I.demoFlag("Atendimento demonstrativo", true) + "</div>" +
        '<span class="eyebrow">' + esc(s.categoria) + "</span>" +
        '<h1 class="h2">' + esc(s.nome) + "</h1>" +
        '<p class="lead">' + esc(s.resumo) + "</p>" +
        "</div></div></section>" +

        '<div class="container course-layout">' +
        '<div class="course-main">' +
        '<section class="course-section reveal"><span class="eyebrow">Descrição</span><h2 class="h3">Como funciona</h2><p class="lead">' + esc(s.descricao) + "</p>" +
        '<div class="desc-grid">' +
        '<div class="desc-item"><h3>Para quem</h3><p>' + esc(s.publico) + "</p></div>" +
        '<div class="desc-item"><h3>Duração</h3><p>' + esc(s.prazo || "A definir") + "</p></div>" +
        '<div class="desc-item"><h3>Especialidade</h3><p>' + esc(s.especialidade) + "</p></div>" +
        '<div class="desc-item"><h3>Quem atende</h3><p>Cirurgiões-dentistas em formação, sob supervisão de professores (modelo a confirmar com a unidade).</p></div>' +
        "</div></section>" +
        '<section class="course-section reveal"><span class="eyebrow">Benefícios</span><h2 class="h3">Vantagens para o paciente</h2>' +
        '<ul class="tools">' + s.beneficios.map(function (b) { return '<li class="tool">' + icon("check") + "<span>" + esc(b) + "</span></li>"; }).join("") + "</ul></section>" +
        '<section class="course-section reveal"><span class="eyebrow">Escopo</span><h2 class="h3">O atendimento inclui</h2>' +
        '<ul class="check-list check-list--lg">' + s.incluso.map(function (b) { return "<li>" + icon("check") + "<span>" + esc(b) + "</span></li>"; }).join("") + "</ul></section>" +
        '<section class="course-section reveal"><span class="eyebrow">Jornada</span><h2 class="h3">Como se tornar paciente</h2>' +
        '<ol class="learn-list">' + s.etapas.map(function (a, i) { return '<li><span class="learn-list__n">' + String(i + 1).padStart(2, "0") + "</span><span>" + esc(a) + "</span></li>"; }).join("") + "</ol></section>" +
        "</div>" +
        '<aside class="course-aside" aria-label="Agendamento"><div class="enroll">' +
        '<div class="enroll__top"><span class="service-card__icon">' + icon(s.icone) + "</span>" + I.demoFlag("Valor fictício") + "</div>" +
        '<p class="price__label">' + esc(p.label) + "</p>" +
        '<p class="enroll__price">' + p.value + '<small style="font-size:1rem;color:var(--graphite-400)">' + p.suffix + "</small></p>" +
        '<p class="small muted" style="margin-bottom:1.25rem">Valor final definido após a triagem e o plano de tratamento.</p>' +
        '<button type="button" class="btn btn--lg btn--block" data-schedule="' + esc(s.id) + '">' + icon("calendar") + "Agendar triagem</button>" +
        '<a class="btn btn--block btn--outline" style="margin-top:.75rem" href="' + DATA.config.unidade.whatsapp + '" target="_blank" rel="noopener">' + icon("message-circle") + "Tirar dúvidas</a>" +
        '<ul class="enroll__list">' +
        "<li>" + icon("clock") + "Triagem de " + DATA.config.agenda.duracaoTriagemMin + " minutos</li>" +
        "<li>" + icon("calendar") + "Agendamento via Google Agenda</li>" +
        "<li>" + icon("map-pin") + "Clínica IOA — São Luís</li>" +
        "</ul></div></aside>" +
        "</div>" +
        '<div class="mobile-buy"><div><span class="price__label">' + esc(p.label) + "*</span><strong>" + p.value + p.suffix + '</strong></div><button type="button" class="btn" data-schedule="' + esc(s.id) + '">Agendar triagem</button></div>' +
        '<section class="section section--ivory"><div class="container">' +
        '<div class="section-head section-head--split"><div><span class="eyebrow">Seja um paciente</span><h2 class="h3" style="margin-top:.75rem">Outros tratamentos</h2></div>' +
        '<a class="link-arrow" href="' + I.routes.servicos + '">Ver todos ' + icon("arrow-right") + "</a></div>" +
        '<div class="grid-cards">' + others.map(function (o) { return I.serviceCard(o, { compact: true }); }).join("") + "</div></div></section>";
      I.refresh(root);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCatalog();
    initDetail();
  });

  return { openSchedule: openSchedule, scheduleLink: scheduleLink };
})();
