let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
let activeTabIndex = 0;

const categories = [
  "Home", "Calculus", "Senior Project", "UI Design", "OS Systems",
  "Database", "Cybersecurity", "Seminar", "Other"
];

function renderTabs() {
  const tabContainer = document.getElementById("tabs");
  tabContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.textContent = category;
    btn.onclick = () => showCategory(index);
    tabContainer.appendChild(btn);
  });
}

function renderSections() {
  const sectionContainer = document.getElementById("sections");
  sectionContainer.innerHTML = "";

  categories.forEach((category, index) => {
    if (!tasks[category]) tasks[category] = [];

    const section = document.createElement("div");
    section.className = "section";
    section.dataset.index = index;

    const heading = document.createElement("h2");
    heading.textContent = category;
    section.appendChild(heading);

    // Special case for Home tab
    if (category === "Home") {
      const homeContent = document.createElement("div");
      homeContent.className = "home-content";

      const welcome = document.createElement("h2");
      welcome.textContent = "[ [ [ [ Progress Completion ] ] ] ]";
      homeContent.appendChild(welcome);

const xpContainer = document.createElement("div");
xpContainer.className = "xp-container";

const xpLabel = document.createElement("div");
xpLabel.className = "xp-label";
xpLabel.id = "xp-label";
xpLabel.textContent = "0%";

const xpBarWrapper = document.createElement("div");
xpBarWrapper.className = "xp-bar-wrapper";

const xpBar = document.createElement("div");
xpBar.id = "xp-bar";

xpBarWrapper.appendChild(xpBar);
xpContainer.appendChild(xpLabel);
xpContainer.appendChild(xpBarWrapper);
homeContent.appendChild(xpContainer);

      section.appendChild(homeContent);
      sectionContainer.appendChild(section);
      return; // Skip the rest for Home tab
    }

    // Input + Add button for other categories
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Add a ${category} task...`;

    const button = document.createElement("button");
    button.textContent = "Add";
    button.onclick = () => {
      const text = input.value.trim();
      if (text === "") return;
      console.log(`Adding task to ${category}:`, text);
      tasks[category].push({ text, completed: false });
      input.value = "";
      saveTasks();
    };

    section.appendChild(input);
    section.appendChild(button);

    const list = document.createElement("ul");
    tasks[category].forEach((task, index) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const textSpan = document.createElement("span");
      textSpan.className = "task-text";
      textSpan.textContent = task.text;

      const controls = document.createElement("div");
      controls.style.display = "flex";
      controls.style.gap = "10px";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.onclick = () => toggleComplete(category, index);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✖";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => deleteTask(category, index);

      controls.appendChild(checkbox);
      controls.appendChild(deleteBtn);

      li.appendChild(textSpan);
      li.appendChild(controls);
      list.appendChild(li);
    });

    section.appendChild(list);
    sectionContainer.appendChild(section);
  });
}

function showCategory(index) {
  activeTabIndex = index;
  document.querySelectorAll(".tab-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
  document.querySelectorAll(".section").forEach((sec, i) => {
    sec.classList.toggle("active", i === index);
  });
}

function toggleComplete(category, index) {
  tasks[category][index].completed = !tasks[category][index].completed;
  saveTasks();
}

function deleteTask(category, index) {
  tasks[category].splice(index, 1);
  saveTasks();
}

function updateXPBar() {
  const xpBar = document.getElementById("xp-bar");
  const xpLabel = document.getElementById("xp-label");
  if (!xpBar || !xpLabel) return;

  let totalTasks = 0;
  let completedTasks = 0;

  categories.forEach(category => {
    if (category === "Home") return;
    if (tasks[category]) {
      totalTasks += tasks[category].length;
      completedTasks += tasks[category].filter(task => task.completed).length;
    }
  });

  const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  xpBar.style.width = `${percent}%`;
  xpLabel.textContent = `${percent}%`;
}



function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderSections();
  showCategory(activeTabIndex);
  updateXPBar(); // ← XP bar updates here
}

renderTabs();
renderSections();
showCategory(0); // Home is now index 0
