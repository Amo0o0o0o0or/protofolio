const languageButton = document.querySelector(".language-toggle");
const themeButton = document.querySelector(".theme-toggle");
const translatableElements = document.querySelectorAll("[data-en][data-ar]");
const themeColor = document.querySelector('meta[name="theme-color"]');

function updateThemeButton(isDark) {
  const isArabic = document.documentElement.lang === "ar";
  const label = isArabic
    ? isDark
      ? "التبديل إلى الوضع الفاتح"
      : "التبديل إلى الوضع الداكن"
    : `Switch to ${isDark ? "light" : "dark"} mode`;

  themeButton.setAttribute("aria-pressed", String(isDark));
  themeButton.setAttribute("aria-label", label);
  themeButton.title = label;
}

function setTheme(theme, persist = true) {
  const isDark = theme === "dark";

  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  updateThemeButton(isDark);
  themeColor.content = isDark ? "#111512" : "#f6f5f0";

  if (persist) {
    try {
      localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    } catch (error) {
      console.warn("Could not save the portfolio theme preference.", error);
    }
  }
}

setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light", false);

function setLanguage(language) {
  const isArabic = language === "ar";

  translatableElements.forEach((element) => {
    element.innerHTML = element.dataset[isArabic ? "ar" : "en"];
  });

  document.documentElement.lang = language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";
  languageButton.textContent = isArabic ? "EN" : "عربي";
  languageButton.setAttribute("aria-pressed", String(isArabic));
  languageButton.setAttribute(
    "aria-label",
    isArabic ? "Switch language to English" : "Switch language to Arabic",
  );
  document.title = isArabic
    ? "عمر شريف — مطوّر ويب شامل ومهندس برمجيات"
    : "Omar Sherif — Full-Stack Developer & Software Engineer";
  const isDark = document.documentElement.dataset.theme === "dark";
  updateThemeButton(isDark);

  document.querySelector(".whatsapp-link").href =
    `https://wa.me/201205305270?text=${encodeURIComponent(
      isArabic
        ? "مرحبًا عمر، شاهدت معرض أعمالك وأرغب في مناقشة مشروع."
        : "Hi Omar, I saw your portfolio and would like to discuss a project.",
    )}`;
}

languageButton.addEventListener("click", () => {
  setLanguage(document.documentElement.lang === "en" ? "ar" : "en");
});

themeButton.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

function addScrollAnimations() {
  const revealGroups = [
    [".section-heading > *", "up"],
    [".project-copy", "left"],
    [".erp-preview, .shop-preview", "right"],
    [".expertise-heading", "left"],
    [".expertise-item", "right"],
    [".toolkit-intro", "left"],
    [".toolkit-group", "right"],
    [".about-side", "left"],
    [".about-copy", "right"],
    [".contact-card > *:not(.contact-spark)", "up"],
    [".site-footer > *", "up"],
  ];
  const revealElements = [];

  revealGroups.forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.dataset.reveal = direction;
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index, 4) * 90}ms`,
      );
      revealElements.push(element);
    });
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  document.body.classList.add("has-reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

function addScrollEffects() {
  const progressBar = document.querySelector(".scroll-progress");
  const portrait = document.querySelector(".hero-visual");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let frameRequested = false;

  function updateScrollEffects() {
    frameRequested = false;
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;

    if (!reduceMotion) {
      const bounds = portrait.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - bounds.top - bounds.height / 2) * 0.035;
      portrait.style.setProperty(
        "--portrait-shift",
        `${Math.min(12, Math.max(-12, offset))}px`,
      );
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!frameRequested) {
        frameRequested = true;
        window.requestAnimationFrame(updateScrollEffects);
      }
    },
    { passive: true },
  );
  updateScrollEffects();
}

addScrollAnimations();
addScrollEffects();
document.querySelector("#year").textContent = new Date().getFullYear();
