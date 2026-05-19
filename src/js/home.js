import { HOME_CONTENT } from "./config.js";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".m4v", ".mov"];

function isVideo(src) {
  const lower = src.toLowerCase();
  return VIDEO_EXTENSIONS.some((extension) => lower.endsWith(extension));
}

function getItemSource(item) {
  if (typeof item === "string") return item;
  return item?.src || "";
}

function getItemType(item) {
  if (typeof item === "object" && item?.type) return item.type;
  return isVideo(getItemSource(item)) ? "video" : "image";
}

function createCarouselItem(item, index) {
  const src = getItemSource(item);
  const type = getItemType(item);
  const card = document.createElement("article");
  card.className = "carousel-item";
  card.dataset.mediaSrc = src;
  card.dataset.mediaType = type;
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
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  const heroDescription = document.getElementById("heroDescription");
  const heroTags = document.getElementById("heroTags");
  const homeRows = document.getElementById("homeRows");
  const heroPlayBtn = document.getElementById("heroPlayBtn");
  const heroPlayIcon = document.getElementById("heroPlayIcon");
  const heroPlayLabel = document.getElementById("heroPlayLabel");

  if (!heroImage || !heroVideo || !homeRows) return;

  let currentHeroIsVideo = false;
  let imageZoomPaused = false;

  const updatePlayButton = (isPlaying) => {
    if (heroPlayIcon) {
      heroPlayIcon.classList.toggle("is-play", !isPlaying);
      heroPlayIcon.classList.toggle("is-pause", isPlaying);
    }
    if (heroPlayLabel) {
      heroPlayLabel.textContent = isPlaying ? "Pause" : "Play";
    } else if (heroPlayBtn) {
      heroPlayBtn.textContent = isPlaying ? "Pause" : "Play";
    }
  };

  const setHeroMedia = async (src, shouldAutoplayVideo = false) => {
    const mediaIsVideo = isVideo(src);
    currentHeroIsVideo = mediaIsVideo;

    if (mediaIsVideo) {
      heroImage.classList.remove("zoom-active");
      heroImage.hidden = true;
      heroVideo.hidden = false;
      heroVideo.src = src;
      if (shouldAutoplayVideo) {
        try {
          await heroVideo.play();
          updatePlayButton(true);
        } catch (error) {
          updatePlayButton(false);
        }
      } else {
        updatePlayButton(false);
      }
      return;
    }

    heroVideo.pause();
    heroVideo.hidden = true;
    heroVideo.removeAttribute("src");
    heroImage.hidden = false;
    heroImage.src = src;
    heroImage.classList.remove("zoom-active");
    void heroImage.offsetWidth;
    heroImage.classList.add("zoom-active");
    imageZoomPaused = false;
    heroImage.style.animationPlayState = "running";
    updatePlayButton(true);
  };

  setHeroMedia(HOME_CONTENT.heroMedia, false);

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
    heroPlayBtn.addEventListener("click", async () => {
      if (currentHeroIsVideo) {
        if (heroVideo.paused) {
          try {
            await heroVideo.play();
            updatePlayButton(true);
          } catch (error) {
            updatePlayButton(false);
          }
        } else {
          heroVideo.pause();
          updatePlayButton(false);
        }
      } else {
        imageZoomPaused = !imageZoomPaused;
        heroImage.style.animationPlayState = imageZoomPaused ? "paused" : "running";
        updatePlayButton(!imageZoomPaused);
      }
    });
  }

  homeRows.addEventListener("click", (event) => {
    const card = event.target.closest(".carousel-item");
    if (!card) return;

    const src = card.dataset.mediaSrc;
    const type = card.dataset.mediaType;
    setHeroMedia(src, type === "video");
  });
}
