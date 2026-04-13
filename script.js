const portfolioData = {
  videos: [
    {
      title: "Fashion Reel",
      description:
        "Replace this sample project with one of your own videos. You can use a YouTube or Vimeo embed link here.",
      embedUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
      tags: ["Direction", "Editing", "Cinematic"],
    },
    {
      title: "Travel Story",
      description:
        "Use this section for short films, ad campaigns, event recaps, behind-the-scenes edits, or branded content.",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      tags: ["Travel", "Motion", "Storytelling"],
    },
  ],
  photos: [
    {
      title: "Golden Hour Portrait",
      caption: "A sample image card for your portrait work.",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "City Motion",
      caption: "Use this grid to feature editorial, street, travel, or brand photography.",
      imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Studio Detail",
      caption: "Swap this placeholder with your own still-life or studio image.",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Landscape Frame",
      caption: "Wide photos work especially well in this masonry layout.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Editorial Look",
      caption: "Mix portraits, scenes, and detail shots to show range.",
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    },
  ],
};

function createVideoCard(video, index) {
  const card = document.createElement("article");
  card.className = "video-card fade-in";
  card.style.animationDelay = `${index * 120}ms`;

  const tagsMarkup = video.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  card.innerHTML = `
    <iframe
      class="video-frame"
      src="${video.embedUrl}"
      title="${video.title}"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <div class="video-copy">
      <h3>${video.title}</h3>
      <p>${video.description}</p>
      <div class="video-meta">${tagsMarkup}</div>
    </div>
  `;

  return card;
}

function createPhotoCard(photo, index) {
  const card = document.createElement("figure");
  card.className = "photo-card fade-in";
  card.style.animationDelay = `${index * 100}ms`;

  card.innerHTML = `
    <img src="${photo.imageUrl}" alt="${photo.title}" loading="lazy" />
    <figcaption class="photo-caption">
      <strong>${photo.title}</strong>
      <span>${photo.caption}</span>
    </figcaption>
  `;

  return card;
}

function renderPortfolio() {
  const videoGrid = document.getElementById("video-grid");
  const photoGrid = document.getElementById("photo-grid");

  portfolioData.videos.forEach((video, index) => {
    videoGrid.appendChild(createVideoCard(video, index));
  });

  portfolioData.photos.forEach((photo, index) => {
    photoGrid.appendChild(createPhotoCard(photo, index));
  });
}

renderPortfolio();
