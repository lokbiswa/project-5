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
      if (task.id == id) {
        this.todoItems.splice(index, 1);
      }
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
  renderAllTodos() {
    this.todoLists.forEach(createNoteElements);
  }
  renderTodo(newTodo) {
    createNoteElements(newTodo);
  }
  getTodo(id) {
    return this.todoLists.get(id);
  }
  deleteList(id) {
    this.todoLists.delete(id);
  }
}

// testing only
const newNotebook = new TaskListManager();
const list = newNotebook.getTodo("list-1632414742511");
// list.addListItem("Noddles");
// list.addListItem("Tomatoes");
// list.addListItem("Garlic");
// newNotebook.storeTodo();

newNotebook.renderAllTodos();

function createCheckList(todo, listId) {
  const todolistItems = createElement("div", "task-list");
  todo.forEach((task) => {
    const listItem = createElement("div", "task", task.id);
    const checkMarkButton = createElement("button", "task-checkmark");
    checkMarkButton.onclick = () => removeFromCheckList(task.id, listId);
    const checkIcon = createElement("p", "fa fa-check");
    const listInput = createElement("p", "task-text");
    listInput.innerText = task.name;
    checkMarkButton.appendChild(checkIcon);
    listItem.appendChild(checkMarkButton);
    listItem.appendChild(listInput);
    todolistItems.appendChild(listItem);
  });
  return todolistItems;
}

function createNoteElements(todoList) {
  // creating all the elements of todo list
  const deleteButton = createElement("button", "delete-btn");
  const deleteIcon = createElement("p", "fa fa-times");
  deleteButton.onclick = () => removeTodoList(todoList.id);
  const noteContainer = document.getElementById("notebook");
  const button = document.getElementById("addNote");
  const noteCard = createElement("div", "note card col-ms-6 col-md-4");
  noteCard.id = todoList.id;
  const noteTitle = createElement("h1", "page-title card-title");
  noteTitle.innerHTML = todoList.title;
  const noteList = createCheckList(todoList.todoItems, todoList.id);

  // creating add item list button
  const form = createElement("form", "task-input");
  form.onsubmit = () => addToCheckList(todoList.id);
  const taskInputText = createElement("input", "task-submit-text");
  taskInputText.name = todoList.id;
  const taskInputButton = createElement("button", "task-submit-button");
  const buttonIcon = createElement("p", "fa fa-chevron-up");

  // adding elements to screen
  deleteButton.appendChild(deleteIcon);
  noteCard.appendChild(deleteButton);
  noteCard.appendChild(noteTitle);
  noteCard.appendChild(noteList);
  taskInputButton.appendChild(buttonIcon);
  form.appendChild(taskInputText);
  form.appendChild(taskInputButton);

  noteCard.appendChild(form);
  noteContainer.insertBefore(noteCard, button);
}

// utility functions
function newTaskObj(task, newTask) {
  return { name: newTask, id: task.id };
}
function createElement(eName, className, id) {
  id = id || "";
  const element = document.createElement(eName);
  element.className = className;
  element.id = id;
  return element;
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
