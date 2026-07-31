(function () {
  "use strict";

  var YEAR = document.getElementById("year");
  if (YEAR) YEAR.textContent = new Date().getFullYear();

  function track(eventName, params) {
    if (typeof gtag === "function") {
      gtag("event", eventName, params || {});
    }
  }

  function redirect(path) {
    window.location.href = path;
  }

  // ------------------------------------------------------------
  // Mobile navigation toggle
  // ------------------------------------------------------------
  var navToggle = document.getElementById("nav-toggle");
  var navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var expanded = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }

  // ------------------------------------------------------------
  // Home page: lead capture form -> Web3Forms -> generate_lead -> /thank-you
  // ------------------------------------------------------------
  var leadForm = document.getElementById("lead-form");
  if (leadForm) {
    var leadStatus = document.getElementById("lead-form-status");
    var leadBtn = leadForm.querySelector("button[type='submit']");

    function showLeadError(message) {
      if (!leadStatus) {
        alert(message);
        return;
      }
      leadStatus.textContent = message;
      leadStatus.classList.add("is-error");
      leadStatus.setAttribute("aria-hidden", "false");
    }

    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (leadStatus) {
        leadStatus.textContent = "";
        leadStatus.classList.remove("is-error");
      }
      if (leadBtn) leadBtn.disabled = true;
      fetch(leadForm.action, {
        method: "POST",
        body: new FormData(leadForm),
        headers: { "Accept": "application/json" },
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.success) {
            track("generate_lead", {
              method: "AI Automation Checklist Download",
              form_location: "homepage",
            });
            redirect(leadForm.getAttribute("data-thank-you") || "thank-you/");
          } else {
            showLeadError(
              (data && data.message) ||
                "There was a problem sending your message. Please try again."
            );
            if (leadBtn) leadBtn.disabled = false;
          }
        })
        .catch(function () {
          showLeadError(
            "Network error. Please check your connection and try again."
          );
          if (leadBtn) leadBtn.disabled = false;
        });
    });
  }

  // ------------------------------------------------------------
  // Contact page: contact form -> Web3Forms -> contact_form_submit -> /thank-you
  // ------------------------------------------------------------
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var statusEl = document.getElementById("form-status");
    var submitBtn = contactForm.querySelector("button[type='submit']");

    function showFormError(message) {
      if (!statusEl) {
        alert(message);
        return;
      }
      statusEl.textContent = message;
      statusEl.classList.add("is-error");
      statusEl.setAttribute("aria-hidden", "false");
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var automate = document.getElementById("automate-what");
      if (statusEl) {
        statusEl.textContent = "";
        statusEl.classList.remove("is-error");
      }
      if (submitBtn) submitBtn.disabled = true;
      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" },
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.success) {
            track("contact_form_submit", {
              form_location: "contact",
              automate_what: automate ? automate.value : "",
            });
            redirect(contactForm.getAttribute("data-thank-you") || "thank-you/");
          } else {
            showFormError(
              (data && data.message) ||
                "There was a problem sending your message. Please try again."
            );
            if (submitBtn) submitBtn.disabled = false;
          }
        })
        .catch(function () {
          showFormError(
            "Network error. Please check your connection and try again."
          );
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  // ------------------------------------------------------------
  // Services page: pricing toggle -> pricing_toggle_view
  // ------------------------------------------------------------
  var pricingToggle = document.getElementById("pricing-toggle");
  if (pricingToggle) {
    var billingMode = "monthly";
    var priceEls = document.querySelectorAll(".js-price");
    var noteEls = document.querySelectorAll(".js-billing-note");

    function formatPrice(value) {
      return Number(value).toLocaleString("en-US");
    }

    function renderPrices() {
      priceEls.forEach(function (el) {
        el.textContent = "$" + formatPrice(el.getAttribute("data-" + billingMode));
      });
      noteEls.forEach(function (el) {
        if (billingMode === "yearly") {
          el.textContent = "/mo, billed annually";
        } else {
          el.textContent = "/month";
        }
      });
    }

    pricingToggle.querySelectorAll("[data-billing]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = btn.getAttribute("data-billing");
        if (next === billingMode) return;
        billingMode = next;
        pricingToggle
          .querySelectorAll("[data-billing]")
          .forEach(function (b) {
            b.classList.toggle("is-active", b === btn);
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });
        renderPrices();
        track("pricing_toggle_view", {
          billing_period: next,
        });
      });
    });
  }

  // ------------------------------------------------------------
  // Services page: service card expand -> service_card_click
  // ------------------------------------------------------------
  document.querySelectorAll(".js-service-card summary").forEach(function (summary) {
    summary.addEventListener("click", function () {
      var card = summary.closest(".js-service-card");
      track("service_card_click", {
        service_name: card.getAttribute("data-service"),
      });
    });
  });
})();
