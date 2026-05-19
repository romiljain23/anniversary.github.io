import { HOME_CONTENT } from "./config.js";

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
  const heroImage = document.getElementById("heroImage");
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

  if (!homeRows) return null;

  let videoPlaying = false;

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

  function showImage(src) {
    if (heroVideo) {
      heroVideo.pause();
      heroVideo.hidden = true;
    }
    if (heroImage) {
      heroImage.src = src;
      heroImage.hidden = false;
      heroImage.classList.remove("zoom-active");
      void heroImage.offsetWidth;
      heroImage.classList.add("zoom-active");
    }
    videoPlaying = false;
    setOverlayHidden(false);
    updateButton(false);
  }

  function playVideo() {
    if (!heroVideo) return;
    if (heroImage) {
      heroImage.classList.remove("zoom-active");
      heroImage.hidden = true;
    }
    heroVideo.hidden = false;
    heroVideo.muted = false;
    heroVideo.removeAttribute("muted");
    heroVideo.volume = 1.0;
    heroVideo.currentTime = 0;
    heroVideo.play().catch(() => {});
    videoPlaying = true;
    setOverlayHidden(true);
    updateButton(true);
  }

  function stopVideo() {
    if (!heroVideo) return;
    heroVideo.pause();
    heroVideo.hidden = true;
    heroVideo.muted = true;
    heroVideo.setAttribute("muted", "");
    if (heroImage) heroImage.hidden = false;
    videoPlaying = false;
    setOverlayHidden(false);
    updateButton(false);
  }

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
      if (!videoPlaying) {
        playVideo();
      } else {
        stopVideo();
      }
    });
  }

  if (heroVideo) {
    heroVideo.addEventListener("click", () => {
      if (videoPlaying) stopVideo();
    });
  }

  homeRows.addEventListener("click", (event) => {
    const card = event.target.closest(".carousel-item");
    if (!card) return;
    const src = card.dataset.mediaSrc;
    if (videoPlaying) stopVideo();
    showImage(src);
  });

  return null;
}
