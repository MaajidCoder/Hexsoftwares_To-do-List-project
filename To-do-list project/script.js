class TodoApp {
  constructor() {
    this.todos = [];
    this.currentFilter = "all";
    this.init();
  }

  init() {
    this.loadFromLocalStorage();
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    const addBtn = document.getElementById("addBtn");
    const todoInput = document.getElementById("todoInput");
    const clearBtn = document.getElementById("clearCompleted");
    const filterBtns = document.querySelectorAll(".filter-btn");

    // Add task on button click
    addBtn.addEventListener("click", () => this.addTodo());

    // Add task on Enter key
    todoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTodo();
      }
    });

    // Clear completed tasks
    clearBtn.addEventListener("click", () => this.clearCompleted());

    // Filter buttons
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentFilter = e.target.dataset.filter;
        this.render();
      });
    });
  }

  addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();

    if (text === "") {
      alert("Please enter a task!");
      return;
    }

    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    this.todos.push(todo);
    input.value = "";
    input.focus();
    this.saveToLocalStorage();
    this.render();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.saveToLocalStorage();
    this.render();
  }

  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToLocalStorage();
      this.render();
    }
  }

  clearCompleted() {
    if (this.todos.some((t) => t.completed)) {
      if (confirm("Are you sure you want to delete all completed tasks?")) {
        this.todos = this.todos.filter((todo) => !todo.completed);
        this.saveToLocalStorage();
        this.render();
      }
    }
  }

  getFilteredTodos() {
    switch (this.currentFilter) {
      case "active":
        return this.todos.filter((t) => !t.completed);
      case "completed":
        return this.todos.filter((t) => t.completed);
      default:
        return this.todos;
    }
  }

  render() {
    const todoList = document.getElementById("todoList");
    const filteredTodos = this.getFilteredTodos();

    if (filteredTodos.length === 0) {
      todoList.innerHTML =
        '<div class="empty-message">No tasks yet. Add one to get started!</div>';
    } else {
      todoList.innerHTML = filteredTodos
        .map(
          (todo) => `
                <li class="todo-item ${todo.completed ? "completed" : ""}">
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${todo.completed ? "checked" : ""}
                        onchange="app.toggleTodo(${todo.id})"
                    >
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">Delete</button>
                </li>
            `,
        )
        .join("");
    }

    this.updateStats();
  }

  updateStats() {
    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");

    const total = this.todos.length;
    const completed = this.todos.filter((t) => t.completed).length;

    totalTasks.textContent = `Total: ${total}`;
    completedTasks.textContent = `Completed: ${completed}`;
  }

  saveToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem("todos");
    this.todos = saved ? JSON.parse(saved) : [];
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the app when the DOM is ready
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new TodoApp();
});
