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
  // Home page: lead capture form -> generate_lead -> /thank-you
  // ------------------------------------------------------------
  var leadForm = document.getElementById("lead-form");
  if (leadForm) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      track("generate_lead", {
        method: "AI Automation Checklist Download",
        form_location: "homepage",
      });
      redirect(leadForm.getAttribute("data-thank-you") || "thank-you/");
    });
  }

  // ------------------------------------------------------------
  // Contact page: contact form -> contact_form_submit -> /thank-you
  // ------------------------------------------------------------
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var automate = document.getElementById("automate-what");
      track("contact_form_submit", {
        form_location: "contact",
        automate_what: automate ? automate.value : "",
      });
      redirect(contactForm.getAttribute("data-thank-you") || "thank-you/");
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
