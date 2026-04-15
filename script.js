document.addEventListener("DOMContentLoaded", () => {
  // Dropdown behavior
  const dropdown = document.querySelector(".dropdown");
  const projectsToggle = document.getElementById("projectsToggle");

  if (dropdown && projectsToggle) {
    projectsToggle.addEventListener("click", () => {
      const isOpen = dropdown.classList.toggle("open");
      projectsToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
        projectsToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        dropdown.classList.remove("open");
        projectsToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const photoGrid = document.getElementById("photo-grid");
  const videoGrid = document.getElementById("video-grid");

  // If grids exist, render media
  if (photoGrid && videoGrid) {
    const photos = [
      "Image 1.jpg",
      "Image 2.jpg",
      "Image 3.jpg",
      "Image 4.jpg",
      "Image 5.jpg",
      "Image 6.jpg",
      "Image 7.jpg",
      "Image 8.JPG",
      "Image 9.jpg",
      "Image 10.jpg",
      "Image 11.jpg"
    ];

    const videos = [
      "Video 1.mp4",
      "Video 2.mp4",
      "Video 3.mp4",
      "Video 4.mp4"
    ];

    // Render photos
    photos.forEach((file, i) => {
      const card = document.createElement("div");
      card.className = "media-card";
      card.innerHTML = `
        <img src="assets/images/${file}" alt="Gallery image ${i + 1}" loading="lazy" />
        <div class="media-caption">Image ${i + 1}</div>
      `;
      photoGrid.appendChild(card);
    });

    // Render videos
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

    // Volume + one-time notice
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
      video.addEventListener("loadedmetadata", () => {
        video.volume = 0.1;
      });

      video.addEventListener("play", () => {
        if (!localStorage.getItem(noticeKey)) {
          showToast();
          localStorage.setItem(noticeKey, "true");
        }
      });
    });

    // Photo lightbox
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">Close ✕</button>
      <img alt="Expanded photo preview" />
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    photoGrid.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      lightboxImg.src = img.src;
      lightbox.classList.add("open");
    });

    closeBtn.addEventListener("click", () => {
      lightbox.classList.remove("open");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.remove("open");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") lightbox.classList.remove("open");
    });
  }
});