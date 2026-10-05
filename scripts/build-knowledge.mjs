import { resume } from "../src/resume.js";
import { writeFile } from "node:fs/promises";

const facts = [
  {
    id: "profile",
    title: "About Manoj",
    text: "Manoj Mathivanan is a software architect based in Chennai, India. His work focuses on distributed systems, messaging and streaming, automation, and connected devices. Career information is a February 2024 snapshot; his present employer, availability, and employment status have not been confirmed.",
    keywords:
      "about who background introduce summary manoj mathivanan location based chennai current now present employer availability",
    url: "/#main",
  },
  ...resume.experience.map((job, i) => ({
    id: `career-${i}`,
    title: `${job.company} experience`,
    text: `${job.role} at ${job.company}. ${job.note}. ${job.summary} ${job.details.join(" ")} These facts come from the February 2024 resume.`,
    keywords: `${job.company} ${job.role} ${job.tags.join(" ")} experience work career job employment ${i === 0 ? "current latest availability" : ""}`,
    url: "/#experience",
  })),
  {
    id: "skills",
    title: "Skills",
    text: `The February 2024 resume lists: ${resume.skills.map((s) => s.name).join(", ")}. It does not list proficiency scores or confirm skills acquired since then.`,
    keywords:
      "skill skills technology technologies toolkit tech stack programming language languages java kafka cloud docker ansible",
    url: "/#skills",
  },
  ...resume.education.map((item, i) => ({
    id: `education-${i}`,
    title: item.degree,
    text: `${item.degree}, ${item.school}, ${item.year}. ${item.project}`,
    keywords: `education degree studied university college school qualification ${item.school} ${item.degree} ${item.project}`,
    url: "/#education-title",
  })),
  ...resume.recognition.map((item, i) => ({
    id: `recognition-${i}`,
    title: item.title,
    text: item.text,
    keywords: `award awards achievement recognition accomplishment contribution ${item.title} ${item.text}`,
    url: "/#recognition-title",
  })),
  ...resume.innovations.map((item, i) => ({
    id: `innovation-${i}`,
    title: item.title,
    text: `${item.description} These are explorations described in the February 2024 resume; their current status is not confirmed.`,
    keywords: `project projects innovation innovations experiment ${item.category} ${item.description} ${item.tags.join(" ")}`,
    url: "/#projects",
  })),
  {
    id: "trader",
    title: "Trader project",
    text: "Trader is Manoj’s software project at https://trader.manojmathivanan.com. Its published project notes describe market research, backtesting, and paper-trading workflows, with a Python web application. It is hosted on a DigitalOcean VPS with Caddy HTTPS. This chatbot cannot inspect account data, execute trades, or provide investment recommendations.",
    keywords:
      "trader trading project projects backtest backtesting research paper python hosting digitalocean caddy",
    url: "https://trader.manojmathivanan.com",
  },
  {
    id: "homepage",
    title: "Personal homepage",
    text: "The interactive resume at https://manojmathivanan.com is built with HTML, CSS, and JavaScript. It has an expandable career timeline, skills by category, selected innovations, light and dark themes, and a printable resume. Its independent repository is https://github.com/manoj-mathivanan/website_home. It shares the existing VPS with Trader while keeping its own source, static files, and deployment.",
    keywords:
      "website homepage home resume portfolio github repository hosting domain html css javascript",
    url: "https://github.com/manoj-mathivanan/website_home",
  },
  {
    id: "contact",
    title: "Contact Manoj",
    text: "Manoj’s published email is ma.manoj@gmail.com and his GitHub profile is https://github.com/manoj-mathivanan. Visitors can optionally leave a name and email or phone number using this chat’s contact form. That requests follow-up; it does not promise a reply or an appointment. No phone number or exact residential address for Manoj is published here.",
    keywords:
      "contact reach email connect hire hiring opportunity recruitment recruiter collaborate collaboration meeting phone address",
    url: "/#contact",
  },
  {
    id: "interests",
    title: "Interests",
    text: "The February 2024 resume mentions trying new technologies and gadgets, automating everyday tasks, attending meetups and conferences, biking, and travelling.",
    keywords:
      "interest interests hobby hobbies passion bike biking travelling travel gadget gadgets meetup",
    url: "/#education-title",
  },
];
await writeFile(
  new URL("../chat/knowledge.json", import.meta.url),
  JSON.stringify({ snapshot: resume.snapshot, facts }, null, 2) + "\n",
);
console.log(`Generated ${facts.length} public resume/project facts.`);
