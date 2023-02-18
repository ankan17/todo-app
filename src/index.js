import "./style.css";

// State
const todos = [
  {
    id: "36b8f84d-df4e-4d49-b662-bcde71a8764f",
    description: "Buy groceries",
    completed: false,
  },
];

const form = document.querySelector('form[name="todo-input-form"]');
const input = document.querySelector('input[name="add-todo-btn"]');
const todoList = document.querySelector('ul[name="todo-list"]');

const addTodo = (todo) => {
  // Generate the HTML for the new to-do
  const newTodoHtml = `
    <li
      data-id="${todo.id}"
      class="mt-3 p-3 border rounded-lg flex justify-between items-center"
    >
      <input
        type="checkbox"
        class="text-lg font-medium mr-2 cursor-pointer"
        ${todo.completed ? "checked" : ""}
      />
      <input
        type="text"
        class="todo-input cursor-pointer flex-1 ml-2 mr-2"
        readOnly
        value="${todo.description}"
      />
      <button data-action="edit" class="flex text-blue-600 hover:text-blue-800 mr-1">
        <span class="material-symbols-outlined">edit</span>
      </button>
      <button data-action="delete" class="flex text-red-600 hover:text-red-800">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </li>
  `;

  // Add the new to-do to the DOM using the insertAdjacentHTML method
  todoList.insertAdjacentHTML("beforeend", newTodoHtml);
};

const replaceTodo = (updatedTodo) => {
  const todoElement = todoList.querySelector(`[data-id="${updatedTodo.id}"]`);
  if (!todoElement) return;

  const todoItemIdx = todos.findIndex((todo) => todo.id === updatedTodo.id);
  todos[todoItemIdx] = updatedTodo;

  const todoCheckbox = todoElement.querySelector("input[type=checkbox]");
  todoCheckbox.checked = updatedTodo.completed;

  const todoLabel = todoElement.querySelector("input[type=text]");
  if (updatedTodo.completed && !todoLabel.classList.contains("line-through")) {
    todoLabel.classList.add("line-through");
  } else if (
    !updatedTodo.completed &&
    todoLabel.classList.contains("line-through")
  ) {
    todoLabel.classList.remove("line-through");
  }
  todoLabel.value = updatedTodo.description;
};

const deleteTodo = (todoId) => {
  const todoElement = todoList.querySelector(`[data-id="${todoId}"]`);
  if (!todoElement) return;
  todoElement.remove();

  const todoItemIdx = todos.findIndex((todo) => todo.id === todoId);
  todos.splice(todoItemIdx, 1);
};

window.addEventListener("load", () => {
  todos.forEach(addTodo);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTodoText = input.value.trim();
  if (newTodoText) {
    const newTodo = {
      id: crypto.randomUUID(),
      description: newTodoText,
      completed: false,
    };
    todos.push(newTodo);
    addTodo(newTodo);
    input.value = "";
  }
});

// Set up an event listener to allow double-click editing of to-do titles
todoList.addEventListener("dblclick", (event) => {
  const clickedElement = event.target;
  const todoId = clickedElement.parentElement.dataset.id;

  const todoLabel =
    clickedElement.parentElement.querySelector('input[type="text"]');

  if (clickedElement === todoLabel && clickedElement.readOnly) {
    clickedElement.removeAttribute("readOnly");
    clickedElement.focus();
    clickedElement.setSelectionRange(
      clickedElement.value.length,
      clickedElement.value.length
    );

    clickedElement.addEventListener("blur", () => {
      const newTitle = clickedElement.value.trim();
      clickedElement.setAttribute("readOnly", true);
      if (newTitle) {
        const todoItem = todos.find((todo) => todo.id === todoId);
        replaceTodo({ ...todoItem, description: newTitle });
      } else {
        deleteTodo(todoId);
      }
    });
  }
});

todoList.addEventListener("click", (event) => {
  const clickedElement = event.target.closest("li[data-id]");
  const todoId = clickedElement.dataset.id;

  const todoCheckbox = clickedElement.querySelector('input[type="checkbox"]');
  const todoLabel = clickedElement.querySelector('input[type="text"]');
  const editBtn = clickedElement.querySelector(
    'button[data-action="edit"] > span'
  );
  const deleteBtn = clickedElement.querySelector(
    'button[data-action="delete"] > span'
  );

  if (event.target === todoCheckbox) {
    const todoItem = todos.find((todo) => todo.id === todoId);
    const updatedTodo = {
      ...todoItem,
      completed: !todoItem.completed,
    };
    replaceTodo(updatedTodo);
  } else if (event.target === editBtn) {
    todoLabel.removeAttribute("readOnly");
    todoLabel.focus();
    todoLabel.setSelectionRange(todoLabel.value.length, todoLabel.value.length);
  } else if (event.target === deleteBtn) {
    deleteTodo(todoId);
  }
});
