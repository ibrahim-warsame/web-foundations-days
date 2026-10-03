let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

const categories = ["personal", "work", "study"];

// returns the notes that contain the word, ignoring upper/lower case
function searchNotes(word) {
  const w = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(w));
}

// returns the note with the most characters, or null if there are none
function longestNote() {
  if (notes.length === 0) {
    return null;
  }
  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// counts how many notes are in each category
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    if (counts[note.category] === undefined) {
      counts[note.category] = 1;
    } else {
      counts[note.category]++;
    }
  }
  return counts;
}

// e.g. "5 notes: 2 personal, 1 work, 2 study."
function getSummary() {
  const total = notes.length;
  const word = total === 1 ? "note" : "notes";
  if (total === 0) {
    return `0 ${word}.`;
  }
  const counts = countByCategory();
  const parts = [];
  for (const category of categories) {
    if (counts[category]) {
      parts.push(`${counts[category]} ${category}`);
    }
  }
  return `${total} ${word}: ${parts.join(", ")}.`;
}

// true if a note with the same text is already there (ignores case and extra spaces)
function isDuplicate(text) {
  const clean = (t) => t.trim().toLowerCase().replace(/\s+/g, " ");
  return notes.some((note) => clean(note.text) === clean(text));
}

// adds a note if it is valid, returns true if added and false if not
function addNote(text, category) {
  const cleaned = text.trim();

  if (cleaned.length < 1 || cleaned.length > 200) {
    console.log("❌ Rejected: text must be 1-200 characters.");
    return false;
  }
  if (isDuplicate(cleaned)) {
    console.log(`❌ Rejected: "${cleaned}" already exists.`);
    return false;
  }
  if (!categories.includes(category)) {
    console.log(`❌ Rejected: "${category}" is not personal, work or study.`);
    return false;
  }

  const lastId = notes.length > 0 ? notes[notes.length - 1].id : 0;
  notes.push({ id: lastId + 1, text: cleaned, category: category });
  console.log(`✅ Added: "${cleaned}" (${category})`);
  return true;
}

// ---------- Tests ----------
const original = notes;

// searchNotes
console.log(searchNotes("javascript")); // [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]
console.log(searchNotes("xyz")); // [] (no results)
console.log(searchNotes("CALL").length); // 1 (case is ignored)

// longestNote
console.log(longestNote()); // { id: 3, text: "Email the project report to Grace", category: "work" }
notes = [];
console.log(longestNote()); // null (no notes)
notes = original;

// countByCategory
console.log(countByCategory()); // { personal: 2, study: 2, work: 1 }
notes = [];
console.log(countByCategory()); // {} (no notes)
notes = original;

// getSummary
console.log(getSummary()); // "5 notes: 2 personal, 1 work, 2 study."
notes = [original[2]];
console.log(getSummary()); // "1 note: 1 work."
notes = [];
console.log(getSummary()); // "0 notes."
notes = original;

// isDuplicate
console.log(isDuplicate("Buy milk and bread")); // true
console.log(isDuplicate("   BUY  milk   AND bread  ")); // true (case and spaces ignored)
console.log(isDuplicate("Buy eggs")); // false

// addNote
console.log(addNote("Water the plants", "personal")); // logs "✅ Added..." then true
console.log(addNote("   ", "work")); // logs "❌ Rejected: text must be 1-200 characters." then false
console.log(addNote("a".repeat(201), "work")); // same rejection as above, false (too long)
console.log(addNote("buy MILK and bread", "personal")); // logs "❌ Rejected: ... already exists." then false
console.log(addNote("Plan a holiday", "travel")); // logs "❌ Rejected: "travel" is not personal, work or study." then false
console.log(notes.length); // 6 (only "Water the plants" was added)
console.log(getSummary()); // "6 notes: 3 personal, 1 work, 2 study."
