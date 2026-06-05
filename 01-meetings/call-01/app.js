const data = window.agendaData;
const root = document.querySelector("#agenda-root");
const totalSlides = data.slides.length;
const overviewIndex = -1;
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
  const header = renderSlideHeader({
    kicker: data.meeting.eyebrow,
    title: data.overviewTitle,
    lead: data.meeting.subtitle
  });
  const grid = createElement("div", { className: "overview-grid" });

  data.slides.forEach((item, index) => {
    const button = createElement("button", {
      className: "overview-card",
      attributes: { type: "button", "data-slide-index": String(index) }
    });

    appendChildren(button, [
      createElement("span", { text: `Slide ${index + 1}` }),
      createElement("strong", { text: item.title })
    ]);
    grid.appendChild(button);
  });

  appendChildren(slide, [header, grid]);
  return slide;
}

function renderTopicSlide(slideData, index) {
  const slide = createElement("article", { className: "slide topic-slide" });
  const header = renderSlideHeader(slideData);
  const body = createElement("div", { className: "slide-body" });

  if (slideData.bullets) {
    body.appendChild(renderBulletList(slideData.bullets));
  }

  if (slideData.layout === "use-cases") {
    body.appendChild(renderUseCases());
  }

  if (slideData.layout === "process-flow") {
    body.appendChild(renderProcessFlow());
  }

  if (slideData.layout === "decisions") {
    body.appendChild(renderDecisions());
  }

  if (slideData.layout === "questions") {
    body.appendChild(renderQuestions());
  }

  if (slideData.layout === "next-actions") {
    body.appendChild(renderNextActions());
  }

  appendChildren(slide, [
    renderDeckMeta(index),
    header,
    body
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
  items.forEach((item) => {
    list.appendChild(createElement("li", { text: item }));
  });
  return list;
}

function renderUseCases() {
  const grid = createElement("div", { className: "use-case-grid" });

  data.useCases.forEach((useCase) => {
    const card = createElement("article", { className: "use-case-card" });
    appendChildren(card, [
      createElement("span", { text: useCase.id }),
      createElement("h2", { text: useCase.title })
    ]);
    grid.appendChild(card);
  });

  return grid;
}

function renderProcessFlow() {
  const list = createElement("ol", {
    className: "process-flow",
    attributes: { "aria-label": "Prescription to confirmation process flow" }
  });

  data.processFlow.forEach((step) => {
    list.appendChild(createElement("li", { text: step }));
  });

  return list;
}

function renderDecisions() {
  const list = createElement("div", { className: "decision-list" });

  data.proposedDecisions.forEach((decision) => {
    const card = createElement("article", { className: "decision-card" });
    appendChildren(card, [
      createElement("span", { text: decision.id }),
      createElement("p", { text: decision.text })
    ]);
    list.appendChild(card);
  });

  return list;
}

function renderQuestionColumn(title, questions) {
  const column = createElement("section", { className: "question-column" });
  appendChildren(column, [
    createElement("h2", { text: title }),
    renderBulletList(questions)
  ]);
  return column;
}

function renderQuestions() {
  const columns = createElement("div", { className: "question-grid" });
  appendChildren(columns, [
    renderQuestionColumn("Pharmacist validation", data.questions.pharmacist),
    renderQuestionColumn("Vendor validation", data.questions.vendor),
    renderQuestionColumn("FHIR / data model", data.questions.fhir)
  ]);
  return columns;
}

function renderNextActions() {
  const list = createElement("ol", { className: "next-action-list" });
  data.nextActions.forEach((action) => {
    list.appendChild(createElement("li", { text: action }));
  });
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
  data.slides.forEach((slide, index) => {
    stage.appendChild(renderTopicSlide(slide, index));
  });
}

function restoreSlideAfterPrint() {
  showSlide(slideBeforePrint);
}

function bindNavigation() {
  document.querySelector("#previous-slide").addEventListener("click", previousSlide);
  document.querySelector("#next-slide").addEventListener("click", nextSlide);
  document.querySelector("#overview-slide").addEventListener("click", showOverview);

  document.addEventListener("keydown", (event) => {
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
  document.title = `${data.meeting.eyebrow} Call #1 Meeting Deck`;
  renderDeckShell();
  bindNavigation();
  showOverview();
}

renderDeck();
