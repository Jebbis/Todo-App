const taskInput = document.querySelector(".new-task");
const taskSubmit = document.querySelector(".submit-new-task");
const taskList = document.querySelector(".task-list");
const taskFilter = document.querySelector(".task-filter");
const generateTests = document.querySelector(".testiNappi");
const errorText = document.querySelector(".errorText");
const taskCounter = document.querySelector(".taskCounter");
const clearAllTasks = document.querySelector(".clearAllTasks");
const clearDoneTasks = document.querySelector(".clearDoneTasks");

taskSubmit.addEventListener("click", addTask);
taskList.addEventListener("click", deleteStatus);
taskFilter.addEventListener("click", filter);
generateTests.addEventListener("click", addTest);
clearDoneTasks.addEventListener("click", clearDone);
clearAllTasks.addEventListener("click", clearAll);
document.addEventListener("DOMContentLoaded", getTasks);
document.addEventListener("DOMContentLoaded", count);

let listOfNotDoneTasks = document.getElementsByClassName("notCompleted-text");
let listOfDoneTasks = document.getElementsByClassName("completed-text");
let listOfAllTasks = document.getElementsByClassName("task");
let activeFilter = document.getElementsByClassName("activeFilter");

function count() {
  let number = listOfAllTasks.length - listOfDoneTasks.length;
  taskCounter.innerHTML = "Open tasks: " + number;
}

function showDevTestButton() {
  generateTests.style.display = "flex";
}

function addTask(event) {
  event.preventDefault();
  if (taskInput.value == "") {
    errorText.style.visibility = "visible";
    taskInput.style.borderColor = "#EF695F";
  } else {
    errorText.style.visibility = "hidden";
    taskInput.style.borderColor = "white";
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task", "notCompleted-text");

    const newTask = document.createElement("li");
    newTask.innerText = taskInput.value;
    newTask.classList.add("task-object");
    taskDiv.appendChild(newTask);

    saveToLocalStorage(new TaskObject(taskInput.value, UNCOMPLETED));

    const statusButton = document.createElement("button");
    statusButton.classList.add("complete-button");
    taskDiv.appendChild(statusButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa", "fa-trash", "fa-2x");
    deleteButton.appendChild(deleteIcon);
    taskDiv.appendChild(deleteButton);

    taskList.appendChild(taskDiv);

    taskInput.value = "";
    count();
  }
}

function deleteStatus(e) {
  if (e.target.classList.contains("delete-button")) {
    let confirmAction = confirm("Are you sure you want to delete this task?");
    if (confirmAction) {
      e.target.parentElement.remove();
      removeFromLocalStorage(e.target.parentElement);
    } else {
      return;
    }
  }
  if (e.target.classList.contains("complete-button")) {
    if (!e.target.classList.contains("completed")) {
      e.target.classList.remove("uncompleted");
      e.target.classList.add("completed");
      e.target.parentElement.classList.remove("notCompleted-text");
      e.target.parentElement.classList.add("completed-text");
    } else {
      e.target.classList.remove("completed");
      e.target.classList.add("uncompleted");
      e.target.parentElement.classList.remove("completed-text");
      e.target.parentElement.classList.add("notCompleted-text");
    }
    saveToLocalStorage(new TaskObject(e.target.parentElement.children[0].innerText, COMPLETED));

  }
  count();
}

function filter(e) {
  // Show not done tasks
  if (e.target.classList.contains("notDone")) {
     for (const i of activeFilter) {
       i.classList.remove("activeFilter");
     }
     e.target.classList.add("activeFilter");
    for (const i of listOfNotDoneTasks) {
      i.style.display = "flex";
    }
    for (const i of listOfDoneTasks) {
      i.style.display = "none";
      i.classList.remove("uncompleted-temp");
    }
    // Show done tasks
  }
  if (e.target.classList.contains("done")) {
    for (const i of activeFilter) {
      i.classList.remove("activeFilter");
    }
    e.target.classList.add("activeFilter");
    for (const i of listOfNotDoneTasks) {
      i.style.display = "none";
    }
    for (const i of listOfDoneTasks) {
      i.classList.add("uncompleted-temp");
      i.style.display = "flex";
    }
    // Show all tasks
  }
  if (e.target.classList.contains("all")) {
    for (const i of activeFilter) {
      i.classList.remove("activeFilter");
    }
    e.target.classList.add("activeFilter");
    for (const i of listOfDoneTasks) {
      i.classList.remove("uncompleted-temp");
    }
    for (const i of listOfAllTasks) {
      i.style.display = "flex";
    }
  }
}

// With this you can generate 5 test tasks easily
function addTest(event) {
  event.preventDefault();
  for (let i = 0; i < 5; i++) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task", "notCompleted-text");

    const newTask = document.createElement("li");
    newTask.innerText = "test " + i;
    newTask.classList.add("task-object");
    taskDiv.appendChild(newTask);

    saveToLocalStorage(newTask.innerText);

    const statusButton = document.createElement("button");
    statusButton.classList.add("complete-button");
    taskDiv.appendChild(statusButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa", "fa-trash", "fa-2x");
    deleteButton.appendChild(deleteIcon);

    taskDiv.appendChild(deleteButton);

    taskList.appendChild(taskDiv);
    count();
  }
}

function clearAll() {
  let confirmAction = confirm("Are you sure you want to delete ALL task?");
  if (confirmAction) {
    let length = listOfAllTasks.length;
    for (let i = 0; i < length; i++) {
      removeFromLocalStorage(listOfAllTasks[0]);
      listOfAllTasks[0].remove();
    }
  } else {
    return;
  }
  count();
}

function clearDone() {
  let confirmAction = confirm("Are you sure you want to delete ALL done task?");
  if (confirmAction) {
    let length = listOfDoneTasks.length;
    for (let i = 0; i < length; i++) {
      removeFromLocalStorage(listOfDoneTasks[0]);
      listOfDoneTasks[0].remove();
    }
  } else {
    return;
  }
}

function saveToLocalStorage(task) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  
  const itemIndex = tasks.findIndex((element, index) => {
    if (element.text === task.text) {
      return true;
    }
  });
  if (itemIndex == -1) {
    tasks.push(task);
  } else {
    if (tasks[itemIndex].status === COMPLETED) {
      task.status = UNCOMPLETED;
    } else if (tasks[itemIndex].status === UNCOMPLETED) {
      task.status = COMPLETED;
    }
    tasks[itemIndex] = task;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.forEach(function (task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task", "notCompleted-text");

    const newTask = document.createElement("li");
    newTask.innerText = task.text;
    newTask.classList.add("task-object");
    if (task.status === COMPLETED) {
      taskDiv.classList.add("completed-text");
      taskDiv.classList.remove("notCompleted-text");
    }
    taskDiv.appendChild(newTask);

    const statusButton = document.createElement("button");
    statusButton.classList.add("complete-button");
    if (task.status === COMPLETED) {
      statusButton.classList.add("completed");
    }
    taskDiv.appendChild(statusButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa", "fa-trash", "fa-2x");
    deleteButton.appendChild(deleteIcon);
    taskDiv.appendChild(deleteButton);

    taskList.appendChild(taskDiv);
  });
}

function removeFromLocalStorage(todo) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  const taskIndex = todo.children[0].innerText;
  tasks.splice(tasks.indexOf(taskIndex), 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


class TaskObject {
  constructor(text, status) {
    this.text = text;
    this.status = status;
  }
}

const UNCOMPLETED = "UNCOMPLETED";
const COMPLETED = "COMPLETED";
