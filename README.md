# Portfolio Website

This is a simple portfolio website you can use to present your videos and photography.

## Open it locally

1. Open the folder: `C:\Users\Owner\Documents\New project`
2. Double-click `index.html`

## Customize it

Edit `script.js` to replace the sample content:

- In `portfolioData.videos`, update:
  - `title`
  - `description`
  - `embedUrl`
  - `tags`
- In `portfolioData.photos`, update:
  - `title`
  - `caption`
  - `imageUrl`

## Add your own videos

For YouTube:

1. Open your video on YouTube
2. Click `Share`
3. Click `Embed`
4. Copy the URL that looks like `https://www.youtube.com/embed/...`
5. Paste it into `embedUrl`

For Vimeo:

Use an embed link like `https://player.vimeo.com/video/VIDEO_ID`

## Add your own images

You can either:

1. Use online image links in `imageUrl`
2. Or create an `assets` folder and use local files like:
   - `assets/photo-1.jpg`
   - `assets/photo-2.jpg`

Example:

```js
{
  title: "My Portrait Session",
  caption: "Shot for a fashion editorial project.",
  imageUrl: "assets/photo-1.jpg",
}
```

## Publish it so anyone can access it

Good free options:

- GitHub Pages
- Netlify
- Vercel

If you want, I can do the next step too and prepare this website for easy publishing on one of those platforms.
