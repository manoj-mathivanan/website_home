const dialog = document.querySelector("#resume-chat");
const question = document.querySelector("#chat-question");
const messageForm = document.querySelector("#chat-message-form");
const contactForm = document.querySelector("#chat-contact-form");
const messages = document.querySelector("#chat-messages");
const storageNotice = document.querySelector("#chat-storage-notice");
const error = document.querySelector("#chat-error");
const scroll = document.querySelector("#chat-scroll");
let started = false;
let busy = false;
let pending;
let initialized = false;

async function api(path, body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 16000);
  try {
    const response = await fetch(`/api/chat/${path}`, {
      method: body ? "POST" : "GET",
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Chat is unavailable. Please try again.");
    return data;
  } catch (failure) {
    if (failure.name === "AbortError")
      throw new Error("The request timed out. Please try sending it again.");
    throw failure;
  } finally {
    clearTimeout(timeout);
  }
}

function addMessage(who, text, sources = []) {
  const article = document.createElement("article");
  article.className = `chat-message ${who}`;
  const speaker = document.createElement("span");
  speaker.className = "speaker";
  speaker.textContent = who === "visitor" ? "You" : "About Manoj";
  const content = document.createElement("p");
  content.textContent = text;
  article.append(speaker, content);
  if (sources.length) {
    const links = document.createElement("div");
    links.className = "chat-sources";
    for (const source of sources) {
      const url = new URL(source.url, window.location.origin);
      if (
        !["http:", "https:"].includes(url.protocol) ||
        ![
          window.location.hostname,
          "trader.manojmathivanan.com",
          "github.com",
        ].includes(url.hostname)
      )
        continue;
      const link = document.createElement("a");
      link.href = url.href;
      link.textContent = source.title + " ↗";
      if (url.origin !== window.location.origin) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else link.addEventListener("click", () => dialog.close());
      links.append(link);
    }
    article.append(links);
  }
  messages.append(article);
  scroll.scrollTop = scroll.scrollHeight;
}

function state() {
  storageNotice.hidden = started;
  document.querySelector("#chat-send").disabled = busy;
  document.querySelector("#chat-new").disabled = busy;
  messageForm.setAttribute("aria-busy", String(busy));
}

document.querySelector("#chat-open").addEventListener("click", async () => {
  dialog.showModal();
  if (initialized) return;
  busy = true;
  state();
  try {
    const [history, status] = await Promise.all([
      api("session"),
      api("status"),
    ]);
    document.querySelector("#chat-retention").textContent =
      status.retention_days;
    document.querySelector("#chat-ai-notice").hidden = status.mode !== "llm";
    for (const item of history.messages) {
      addMessage("visitor", item.question);
      addMessage("assistant", item.answer, item.sources);
    }
    started = history.messages.length > 0;
    if (history.contact_saved) {
      contactForm.hidden = true;
      document.querySelector("#chat-contact").append(
        Object.assign(document.createElement("p"), {
          textContent: "Your contact details have been saved for Manoj.",
        }),
      );
    }
    initialized = true;
  } catch {
    error.textContent =
      "Chat is temporarily unavailable. Please try again or email ma.manoj@gmail.com.";
  } finally {
    busy = false;
    state();
  }
});
document
  .querySelector("#chat-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    dialog.close();
});
document.querySelector("#chat-prompts").addEventListener("click", (event) => {
  const prompt = event.target.closest("[data-question]");
  if (!prompt) return;
  question.value = prompt.dataset.question;
  question.focus();
});
question.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    messageForm.requestSubmit();
  }
});
messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = question.value.trim();
  if (busy || !text) return;
  busy = true;
  error.textContent = "";
  state();
  // Reuse a request ID after a network failure to avoid duplicated messages/emails.
  if (!pending || pending.text !== text)
    pending = { text, id: crypto.randomUUID() };
  try {
    const result = await api("message", {
      message: text,
      request_id: pending.id,
      consent: true,
    });
    addMessage("visitor", text);
    addMessage("assistant", result.text, result.sources);
    if (
      result.engine === "facts" &&
      !document.querySelector("#chat-ai-notice").hidden
    )
      error.textContent =
        "AI is temporarily unavailable or its daily limit has been reached. This answer uses published passages.";
    started = true;
    pending = undefined;
    question.value = "";
  } catch (failure) {
    error.textContent = failure.message;
  } finally {
    busy = false;
    state();
    question.focus();
  }
});
contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = document.querySelector("#chat-contact-status");
  if (!started) {
    status.textContent =
      "Send your first message before leaving contact details.";
    return;
  }
  const button = contactForm.querySelector("button[type=submit]");
  button.disabled = true;
  status.textContent = "";
  try {
    const values = Object.fromEntries(new FormData(contactForm));
    await api("contact", { ...values, consent: true });
    contactForm.querySelectorAll("input,textarea").forEach((input) => {
      input.disabled = true;
    });
    status.textContent = "Saved for Manoj. Thank you for reaching out.";
  } catch (failure) {
    status.textContent = failure.message;
    button.disabled = false;
  }
});
document.querySelector("#chat-new").addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  state();
  try {
    await api("new", {});
    started = false;
    pending = undefined;
    messages.replaceChildren();
    question.value = "";
    error.textContent = "";
    contactForm.hidden = false;
    contactForm.reset();
    contactForm.querySelectorAll("input,textarea,button").forEach((input) => {
      input.disabled = false;
    });
    document.querySelector("#chat-contact-status").textContent = "";
    document
      .querySelector("#chat-contact")
      .querySelectorAll(":scope > p:not(:first-of-type)")
      .forEach((item) => item.remove());
    document.querySelector("#chat-contact").open = false;
    question.focus();
  } catch (failure) {
    error.textContent = failure.message;
  } finally {
    busy = false;
    state();
  }
});
