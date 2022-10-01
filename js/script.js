const taskInput = document.querySelector(".task-input input");
const addBtn = document.querySelector(".task-input button");
const taskBox = document.querySelector(".task-box");

const TASK_KEY = "task-list";

let tasks = JSON.parse(localStorage.getItem(TASK_KEY));

// add the task into the HTML document
function showTask() {
  let li = "";
  if (tasks) {
    tasks.forEach((task, id) => {
      li += `<li class="task">
            <label for="${id}">
              <input type="checkbox" id="${id}" />
              <span id="tasks-left">${task.name}</span>
            </label>
              <div class="settings">
                <ion-icon name="create-outline"></ion-icon>
                <ion-icon name="trash"></ion-icon>
              </div>`;
    });
  }
  taskBox.innerHTML = li;
}
showTask();

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
  if (!tasks) {
    tasks = [];
  }
  taskInput.value = "";
  let newTaskObj = { name: userTask, status: "pending" };
  tasks.push(newTaskObj);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  showTask();
});

// if user put the task in the field and press 'enter'
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    addBtn.click();
  }
});
