// every todo list item
class Task {
  constructor(taskName, id) {
    this.name = taskName;
    console.log(id);
    this.id = id || `task-${Date.now()}`;
  }
}
// every todo list
class TaskList {
  constructor(title, id) {
    this.title = title;
    this.id = id || `list-${Date.now()}`;
    this.todoItems = [];
  }
  addListItem(taskName, id) {
    const newTask = new Task(taskName, id);
    this.todoItems.push(newTask);
  }
  removeListItem(id) {
    this.todoItems.forEach((task, index) => {
      if (task.id == id) this.todoItems.splice(index, 1);
    });
  }
  updateListItem(id, newTask) {
    this.todoItems = this.todoItems.map((task) =>
      task.id == id ? newTaskObj(task, newTask) : task
    );
  }
}
// task list menager
class TaskListManager {
  constructor() {
    this.todoLists = new Map(this.loadTodo());
  }
  newTodo(title) {
    const newTodo = new TaskList(title);
    this.todoLists.set(newTodo.id, newTodo);
    this.storeTodo();
    return newTodo;
  }
  loadTodo() {
    let result = localStorage.getItem("todoList");
    let todoList = result ? JSON.parse(result) : [];
    // console.log(todoList);
    if (todoList.length != 0) {
      todoList = todoList.map((item) => {
        let [id, todo] = item;
        let eachList = new TaskList(todo.title, id);
        if (todo.todoItems.length != 0) {
          todo.todoItems.forEach((task) =>
            eachList.addListItem(task.name, task.id)
          );
        }
        return [id, eachList];
      });
    }
    return todoList;
  }
  storeTodo() {
    const toStringify = [];
    this.todoLists.forEach((todo, key) => toStringify.push([key, todo]));
    const stringified = JSON.stringify(toStringify);
    localStorage.setItem("todoList", stringified);
  }
  renderAllTodos = () => this.todoLists.forEach(createTodoElements);
  renderTodo = (newTodo) => createTodoElements(newTodo);
  getTodo = (id) => this.todoLists.get(id);
  deleteList = (id) => this.todoLists.delete(id);
}

// testing only
const newNotebook = new TaskListManager();

newNotebook.renderAllTodos();

// function interacting with DOM elelments.
function createCheckList(eachTodo) {
  // list items container
  const todolistItems = createElement("div", "task-list");
  // checklist item
  eachTodo.todoItems.forEach((task) => {
    const listItem = createElement("div", "task", task.id);
    const checkMarkButton = createElement("button", "task-checkmark");
    checkMarkButton.onclick = () => removeFromCheckList(task.id, eachTodo.id);
    const checkIcon = createElement("p", "fa fa-check");
    const listInput = createElement("p", "task-text");
    listInput.innerText = task.name;

    nestElements(checkMarkButton, checkIcon);
    // each check list-item
    nestElements(listItem, checkMarkButton, listInput);
    // list items into container
    nestElements(todolistItems, listItem);
  });
  return todolistItems;
}
function createTodoElements(eachTodo) {
  const noteContainer = document.getElementById("notebook");
  // creating all the elements of todo list
  const deleteButton = createElement("button", "delete-btn");
  const deleteIcon = createElement("p", "fa fa-times");
  const button = document.getElementById("add-btn-div");
  const noteDiv = createElement(
    "div",
    "col-sm-12 col-md-6 col-lg-4",
    eachTodo.id
  );
  const noteCard = createElement("div", "note  card mb-4");
  const noteTitle = createElement("h1", "page-title card-title");
  const form = createElement("form", "task-input");
  const taskInputText = createElement("input", "task-submit-text");
  const taskInputButton = createElement("button", "task-submit-button");
  const buttonIcon = createElement("p", "fa fa-chevron-up");
  // creating add item list button
  const noteList = createCheckList(eachTodo);

  deleteButton.onclick = () => removeTodoList(eachTodo.id);
  noteTitle.innerText = eachTodo.title;
  form.onsubmit = () => addToCheckList(eachTodo.id);
  taskInputText.name = eachTodo.id;
  deleteButton.appendChild(deleteIcon);
  // appending to appropriate elements
  nestElements(taskInputButton, buttonIcon);
  nestElements(form, taskInputText, taskInputButton);
  nestElements(noteCard, deleteButton, noteTitle, noteList, form);
  nestElements(noteDiv, noteCard);
  // adding elements to screen
  noteContainer.insertBefore(noteDiv, button);
}
function addToCheckList(id) {
  const inputText = document.getElementsByName(id)[0].value;
  const list = newNotebook.getTodo(id);
  console.log(inputText);
  list.addListItem(inputText);
  newNotebook.storeTodo();
}
function removeFromCheckList(id, listId) {
  const todoItem = document.getElementById(id);
  console.log(listId);
  const list = newNotebook.getTodo(listId);
  list.removeListItem(id);
  newNotebook.storeTodo();
  todoItem.parentElement.removeChild(todoItem);
}

function addNewTodoList() {
  const todoName = prompt("What do you want to call this List");
  if (todoName) {
    const newTodo = newNotebook.newTodo(todoName);
    newNotebook.renderTodo(newTodo);
  }
}
function removeTodoList(id) {
  newNotebook.deleteList(id);
  const todoList = document.getElementById(id);
  todoList.parentElement.removeChild(todoList);
  newNotebook.storeTodo();
}

// utility functions
function nestElements(...elements) {
  const nested = elements.reduce((a, b) => {
    a.appendChild(b);
    return a;
  });
}
function newTaskObj(task, newTask) {
  return { name: newTask, id: task.id };
}
function createElement(eName, className, id) {
  const element = document.createElement(eName);
  element.className = className;
  if (id) element.id = id;
  return element;
}
// Adding animat5ion using css class
function scrollAnim() {
  const heading = document.getElementById("heading");
  if (window.scrollY != 0) heading.className = "heading-scroll";
  heading.className = "";
}
