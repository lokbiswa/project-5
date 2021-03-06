// initial tasks
const tasks = loadTask();
// each task
class Task {
  constructor(name) {
    this.id = `task-${Date.now()}`;
    this.name = name;
  }
}
// read localStorage
function loadTask() {
  let result = localStorage.getItem("task");
  return result ? JSON.parse(result) : [];
}

// write localStorage
function storeTasks() {
  let stringified = JSON.stringify(tasks);
  localStorage.setItem("task", stringified);
}

// add task to tasks list
function addTask(newTaskText) {
  if (newTaskText) {
    const newTask = new Task(newTaskText);
    tasks.push(newTask);
    storeTasks();
    addTaskToPage();
  }
}

// remove task from list
function removeTask(id) {
  tasks.forEach((task, index) => {
    if (task.id == id) {
      console.log("removing");
      tasks.splice(index, 1);
    }
  });
  storeTasks();
}

// creating and adding element to the page.
function addTaskToPage(task) {
  const tasksContainer = document.getElementById("task-list");
  // creating task elements
  const taskDiv = createElement("div", "task");
  const taskName = createElement("label", "task-text");
  taskName.htmlFor = task.id;
  taskName.innerHTML = task.name;
  const checkMarkButton = createElement("button", "task-checkmark");
  checkMarkButton.onclick = () => onTaskClick(task.id);
  checkMarkButton.id = task.id;
  //  check icon using fontawesome
  const checkMark = createElement("p", "fa fa-check");

  checkMarkButton.appendChild(checkMark);
  taskDiv.appendChild(checkMarkButton);
  taskDiv.appendChild(taskName);
  //appending task to page
  tasksContainer.appendChild(taskDiv);
}

// carete element and assing class
function createElement(name, cName) {
  const element = document.createElement(name);
  element.className = cName;
  return element;
}

// list all the task when page loads
function onPageLoad() {
  if (tasks) tasks.forEach(addTaskToPage);
}

// remove task from the list and also from the memory
function onTaskClick(id) {
  const task = document.getElementById(id);
  const taskDiv = task.parentElement;
  const taskList = document.getElementById("task-list");
  removeTask(id);
  taskList.removeChild(taskDiv);
}

// careting new task when form submits
function onTaskSubmit() {
  const newTaskText = document.getElementById("task-submit-text").value;
  addTask(newTaskText);
}
