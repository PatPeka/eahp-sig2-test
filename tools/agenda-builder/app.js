const STORAGE_KEY = "eahp-sig2-agenda-builder-draft-v1";
const editorRoot = document.querySelector("#editor-root");
const previewRoot = document.querySelector("#preview-root");
const message = document.querySelector("#message");
const saveStatus = document.querySelector("#save-status");
let selectedSlide = 0;
let autosaveTimer;

const initialState = {
  meeting: {
    meetingNumber: "Call #2",
    title: "Interoperability in Hospital Pharmacy Automation",
    subtitle: "Prepare the next SIG 2 discussion and decisions.",
    date: "",
    storageKey: "eahp-sig2-call-02-notes",
    footerLabel: "EAHP SIG 2",
    objectives: ["Confirm the meeting scope.", "Review proposed use cases.", "Agree decisions and next actions."]
  },
  slides: [
    {
      id: "S-01",
      title: "Welcome and meeting objectives",
      type: "standard",
      description: "Set the working frame and expected outcomes.",
      bullets: ["Confirm the meeting scope.", "Review proposed use cases.", "Agree decisions and next actions."],
      image: "",
      imageCaption: ""
    },
    { id: "S-02", title: "Candidate use cases", type: "use-cases", description: "Review and prioritize candidate scenarios.", bullets: [], image: "", imageCaption: "" },
    { id: "S-03", title: "Process flow", type: "process-flow", description: "Review the end-to-end workflow.", bullets: [], image: "", imageCaption: "" },
    { id: "S-04", title: "Decisions expected", type: "decisions", description: "Confirm the decisions needed to proceed.", bullets: [], image: "", imageCaption: "" },
    { id: "S-05", title: "Open questions", type: "questions", description: "Validate clinical, vendor, and data-model questions.", bullets: [], image: "", imageCaption: "" },
    { id: "S-06", title: "Next actions", type: "next-actions", description: "Assign owners and follow-up dates.", bullets: [], image: "", imageCaption: "" }
  ],
  useCases: [
    { id: "UC-01", title: "Patient-specific dispense order from PIS to preparation system", description: "", status: "Candidate", validationFocus: "Order content and transmission", image: "" },
    { id: "UC-02", title: "Unit-dose labeling and traceability", description: "", status: "Candidate", validationFocus: "Label data and identifiers", image: "" },
    { id: "UC-03", title: "Order cancellation or modification after production planning", description: "", status: "Candidate", validationFocus: "Change and cancellation handling", image: "" },
    { id: "UC-04", title: "Preparation confirmation and status feedback", description: "", status: "Candidate", validationFocus: "Status events and confirmation", image: "" }
  ],
  processFlow: [
    "Prescription validated",
    "Dispense order created",
    "Order transmitted",
    "Preparation system accepts/rejects",
    "Unit dose prepared",
    "Confirmation returned"
  ],
  decisions: [
    { id: "D-001", text: "Use case documentation will follow a standard SOP template", status: "Proposed" },
    { id: "D-002", text: "Each selected use case will include a flow diagram first, then BPMN where appropriate", status: "Proposed" },
    { id: "D-003", text: "Each use case will maintain separate pharmacist and vendor validation questions", status: "Proposed" }
  ],
  questionGroups: [
    { title: "Pharmacist validation", items: ["Which clinical checks must happen before an order is sent?"] },
    { title: "Vendor validation", items: ["Which message formats and identifiers are currently supported?"] },
    { title: "FHIR / data model", items: ["Which resources and identifiers best represent the workflow?"] }
  ],
  nextActions: [
    { owner: "", action: "Confirm owners for the first use case drafts", dueDate: "", status: "Open" }
  ]
};

let state = structuredClone(initialState);

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
}

function field(label, value, scope, index, name, options = {}) {
  const attributes = `data-scope="${scope}" data-index="${index ?? ""}" data-field="${name}"`;
  if (options.type === "textarea") {
    return `<label class="${options.wide ? "field-wide" : ""}">${label}<textarea rows="${options.rows || 3}" ${attributes}>${escapeHtml(value)}</textarea></label>`;
  }
  if (options.type === "select") {
    const choices = options.choices.map((choice) => `<option value="${escapeHtml(choice)}" ${choice === value ? "selected" : ""}>${escapeHtml(choice)}</option>`).join("");
    return `<label>${label}<select ${attributes}>${choices}</select></label>`;
  }
  return `<label class="${options.wide ? "field-wide" : ""}">${label}<input type="${options.type || "text"}" value="${escapeHtml(value)}" ${attributes}></label>`;
}

function sectionHeading(title, description, action = "") {
  return `<div class="section-heading"><div><h2>${escapeHtml(title)}</h2>${description ? `<p>${escapeHtml(description)}</p>` : ""}</div>${action}</div>`;
}

function renderEditor() {
  editorRoot.innerHTML = [renderMeetingEditor(), renderSlidesEditor(), renderUseCasesEditor(), renderFlowEditor(), renderDecisionsEditor(), renderQuestionsEditor(), renderActionsEditor(), renderImageNote()].join("");
}

function renderMeetingEditor() {
  const meeting = state.meeting;
  return `<section class="editor-section">
    ${sectionHeading("Meeting metadata", "Details used on the overview and throughout the exported deck.")}
    <div class="field-grid">
      ${field("Meeting number", meeting.meetingNumber, "meeting", null, "meetingNumber")}
      ${field("Date", meeting.date, "meeting", null, "date", { type: "date" })}
      ${field("Meeting title", meeting.title, "meeting", null, "title", { wide: true })}
      ${field("Subtitle", meeting.subtitle, "meeting", null, "subtitle", { type: "textarea", rows: 2, wide: true })}
      ${field("Meeting notes storage key", meeting.storageKey, "meeting", null, "storageKey")}
      ${field("Footer label", meeting.footerLabel, "meeting", null, "footerLabel")}
      ${field("Meeting objectives (one per line)", meeting.objectives.join("\n"), "meeting", null, "objectives", { type: "textarea", rows: 4, wide: true })}
    </div>
  </section>`;
}

function renderSlidesEditor() {
  const items = state.slides.map((slide, index) => `<article class="editor-item ${index === selectedSlide ? "selected" : ""}" data-select-slide="${index}">
    <div class="item-title-row">
      <strong>${escapeHtml(slide.id || `Slide ${index + 1}`)} · ${escapeHtml(slide.title || "Untitled slide")}</strong>
      <div class="item-actions">
        <button class="button-small" type="button" data-action="select-slide" data-index="${index}">Preview</button>
        <button class="button-small" type="button" data-action="move-slide-up" data-index="${index}" ${index === 0 ? "disabled" : ""}>↑</button>
        <button class="button-small" type="button" data-action="move-slide-down" data-index="${index}" ${index === state.slides.length - 1 ? "disabled" : ""}>↓</button>
        <button class="button-small" type="button" data-action="duplicate-slide" data-index="${index}">Duplicate</button>
        <button class="button-small button-danger" type="button" data-action="delete-slide" data-index="${index}">Delete</button>
      </div>
    </div>
    <div class="field-grid">
      ${field("Slide ID", slide.id, "slides", index, "id")}
      ${field("Slide type", slide.type, "slides", index, "type", { type: "select", choices: ["title", "standard", "use-cases", "process-flow", "decisions", "questions", "next-actions"] })}
      ${field("Slide title", slide.title, "slides", index, "title", { wide: true })}
      ${field("Short description / speaker note", slide.description, "slides", index, "description", { type: "textarea", rows: 2, wide: true })}
      ${field("Bullet list (one per line)", slide.bullets.join("\n"), "slides", index, "bullets", { type: "textarea", rows: 3, wide: true })}
      ${field("Image reference", slide.image, "slides", index, "image")}
      ${field("Image caption", slide.imageCaption, "slides", index, "imageCaption")}
    </div>
  </article>`).join("");
  return `<section class="editor-section">
    ${sectionHeading("Slides", "Arrange the agenda and choose the content type for each slide.", '<button type="button" data-action="add-slide">Add slide</button>')}
    <div class="item-list">${items}</div>
  </section>`;
}

function renderUseCasesEditor() {
  const items = state.useCases.map((item, index) => `<article class="editor-item">
    <div class="item-title-row"><strong>${escapeHtml(item.id || "Use case")}</strong><button class="button-small button-danger" type="button" data-action="delete-use-case" data-index="${index}">Delete</button></div>
    <div class="field-grid">
      ${field("ID", item.id, "useCases", index, "id")}
      ${field("Status", item.status, "useCases", index, "status")}
      ${field("Title", item.title, "useCases", index, "title", { wide: true })}
      ${field("Description", item.description, "useCases", index, "description", { type: "textarea", rows: 2, wide: true })}
      ${field("Validation focus", item.validationFocus, "useCases", index, "validationFocus")}
      ${field("Image reference", item.image, "useCases", index, "image")}
    </div>
  </article>`).join("");
  return `<section class="editor-section">${sectionHeading("Use case cards", "Detailed scenarios available to use-case slides.", '<button type="button" data-action="add-use-case">Add use case</button>')}<div class="item-list">${items}</div></section>`;
}

function renderFlowEditor() {
  const rows = state.processFlow.map((step, index) => `<div class="flow-row">
    <input value="${escapeHtml(step)}" data-scope="processFlow" data-index="${index}" data-field="value" aria-label="Process step ${index + 1}">
    <div class="item-actions">
      <button class="button-small" type="button" data-action="move-step-up" data-index="${index}" ${index === 0 ? "disabled" : ""}>↑</button>
      <button class="button-small" type="button" data-action="move-step-down" data-index="${index}" ${index === state.processFlow.length - 1 ? "disabled" : ""}>↓</button>
      <button class="button-small button-danger" type="button" data-action="delete-step" data-index="${index}">Delete</button>
    </div>
  </div>`).join("");
  return `<section class="editor-section">${sectionHeading("Process flow", "Edit and order the workflow steps.", '<button type="button" data-action="add-step">Add step</button>')}<div>${rows}</div></section>`;
}

function renderDecisionsEditor() {
  const items = state.decisions.map((item, index) => `<article class="editor-item">
    <div class="item-title-row"><strong>${escapeHtml(item.id || "Decision")}</strong><button class="button-small button-danger" type="button" data-action="delete-decision" data-index="${index}">Delete</button></div>
    <div class="field-grid">
      ${field("Decision ID", item.id, "decisions", index, "id")}
      ${field("Status", item.status, "decisions", index, "status", { type: "select", choices: ["Proposed", "Validated", "Deferred"] })}
      ${field("Decision text", item.text, "decisions", index, "text", { type: "textarea", rows: 2, wide: true })}
    </div>
  </article>`).join("");
  return `<section class="editor-section">${sectionHeading("Proposed decisions", "Track decision wording and current status.", '<button type="button" data-action="add-decision">Add decision</button>')}<div class="item-list">${items}</div></section>`;
}

function renderQuestionsEditor() {
  const groups = state.questionGroups.map((group, groupIndex) => {
    const questions = group.items.map((question, questionIndex) => `<div class="question-row">
      <input value="${escapeHtml(question)}" data-scope="questions" data-index="${groupIndex}" data-sub-index="${questionIndex}" data-field="value" aria-label="${escapeHtml(group.title)} question">
      <button class="button-small button-danger" type="button" data-action="delete-question" data-index="${groupIndex}" data-sub-index="${questionIndex}">Delete</button>
    </div>`).join("");
    return `<div class="question-group"><div class="item-title-row"><strong>${escapeHtml(group.title)}</strong><button class="button-small" type="button" data-action="add-question" data-index="${groupIndex}">Add question</button></div>${questions}</div>`;
  }).join("");
  return `<section class="editor-section">${sectionHeading("Open questions", "Keep validation questions grouped for the meeting.")} ${groups}</section>`;
}

function renderActionsEditor() {
  const rows = state.nextActions.map((item, index) => `<article class="editor-item action-row">
    <div class="action-fields">
      ${field("Owner", item.owner, "nextActions", index, "owner")}
      ${field("Action", item.action, "nextActions", index, "action")}
      ${field("Due date", item.dueDate, "nextActions", index, "dueDate", { type: "date" })}
      ${field("Status", item.status, "nextActions", index, "status", { type: "select", choices: ["Open", "In progress", "Done", "Deferred"] })}
    </div>
    <button class="button-small button-danger" type="button" data-action="delete-action" data-index="${index}">Delete</button>
  </article>`).join("");
  return `<section class="editor-section">${sectionHeading("Next actions", "Capture owners, deadlines, and action status.", '<button type="button" data-action="add-action">Add action</button>')}<div class="item-list">${rows}</div></section>`;
}

function renderImageNote() {
  return `<section class="editor-section"><h2>Image references</h2><p class="help-note">Images should first be uploaded to the repository, ideally under <strong>assets/images/</strong>. Reference them in the exported agenda data with the correct relative path, for example <strong>../../assets/images/workflow-example.png</strong>. Drag-and-drop upload is not included in this version.</p></section>`;
}

function renderPreview() {
  const slide = state.slides[selectedSlide] || state.slides[0];
  const agenda = state.slides.map((item, index) => `<li><button class="button-small" type="button" data-action="select-slide" data-index="${index}">${escapeHtml(item.title || `Slide ${index + 1}`)}</button></li>`).join("");
  previewRoot.innerHTML = `<div class="preview-card">
    <div class="preview-hero"><p class="eyebrow">${escapeHtml(state.meeting.meetingNumber || "SIG 2 meeting")}</p><h3>${escapeHtml(state.meeting.title || "Untitled meeting")}</h3><p>${escapeHtml(state.meeting.subtitle || "")}</p></div>
    <div class="preview-body">
      <h3>Agenda</h3><ol class="preview-agenda">${agenda}</ol>
      ${renderSelectedSlidePreview(slide)}
      <h4>Use case cards</h4><div class="preview-grid">${state.useCases.map((item) => `<div class="preview-mini-card"><strong>${escapeHtml(item.id)}</strong>${escapeHtml(item.title)}<br><small>${escapeHtml(item.status)}</small></div>`).join("")}</div>
      <h4>Decisions</h4><ul class="preview-list">${state.decisions.map((item) => `<li><strong>${escapeHtml(item.id)}</strong> ${escapeHtml(item.text)} (${escapeHtml(item.status)})</li>`).join("")}</ul>
      <h4>Open questions</h4>${state.questionGroups.map((group) => `<strong>${escapeHtml(group.title)}</strong><ul class="preview-list">${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`).join("")}
      <h4>Next actions</h4>${renderActionsPreview()}
    </div>
  </div>`;
}

function renderSelectedSlidePreview(slide) {
  if (!slide) return "";
  let content = slide.bullets.length ? `<ul class="preview-list">${slide.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
  if (slide.type === "use-cases") content = `<div class="preview-grid">${state.useCases.map((item) => `<div class="preview-mini-card"><strong>${escapeHtml(item.id)}</strong>${escapeHtml(item.title)}</div>`).join("")}</div>`;
  if (slide.type === "process-flow") content = `<p>${state.processFlow.map(escapeHtml).join(" → ")}</p>`;
  if (slide.type === "decisions") content = `<ul class="preview-list">${state.decisions.map((item) => `<li>${escapeHtml(item.id)}: ${escapeHtml(item.text)}</li>`).join("")}</ul>`;
  if (slide.type === "questions") content = state.questionGroups.map((group) => `<strong>${escapeHtml(group.title)}</strong><ul class="preview-list">${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`).join("");
  if (slide.type === "next-actions") content = renderActionsPreview();
  return `<div class="preview-slide"><p class="eyebrow">${escapeHtml(slide.id)} · ${escapeHtml(slide.type)}</p><h3>${escapeHtml(slide.title)}</h3><p>${escapeHtml(slide.description)}</p>${slide.image ? `<p><strong>Image:</strong> ${escapeHtml(slide.image)}${slide.imageCaption ? ` — ${escapeHtml(slide.imageCaption)}` : ""}</p>` : ""}${content}</div>`;
}

function renderActionsPreview() {
  return `<table class="preview-table"><thead><tr><th>Owner</th><th>Action</th><th>Due</th><th>Status</th></tr></thead><tbody>${state.nextActions.map((item) => `<tr><td>${escapeHtml(item.owner)}</td><td>${escapeHtml(item.action)}</td><td>${escapeHtml(item.dueDate)}</td><td>${escapeHtml(item.status)}</td></tr>`).join("")}</tbody></table>`;
}

function updateStateFromInput(target) {
  const { scope, field: name, index, subIndex } = target.dataset;
  let value = target.value;
  if (name === "bullets" || name === "objectives") value = value.split("\n").map((item) => item.trim()).filter(Boolean);
  if (scope === "meeting") state.meeting[name] = value;
  if (["slides", "useCases", "decisions", "nextActions"].includes(scope)) state[scope][Number(index)][name] = value;
  if (scope === "processFlow") state.processFlow[Number(index)] = value;
  if (scope === "questions") state.questionGroups[Number(index)].items[Number(subIndex)] = value;
  scheduleAutosave();
  renderPreview();
}

function scheduleAutosave() {
  saveStatus.textContent = "Saving…";
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    saveDraft(false);
    saveStatus.textContent = "Saved locally";
  }, 500);
}

function saveDraft(showMessage = true) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (showMessage) setMessage("Draft saved locally in this browser.");
}

function loadDraft() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return setMessage("No local draft was found.", true);
  try {
    state = normalizeDraft(JSON.parse(saved));
    selectedSlide = 0;
    renderAll();
    setMessage("Local draft loaded.");
  } catch (error) {
    setMessage("The local draft could not be loaded.", true);
  }
}

function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(initialState);
  selectedSlide = 0;
  renderAll();
  setMessage("Local draft cleared and examples restored.");
}

function moveItem(array, from, to) {
  if (to < 0 || to >= array.length) return;
  const [item] = array.splice(from, 1);
  array.splice(to, 0, item);
}

function handleAction(action, index, subIndex) {
  if (action === "add-slide") {
    state.slides.push({ id: `S-${String(state.slides.length + 1).padStart(2, "0")}`, title: "New slide", type: "standard", description: "", bullets: [], image: "", imageCaption: "" });
    selectedSlide = state.slides.length - 1;
  }
  if (action === "select-slide") selectedSlide = Number(index);
  if (action === "duplicate-slide") {
    state.slides.splice(Number(index) + 1, 0, structuredClone(state.slides[Number(index)]));
    selectedSlide = Number(index) + 1;
  }
  if (action === "delete-slide" && state.slides.length > 1) {
    state.slides.splice(Number(index), 1);
    selectedSlide = Math.min(selectedSlide, state.slides.length - 1);
  }
  if (action === "move-slide-up") { moveItem(state.slides, Number(index), Number(index) - 1); selectedSlide = Math.max(0, Number(index) - 1); }
  if (action === "move-slide-down") { moveItem(state.slides, Number(index), Number(index) + 1); selectedSlide = Math.min(state.slides.length - 1, Number(index) + 1); }
  if (action === "add-use-case") state.useCases.push({ id: `UC-${String(state.useCases.length + 1).padStart(2, "0")}`, title: "New use case", description: "", status: "Candidate", validationFocus: "", image: "" });
  if (action === "delete-use-case") state.useCases.splice(Number(index), 1);
  if (action === "add-step") state.processFlow.push("New process step");
  if (action === "delete-step") state.processFlow.splice(Number(index), 1);
  if (action === "move-step-up") moveItem(state.processFlow, Number(index), Number(index) - 1);
  if (action === "move-step-down") moveItem(state.processFlow, Number(index), Number(index) + 1);
  if (action === "add-decision") state.decisions.push({ id: `D-${String(state.decisions.length + 1).padStart(3, "0")}`, text: "New proposed decision", status: "Proposed" });
  if (action === "delete-decision") state.decisions.splice(Number(index), 1);
  if (action === "add-question") state.questionGroups[Number(index)].items.push("New question?");
  if (action === "delete-question") state.questionGroups[Number(index)].items.splice(Number(subIndex), 1);
  if (action === "add-action") state.nextActions.push({ owner: "", action: "New action", dueDate: "", status: "Open" });
  if (action === "delete-action") state.nextActions.splice(Number(index), 1);
  saveDraft(false);
  renderAll();
}

function buildAgendaData() {
  const meetingNumber = state.meeting.meetingNumber || "SIG 2 Meeting";
  return {
    meeting: {
      documentTitle: `EAHP SIG 2 ${meetingNumber} Agenda`,
      eyebrow: state.meeting.footerLabel || "EAHP SIG 2",
      title: state.meeting.title,
      subtitle: state.meeting.subtitle,
      meetingNumber,
      date: state.meeting.date || "Date to be confirmed",
      meta: [meetingNumber, state.meeting.date || "Date to be confirmed", "Slide deck", "Offline"],
      storageKey: state.meeting.storageKey,
      objectives: state.meeting.objectives,
      logos: [
        { src: "../../assets/logos/peka-logo.png", alt: "Peka logo", position: "left" },
        { src: "../../assets/logos/eahp-logo.png", alt: "EAHP logo", position: "right" }
      ]
    },
    slides: state.slides.map((slide, index) => {
      const exported = {
        id: slide.id,
        title: slide.title,
        kicker: `Slide ${index + 1}`,
        lead: slide.description,
        facilitationNotes: slide.description,
        image: slide.image,
        imageCaption: slide.imageCaption
      };
      if (slide.bullets.length) exported.bullets = slide.bullets;
      if (slide.type === "use-cases") { exported.layout = "use-cases"; exported.items = state.useCases; }
      if (slide.type === "process-flow") { exported.layout = "process-flow"; exported.steps = state.processFlow; }
      if (slide.type === "decisions") { exported.layout = "decisions"; exported.items = state.decisions; }
      if (slide.type === "questions") { exported.layout = "questions"; exported.groups = state.questionGroups; }
      if (slide.type === "next-actions") {
        exported.layout = "next-actions";
        exported.items = state.nextActions.map((item) => [item.owner, item.action, item.dueDate, item.status].filter(Boolean).join(" — "));
        exported.actions = state.nextActions;
      }
      return exported;
    })
  };
}

function parseImportedData(source) {
  const trimmed = source.trim().replace(/^window\.agendaData\s*=\s*/, "").replace(/;\s*$/, "");
  return JSON.parse(trimmed);
}

function normalizeDraft(data) {
  if (data.useCases && data.processFlow && data.decisions) return { ...structuredClone(initialState), ...data };
  const meeting = data.meeting || {};
  const slides = (data.slides || []).map((slide, index) => ({
    id: slide.id || `S-${String(index + 1).padStart(2, "0")}`,
    title: slide.title || "Untitled slide",
    type: slide.layout || "standard",
    description: slide.facilitationNotes || slide.lead || "",
    bullets: slide.bullets || [],
    image: slide.image || "",
    imageCaption: slide.imageCaption || ""
  }));
  const findSlide = (layout) => (data.slides || []).find((slide) => slide.layout === layout) || {};
  return {
    meeting: {
      meetingNumber: meeting.meetingNumber || "",
      title: meeting.title || "",
      subtitle: meeting.subtitle || "",
      date: meeting.date && !meeting.date.startsWith("Date to") ? meeting.date : "",
      storageKey: meeting.storageKey || "eahp-sig2-call-notes",
      footerLabel: meeting.eyebrow || "EAHP SIG 2",
      objectives: meeting.objectives || []
    },
    slides: slides.length ? slides : structuredClone(initialState.slides),
    useCases: (findSlide("use-cases").items || []).map((item) => ({ description: "", status: "Candidate", validationFocus: "", image: "", ...item })),
    processFlow: findSlide("process-flow").steps || [],
    decisions: (findSlide("decisions").items || []).map((item) => ({ status: "Proposed", ...item })),
    questionGroups: findSlide("questions").groups || structuredClone(initialState.questionGroups),
    nextActions: findSlide("next-actions").actions || (findSlide("next-actions").items || []).map((action) => ({ owner: "", action, dueDate: "", status: "Open" }))
  };
}

function agendaJs() {
  return `window.agendaData = ${JSON.stringify(buildAgendaData(), null, 2)};\n`;
}

function downloadFile(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function setMessage(text, error = false) {
  message.textContent = text;
  message.style.color = error ? "#a13d3d" : "#115a54";
}

function renderAll() {
  renderEditor();
  renderPreview();
}

editorRoot.addEventListener("input", (event) => {
  if (event.target.matches("input, textarea, select")) updateStateFromInput(event.target);
});
editorRoot.addEventListener("change", (event) => {
  if (event.target.matches("select")) updateStateFromInput(event.target);
});
editorRoot.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (button) handleAction(button.dataset.action, button.dataset.index, button.dataset.subIndex);
});
previewRoot.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='select-slide']");
  if (button) handleAction("select-slide", button.dataset.index);
});

document.querySelector("#save-draft").addEventListener("click", () => saveDraft(true));
document.querySelector("#load-draft").addEventListener("click", loadDraft);
document.querySelector("#clear-draft").addEventListener("click", clearDraft);
document.querySelector("#import-data").addEventListener("click", () => {
  try {
    state = normalizeDraft(parseImportedData(document.querySelector("#import-source").value));
    selectedSlide = 0;
    saveDraft(false);
    renderAll();
    setMessage("Imported agenda data loaded into the editor.");
  } catch (error) {
    setMessage("Could not parse the pasted data. Use valid agenda-data.js or JSON.", true);
  }
});
document.querySelector("#export-js").addEventListener("click", () => downloadFile("agenda-data.js", agendaJs(), "application/javascript"));
document.querySelector("#export-json").addEventListener("click", () => downloadFile("agenda-data.json", `${JSON.stringify(buildAgendaData(), null, 2)}\n`, "application/json"));
document.querySelector("#copy-js").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(agendaJs());
    setMessage("agenda-data.js copied to the clipboard.");
  } catch (error) {
    setMessage("Clipboard access was blocked. Use Export agenda-data.js instead.", true);
  }
});

renderAll();
