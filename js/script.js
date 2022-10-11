const taskInput = document.querySelector(".task-input input");
const addBtn = document.querySelector(".task-input button");
const taskBox = document.querySelector(".task-box");
const filters = document.querySelectorAll(".filters span");

const TASK_KEY = "task-list";

let tasks = JSON.parse(localStorage.getItem(TASK_KEY));

// localstorage가 비어있지 않을 경우 HTML document에 task를 추가
function showTask(filter) {
  let li = "";
  if (tasks) {
    tasks.forEach((task, id) => {
      let isCompleted = task.status == "completed" ? "checked" : "";
      if (filter == task.status || filter == "all") {
        li += `<li class="task">
      <label for="${id}">
        <input onclick="setTaskStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
        <span class="${isCompleted}" id="tasks-left">${task.name}</span>
        </label>
      <div class="settings">
        <ion-icon name="create-outline" onclick="editTask(this)"></ion-icon>
        <ion-icon name="trash-outline" onclick="removeTask(${id})"></ion-icon>   
        </div>
        </li>`;
      }
    });
  }
  taskBox.innerHTML =
    li || `<span class ="empty-task">※ You don't have any task.</span>`;
}
showTask("all");

// 체크박스 상태에 따른 효과 적용 및 localstorage내 status 설정
function setTaskStatus(checkedTask) {
  const taskName =
    checkedTask.parentElement.parentElement.querySelector("span");
  if (checkedTask.checked) {
    taskName.classList.add("checked");
    tasks[checkedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    tasks[checkedTask.id].status = "pending";
  }
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

// Task 편집 및 편집 내용 localstorage에 저장
function editTask(editBtn) {
  const checkBox =
    editBtn.parentElement.parentElement.querySelector("label input");
  const editedTask = editBtn.parentElement.parentElement.querySelector("span");
  if (editBtn.name === "create-outline") {
    editedTask.setAttribute("contentEditable", true);
    var value = editedTask.textContent;
    editedTask.textContent = "";
    editedTask.focus();
    editedTask.textContent = value;
    editBtn.name = "checkmark-outline";
    editBtn.style.color = "#f25832";
    checkBox.disabled = true;
    if (editedTask.className == "checked") {
      editedTask.classList.remove("checked");
      editedTask.classList.add("hidden-checked");
    }
  } else if (editBtn.name === "checkmark-outline") {
    editedTask.setAttribute("contentEditable", false);
    editedTask.blur();
    editBtn.name = "create-outline";
    editBtn.style.color = "";
    checkBox.disabled = false;
    if (editedTask.className == "hidden-checked") {
      editedTask.classList.remove("hidden-checked");
      editedTask.classList.add("checked");
    }
    tasks[id].name = editedTask.textContent;
  }
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

// Task를 taskbox 및 localstorage에서 삭제
removeTask = (removeId) => {
  tasks.splice(removeId, 1);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  showTask("all");
};

// input이 비어있지 않을 경우 add버튼이 활성화
taskInput.onkeyup = () => {
  let userTask = taskInput.value.trim();
  let lineIcon = taskInput.parentElement.querySelector("ion-icon");
  if (userTask) {
    addBtn.classList.add("active");
    lineIcon.style.color = "#232323";
  } else {
    addBtn.classList.remove("active");
    lineIcon.style.color = "";
  }
};

// Add버튼을 클릭하여 task 추가 및 localstorage에 저장
addBtn.addEventListener("click", function () {
  let userTask = taskInput.value.trim();
  let lineIcon = taskInput.parentElement.querySelector("ion-icon");
  addBtn.classList.remove("active");
  lineIcon.style.color = "";
  // If localStorage is empty, send empty array
  if (!tasks) {
    tasks = [];
  }
  taskInput.value = "";
  taskInput.blur();
  let newTaskObj = { name: userTask, status: "pending" };
  tasks.push(newTaskObj);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  showTask("all");
});

// Enter키를 눌러 task 추가 및 localstorage에 저장
taskInput.addEventListener("keyup", function (e) {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    addBtn.click();
  }
});

// 클릭한 filter menu의 버튼 활성화
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTask(btn.id);
  });
});
