/* ==========================================================================
   Formulários — validação e utilitários (usados na reserva de vagas)
   ========================================================================== */

window.IOA_FORMS = (function () {
  "use strict";

  const I = window.IOA;
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

  function summaryHTML(rows) {
    return (
      '<dl class="summary">' +
      rows.filter(function (r) { return r && r[1]; }).map(function (r) {
        return '<div class="summary__row' + (r[2] ? " summary__row--total" : "") + '"><dt>' + esc(r[0]) + "</dt><dd>" + r[1] + "</dd></div>";
      }).join("") +
      "</dl>"
    );
  }

  return {
    validate: validate,
    liveValidation: liveValidation,
    serialize: serialize,
    summaryHTML: summaryHTML,
    protocol: protocol
  };
})();
