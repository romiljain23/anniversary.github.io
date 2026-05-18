# LOVEFLIX Anniversary (Static Frontend)

Mobile-first Netflix-inspired anniversary profile experience built with:

- HTML
- CSS
- JavaScript (ES modules)

No backend is required.

## Project Structure

```text
anniversary/
  index.html
  download.png
  src/
    css/
      base.css
      profile-screen.css
      loading-screen.css
    js/
      config.js
      ui.js
      main.js
```

## How to Run Locally

Because this project uses ES module scripts, run it through a local server (do not open with `file://`).

### Option 1: VS Code Live Server

1. Install **Live Server** extension.
2. Right-click `index.html`.
3. Click **Open with Live Server**.

### Option 2: Python HTTP Server

From the project root:

```bash
python3 -m http.server 5500
```

Then open:

`http://localhost:5500`

### Option 3: Node serve

If you have Node.js:

```bash
npx serve .
```

Then open the local URL printed in terminal.

## Editing Profile Name and Image

- Profile image is set in `index.html` as:
  - `./download.png`
- Editable profile text is the `contenteditable` element with id:
  - `profileName`

## Behavior

- Tap/click the single profile card:
  - Profile screen hides
  - Netflix-style loading screen appears
  - After configured delay, it returns (placeholder flow)

You can change loading delay in:

- `src/js/config.js` (`loadingDurationMs`)

## Deploy (Static Hosting)

This project is static and can be deployed directly on:

- Netlify
- Vercel
- GitHub Pages

Set the publish root to the repository root (where `index.html` is located).

## Notes

- Keep all assets as relative paths for deployment compatibility.
- Do not store secrets/tokens in this repository (not needed for this project).
