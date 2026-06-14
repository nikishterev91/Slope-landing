/* ============================================================
   SLOPE — Modern Living
   Vanilla JS: nav state, smooth scroll, reveal, form validation
   ============================================================ */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const onScroll = () => {
    nav.classList.toggle("nav--scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav__links");

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // light stagger for siblings revealing together
            entry.target.style.transitionDelay = `${(i % 4) * 90}ms`;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const launch3d = document.getElementById("launch3d");
  const stage = document.getElementById("showcaseStage");
  if (launch3d) {
    launch3d.addEventListener("click", () => {
      const original = launch3d.innerHTML;
      launch3d.disabled = true;
      launch3d.innerHTML =
        '<span class="showcase__btn-dot"></span> Loading model…';
      // Placeholder for real 3D engine init (e.g. three.js / Matterport iframe).
      setTimeout(() => {
        launch3d.innerHTML = "Model ready — demo only";
        stage.classList.add("is-loaded");
        setTimeout(() => {
          launch3d.innerHTML = original;
          launch3d.disabled = false;
        }, 2200);
      }, 1400);
    });
  }

  const form = document.getElementById("inquiryForm");
  const success = document.getElementById("formSuccess");

  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? ""
        : "Please enter a valid email address.",
    phone: (v) =>
      /^[+()\d\s\-]{7,}$/.test(v.trim())
        ? ""
        : "Please enter a valid phone number.",
    project: (v) => (v ? "" : "Please select a residence."),
    message: (v) =>
      v.trim().length >= 10 ? "" : "Please tell us a little more (10+ chars).",
  };

  const setFieldState = (input, msg) => {
    const field = input.closest(".field");
    const error = field.querySelector(".field__error");
    field.classList.toggle("is-invalid", Boolean(msg));
    if (error) error.textContent = msg;
    return !msg;
  };

  const validateField = (input) => {
    const fn = validators[input.name];
    if (!fn) return true;
    return setFieldState(input, fn(input.value));
  };

  form.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("is-invalid")) {
        validateField(input);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    success.hidden = true;

    let valid = true;
    let firstInvalid = null;

    form.querySelectorAll("input, select, textarea").forEach((input) => {
      const ok = validateField(input);
      if (!ok && !firstInvalid) firstInvalid = input;
      valid = valid && ok;
    });

    if (!valid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    success.hidden = false;
    form.reset();
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
