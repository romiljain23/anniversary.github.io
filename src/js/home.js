import { HOME_CONTENT } from "./config.js";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".m4v", ".mov"];

function isVideo(src) {
  const lower = src.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function getItemSource(item) {
  if (typeof item === "string") return item;
  return item?.src || "";
}

function createCarouselItem(item, index) {
  const src = getItemSource(item);
  const card = document.createElement("article");
  card.className = "carousel-item";
  card.dataset.mediaSrc = src;
  card.innerHTML = `<img src="${src}" alt="Memory ${index + 1}" loading="lazy" />`;
  return card;
}

function createRowSection(row, rowIndex) {
  const section = document.createElement("section");
  section.className = "carousel-section";
  section.innerHTML = `
    <h3 class="carousel-title">${row.title}</h3>
    <div class="image-carousel" id="row-carousel-${rowIndex}"></div>
  `;

  const rowCarousel = section.querySelector(`#row-carousel-${rowIndex}`);
  const rowItems = row.items || row.images || [];
  rowItems.forEach((item, index) => {
    rowCarousel.appendChild(createCarouselItem(item, index));
  });

  return section;
}

export function setupHomeScreen() {
  const heroVideo = document.getElementById("heroVideo");
  const heroOverlay = document.querySelector(".hero-overlay");
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  const heroDescription = document.getElementById("heroDescription");
  const heroTags = document.getElementById("heroTags");
  const homeRows = document.getElementById("homeRows");
  const heroPlayBtn = document.getElementById("heroPlayBtn");
  const heroPlayIcon = document.getElementById("heroPlayIcon");
  const heroPlayLabel = document.getElementById("heroPlayLabel");

  if (!heroVideo || !homeRows) return null;

  let soundOn = false;
  let autoplayTimerId = 0;

  const setOverlayHidden = (hidden) => {
    if (heroOverlay) heroOverlay.classList.toggle("is-cinematic", hidden);
  };

  const updateButton = (playing) => {
    if (heroPlayIcon) {
      heroPlayIcon.classList.toggle("is-play", !playing);
      heroPlayIcon.classList.toggle("is-pause", playing);
    }
    if (heroPlayLabel) {
      heroPlayLabel.textContent = playing ? "Pause" : "Play";
    }
  };

  updateButton(false);

  if (heroTitle) heroTitle.textContent = HOME_CONTENT.heroTitle;
  if (heroSubtitle) heroSubtitle.textContent = HOME_CONTENT.heroSubtitle;
  if (heroDescription) heroDescription.textContent = HOME_CONTENT.heroDescription;
  if (heroTags) {
    heroTags.innerHTML = "";
    HOME_CONTENT.heroTags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "hero-tag";
      chip.textContent = tag;
      heroTags.appendChild(chip);
    });
  }

  homeRows.innerHTML = "";
  HOME_CONTENT.rows.forEach((row, rowIndex) => {
    homeRows.appendChild(createRowSection(row, rowIndex));
  });

  if (heroPlayBtn) {
    heroPlayBtn.addEventListener("click", () => {
      clearTimeout(autoplayTimerId);

      if (!soundOn) {
        heroVideo.muted = false;
        heroVideo.removeAttribute("muted");
        heroVideo.volume = 1.0;

        if (heroVideo.paused) {
          heroVideo.play().catch(() => {});
        }

        soundOn = true;
        setOverlayHidden(true);
        updateButton(true);
      } else {
        heroVideo.muted = true;
        heroVideo.setAttribute("muted", "");
        soundOn = false;
        setOverlayHidden(false);
        updateButton(false);
      }
    });
  }

  heroVideo.addEventListener("click", () => {
    if (soundOn && heroPlayBtn) {
      heroPlayBtn.click();
    }
  });

  homeRows.addEventListener("click", (event) => {
    const card = event.target.closest(".carousel-item");
    if (!card) return;
    const src = card.dataset.mediaSrc;
    if (isVideo(src)) {
      heroVideo.src = src;
      heroVideo.muted = true;
      heroVideo.setAttribute("muted", "");
      soundOn = false;
      setOverlayHidden(false);
      updateButton(false);
      heroVideo.play().catch(() => {});
    }
  });

  return {
    startHeroVideo() {
      autoplayTimerId = setTimeout(() => {
        if (soundOn) return;
        heroVideo.muted = true;
        heroVideo.setAttribute("muted", "");
        heroVideo.play().catch(() => {});
      }, 1500);
    }
  };
}
