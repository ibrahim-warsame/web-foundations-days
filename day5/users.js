// ---------- 1. Select the elements we need ----------
const loadBtn = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const list = document.querySelector("#users-list");

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

// ---------- 2. The data: every user we have loaded ----------
let users = [];

// ---------- 3. Draw a list of users on the page ----------
function createUserItem(user) {
  const li = document.createElement("li");

  const name = document.createElement("strong");
  name.textContent = user.name;

  const email = document.createElement("div");
  email.textContent = `Email: ${user.email}`;

  const city = document.createElement("div");
  city.textContent = `City: ${user.address.city}`;

  const company = document.createElement("div");
  company.textContent = `Company: ${user.company.name}`;

  li.append(name, email, city, company);
  return li;
}

function renderUsers(usersToShow) {
  list.replaceChildren(); // clear the old list

  // We loaded some users, but none match the filter
  if (users.length > 0 && usersToShow.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No users match your filter.";
    list.appendChild(empty);
    return;
  }

  usersToShow.forEach((user) => {
    list.appendChild(createUserItem(user));
  });
}

// ---------- 4. Load users from the server ----------
async function loadUsers() {
  statusText.textContent = "Loading users...";
  loadBtn.disabled = true; // stop impatient double-clicks

  try {
    const response = await fetch(USERS_URL);

    // fetch does NOT throw on 404 or 500, so check the status ourselves
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    users = await response.json();
    applyFilter(); // draw the users, respecting any text already typed
    statusText.textContent = `Loaded ${users.length} users.`;
  } catch (error) {
    statusText.textContent = "Could not load users. Please try again.";
    console.error(error);
  } finally {
    loadBtn.disabled = false; // runs after success AND after an error
  }
}

// ---------- 5. Filter the users we already have (no new request) ----------
function applyFilter() {
  const searchText = filterInput.value.trim().toLowerCase();

  const matches = users.filter((user) =>
    user.name.toLowerCase().includes(searchText)
  );

  renderUsers(matches);
}

// ---------- 6. Listen for events ----------
loadBtn.addEventListener("click", loadUsers);
filterInput.addEventListener("input", applyFilter);
