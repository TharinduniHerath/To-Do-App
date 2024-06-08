document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const addTaskButton = document.getElementById("addTaskButton");
  const taskList = document.getElementById("taskList");
  const sortBy = document.getElementById("sortBy");
  const filterBy = document.getElementById("filterBy");
  const filterValue = document.getElementById("filterValue");
  const filterButton = document.getElementById("filterButton");
  const messageContainer = document.getElementById("messageContainer");
  const popupForm = document.getElementById("popupForm");
  const updateTaskForm = document.getElementById("updateTaskForm");
  const updateTaskInput = document.getElementById("updateTaskInput");
  const updateTaskDate = document.getElementById("updateTaskDate");
  const closeBtn = document.querySelector(".close");

  let currentTaskId = null;

  function showMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.className = `message-container ${type}`;
    setTimeout(() => {
      messageContainer.textContent = "";
      messageContainer.className = "message-container";
    }, 3000);
  }

  function getPriorityValue() {
    const radios = document.getElementsByName("priority");
    for (const radio of radios) {
      if (radio.checked) {
        return radio.value;
      }
    }
    return "low"; // Default
  }

  async function fetchTasks() {
    const sortByValue = sortBy.value;
    const filterByValue = filterBy.value;
    const filterValueValue = filterValue.value;

    let url = "http://localhost:5001/api/tasks";
    const params = new URLSearchParams();
    if (sortByValue) {
      params.append("sortBy", sortByValue);
    }
    if (filterByValue && filterValueValue) {
      params.append("filterBy", filterByValue);
      params.append("filterValue", filterValueValue);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    taskList.innerHTML = "";
    data.tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <span>(Due: ${
          task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"
        }, Priority: ${task.priority})</span>
        <span class="delete-button"><i class="fa-solid fa-trash"></i></span>
        <span class="update-button"><i class="fa-solid fa-pen"></i></span>
        <span class="complete-button"><i class="fa-solid fa-check"></i></span>
      `;
      if (task.completed) {
        li.classList.add("checked");
      }
      taskList.appendChild(li);

      const deleteButton = li.querySelector(".delete-button");
      deleteButton.onclick = async () => {
        await fetch(`http://localhost:5001/api/tasks/${task._id}`, {
          method: "DELETE",
        });
        fetchTasks();
        showMessage("Task deleted successfully", "success");
      };

      const updateButton = li.querySelector(".update-button");
      updateButton.onclick = () => {
        currentTaskId = task._id;
        updateTaskInput.value = task.text;
        updateTaskDate.value = task.dueDate ? task.dueDate.split('T')[0] : "";
        popupForm.style.display = "block";
      };

      const completeButton = li.querySelector(".complete-button");
      completeButton.onclick = () => {
        completeTask(task._id);
      };
    });
  }

  async function addTask(text, dueDate, priority) {
    await fetch("http://localhost:5001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, dueDate, priority }),
    });
    fetchTasks();
    showMessage("Task added successfully", "success");
  }

  async function updateTask(id, newText, newDate) {
    await fetch(`http://localhost:5001/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newText, dueDate: newDate }),
    });
    fetchTasks();
    showMessage("Task updated successfully", "success");
  }

  async function completeTask(id) {
    await fetch(`http://localhost:5001/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchTasks();
    showMessage("Task marked as completed", "success");
  }

  addTaskButton.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = getPriorityValue();
    if (text) {
      addTask(text, dueDate, priority);
      taskInput.value = "";
      dueDateInput.value = "";
    }
  });

  filterButton.addEventListener("click", () => {
    fetchTasks();
  });

  updateTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newText = updateTaskInput.value.trim();
    const newDate = updateTaskDate.value;
    if (newText && currentTaskId) {
      updateTask(currentTaskId, newText,newDate);
      popupForm.style.display = "none";
    }
  });

  closeBtn.addEventListener("click", () => {
    popupForm.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === popupForm) {
      popupForm.style.display = "none";
    }
  });

  fetchTasks();
});
