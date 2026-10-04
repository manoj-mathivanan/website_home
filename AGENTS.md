# Personal homepage

- This is the independent source repository for `manojmathivanan.com`.
- Keep future tools and projects in sibling folders with their own repositories.
- Leave `trader.manojmathivanan.com` and its deployment unchanged when updating this homepage.
- Career facts in `src/resume.js` initially come from the owner's February 2024 resume. Do not present that dated employment snapshot as verified current information.
- Run `npm run check` and `npm run build` after source changes. Publish only public static assets, using the versioned-release workflow in `deploy/README.md` on the existing VPS, or `dist/` on another static host.
- Never commit credentials, local environment files, or the original private resume document.
