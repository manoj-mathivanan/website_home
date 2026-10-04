import { resume } from "./resume.js";

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const tags = (values) =>
  values.map((tag) => `<span class="tag">${escape(tag)}</span>`).join("");

document.querySelector("#experience-list").innerHTML = resume.experience
  .map(
    (job, i) => `
  <details class="experience" ${i === 0 ? "open" : ""}>
    <summary><span class="timeline-mark" aria-hidden="true"></span><span class="job-period">${escape(job.period)}</span><span class="job-header"><span class="company">${escape(job.company)}</span><span class="role">${escape(job.role)}</span></span><span class="expand-icon" aria-hidden="true">+</span></summary>
    <div class="job-content"><div><p class="job-meta">${escape(job.note)}${job.location ? ` · ${escape(job.location)}` : ""}</p><p class="job-summary">${escape(job.summary)}</p><ul>${job.details.map((item) => `<li>${escape(item)}</li>`).join("")}</ul><div class="tags">${tags(job.tags)}</div></div>${job.impact ? `<aside class="impact"><strong>${escape(job.impact.value)}</strong><span>${escape(job.impact.label)}</span></aside>` : ""}</div>
  </details>`,
  )
  .join("");

const categories = [
  "All",
  ...new Set(resume.skills.map((skill) => skill.category)),
];
const filterContainer = document.querySelector("#skill-filters");
filterContainer.innerHTML = categories
  .map(
    (category, i) =>
      `<button class="filter-button" aria-pressed="${i === 0}" data-category="${escape(category)}">${escape(category)}</button>`,
  )
  .join("");
function renderSkills(category) {
  const skills = resume.skills.filter(
    (skill) => category === "All" || skill.category === category,
  );
  document.querySelector("#skills-list").innerHTML = skills
    .map(
      (skill) =>
        `<span class="skill"><span class="skill-dot" aria-hidden="true"></span>${escape(skill.name)}</span>`,
    )
    .join("");
}
filterContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  filterContainer
    .querySelectorAll("button")
    .forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
  renderSkills(button.dataset.category);
});
renderSkills("All");

document.querySelector("#innovations-list").innerHTML = resume.innovations
  .map(
    (item) =>
      `<article class="innovation"><div class="innovation-top"><span class="eyebrow">${escape(item.category)}</span><span class="innovation-number">${escape(item.number)}</span></div><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p><div class="tags">${tags(item.tags)}</div></article>`,
  )
  .join("");
document.querySelector("#recognition-list").innerHTML = resume.recognition
  .map(
    (item) =>
      `<article><p class="eyebrow">${escape(item.label)}</p><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p></article>`,
  )
  .join("");
document.querySelector("#education-list").innerHTML = resume.education
  .map(
    (item) =>
      `<article><div class="education-top"><h3>${escape(item.degree)}</h3><span>${escape(item.year)}</span></div><p class="school">${escape(item.school)}</p><p>${escape(item.project)}</p></article>`,
  )
  .join("");

const themeButton = document.querySelector("#theme-toggle");
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === "dark";
  themeButton.setAttribute("aria-pressed", String(dark));
  themeButton.setAttribute(
    "aria-label",
    `Switch to ${dark ? "light" : "dark"} theme`,
  );
  document.querySelector('meta[name="theme-color"]').content = dark
    ? "#17201e"
    : "#f6f5f0";
}
themeButton.addEventListener("click", () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("manoj-theme", theme);
  } catch {
    /* Theme still works without storage. */
  }
  updateThemeButton();
});
updateThemeButton();

document
  .querySelector("#print-resume")
  .addEventListener("click", () => window.print());
// Print the complete resume even when a visitor collapsed jobs or filtered skills.
let printState;
window.addEventListener("beforeprint", () => {
  printState = {
    jobs: [...document.querySelectorAll(".experience")].map(
      (item) => item.open,
    ),
    category: filterContainer.querySelector('[aria-pressed="true"]').dataset
      .category,
  };
  document.querySelectorAll(".experience").forEach((item) => {
    item.open = true;
  });
  renderSkills("All");
});
window.addEventListener("afterprint", () => {
  if (!printState) return;
  document.querySelectorAll(".experience").forEach((item, i) => {
    item.open = printState.jobs[i];
  });
  renderSkills(printState.category);
  printState = undefined;
});

document.querySelector("#copy-email").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText("ma.manoj@gmail.com");
    status.textContent = "Email copied.";
  } catch {
    status.textContent =
      "Select and copy the email above, or click it to open your email app.";
  }
});
