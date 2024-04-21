const taskList = document.getElementById("taskList");
const doneList = document.getElementById("doneList");

document.addEventListener("DOMContentLoaded", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => {
    const li = createTaskElement(task.text, task.description, task.completed);
    if (task.completed) {
      li.classList.add("done-item");
      doneList.appendChild(li);
    } else {
      taskList.appendChild(li);
    }
  });
});

const taskInput = document.getElementById("taskInput");
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const descriptionInputValue = document
      .getElementById("descriptionInput")
      .value.trim();
    const li = createTaskElement(taskText, descriptionInputValue, false);
    taskList.appendChild(li);
    saveTaskToLocalStorage({
      text: taskText,
      description: descriptionInputValue,
      completed: false,
    });
    taskInput.value = "";
    document.getElementById("descriptionInput").value = "";
  }
}

function createTaskElement(text, description, completed) {
  const li = document.createElement("li");
  li.className = completed ? "done-item" : "task-item";
  li.innerHTML = `
    <span>${text}</span>
    <span class="description-text">${description}</span>
    <button onclick="toggleTask(this)"> ${
      completed ? "Restore" : "Complete"
    }</button>
    <button onclick="editTask(this)">Edit</button>
    <button onclick="deleteTask(this)">Delete</button>
    <button onclick="shareTask(this)">Share Telegram</button>
  `;
  return li;
}

function toggleTask(button) {
  const taskItem = button.parentElement;
  const isCompleted = taskItem.classList.contains("done-item");

  if (isCompleted) {
    taskItem.classList.remove("done-item");
    taskItem.classList.add("task-item");
    taskList.appendChild(taskItem);
  } else {
    taskItem.classList.remove("task-item");
    taskItem.classList.add("done-item");
    doneList.appendChild(taskItem);
  }

  button.textContent = isCompleted ? "Complete" : "Restore";

  updateTaskInLocalStorage(taskItem);
}

function deleteTask(button) {
  const taskItem = button.parentElement;
  taskItem.remove();
  removeTaskFromLocalStorage(taskItem);
}

function saveTaskToLocalStorage(task) {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

function removeTaskFromLocalStorage(taskItem) {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = savedTasks.findIndex(
    (task) => task.text === taskItem.querySelector("span").textContent
  );
  if (taskIndex !== -1) {
    savedTasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(savedTasks));
  }
}
function editTask(element) {
  const taskElement = element.closest("li");
  const taskText = taskElement.querySelector("span");
  const descriptionText = taskElement.querySelector(".description-text");
  const editButton = element;

  if (editButton.textContent === "Edit") {
    taskText.contentEditable = true;
    descriptionText.contentEditable = true;
    taskText.focus();
    editButton.textContent = "Save";
  } else {
    taskText.contentEditable = false;
    descriptionText.contentEditable = false;
    editButton.textContent = "Edit";
  }
  updateTaskInLocalStorage(taskElement);
}

function updateTaskInLocalStorage(taskElement) {
  const taskText = taskElement.querySelector("span").textContent;
  const taskDescription =
    taskElement.querySelector(".description-text").textContent;
  const completed = taskElement.classList.contains("done-item");

  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = savedTasks.findIndex(
    (task) => task.text === taskText && task.description === taskDescription
  );

  if (taskIndex !== -1) {
    savedTasks[taskIndex].completed = completed;
    localStorage.setItem("tasks", JSON.stringify(savedTasks));
  }
}

function shareTask(button) {
  const taskItem = button.parentElement;
  const taskText = taskItem.querySelector("span").textContent;
  const taskDescription =
    taskItem.querySelector(".description-text").textContent;
  console.log(taskDescription);
  const completed = taskItem.classList.contains("done-item");
  const textToCopy = `Назва Завдання - ${taskText}, Опис завдання - ${taskDescription}, Статус - ${completed}`;
  const encodedText = encodeURIComponent(taskText);
  const telegramURL = `https://web.telegram.org/#/im?text=${encodedText}`;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      alert("Текст і опис скопійовано!");
      window.open(telegramURL, "_blank");
    })
    .catch((err) => {
      console.error("Помилка копіювання:", err);
    });
}
