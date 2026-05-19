const GLOW_THRESHOLD = 10;
const GLOW_FADE_MS = 600;
const PARALLAX_FACTOR = 0.035;

export function setupScrollEffects() {
  const screen = document.getElementById("homeScreen");
  const glowTop = document.getElementById("scrollGlowTop");
  const glowBottom = document.getElementById("scrollGlowBottom");
  const heroCard = document.querySelector(".hero-card");

  if (!screen) return;

  let topTimer = 0;
  let bottomTimer = 0;
  let ticking = false;

  function clearGlow(el, timerRef) {
    if (!el) return 0;
    clearTimeout(timerRef);
    return setTimeout(() => el.classList.remove("active"), GLOW_FADE_MS);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = screen.scrollTop;
      const maxScroll = screen.scrollHeight - screen.clientHeight;

      if (glowTop) {
        if (scrollY <= GLOW_THRESHOLD) {
          glowTop.classList.add("active");
          topTimer = clearGlow(glowTop, topTimer);
        }
      }

      if (glowBottom) {
        if (scrollY >= maxScroll - GLOW_THRESHOLD) {
          glowBottom.classList.add("active");
          bottomTimer = clearGlow(glowBottom, bottomTimer);
        }
      }

      if (heroCard) {
        const offset = Math.min(scrollY * PARALLAX_FACTOR, 20);
        heroCard.style.transform = `translateY(${offset}px)`;
      }

      const sections = screen.querySelectorAll(".carousel-section");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const viewH = screen.clientHeight;
        const visible = rect.top < viewH && rect.bottom > 0;

        if (visible) {
          const progress = 1 - Math.max(0, (rect.top - viewH * 0.7) / (viewH * 0.3));
          const clamped = Math.max(0, Math.min(1, progress));
          section.style.opacity = 0.4 + clamped * 0.6;
          section.style.transform = `translateY(${(1 - clamped) * 12}px)`;
        }
      });

      ticking = false;
    });
  }

  screen.addEventListener("scroll", onScroll, { passive: true });

  onScroll();
}
