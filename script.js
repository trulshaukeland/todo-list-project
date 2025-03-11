const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");
const dueDateInput = document.getElementById("due-date"); // Input for dato
const filterDateInput = document.getElementById("filter-date"); // Filtrering

document.getElementById("input-button").addEventListener("click", addTask);
inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Last oppgaver ved oppstart
loadTasks();

function addTask() {
  const taskText = inputBox.value.trim();
  const dueDate = dueDateInput.value; // Hent valgt dato
  if (!taskText) {
    alert("Please write down a task");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `
    <label>
      <input type="checkbox">
      <span class="task-text">${taskText}</span>
    </label>
    <span class="due-date">Due: ${dueDate || "No date"}</span>
    <div>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
    </div>
  `;

  listContainer.appendChild(li);
  inputBox.value = "";
  dueDateInput.value = "";

  const checkbox = li.querySelector("input");
  const editBtn = li.querySelector(".edit-btn");
  const taskSpan = li.querySelector(".task-text");
  const deleteBtn = li.querySelector(".delete-btn");

  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
    saveTasks();
  });

  editBtn.addEventListener("click", function () {
    const newTask = prompt("Edit task:", taskSpan.textContent);
    if (newTask !== null) {
      taskSpan.textContent = newTask;
      li.classList.remove("completed");
      checkbox.checked = false;
      updateCounters();
      saveTasks();
    }
  });

  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      updateCounters();
      saveTasks();
    }
  });

  updateCounters();
  saveTasks();
}

function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;
  const uncompletedTasks =
    document.querySelectorAll("li:not(.completed)").length;

  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

// 🎯 Lagring i localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach((li) => {
    tasks.push({
      text: li.querySelector(".task-text").textContent,
      completed: li.classList.contains("completed"),
      dueDate: li.querySelector(".due-date").textContent.replace("Due: ", ""),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 🎯 Hente oppgaver fra localStorage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => {
    inputBox.value = task.text;
    dueDateInput.value = task.dueDate === "No date" ? "" : task.dueDate;
    addTask();
    listContainer.lastElementChild.classList.toggle(
      "completed",
      task.completed
    );
  });
}

// 🎯 Automatisk sletting av gamle oppgaver
function removeOldTasks() {
  const now = new Date().toISOString().split("T")[0]; // Dagens dato i YYYY-MM-DD format
  document.querySelectorAll("li").forEach((li) => {
    const dueDate = li
      .querySelector(".due-date")
      .textContent.replace("Due: ", "");
    if (dueDate !== "No date" && dueDate < now) {
      li.remove();
    }
  });
  updateCounters();
  saveTasks();
}

// 🎯 Filtrere oppgaver etter dato
filterDateInput.addEventListener("change", function () {
  const selectedDate = filterDateInput.value;
  document.querySelectorAll("li").forEach((li) => {
    const dueDate = li
      .querySelector(".due-date")
      .textContent.replace("Due: ", "");
    li.style.display =
      dueDate === selectedDate || selectedDate === "" ? "" : "none";
  });
});

// 🎯 Kjør sletting av gamle oppgaver ved oppstart
removeOldTasks();
