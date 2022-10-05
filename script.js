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
clearDoneTasks.addEventListener("click", clearDone);
clearAllTasks.addEventListener("click", clearAll);
document.addEventListener("DOMContentLoaded", getTasks);
document.addEventListener("DOMContentLoaded", count);

let listOfNotDoneTasks = document.getElementsByClassName("notCompleted-text");
let listOfDoneTasks = document.getElementsByClassName("completed-text");
let listOfAllTasks = document.getElementsByClassName("task");
let activeFilter = document.getElementsByClassName("activeFilter");

const UNCOMPLETED = "UNCOMPLETED";
const COMPLETED = "COMPLETED";

function count() {
  // Calculate how many tasks are notDone
  let number = listOfAllTasks.length - listOfDoneTasks.length;
  taskCounter.innerHTML = "Open tasks: " + number;
}

function addTask(event) {
  // Add news task and creating the elements
  event.preventDefault();
  if (taskInput.value == "") {
    // Show error message + highlight border if input is empty
    errorText.style.visibility = "visible";
    taskInput.style.borderColor = "#EF695F";
  } else {
    // If input is not empty create new task
    errorText.style.visibility = "hidden";
    taskInput.style.borderColor = "white";
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task", "notCompleted-text");

    const newTask = document.createElement("li");
    newTask.innerText = taskInput.value;
    newTask.classList.add("task-object");
    taskDiv.appendChild(newTask);

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

    const taskobject = new TaskObject(taskInput.value, UNCOMPLETED); //Create new task object
    if (checkIfInStorage(taskobject)) {
      //Check if the object is already in the storage
      saveToLocalStorage(new TaskObject(taskInput.value, UNCOMPLETED)); //Save task to storage if it is a new one
    } else {
      //If its already in the storage, dont save it and remove the task div which was created above
      taskDiv.remove();
    }

    taskInput.value = ""; //Clear user input for new task
    count();
  }
}

function checkIfInStorage(task) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    //If "tasks" storage is empty create new empty array
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks")); //Get tasks/"items" from "tasks" storage
  }

  const itemIndex = tasks.findIndex((element, index) => {
    //Checking if the task is already in the storage
    if (element.text === task.text) {
      return true;
    }
  });
  if (itemIndex == -1) {
    return true;
  } else {
    return false;
  }
}

// Change status to done or notDone. Delete button to remove task
function deleteStatus(e) {
  // If delete button is pressed ask confirmation for delete
  if (e.target.classList.contains("delete-button")) {
    let confirmAction = confirm("Are you sure you want to delete this task?");
    if (confirmAction) {
      e.target.parentElement.remove(); //Delete the task from storage
      removeFromLocalStorage(e.target.parentElement);
    } else {
      //If user pressed cancel to confirmation, nothing happens
      return;
    }
  }
  if (e.target.classList.contains("complete-button")) {
    //If status button is pressed, add and remove classes to update them visually
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
    if (e.target.parentElement.classList.contains("uncompleted-temp")) {
      e.target.parentElement.classList.remove("uncompleted-temp");
      e.target.parentElement.style.display = "none";
    }
    saveToLocalStorage(
      new TaskObject(e.target.parentElement.children[0].innerText, COMPLETED)
    ); //Updating the storage for status change
  }
  count();
}

function filter(e) {
  // Show not done tasks and change the classes to show them correctly
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
    // Show done tasks and change the classes to show them correctly
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
    // Show all tasks and change the classes to show them correctly
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

function clearAll() {
  //Clear ALL tasks, ask confirmation before deleting
  let confirmAction = confirm("Are you sure you want to delete ALL task?");
  if (confirmAction) {
    let length = listOfAllTasks.length;
    for (let i = 0; i < length; i++) {
      // Loop through the list of ALL tasks and remove them
      removeFromLocalStorage(listOfAllTasks[0]);
      listOfAllTasks[0].remove();
    }
  } else {
    return;
  }
  count();
}

function clearDone() {
  //Clear DONE tasks, ask confirmation before deleting
  let confirmAction = confirm("Are you sure you want to delete ALL done task?");
  if (confirmAction) {
    let length = listOfDoneTasks.length;
    for (let i = 0; i < length; i++) {
      // Loop through the list of DONE tasks and remove them
      removeFromLocalStorage(listOfDoneTasks[0]);
      listOfDoneTasks[0].remove();
    }
  } else {
    return;
  }
}

function saveToLocalStorage(task) {
  //Saving the tasks to localstorage
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    //If "tasks" storage is empty create new empty array
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks")); //Get tasks/"items" from "tasks" storage
  }

  const itemIndex = tasks.findIndex((element, index) => {
    //Checking if the task is already in the storage
    if (element.text === task.text) {
      return true;
    }
  });
  if (itemIndex == -1) { //-1 indicates that the object is not same 
    tasks.push(task); //Save task to the storage
  } else { //Change the status of task in local storage
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
  //Load tasks from the storage and recreating them with same principle when user adds them manually
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
    newTask.innerText = task.text; //InnerText is loaded from storage and not from user input
    newTask.classList.add("task-object");
    if (task.status === COMPLETED) {
      // Checking the task status of task and adding proper classes to them
      taskDiv.classList.add("completed-text");
      taskDiv.classList.remove("notCompleted-text");
    }
    taskDiv.appendChild(newTask);

    const statusButton = document.createElement("button");
    statusButton.classList.add("complete-button");
    if (task.status === COMPLETED) {
      // Checking the task status of task and adding proper classes to them
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
  //Removing the task from localstorage
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  const taskIndex = todo.children[0].innerText; //Finding the task's index from tasks storage
  tasks.splice(tasks.indexOf(taskIndex), 1); //From what index we delete and how many tasks we delete
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

class TaskObject {
  //Task object which has two parameter text = task text, status = done or not done
  constructor(text, status) {
    this.text = text;
    this.status = status;
  }
}
