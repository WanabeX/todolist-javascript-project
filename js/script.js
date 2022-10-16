const taskInput = document.querySelector(".task-input input");
const addBtn = document.querySelector(".task-input button");
const taskBox = document.querySelector(".task-box");
const filters = document.querySelectorAll(".filters span");
const clearBtn = document.querySelector(".task-controls button");

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
        <span class="${isCompleted}">${task.name}</span>
        </label>
      <div class="settings">
        <ion-icon name="create-outline" onclick="editTask(this, ${id})"></ion-icon>
        <ion-icon name="trash-outline" onclick="removeTask(${id})"></ion-icon>   
        </div>
        </li>`;
      }
    });
  }
  taskBox.innerHTML =
    li || `<span class ="empty-task">※ You don't have any task.</span>`;
  countTasks();
}
showTask("all");

// task 체크 여부에 따른 효과 적용 및 status 변경
function setTaskStatus(checkedTask) {
  const taskName =
    checkedTask.parentElement.parentElement.querySelector("span");
  if (checkedTask.checked) {
    taskName.classList.add("checked");
    tasks[checkedTask.id].status = "completed";
    countTasks();
  } else {
    taskName.classList.remove("checked");
    tasks[checkedTask.id].status = "pending";
    countTasks();
  }
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

// Task 내용 편집
function editTask(editBtn, id) {
  const checkBox =
    editBtn.parentElement.parentElement.querySelector("label input");
  const editedTask = editBtn.parentElement.parentElement.querySelector("span");
  //'edit'버튼 클릭 시 task를 수정가능한 상태로 변경
  if (editBtn.name === "create-outline") {
    editedTask.setAttribute("contentEditable", true); //요소를 수정가능한 상태로 변경

    //task focus시 커서를 우측에 위치시킴
    let range = new Range(); //range를 생성
    let sel = window.getSelection(); //커서의 위치를 나타내는 selection을 가져옴
    range.setStart(editedTask, 1); //range의 시작점을 task(span)로 지정
    sel.removeAllRanges(); //기존 range를 삭제
    sel.addRange(range); //range 추가

    editedTask.focus(); //task focusing 및 cursor 활성화
    editBtn.name = "checkmark-outline";
    editBtn.style.color = "#f25832";
    checkBox.disabled = true; //checkbox 비활성화
    //체크상태인 task를 수정할시 체크효과 숨김
    if (editedTask.className == "checked") {
      editedTask.classList.remove("checked");
      editedTask.classList.add("hidden-checked");
    }
    //'check'버튼 클릭 시 수정 된 task를 localstorage에 반영
  } else if (editBtn.name === "checkmark-outline") {
    editedTask.setAttribute("contentEditable", false);
    editedTask.blur(); //focus 제거
    editBtn.name = "create-outline";
    editBtn.style.color = "";
    checkBox.disabled = false;
    //체크상태인 task 수정완료 후 체크효과를 활성화
    if (editedTask.className == "hidden-checked") {
      editedTask.classList.remove("hidden-checked");
      editedTask.classList.add("checked");
    }
    tasks[id].name = editedTask.textContent;
  }
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

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
  showTask(document.querySelector("span.active").id);
});

// Enter키를 눌러 task 추가 및 localstorage에 저장
taskInput.addEventListener("keyup", function (e) {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    addBtn.click();
  }
});

// 선택한 Task를 taskbox 및 localstorage에서 삭제
removeTask = (removeId) => {
  tasks.splice(removeId, 1);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  showTask("all");
};

// 모든 Task를 taskbox 및 localstorage에서 삭제
clearBtn.addEventListener("click", () => {
  tasks.splice(0, tasks.length);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  showTask("all");
});

// 클릭한 filter menu의 버튼 활성화
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTask(btn.id);
  });
});

// 전체 task 개수와 남은 task개수를 출력함
function countTasks() {
  let CounterSpan = document.querySelector("#task-counter");
  let completedTask = tasks.filter((obj) => obj.status === "completed"); //상태가 'completed'인 object들을 불러옴
  let allTasksLength = tasks.length; //전체 task 개수
  let completedTaskLength = completedTask.length; //완료된 task 개수
  let tasksLeft = allTasksLength - completedTaskLength; //전체 task - 완료된 task
  CounterSpan.innerHTML = `${tasksLeft} / ${allTasksLength} tasks left`;
}

// 연,월,일,요일 표시
const date = document.querySelector("#today");

let getTime = () => {
  let realTime = new Date(); //GMT 기준시간을 불러옴
  let week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let curWeek = week[realTime.getDay()];
  let curDay = realTime.getDate();
  let curMonth = months[realTime.getMonth()];
  let curYear = realTime.getFullYear();

  date.innerText = `${curWeek}, ${curDay} ${curMonth} ${curYear}`;
};
getTime();
