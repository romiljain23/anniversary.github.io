import { APP_CONFIG } from "./config.js";
import {
  lockEditableOnSelect,
  sanitizeEditableText,
  showLoadingScreen
} from "./ui.js";
import { setupHomeScreen } from "./home.js";

const profileScreen = document.getElementById("profileScreen");
const loadingScreen = document.getElementById("loadingScreen");
const introLoadingScreen = document.getElementById("introLoadingScreen");
const homeScreen = document.getElementById("homeScreen");
const profileCard = document.getElementById("profileCard");
const profileName = document.getElementById("profileName");
const homeBackBtn = document.getElementById("homeBackBtn");
const homeShareBtn = document.getElementById("homeShareBtn");
const ALL_SCREENS = [introLoadingScreen, profileScreen, loadingScreen, homeScreen];

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

window.addEventListener("DOMContentLoaded", () => {
  try {
    setupHomeScreen();
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
    }, APP_CONFIG.loadingDurationMs);
  });
}

if (homeBackBtn) {
  homeBackBtn.addEventListener("click", () => {
    showOnlyScreen(profileScreen);
  });
}

async function shareSite() {
  const shareData = {
    title: document.title || "LOVEFLIX",
    text: "Come and relive these memories with us!",
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(shareData.url);
    window.alert("Link copied. You can paste and share it.");
  } catch (error) {
    window.prompt("Copy this link to share:", shareData.url);
  }
}

if (homeShareBtn) {
  homeShareBtn.addEventListener("click", () => {
    shareSite();
  });
}
