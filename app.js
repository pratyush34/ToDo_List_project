const addTodoBtn = document.getElementById("addTodoBtn");
const inputTag = document.getElementById("todoInput");
const todoListUl = document.getElementById("todoList");
const remaining = document.getElementById("remaining-count");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterAllBtn = document.getElementById("filterAllBtn");
const filterActiveBtn = document.getElementById("filterActiveBtn");
const filterCompletedBtn = document.getElementById("filterCompletedBtn");

let todoText; // This should be populated when the user clicks on Add button
let todos = [];
let filter = "all"; // all, active, completed
let todosString = localStorage.getItem("todos");
// If we have todos in the localStorage, we will read it
if (todosString) {
    todos = JSON.parse(todosString);
    remaining.innerHTML = todos.filter((item) => item.isCompleted != true).length;
}



const populateTodos = () => {
    let filteredTodos = todos;
    if (filter === "active") {
        filteredTodos = todos.filter((todo) => !todo.isCompleted);
    } else if (filter === "completed") {
        filteredTodos = todos.filter((todo) => todo.isCompleted);
    }
    let string = "";
    for (const todo of filteredTodos) {
        string += `<li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
            <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""} >
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>`;
    }
    todoListUl.innerHTML = string;

    const todoCheckboxes = document.querySelectorAll(".todo-checkbox");

    todoCheckboxes.forEach((element) => {
        element.addEventListener("click", (e) => {
            if (e.target.checked) {
                element.parentNode.classList.add("completed");
                console.log(todos);
                todos = todos.map(todo => {
                    if (todo.id == element.parentNode.id) {
                        console.log(todo.id, element.parentNode.id);
                        return { ...todo, isCompleted: true };
                    }
                    else {
                        return todo;
                    }
                });
                remaining.innerHTML = todos.filter((item) => item.isCompleted != true).length;
                localStorage.setItem("todos", JSON.stringify(todos));
            }
            else {
                element.parentNode.classList.remove("completed");
                // Grab this todo from todos array and update the todos array to set this todos isCompleted attribute as false
                todos = todos.map(todo => {
                    if (todo.id == element.parentNode.id) {
                        return { ...todo, isCompleted: false };
                    }
                    else {
                        return todo;
                    }
                });
                remaining.innerHTML = todos.filter((item) => item.isCompleted != true).length;
                localStorage.setItem("todos", JSON.stringify(todos));
            }
        });
    });

    // Handle the clear completed button click
    clearCompletedBtn.addEventListener("click", () => {
        todos = todos.filter((todo) => todo.isCompleted == false);
        populateTodos();
        localStorage.setItem("todos", JSON.stringify(todos));
    });

    // Handle the delete buttons
    let deleteBtns = document.querySelectorAll(".delete-btn");

    deleteBtns.forEach((element) => {
        element.addEventListener("click", (e) => {
            const confirmation = confirm("Do you want to delete this todo");
            if (confirmation) {
                todos = todos.filter((todo) => {
                    return (todo.id) !== (e.target.parentNode.id);
                });
                remaining.innerHTML = todos.filter((item) => item.isCompleted != true).length;
                localStorage.setItem("todos", JSON.stringify(todos));
                populateTodos();
            }
        });
    });
};


addTodoBtn.addEventListener("click", () => {
    todoText = inputTag.value;
    // check if the length of todo is greater than 3
    if (todoText.trim().length < 4) {
        alert("You cannot add a todo that small!");
        return;
    }
    inputTag.value = "";
    let todo = {
        id: "todo-" + Date.now(),
        title: todoText,
        isCompleted: false
    };
    todos.push(todo);
    remaining.innerHTML = todos.filter((item) => item.isCompleted != true).length;
    localStorage.setItem("todos", JSON.stringify(todos));
    populateTodos();
});

populateTodos();

// Filter Buttons Logic

filterAllBtn.addEventListener("click", () => {
    filter = "all";
    populateTodos();
    filterAllBtn.classList.add("active");
    filterActiveBtn.classList.remove("active");
    filterCompletedBtn.classList.remove("active");
});

filterActiveBtn.addEventListener("click", () => {
    filter = "active";
    populateTodos();
    filterAllBtn.classList.remove("active");
    filterActiveBtn.classList.add("active");
    filterCompletedBtn.classList.remove("active");
});

filterCompletedBtn.addEventListener("click", () => {
    filter = "completed";
    populateTodos();
    filterAllBtn.classList.remove("active");
    filterActiveBtn.classList.remove("active");
    filterCompletedBtn.classList.add("active");
});