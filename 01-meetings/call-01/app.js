const agendaItems = Array.from(document.querySelectorAll(".agenda-item"));
const checkboxes = agendaItems.map((item) => item.querySelector("input[type='checkbox']"));
const completedCount = document.querySelector("#completed-count");
const totalCount = document.querySelector("#total-count");
const progressFill = document.querySelector("#progress-fill");
const notes = document.querySelector("#meeting-notes");
const clearNotes = document.querySelector("#clear-notes");
const saveStatus = document.querySelector("#save-status");

const storageKeys = {
  checks: "eahp-sig2-call-01-interoperability-checks",
  notes: "eahp-sig2-call-01-interoperability-notes"
};

function readSavedChecks() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.checks) || "[]");
  } catch {
    return [];
  }
}

function loadState() {
  const savedChecks = readSavedChecks();
  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = Boolean(savedChecks[index]);
  });

  notes.value = localStorage.getItem(storageKeys.notes) || "";
}

function saveChecks() {
  const values = checkboxes.map((checkbox) => checkbox.checked);
  localStorage.setItem(storageKeys.checks, JSON.stringify(values));
}

function updateProgress() {
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

function showSavedMessage(message) {
  saveStatus.textContent = message;
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    saveChecks();
    updateProgress();
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

loadState();
updateProgress();
