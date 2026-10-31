import { mkdir, writeFile } from 'node:fs/promises';
import { onePage as r } from '../src/resume.js';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const section = (title, text) => `<section><h2>${title}</h2><p>${esc(text)}</p></section>`;
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="One-page resume for Manoj Mathivanan: Kafka platform architecture, cloud infrastructure, AI tooling, and developer frameworks."><link rel="canonical" href="https://manojmathivanan.com/resume/"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/src/resume-page.css"><title>Manoj Mathivanan | One-page resume</title></head>
<body><a class="skip-link" href="#resume">Skip to resume</a><nav aria-label="Resume navigation"><a href="/">← Back to homepage</a><a class="download" href="/downloads/Manoj-Mathivanan-Resume.pdf" download>Download PDF <span aria-hidden="true">↓</span></a></nav>
<main id="resume"><header><p class="eyebrow">SOFTWARE ARCHITECTURE · CLOUD PLATFORMS · AUTOMATION</p><h1>${esc(r.name)}</h1><p class="role">${esc(r.title)}</p><p class="contact">Chennai, India · <a href="mailto:ma.manoj@gmail.com">ma.manoj@gmail.com</a> · <a href="https://manojmathivanan.com">manojmathivanan.com</a><br><a href="https://github.com/manoj-mathivanan">github.com/manoj-mathivanan</a> · <a href="https://www.linkedin.com/in/manojmathivanan">linkedin.com/in/manojmathivanan</a></p></header>
<p class="summary">${esc(r.summary)}</p>${section('Core skills', r.skills)}
<section><h2>Experience</h2>${r.jobs.map(job=>`<article><div class="job-heading"><h3>${esc(job.company)}</h3><span>${esc(job.period)}</span></div><p class="job-role">${esc(job.role)}</p><ul>${job.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul></article>`).join('')}</section>
${section('Selected projects', r.projectText)}<p class="project-source"><a href="https://github.com/manoj-mathivanan/trader_all">Trader source</a> · <a href="https://github.com/manoj-mathivanan/kafka-bootstrap-proxy">Kafka diagnostics source</a> · <a href="/#projects">All projects and demos ↗</a></p>
${section('Education',r.educationText)}${section('Recognition',r.recognitionText)}<p class="footnote">${esc(r.footnote)}</p></main></body></html>`;
await mkdir(new URL('../public/resume/', import.meta.url), { recursive: true });
await writeFile(new URL('../public/resume/index.html', import.meta.url), html);
console.log('Generated one-page resume HTML from src/resume.js');
