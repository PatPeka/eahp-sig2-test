const data = window.agendaData;
const root = document.querySelector("#agenda-root");
const totalSlides = data.slides.length;
const overviewIndex = -1;
const notesStoragePrefix = data.meeting.storageKey || "sig2-meeting-deck-notes";
let currentIndex = overviewIndex;
let slideBeforePrint = overviewIndex;

function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text) {
    element.textContent = options.text;
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([name, value]) => {
      element.setAttribute(name, value);
    });
  }

  return element;
}

function appendChildren(parent, children) {
  children.forEach((child) => parent.appendChild(child));
  return parent;
}

function getLogo(position) {
  return data.meeting.logos.find((logo) => logo.position === position) || data.meeting.logos[position === "left" ? 0 : 1];
}

function getNotesKey(index) {
  return `${notesStoragePrefix}-${index === overviewIndex ? "overview" : `slide-${index + 1}`}`;
}

function readSavedNotes(index) {
  try {
    return window.localStorage.getItem(getNotesKey(index)) || "";
  } catch (error) {
    return "";
  }
}

function saveNotes(index, value) {
  try {
    window.localStorage.setItem(getNotesKey(index), value);
  } catch (error) {
    // Browsers may block localStorage for local files in strict privacy modes.
  }
}

function renderDeckShell() {
  root.innerHTML = "";
  appendChildren(root, [
    createElement("section", {
      className: "slide-stage",
      attributes: { id: "slide-stage", "aria-live": "polite" }
    }),
    renderControls()
  ]);
}

function renderControls() {
  const controls = createElement("nav", {
    className: "deck-controls",
    attributes: { "aria-label": "Slide controls" }
  });

  appendChildren(controls, [
    createElement("button", {
      className: "control-button",
      text: "←",
      attributes: { type: "button", id: "previous-slide", "aria-label": "Previous slide" }
    }),
    createElement("button", {
      className: "control-button home-button",
      text: "Home",
      attributes: { type: "button", id: "overview-slide", "aria-label": "Agenda overview" }
    }),
    createElement("p", {
      className: "slide-counter",
      text: `Overview / ${totalSlides}`,
      attributes: { id: "slide-counter" }
    }),
    createElement("button", {
      className: "control-button",
      text: "→",
      attributes: { type: "button", id: "next-slide", "aria-label": "Next slide" }
    })
  ]);

  return controls;
}

function renderOverview() {
  const slide = createElement("article", { className: "slide overview-slide" });
  const grid = createElement("div", { className: "overview-grid" });

  data.slides.forEach((item, index) => {
    const button = createElement("button", {
      className: "overview-card",
      attributes: { type: "button", "data-slide-index": String(index) }
    });

    appendChildren(button, [
      createElement("span", { text: item.kicker || `Slide ${index + 1}` }),
      createElement("strong", { text: item.title })
    ]);
    grid.appendChild(button);
  });

  appendChildren(slide, [renderOverviewHero(), grid, renderSlideFooter(overviewIndex)]);
  return slide;
}

function renderTopicSlide(slideData, index) {
  const slide = createElement("article", { className: "slide topic-slide" });
  const body = createElement("div", { className: "slide-body" });

  if (slideData.bullets) {
    body.appendChild(renderBulletList(slideData.bullets));
  }

  if (slideData.layout === "use-cases") {
    body.appendChild(renderUseCases(slideData.items));
  }

  if (slideData.layout === "process-flow") {
    body.appendChild(renderProcessFlow(slideData.steps));
  }

  if (slideData.layout === "decisions") {
    body.appendChild(renderDecisions(slideData.items));
  }

  if (slideData.layout === "questions") {
    body.appendChild(renderQuestions(slideData.groups));
  }

  if (slideData.layout === "next-actions") {
    body.appendChild(renderNextActions(slideData.items));
  }

  appendChildren(slide, [
    renderDeckMeta(index),
    renderSlideHeader(slideData),
    body,
    renderSlideFooter(index)
  ]);

  return slide;
}

function renderDeckMeta(index) {
  const meta = createElement("div", { className: "deck-meta" });
  data.meeting.meta.forEach((item) => {
    meta.appendChild(createElement("span", { text: item }));
  });
  meta.appendChild(createElement("span", { text: `${index + 1} / ${totalSlides}` }));
  return meta;
}

function renderOverviewHero() {
  const hero = createElement("header", { className: "overview-hero" });
  const meta = createElement("div", { className: "overview-meta" });

  data.meeting.meta.forEach((item) => {
    meta.appendChild(createElement("span", { text: item }));
  });

  appendChildren(hero, [
    createElement("p", { className: "hero-eyebrow", text: data.meeting.eyebrow }),
    createElement("h1", { text: data.meeting.title }),
    createElement("p", { className: "hero-subtitle", text: data.meeting.subtitle }),
    meta
  ]);

  return hero;
}

function renderLogo(logo, className) {
  return createElement("img", {
    className,
    attributes: { src: logo.src, alt: logo.alt }
  });
}

function renderMeetingNotes(index) {
  const wrapper = createElement("label", { className: "meeting-notes" });
  const textarea = createElement("textarea", {
    attributes: {
      rows: "2",
      placeholder: "Meeting notes",
      "aria-label": "Meeting notes"
    }
  });

  textarea.value = readSavedNotes(index);
  textarea.addEventListener("input", () => saveNotes(index, textarea.value));

  appendChildren(wrapper, [
    createElement("span", { text: "Meeting notes" }),
    textarea
  ]);
  return wrapper;
}

function renderSlideFooter(index) {
  const footer = createElement("footer", { className: "slide-footer" });
  appendChildren(footer, [
    renderLogo(getLogo("left"), "footer-logo footer-logo-left"),
    renderMeetingNotes(index),
    renderLogo(getLogo("right"), "footer-logo footer-logo-right")
  ]);
  return footer;
}

function renderSlideHeader({ kicker, title, lead }) {
  const header = createElement("header", { className: "slide-header" });
  appendChildren(header, [
    createElement("p", { className: "eyebrow", text: kicker }),
    createElement("h1", { text: title }),
    createElement("p", { className: "slide-lead", text: lead })
  ]);
  return header;
}

function renderBulletList(items) {
  const list = createElement("ul", { className: "large-list" });
  items.forEach((item) => list.appendChild(createElement("li", { text: item })));
  return list;
}

function renderUseCases(items = []) {
  const grid = createElement("div", { className: "use-case-grid" });
  items.forEach((item) => {
    const card = createElement("article", { className: "use-case-card" });
    appendChildren(card, [
      createElement("span", { text: item.id }),
      createElement("h2", { text: item.title })
    ]);
    grid.appendChild(card);
  });
  return grid;
}

function renderProcessFlow(steps = []) {
  const list = createElement("ol", {
    className: "process-flow",
    attributes: { "aria-label": "Meeting process flow" }
  });
  steps.forEach((step) => list.appendChild(createElement("li", { text: step })));
  return list;
}

function renderDecisions(items = []) {
  const list = createElement("div", { className: "decision-list" });
  items.forEach((item) => {
    const card = createElement("article", { className: "decision-card" });
    appendChildren(card, [
      createElement("span", { text: item.id }),
      createElement("p", { text: item.text })
    ]);
    list.appendChild(card);
  });
  return list;
}

function renderQuestionColumn(group) {
  const column = createElement("section", { className: "question-column" });
  appendChildren(column, [
    createElement("h2", { text: group.title }),
    renderBulletList(group.items)
  ]);
  return column;
}

function renderQuestions(groups = []) {
  const columns = createElement("div", { className: "question-grid" });
  groups.forEach((group) => columns.appendChild(renderQuestionColumn(group)));
  return columns;
}

function renderNextActions(items = []) {
  const list = createElement("ol", { className: "next-action-list" });
  items.forEach((item) => list.appendChild(createElement("li", { text: item })));
  return list;
}

function showSlide(index) {
  currentIndex = Math.max(overviewIndex, Math.min(index, totalSlides - 1));
  const stage = document.querySelector("#slide-stage");
  stage.innerHTML = "";
  stage.appendChild(currentIndex === overviewIndex ? renderOverview() : renderTopicSlide(data.slides[currentIndex], currentIndex));
  updateControls();
}

function updateControls() {
  const previous = document.querySelector("#previous-slide");
  const next = document.querySelector("#next-slide");
  const counter = document.querySelector("#slide-counter");

  previous.disabled = currentIndex === overviewIndex;
  next.disabled = currentIndex === totalSlides - 1;
  counter.textContent = currentIndex === overviewIndex ? `Overview / ${totalSlides}` : `${currentIndex + 1} / ${totalSlides}`;

  document.querySelectorAll("[data-slide-index]").forEach((button) => {
    button.addEventListener("click", () => showSlide(Number(button.dataset.slideIndex)));
  });
}

function nextSlide() {
  if (currentIndex < totalSlides - 1) {
    showSlide(currentIndex + 1);
  }
}

function previousSlide() {
  if (currentIndex > overviewIndex) {
    showSlide(currentIndex - 1);
  }
}

function showOverview() {
  showSlide(overviewIndex);
}

function renderAllSlidesForPrint() {
  slideBeforePrint = currentIndex;
  const stage = document.querySelector("#slide-stage");
  stage.innerHTML = "";
  stage.appendChild(renderOverview());
  data.slides.forEach((slide, index) => stage.appendChild(renderTopicSlide(slide, index)));
}

function restoreSlideAfterPrint() {
  showSlide(slideBeforePrint);
}

function isEditingNotes(event) {
  return event.target.closest("textarea, input, [contenteditable='true']") !== null;
}

function bindNavigation() {
  document.querySelector("#previous-slide").addEventListener("click", previousSlide);
  document.querySelector("#next-slide").addEventListener("click", nextSlide);
  document.querySelector("#overview-slide").addEventListener("click", showOverview);

  document.addEventListener("keydown", (event) => {
    if (isEditingNotes(event)) {
      return;
    }
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      nextSlide();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousSlide();
    }
    if (event.key === "Home" || event.key === "Escape") {
      event.preventDefault();
      showOverview();
    }
  });

  window.addEventListener("beforeprint", renderAllSlidesForPrint);
  window.addEventListener("afterprint", restoreSlideAfterPrint);
}

function renderDeck() {
  document.title = data.meeting.documentTitle || `${data.meeting.eyebrow} ${data.meeting.meetingNumber || "Meeting"}`;
  renderDeckShell();
  bindNavigation();
  showOverview();
}

renderDeck();
