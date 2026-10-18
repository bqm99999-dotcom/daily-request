document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const progress = document.getElementById("progress");
  const progressText = document.getElementById("progress-text");
  const taskCount = document.getElementById("task-count");

  const today = new Date().toISOString().split("T")[0];
  const savedDate = localStorage.getItem("daily_quest_date");

  let tasks = [];

  if (savedDate !== today) {
    localStorage.setItem("daily_quest_date", today);
    localStorage.setItem("daily_quests", JSON.stringify([]));
  } else {
    tasks = JSON.parse(localStorage.getItem("daily_quests")) || [];
  }

  renderTasks();

  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskName = taskInput.value.trim();
    if (taskName === "") return;

    tasks.push({ name: taskName, completed: false });
    saveAndRender();

    taskInput.value = "";
    taskInput.focus();
  });

  function renderTasks() {
    taskList.innerHTML = "";
    let completedTasks = 0;

    tasks.forEach((task, index) => {
      if (task.completed) completedTasks++;

      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const taskInfo = document.createElement("div");
      taskInfo.className = "task-info";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      checkbox.addEventListener("change", function () {
        tasks[index].completed = checkbox.checked;
        saveAndRender();
      });

      if (task.isEditing) {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = task.name;
        editInput.className = "edit-input";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Lưu";
        saveBtn.style.padding = "6px 12px";
        saveBtn.style.fontSize = "0.8rem";

        const saveChanges = () => {
          const val = editInput.value.trim();
          if (val !== "") {
            tasks[index].name = val;
          }
          tasks[index].isEditing = false;
          saveAndRender();
        };

        saveBtn.addEventListener("click", saveChanges);
        editInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") saveChanges();
        });

        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(editInput);
        li.appendChild(taskInfo);
        li.appendChild(saveBtn);

        setTimeout(() => editInput.focus(), 0);
      } else {
        const span = document.createElement("span");
        span.textContent = task.name;

        taskInfo.appendChild(checkbox);
        taskInfo.appendChild(span);

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Sửa";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", function () {
          tasks[index].isEditing = true;
          renderTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Xóa";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function () {
          tasks.splice(index, 1);
          saveAndRender();
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(taskInfo);
        li.appendChild(actions);
      }

      taskList.appendChild(li);
    });

    updateStats(completedTasks);
  }

  function saveAndRender() {
    localStorage.setItem("daily_quests", JSON.stringify(tasks));
    localStorage.setItem("daily_quest_date", today);
    renderTasks();
  }

  function updateStats(completedTasks) {
    const totalTasks = tasks.length;
    let percent = 0;
    if (totalTasks > 0) {
      percent = Math.round((completedTasks / totalTasks) * 100);
    }

    progress.style.width = percent + "%";
    progressText.textContent = `${percent}% hoàn thành`;
    taskCount.textContent = `${completedTasks} / ${totalTasks} nhiệm vụ hoàn thành`;
  }
});
