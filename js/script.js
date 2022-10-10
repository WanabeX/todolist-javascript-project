const taskInput = document.querySelector(".task-input input");
const addBtn = document.querySelector(".task-input button");
const taskBox = document.querySelector(".task-box");

const TASK_KEY = "task-list";

let tasks = JSON.parse(localStorage.getItem(TASK_KEY));

// localstorage가 비어있지 않을 경우 HTML document에 task를 추가
function showTask() {
  let li = "";
  if (tasks) {
    tasks.forEach((task, id) => {
      li += `<li class="task">
      <label for="${id}">
        <input onclick="toggleCheckedStyle(this)" type="checkbox" id="${id}" />
        <span id="tasks-left" >${task.name}</span>
        </label>
      <div class="settings">
        <ion-icon name="create-outline" onclick="editTask(this, ${id})"></ion-icon>
        <ion-icon name="trash-outline" onclick="removeTask(${id})"></ion-icon>   
        </div>
        </li>`;
    });
  }
  taskBox.innerHTML = li;
}
showTask();

// 체크박스 상태에 따른 효과 적용
function toggleCheckedStyle(checkedTask) {
  const taskName =
    checkedTask.parentElement.parentElement.querySelector("span");
  if (checkedTask.checked) {
    taskName.classList.add("checked");
  } else {
    taskName.classList.remove("checked");
  }
}
// Task 편집
function editTask(editBtn, id) {
  const checkBox =
    editBtn.parentElement.parentElement.querySelector("label input");
  const editedTask = editBtn.parentElement.parentElement.querySelector("span");
  if (editBtn.name === "create-outline") {
    editedTask.setAttribute("contentEditable", true);
    editedTask.focus();
    checkBox.disabled = true;
    editedTask.classList.remove("checked");
    editBtn.name = "checkmark-outline";
    editBtn.style.color = "#f25832";
  } else if (editBtn.name === "checkmark-outline") {
    editedTask.setAttribute("contentEditable", false);
    editedTask.blur();
    checkBox.disabled = false;
    editBtn.name = "create-outline";
    editBtn.style.color = "";
    tasks[id].name = editedTask.textContent;
  }
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

// Task 삭제
removeTask = (removeId) => {
  tasks.splice(removeId, 1);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  showTask();
};

// input이 비어있지 않을 경우 add버튼이 활성화
taskInput.onkeyup = () => {
  let userTask = taskInput.value.trim();
  if (userTask) {
    addBtn.classList.add("active");
  } else {
    addBtn.classList.remove("active");
  }
};

// Add버튼을 클릭하여 task 추가
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

// Enter키를 눌러 task 추가
taskInput.addEventListener("keyup", function (e) {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    addBtn.click();
    addBtn.classList.remove("active");
  }
});
