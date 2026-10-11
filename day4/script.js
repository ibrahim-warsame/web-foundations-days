// ---------- 1. Select the elements we need ----------
const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

const DRAFT_KEY = "day4-draft";
const THEME_KEY = "day4-theme";
const LIMIT = 200;
const WARNING_AT = 180;

// ---------- 2. Counters ----------
function countWords(text) {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

function updateCounts() {
  const length = textarea.value.length;

  charCount.textContent = `${length} / ${LIMIT} characters`;
  wordCount.textContent = `${countWords(textarea.value)} words`;

  charCount.classList.toggle("warning", length > WARNING_AT && length <= LIMIT);
  charCount.classList.toggle("over", length > LIMIT);
}

// ---------- 3. Draft: save, restore, clear ----------
function saveDraft() {
  if (textarea.value === "") {
    localStorage.removeItem(DRAFT_KEY);
  } else {
    localStorage.setItem(DRAFT_KEY, textarea.value);
  }
}

function restoreDraft() {
  const saved = localStorage.getItem(DRAFT_KEY);
  if (saved !== null) {
    textarea.value = saved;
  }
}

function clearNote() {
  textarea.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
  textarea.focus();
}

// ---------- 4. Theme ----------
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}

function restoreTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light");
}

// ---------- 5. Listen for events ----------
textarea.addEventListener("input", () => {
  updateCounts();
  saveDraft();
});

textarea.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearNote();
  }
});

clearBtn.addEventListener("click", clearNote);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
});

// ---------- 6. When the page loads ----------
restoreDraft();
restoreTheme();
updateCounts();
