# Manoj's homepage

Independent repository for **manojmathivanan.com**. A responsive, interactive resume made with HTML, CSS, and JavaScript. No framework, install step, or runtime dependency is required. Node 20+ is used only for the local server and build.

## Run locally

```sh
npm run dev
```

Open `http://127.0.0.1:3000`. To use another port, set the `PORT` environment variable.

## Build and preview

```sh
npm run check
npm run build
npm run preview
```

Deploy **the contents of `dist/`** to the static hosting target for `manojmathivanan.com`. This project does not change DNS, modify Trader, or configure a hosting provider. Keep `trader.manojmathivanan.com` pointing to its existing independent project. When connecting a host to this repo, use build command `npm run build` and output directory `dist`.

## Update the resume

- `src/resume.js`: employment, skills, innovations, education, recognition.
- `index.html`: introduction, contact links, Trader link, and page metadata.
- `src/styles.css`: design, mobile layouts, dark theme, print layout, reduced motion.
- `public/favicon.svg`: personal monogram.

The initial career content is sourced from `../Manoj_Resume_Feb2024.docx`. The PayPal role was ongoing **as of February 2024**, not verified as current. The source document is deliberately outside the public site. The homepage does not publish the phone number, street/postal details, or expired visa information. Project descriptions summarize the original resume; they do not imply the prototypes are live services.

## Features

- Native keyboard-accessible expandable career entries.
- Skill category filters with accessible pressed state.
- Light/dark theme saved on the visitor's device.
- Email link, clipboard copy with a failure message, GitHub and Trader links.
- Save resume opens browser printing; choose **Save as PDF**. All career entries and skills are included, and previous browsing state is restored afterward.
- Responsive layout, visible keyboard focus, skip link, reduced-motion support, and print styling.

Google Fonts enhance typography when available; system sans-serif fallbacks keep the site usable without them. No analytics, cookies, or backend are included.

## Repository boundaries

Only this `home/` directory belongs to this repository. Future tools should live in sibling folders, each with its own repository and deployment.

Source repository: https://github.com/manoj-mathivanan/website_home. The local `origin` remote points to it. To publish subsequent source changes:

```sh
git add .
git commit -m "Update personal homepage"
git push
```
