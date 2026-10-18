document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  const xpDisplay = document.getElementById("xp");
  const progress = document.getElementById("progress");
  const xpText = document.getElementById("xp-text");
  const taskCount = document.getElementById("task-count");

  let xp = 0;
  let completedTasks = 0;

  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
      return;
    }

    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    const span = document.createElement("span");

    checkbox.type = "checkbox";
    span.textContent = taskName;

    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        xp += 20;
        completedTasks++;
        li.classList.add("completed");
      } else {
        xp -= 20;
        completedTasks--;
        li.classList.remove("completed");
      }

      updateStats();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    taskList.appendChild(li);

    taskInput.value = "";
    taskInput.focus();

    updateStats();
  });

  function updateStats() {
    const level = Math.floor(xp / 100) + 1;
    const currentXP = xp % 100;

    xpDisplay.textContent = xp;
    xpText.textContent = `${currentXP} / 100 XP`;
    progress.style.width = currentXP + "%";

    taskCount.textContent = `${completedTasks} nhiệm vụ hoàn thành`;

    document.querySelector(".player-card h2").textContent =
      `Novice · Level ${level}`;
  }
});
