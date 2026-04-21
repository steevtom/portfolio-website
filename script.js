document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeStorageKey = "theme_preference";

  const getPreferredTheme = () => {
    const saved = localStorage.getItem(themeStorageKey);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", String(theme === "light"));
    toggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    toggle.classList.toggle("is-light", theme === "light");
  };

  const injectThemeToggle = () => {
    const nav = document.querySelector(".top-nav");
    if (!nav || nav.querySelector(".theme-toggle")) return;

    const toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.innerHTML = `
      <span class="theme-icon theme-icon-moon" aria-hidden="true">🌙</span>
      <span class="theme-switch" aria-hidden="true"><span class="theme-knob"></span></span>
      <span class="theme-icon theme-icon-sun" aria-hidden="true">☀️</span>
    `;

    toggle.addEventListener("click", () => {
      const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      localStorage.setItem(themeStorageKey, nextTheme);
      applyTheme(nextTheme);
    });

    nav.appendChild(toggle);
  };

  injectThemeToggle();
  applyTheme(getPreferredTheme());

  const photoGrid = document.getElementById("photo-grid");
  const videoGrid = document.getElementById("video-grid");

  const photos = [
    "Image 1.jpg", "Image 2.jpg", "Image 3.jpg", "Image 4.jpg", "Image 5.jpg",
    "Image 6.jpg", "Image 7.jpg", "Image 8.JPG", "Image 9.jpg", "Image 10.jpg", "Image 11.jpg"
  ];

  const videos = ["Video 1.mp4", "Video 2.mp4", "Video 3.mp4", "Video 4.mp4"];

  if (photoGrid) {
    photos.forEach((file, i) => {
      const card = document.createElement("div");
      card.className = "media-card";
      card.innerHTML = `
        <img src="assets/images/${file}" alt="Gallery image ${i + 1}" loading="lazy" />
        <div class="media-caption">Image ${i + 1}</div>
      `;
      photoGrid.appendChild(card);
    });

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `<button class="lightbox-close">Close ✕</button><img alt="Expanded photo preview" />`;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    photoGrid.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      lightboxImg.src = img.src;
      lightbox.classList.add("open");
    });

    closeBtn.addEventListener("click", () => lightbox.classList.remove("open"));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.remove("open");
    });
  }

  if (videoGrid) {
    videos.forEach((file, i) => {
      const card = document.createElement("div");
      card.className = "media-card";
      card.innerHTML = `
        <video controls preload="metadata">
          <source src="assets/videos/${file}" type="video/mp4" />
        </video>
        <div class="media-caption">Video ${i + 1}</div>
      `;
      videoGrid.appendChild(card);
    });

    const noticeKey = "volume_notice_shown";
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = "Feel free to increase volume 🔊";
    document.body.appendChild(toast);

    const showToast = () => {
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    };

    document.querySelectorAll("video").forEach((video) => {
      video.volume = 0.1;
      video.addEventListener("loadedmetadata", () => (video.volume = 0.1));
      video.addEventListener("play", () => {
        if (!localStorage.getItem(noticeKey)) {
          showToast();
          localStorage.setItem(noticeKey, "true");
        }
      });
    });
  }
});