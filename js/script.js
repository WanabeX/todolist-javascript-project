const taskInput = document.querySelector(".task-input input");
const addBtn = document.querySelector(".task-input button");
const taskBox = document.querySelector(".task-box");

const TASK_KEY = "task-list";

let tasks = JSON.parse(localStorage.getItem(TASK_KEY));

// Add the task into the HTML document
function showTask() {
  let li = "";
  // If localStorage is not empty
  if (tasks) {
    // Find task and painting
    tasks.forEach((task, id) => {
      li += `<li class="task">
            <label for="${id}">
              <input onclick="toggleCheckedStyle(this)" type="checkbox" id="${id}" />
              <span id="tasks-left">${task.name}</span>
            </label>
              <div class="settings">
                <ion-icon name="create-outline"></ion-icon>
                <ion-icon onclick="removeTask(${id})"name="trash"></ion-icon>
              </div>`;
    });
  }
  taskBox.innerHTML = li;
}
showTask();

// checking status and add checked CSS
function toggleCheckedStyle(checkedTask) {
  // Get the task name from <span>tag
  const taskName = checkedTask.parentElement.lastElementChild;
  // If task "checked"
  if (checkedTask.checked) {
    taskName.classList.add("checked");
  } else {
    taskName.classList.remove("checked");
  }
}

// remove task
removeTask = (removeId) => {
  tasks.splice(removeId, 1);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  showTask();
};

// if input field is not empty, add button is activated
taskInput.onkeyup = () => {
  let userTask = taskInput.value.trim();
  if (userTask) {
    addBtn.classList.add("active");
  } else {
    addBtn.classList.remove("active");
  }
};

// If user click on the Add button
addBtn.addEventListener("click", function () {
  let userTask = taskInput.value.trim();
  // If localStorage is empty, send empty array
  if (!tasks) {
    tasks = [];
  }
  taskInput.value = "";
  let newTaskObj = { name: userTask, status: "pending" };
  tasks.push(newTaskObj);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  showTask();
});

// If user put the task in the field and press 'enter'
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    addBtn.click();
    addBtn.classList.remove("active");
  }
});
