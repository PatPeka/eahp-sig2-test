const data = window.agendaData;
const root = document.querySelector("#agenda-root");

const storageKeys = {
  checks: "eahp-sig2-call-01-interoperability-checks",
  notes: "eahp-sig2-call-01-interoperability-notes"
};

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

function renderHeader() {
  const header = createElement("header", { className: "meeting-header" });
  const meta = createElement("div", {
    className: "meeting-meta",
    attributes: { "aria-label": "Meeting details" }
  });

  data.meeting.meta.forEach((item) => {
    meta.appendChild(createElement("span", { text: item }));
  });

  appendChildren(header, [
    createElement("p", { className: "eyebrow", text: data.meeting.eyebrow }),
    createElement("h1", { text: data.meeting.title }),
    createElement("p", { className: "meeting-summary", text: data.meeting.subtitle }),
    meta
  ]);

  return header;
}

function renderProgressPanel() {
  const section = createElement("section", {
    className: "progress-panel",
    attributes: { "aria-labelledby": "progress-title" }
  });
  const textWrap = createElement("div");
  const progressText = createElement("p");
  const completed = createElement("span", { text: "0", attributes: { id: "completed-count" } });
  const total = createElement("span", { text: "0", attributes: { id: "total-count" } });
  const track = createElement("div", {
    className: "progress-track",
    attributes: { "aria-hidden": "true" }
  });

  progressText.append(completed, document.createTextNode(" of "), total, document.createTextNode(" items completed"));
  appendChildren(textWrap, [
    createElement("h2", { text: "Agenda Progress", attributes: { id: "progress-title" } }),
    progressText
  ]);
  track.appendChild(createElement("div", { className: "progress-fill", attributes: { id: "progress-fill" } }));
  appendChildren(section, [textWrap, track]);

  return section;
}

function renderObjectives() {
  const list = createElement("ul", { className: "objective-list" });
  data.objectives.forEach((objective) => {
    list.appendChild(createElement("li", { text: objective }));
  });

  return renderContentSection({
    eyebrow: "Meeting objectives",
    title: "What Call #1 should settle",
    content: list
  });
}

function renderAgendaList() {
  const section = createElement("section", {
    className: "agenda-list",
    attributes: { "aria-label": "Meeting agenda" }
  });

  data.agendaSections.forEach((item) => {
    const article = createElement("article", { className: "agenda-item" });
    const label = createElement("label");
    const checkbox = createElement("input", { attributes: { type: "checkbox" } });
    const titleWrap = createElement("span");

    appendChildren(titleWrap, [
      createElement("strong", { text: item.title }),
      createElement("small", { text: item.duration })
    ]);
    appendChildren(label, [checkbox, titleWrap]);
    appendChildren(article, [label, createElement("p", { text: item.description })]);
    section.appendChild(article);
  });

  return section;
}

function renderUseCases() {
  const grid = createElement("div", { className: "use-case-grid" });

  data.useCases.forEach((useCase) => {
    const card = createElement("article", { className: "use-case-card" });
    appendChildren(card, [
      createElement("span", { text: useCase.id }),
      createElement("h3", { text: useCase.title }),
      createElement("p", { text: useCase.description })
    ]);
    grid.appendChild(card);
  });

  return renderContentSection({
    eyebrow: "Candidate use cases",
    title: "Initial interoperability scenarios",
    content: grid,
    titleId: "use-cases-title"
  });
}

function renderProcessFlow() {
  const list = createElement("ol", {
    className: "process-flow",
    attributes: { "aria-label": "Prescription to confirmation process flow" }
  });

  data.processFlow.forEach((step) => {
    list.appendChild(createElement("li", { text: step }));
  });

  return renderContentSection({
    eyebrow: "Process flow",
    title: "Baseline dispense-order pathway",
    content: list,
    titleId: "flow-title"
  });
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

  return renderContentSection({
    eyebrow: "Proposed decisions",
    title: "Items to confirm during Call #1",
    content: list,
    titleId: "decisions-title"
  });
}

function renderQuestionColumn(title, questions) {
  const column = createElement("div");
  const list = createElement("ul");
  questions.forEach((question) => {
    list.appendChild(createElement("li", { text: question }));
  });
  appendChildren(column, [createElement("h3", { text: title }), list]);
  return column;
}

function renderQuestions() {
  const columns = createElement("div", { className: "question-columns question-columns-three" });
  appendChildren(columns, [
    renderQuestionColumn("For pharmacists", data.pharmacistValidationQuestions),
    renderQuestionColumn("For vendors", data.vendorValidationQuestions),
    renderQuestionColumn("FHIR / data model", data.fhirDataModelQuestions)
  ]);

  return renderContentSection({
    className: "content-section questions-panel",
    eyebrow: "Validation questions",
    title: "Keep clinical, vendor, and data-model input separate",
    content: columns,
    titleId: "questions-title"
  });
}

function renderNextActions() {
  const list = createElement("ol", { className: "next-action-list" });
  data.nextActions.forEach((action) => {
    list.appendChild(createElement("li", { text: action }));
  });

  return renderContentSection({
    eyebrow: "Next actions",
    title: "Follow-up to prepare before Call #2",
    content: list
  });
}

function renderContentSection({ eyebrow, title, content, className = "content-section", titleId }) {
  const section = createElement("section", { className });
  const heading = createElement("div", { className: "section-heading" });
  const headingId = titleId || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const h2 = createElement("h2", { text: title, attributes: { id: headingId } });

  section.setAttribute("aria-labelledby", headingId);
  appendChildren(heading, [
    createElement("p", { className: "eyebrow", text: eyebrow }),
    h2
  ]);
  appendChildren(section, [heading, content]);

  return section;
}

function renderNotesPanel() {
  const section = createElement("section", {
    className: "notes-panel",
    attributes: { "aria-labelledby": "notes-title" }
  });
  const header = createElement("div", { className: "notes-header" });
  const textarea = createElement("textarea", {
    attributes: {
      id: "meeting-notes",
      rows: "8",
      placeholder: data.meeting.notesPlaceholder
    }
  });

  appendChildren(header, [
    createElement("h2", { text: "Meeting Notes", attributes: { id: "notes-title" } }),
    createElement("button", { text: "Clear", attributes: { type: "button", id: "clear-notes" } })
  ]);
  appendChildren(section, [
    header,
    textarea,
    createElement("p", {
      className: "save-status",
      text: "Notes save automatically in this browser.",
      attributes: { id: "save-status", role: "status" }
    })
  ]);

  return section;
}

function readSavedChecks() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.checks) || "[]");
  } catch {
    return [];
  }
}

function loadState(checkboxes, notes) {
  const savedChecks = readSavedChecks();
  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = Boolean(savedChecks[index]);
  });

  notes.value = localStorage.getItem(storageKeys.notes) || "";
}

function saveChecks(checkboxes) {
  const values = checkboxes.map((checkbox) => checkbox.checked);
  localStorage.setItem(storageKeys.checks, JSON.stringify(values));
}

function updateProgress(agendaItems, checkboxes, completedCount, totalCount, progressFill) {
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
  const total = checkboxes.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  completedCount.textContent = completed;
  totalCount.textContent = total;
  progressFill.style.width = `${percent}%`;

  agendaItems.forEach((item, index) => {
    item.classList.toggle("is-complete", checkboxes[index].checked);
  });
}

function bindInteractions() {
  const agendaItems = Array.from(document.querySelectorAll(".agenda-item"));
  const checkboxes = agendaItems.map((item) => item.querySelector("input[type='checkbox']"));
  const completedCount = document.querySelector("#completed-count");
  const totalCount = document.querySelector("#total-count");
  const progressFill = document.querySelector("#progress-fill");
  const notes = document.querySelector("#meeting-notes");
  const clearNotes = document.querySelector("#clear-notes");
  const saveStatus = document.querySelector("#save-status");

  function showSavedMessage(message) {
    saveStatus.textContent = message;
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      saveChecks(checkboxes);
      updateProgress(agendaItems, checkboxes, completedCount, totalCount, progressFill);
    });
  });

  notes.addEventListener("input", () => {
    localStorage.setItem(storageKeys.notes, notes.value);
    showSavedMessage("Notes saved in this browser.");
  });

  clearNotes.addEventListener("click", () => {
    notes.value = "";
    localStorage.removeItem(storageKeys.notes);
    showSavedMessage("Notes cleared.");
    notes.focus();
  });

  loadState(checkboxes, notes);
  updateProgress(agendaItems, checkboxes, completedCount, totalCount, progressFill);
}

function renderAgenda() {
  document.title = `${data.meeting.eyebrow} Call #1 Agenda`;
  appendChildren(root, [
    renderHeader(),
    renderProgressPanel(),
    renderObjectives(),
    renderAgendaList(),
    renderUseCases(),
    renderProcessFlow(),
    renderDecisions(),
    renderQuestions(),
    renderNextActions(),
    renderNotesPanel()
  ]);

  bindInteractions();
}

renderAgenda();
