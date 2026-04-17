document.addEventListener("DOMContentLoaded", () => {
  const themeKey = "site_theme";
  const savedTheme = localStorage.getItem(themeKey) || "spidy";

  if (savedTheme === "light") {
    document.body.setAttribute("data-theme", "light");
  } else {
    document.body.removeAttribute("data-theme");
  }

  const nav = document.querySelector(".top-nav");
  if (nav) {
    const toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";

    const setToggleLabel = () => {
      const isLight = document.body.getAttribute("data-theme") === "light";
      toggle.textContent = isLight ? "Spidy Mode 🕷️" : "Light Mode ☀️";
    };

    toggle.addEventListener("click", () => {
      const isLight = document.body.getAttribute("data-theme") === "light";
      if (isLight) {
        document.body.removeAttribute("data-theme");
        localStorage.setItem(themeKey, "spidy");
      } else {
        document.body.setAttribute("data-theme", "light");
        localStorage.setItem(themeKey, "light");
      }
      setToggleLabel();
    });

    setToggleLabel();
    nav.appendChild(toggle);
  }
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

    // Lightbox for images
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

    // Volume toast
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