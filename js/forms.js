/* ==========================================================================
   Formulários — validação, reserva de salas e contato
   ========================================================================== */

window.IOA_FORMS = (function () {
  "use strict";

  const I = window.IOA;
  const DATA = I.DATA;
  const esc = I.esc;

  /* ---------------------------------------------------------------
     Validação genérica
     --------------------------------------------------------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(field, msg) {
    const wrap = field.closest(".field") || field.closest(".checkbox");
    if (!wrap) return;
    let err = wrap.querySelector(".field__error");
    if (!err) {
      err = document.createElement("span");
      err.className = "field__error";
      err.id = (field.id || field.name) + "-erro";
      wrap.appendChild(err);
    }
    wrap.classList.toggle("has-error", !!msg);
    err.textContent = msg || "";
    if (msg) {
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", err.id);
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  function checkField(field) {
    const v = field.type === "checkbox" ? field.checked : String(field.value || "").trim();
    if (field.required && !v) {
      return field.type === "checkbox" ? "Confirme para continuar." : "Campo obrigatório.";
    }
    if (!v) return "";
    if (field.type === "email" && !EMAIL_RE.test(v)) return "Informe um e-mail válido.";
    if (field.dataset.validate === "phone" && v.replace(/\D/g, "").length < 10) return "Informe um telefone com DDD.";
    if (field.dataset.validate === "name" && v.split(/\s+/).length < 2) return "Informe nome e sobrenome.";
    if (field.minLength > 0 && v.length < field.minLength) return "Mínimo de " + field.minLength + " caracteres.";
    return "";
  }

  function validate(form, extra) {
    let firstInvalid = null;
    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      if (f.disabled || f.type === "hidden") return;
      const msg = checkField(f);
      setError(f, msg);
      if (msg && !firstInvalid) firstInvalid = f;
    });
    if (extra) {
      const errs = extra(form) || [];
      errs.forEach(function (e) {
        const f = form.elements[e.name];
        if (f) {
          setError(f, e.msg);
          if (!firstInvalid) firstInvalid = f;
        }
      });
    }
    const alert = form.querySelector(".form-alert");
    if (alert) {
      alert.classList.toggle("is-visible", !!firstInvalid);
      alert.textContent = firstInvalid ? "Revise os campos destacados para continuar." : "";
    }
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function liveValidation(form) {
    form.addEventListener("input", function (e) {
      const f = e.target;
      if (f.dataset.validate === "phone") maskPhone(f);
      if (f.closest(".has-error")) setError(f, checkField(f));
    });
    form.addEventListener("change", function (e) {
      if (e.target.closest(".has-error")) setError(e.target, checkField(e.target));
    });
    form.addEventListener("focusout", function (e) {
      const f = e.target;
      if (f.matches("input, select, textarea") && String(f.value || "").trim()) setError(f, checkField(f));
    });
  }

  function maskPhone(f) {
    let d = f.value.replace(/\D/g, "").slice(0, 11);
    let out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
    f.value = out;
  }

  function serialize(form) {
    const o = {};
    new FormData(form).forEach(function (v, k) { o[k] = typeof v === "string" ? v.trim() : v; });
    return o;
  }

  function protocol(prefix) {
    const d = new Date();
    return prefix + "-" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  }

  function isoToday() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  const toMin = function (t) {
    const p = String(t).split(":").map(Number);
    return p[0] * 60 + (p[1] || 0);
  };

  function summaryHTML(rows) {
    return (
      '<dl class="summary">' +
      rows.filter(function (r) { return r && r[1]; }).map(function (r) {
        return '<div class="summary__row' + (r[2] ? " summary__row--total" : "") + '"><dt>' + esc(r[0]) + "</dt><dd>" + r[1] + "</dd></div>";
      }).join("") +
      "</dl>"
    );
  }

  /* ---------------------------------------------------------------
     Reserva de salas
     --------------------------------------------------------------- */
  function reservationFormHTML(salaId) {
    const opts = DATA.salas.map(function (s) {
      return '<option value="' + s.id + '"' + (s.id === salaId ? " selected" : "") + ">" + esc(s.nome) + " — até " + s.capacidade + " pessoas</option>";
    }).join("");
    const fins = DATA.finalidadesReserva.map(function (f) { return "<option>" + esc(f) + "</option>"; }).join("");
    const h = DATA.config.unidade.horarios.map(function (x) { return x.dias + " " + x.horas; }).join(" · ");
    return (
      '<form class="modal__body" id="form-reserva" novalidate>' +
      '<div class="form-alert" role="alert"></div>' +
      '<div class="form-grid">' +
      '<div class="field span-2"><label for="r-nome">Nome completo <span class="req">*</span></label><input class="input" id="r-nome" name="nome" required data-validate="name" autocomplete="name"></div>' +
      '<div class="field span-2"><label for="r-empresa">Empresa ou instituição</label><input class="input" id="r-empresa" name="empresa" autocomplete="organization"></div>' +
      '<div class="field"><label for="r-email">E-mail <span class="req">*</span></label><input class="input" id="r-email" name="email" type="email" required autocomplete="email"></div>' +
      '<div class="field"><label for="r-tel">Telefone <span class="req">*</span></label><input class="input" id="r-tel" name="telefone" type="tel" required data-validate="phone" autocomplete="tel" placeholder="(98) 90000-0000"></div>' +
      '<div class="field span-2"><label for="r-sala">Sala desejada <span class="req">*</span></label><select class="select" id="r-sala" name="sala" required><option value="">Selecione</option>' + opts + "</select></div>" +
      '<div class="field"><label for="r-data">Data pretendida <span class="req">*</span></label><input class="input" id="r-data" name="data" type="date" required min="' + isoToday() + '"></div>' +
      '<div class="field"><label for="r-fin">Finalidade <span class="req">*</span></label><select class="select" id="r-fin" name="finalidade" required><option value="">Selecione</option>' + fins + "</select></div>" +
      '<div class="field"><label for="r-ini">Horário de início <span class="req">*</span></label><input class="input" id="r-ini" name="inicio" type="time" required step="1800"></div>' +
      '<div class="field"><label for="r-fim">Horário de término <span class="req">*</span></label><input class="input" id="r-fim" name="fim" type="time" required step="1800"></div>' +
      '<p class="field__hint span-2">Funcionamento: ' + esc(h) + ".</p>" +
      '<div class="field span-2"><label for="r-pessoas">Número estimado de participantes</label><input class="input" id="r-pessoas" name="pessoas" type="number" min="1" inputmode="numeric"></div>' +
      '<div class="field span-2"><label for="r-obs">Observações adicionais</label><textarea class="textarea" id="r-obs" name="observacoes" placeholder="Layout, recursos necessários, coffee break…"></textarea></div>' +
      '<label class="checkbox span-2"><input type="checkbox" name="consentimento" required><span>Autorizo o contato da unidade sobre esta solicitação e compreendo que ela <strong>não confirma disponibilidade</strong>.</span></label>' +
      "</div>" +
      '<div class="notice" style="margin-top:1.5rem">' + I.icon("info") + "<span><strong>Protótipo:</strong> a solicitação não é enviada a nenhum sistema. Na versão final, este fluxo será integrado ao Google Agenda ou a um sistema de reservas.</span></div>" +
      '<div class="modal__foot" style="padding:1.5rem 0 0"><button type="button" class="btn btn--outline" data-close>Cancelar</button><button type="submit" class="btn">Solicitar reserva ' + I.icon("arrow-right", "icon-arrow") + "</button></div>" +
      "</form>"
    );
  }

  function reservationChecks(form) {
    const errs = [];
    const f = form.elements;
    const sala = DATA.salas.find(function (s) { return s.id === f.sala.value; });
    if (f.data.value) {
      if (f.data.value < isoToday()) errs.push({ name: "data", msg: "Escolha uma data a partir de hoje." });
      const dow = I.parseDate(f.data.value).getDay();
      if (!DATA.config.unidade.funcionamento[dow]) errs.push({ name: "data", msg: "A unidade não funciona aos domingos." });
    }
    if (f.inicio.value && f.fim.value) {
      if (toMin(f.fim.value) <= toMin(f.inicio.value)) {
        errs.push({ name: "fim", msg: "O término deve ser posterior ao início." });
      } else if (f.data.value) {
        const hrs = DATA.config.unidade.funcionamento[I.parseDate(f.data.value).getDay()];
        if (hrs && (toMin(f.inicio.value) < toMin(hrs[0]) || toMin(f.fim.value) > toMin(hrs[1]))) {
          errs.push({ name: "inicio", msg: "Horário fora do funcionamento (" + hrs[0] + " às " + hrs[1] + ")." });
        }
      }
    }
    if (sala && f.pessoas.value && Number(f.pessoas.value) > sala.capacidade) {
      errs.push({ name: "pessoas", msg: "Acima da capacidade da sala (" + sala.capacidade + " pessoas)." });
    }
    return errs;
  }

  function reservationSummary(d) {
    const sala = DATA.salas.find(function (s) { return s.id === d.sala; });
    const horas = (toMin(d.fim) - toMin(d.inicio)) / 60;
    const estimativa = sala && sala.precoHora != null ? I.money(sala.precoHora * horas, { cents: true }) + " <small class='muted'>(estimativa demonstrativa)</small>" : "Sob consulta";
    const prot = protocol("RES");
    return (
      '<div class="modal__body">' +
      '<div class="confirm-hero"><span class="confirm-hero__icon">' + I.icon("check") + "</span>" +
      '<h3 class="h4">Solicitação registrada</h3>' +
      '<p class="muted small">Protocolo de demonstração <strong>' + prot + "</strong></p></div>" +
      summaryHTML([
        ["Solicitante", esc(d.nome)],
        ["Empresa", esc(d.empresa)],
        ["E-mail", esc(d.email)],
        ["Telefone", esc(d.telefone)],
        ["Sala", sala ? esc(sala.nome) : ""],
        ["Data", esc(I.fmtDate(d.data, "weekday"))],
        ["Horário", esc(d.inicio + " às " + d.fim) + " (" + horas.toString().replace(".", ",") + "h)"],
        ["Finalidade", esc(d.finalidade)],
        ["Participantes", esc(d.pessoas)],
        ["Observações", esc(d.observacoes)],
        ["Valor estimado", estimativa, true]
      ]) +
      '<div class="notice" style="margin-top:1.25rem">' + I.icon("info") + "<span><strong>Disponibilidade não confirmada.</strong> Esta é uma simulação: a equipe da unidade entraria em contato para validar data, horário e condições comerciais.</span></div>" +
      '<div class="modal__foot" style="padding:1.5rem 0 0">' +
      '<a class="btn btn--outline" href="' + DATA.config.unidade.whatsapp + '" target="_blank" rel="noopener">' + I.icon("message-circle") + "Falar no WhatsApp</a>" +
      '<button type="button" class="btn" data-close>Concluir</button></div>' +
      "</div>"
    );
  }

  function openReservation(salaId) {
    const sala = DATA.salas.find(function (s) { return s.id === salaId; });
    I.modal.open({
      title: "Solicitar reserva",
      subtitle: sala ? sala.nome + " · preencha os dados para a unidade avaliar a disponibilidade" : "Preencha os dados para a unidade avaliar a disponibilidade",
      html: reservationFormHTML(salaId),
      onOpen: function (el) {
        const form = el.querySelector("#form-reserva");
        liveValidation(form);
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          if (!validate(form, reservationChecks)) return;
          const d = serialize(form);
          I.modal.setContent(reservationSummary(d), "Resumo da solicitação", "Confira os dados enviados");
          I.toast("Solicitação de reserva simulada com sucesso.");
        });
      }
    });
  }

  /* ---------------------------------------------------------------
     Formulário de contato (página Contato)
     --------------------------------------------------------------- */
  function initContact() {
    const form = document.getElementById("form-contato");
    if (!form) return;
    liveValidation(form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      const d = serialize(form);
      const box = document.getElementById("contato-resultado");
      box.innerHTML =
        '<div class="confirm-hero" style="justify-items:start;text-align:left"><span class="confirm-hero__icon">' + I.icon("check") + "</span>" +
        '<h3 class="h4">Mensagem registrada (simulação)</h3><p class="muted small">Protocolo de demonstração <strong>' + protocol("CTT") + "</strong>. Nenhum dado foi enviado — na versão final esta mensagem chegaria à equipe da unidade.</p></div>" +
        summaryHTML([["Nome", esc(d.nome)], ["E-mail", esc(d.email)], ["Telefone", esc(d.telefone)], ["Assunto", esc(d.assunto)], ["Mensagem", esc(d.mensagem)]]) +
        '<button type="button" class="btn btn--outline" style="margin-top:1.5rem" id="contato-novo">Enviar nova mensagem</button>';
      form.hidden = true;
      box.hidden = false;
      box.focus();
      document.getElementById("contato-novo").addEventListener("click", function () {
        form.reset();
        form.hidden = false;
        box.hidden = true;
        form.querySelector("input").focus();
      });
      I.toast("Mensagem simulada com sucesso.");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initContact();
    document.addEventListener("click", function (e) {
      const b = e.target.closest("[data-reserve]");
      if (b) {
        e.preventDefault();
        openReservation(b.dataset.reserve);
      }
    });
  });

  return {
    validate: validate,
    liveValidation: liveValidation,
    serialize: serialize,
    summaryHTML: summaryHTML,
    protocol: protocol,
    openReservation: openReservation
  };
})();
