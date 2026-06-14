/* ============================================================
   SLOPE — Modern Living (Dark Redesign)
   Vanilla JS: nav, smooth scroll, reveal, form, & hero slider
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

    document.addEventListener('DOMContentLoaded', () => {
        const langLinks = document.querySelectorAll(".nav__lang-link");

        console.log(`Found language links: ${langLinks.length}`);

        langLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                const chosenLang = e.currentTarget.textContent.trim().toLowerCase();

                document.cookie = `_locale=${chosenLang}; path=/; max-age=31536000; SameSite=Lax`;

                console.log(`Language preference saved cookie value: ${chosenLang}`);
            });
        });
    });

  if (navToggle && navLinks) {
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
  }

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

  const prevSlide = document.getElementById("prevSlide");
  const nextSlide = document.getElementById("nextSlide");
  const slides = document.querySelectorAll(".preview-card__slide");
  const imgs = document.querySelectorAll(".preview-card__img");
  const dots = document.querySelectorAll(".preview-card__dot");

  if (prevSlide && nextSlide && slides.length > 0) {
    let currentIdx = 0;
    const totalSlides = slides.length;

    const goToSlide = (idx) => {
      slides[currentIdx].classList.remove("active");
      imgs[currentIdx].classList.remove("active");
      dots[currentIdx].classList.remove("active");

      currentIdx = (idx + totalSlides) % totalSlides;

      slides[currentIdx].classList.add("active");
      imgs[currentIdx].classList.add("active");
      dots[currentIdx].classList.add("active");
    };

    prevSlide.addEventListener("click", () => goToSlide(currentIdx - 1));
    nextSlide.addEventListener("click", () => goToSlide(currentIdx + 1));

    dots.forEach((dot, idx) => {
      dot.style.cursor = "pointer";
      dot.addEventListener("click", () => goToSlide(idx));
    });
  }

    /**
     * @typedef {Object} I18n
     * @property {Object} validation
     * @property {string} validation.fullName
     * @property {string} validation.email
     * @property {string} validation.phone
     * @property {string} validation.project
     * @property {string} validation.message
     *
     * @property {Object} showcase
     * @property {string} showcase.loading
     * @property {string} showcase.ready
     */

    /** @type {I18n} */
    const i18n = window.i18n;

  const launch3d = document.getElementById("launch3d");
  const stage = document.getElementById("showcaseStage");
  const launchText = `<span class="showcase__btn-dot"></span>${window.i18n.showcase.loading}`;
  if (launch3d) {
    launch3d.addEventListener("click", () => {
      const original = launch3d.innerHTML;
      launch3d.disabled = true;
      launch3d.innerHTML = launchText;
      setTimeout(() => {
        launch3d.innerHTML = i18n.showcase.ready;
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

  if (form) {
    const validators = {
      name: (v) => (v.trim().length >= 2
          ? ""
          : i18n.validation.fullName
      ),
      email: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
          ? ""
          : i18n.validation.email,
      phone: (v) =>
        /^[+()\d\s\-]{7,}$/.test(v.trim())
          ? ""
          : i18n.validation.phone,
      project: (v) => (v
          ? ""
          : i18n.validation.project
      ),
      message: (v) =>
        v.trim().length >= 10
            ? ""
            : i18n.validation.message,
    };

    const setFieldState = (input, msg) => {
      const field = input.closest(".field");
      if (!field) return true;
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
        const field = input.closest(".field");
        if (field && field.classList.contains("is-invalid")) {
          validateField(input);
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (success) success.hidden = true;

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

      if (success) success.hidden = false;
      form.reset();

      if (slides.length > 0) {
        slides.forEach((s, idx) => {
          s.classList.toggle("active", idx === 0);
          imgs[idx].classList.toggle("active", idx === 0);
          dots[idx].classList.toggle("active", idx === 0);
        });
      }

      if (success) {
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = document.documentElement.classList.toggle("light-mode");
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
