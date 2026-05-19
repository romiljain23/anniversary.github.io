import { APP_CONFIG } from "./config.js";
import {
  lockEditableOnSelect,
  sanitizeEditableText,
  showLoadingScreen
} from "./ui.js";
import { setupHomeScreen } from "./home.js";
import { setupScrollEffects } from "./scroll-effects.js";

const profileScreen = document.getElementById("profileScreen");
const loadingScreen = document.getElementById("loadingScreen");
const introLoadingScreen = document.getElementById("introLoadingScreen");
const homeScreen = document.getElementById("homeScreen");
const profileCard = document.getElementById("profileCard");
const profileImage = document.querySelector(".profile-image");
const profileName = document.getElementById("profileName");
const ALL_SCREENS = [introLoadingScreen, profileScreen, loadingScreen, homeScreen];
const profileClickSound = new Audio("./audio/netflix_profile_click.mp3");

profileClickSound.preload = "auto";

function playProfileClickSound() {
  profileClickSound.currentTime = 0;
  profileClickSound.play().catch(() => {
    // Ignore play interruptions; click flow should continue.
  });
}

function showOnlyScreen(targetScreen) {
  ALL_SCREENS.forEach((screen) => {
    if (!screen) return;
    if (screen === targetScreen) {
      screen.classList.remove("is-hidden");
    } else {
      screen.classList.add("is-hidden");
    }
  });
}

if (profileName) {
  profileName.addEventListener("blur", () => sanitizeEditableText(profileName));
  profileName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      profileName.blur();
    }
  });
}

let homeHandle = null;

window.addEventListener("DOMContentLoaded", () => {
  try {
    homeHandle = setupHomeScreen();
    setupScrollEffects();
  } catch (error) {
    // Keep app usable even if home setup fails.
  }

  window.setTimeout(() => {
    showOnlyScreen(profileScreen);
  }, 700);
});

if (profileCard) {
  profileCard.addEventListener("click", () => {
    if (profileName) lockEditableOnSelect(profileName);
    showLoadingScreen({ profileScreen, loadingScreen });

    window.setTimeout(() => {
      showOnlyScreen(homeScreen);
      if (homeHandle) homeHandle.startHeroVideo();
    }, APP_CONFIG.loadingDurationMs);
  });
}

if (profileImage) {
  profileImage.addEventListener("click", playProfileClickSound);
}

