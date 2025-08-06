// Global variable to store the saved state of completed checkboxes
let savedCompletedState = new Map();

// Global variables for edit mode
let isEditMode = false;
let originalTaskText = "";
let taskBeingEdited = null;

// LocalStorage functions
function saveTasksToStorage() {
  const tasks = [];
  const taskWrappers = document.querySelectorAll('.item-wrapper');
  
  taskWrappers.forEach(function(wrapper) {
    const taskText = wrapper.querySelector('p').textContent;
    const isCompleted = wrapper.querySelector('.completed-box input[type="checkbox"]').checked;
    
    tasks.push({
      text: taskText,
      completed: isCompleted
    });
  });
  
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const savedTasks = localStorage.getItem('todoTasks');
  if (!savedTasks) return;
  
  const tasks = JSON.parse(savedTasks);
  const tasksSection = document.getElementById("tasks-section");
  
  tasks.forEach(function(task) {
    createTaskElement(task.text, task.completed);
  });
  
  // Update counter after loading
  updateTaskCounter();
  checkEdit();
}

function createTaskElement(taskText, isCompleted = false) {
  let tasksSection = document.getElementById("tasks-section");
  
  newItem = {
    wrapper: document.createElement("div"),
    content: document.createElement("p"),
    completedBox: document.createElement("div"),
    completedCheckbox: document.createElement("input"),
    amendBox: document.createElement("div"),
    amendCheckbox: document.createElement("input")
  }
  
  // Style the wrapper for flexbox layout
  newItem.wrapper.classList.add("item-wrapper");
  newItem.wrapper.style.display = "flex";
  newItem.wrapper.style.justifyContent = "space-between";
  newItem.wrapper.style.alignItems = "center";
  newItem.wrapper.style.padding = "10px";
  newItem.wrapper.style.borderBottom = "1px solid rgba(255, 255, 255, 0.2)";
  
  // Style the content (text on left)
  newItem.content.innerText = taskText;
  newItem.content.style.flex = "1";
  newItem.content.style.textAlign = "left";
  newItem.content.style.margin = "0";
  
  // Setup the completed checkbox and its container div
  newItem.completedBox.classList.add("completed-box");
  newItem.completedCheckbox.type = "checkbox";
  newItem.completedCheckbox.classList.add("item-checkbox");
  newItem.completedCheckbox.checked = isCompleted;
  newItem.completedBox.appendChild(newItem.completedCheckbox);
  
  // Setup the amend checkbox and its container div
  newItem.amendBox.classList.add("ammend-box");
  newItem.amendCheckbox.type = "checkbox";
  newItem.amendCheckbox.classList.add("item-checkbox");
  newItem.amendCheckbox.style.marginLeft = "30px";
  newItem.amendCheckbox.style.marginRight = "10px";
  newItem.amendBox.appendChild(newItem.amendCheckbox);
  
  // Append all three divs to the wrapper
  newItem.wrapper.appendChild(newItem.content);
  newItem.wrapper.appendChild(newItem.completedBox);
  newItem.wrapper.appendChild(newItem.amendBox);
  tasksSection.appendChild(newItem.wrapper);
}

function addTask(){
  let userTask = document.getElementById("user-input");
  
  // Check if input has value
  if (!userTask.value.trim()) {
    return; // Don't add empty tasks
  }
  
  // Create the task element
  createTaskElement(userTask.value, false);
  
  // Clear the input field after adding
  userTask.value = "";
  
  // Update counter
  updateTaskCounter();
  
  // Save to localStorage
  saveTasksToStorage();
}
function removeTask(){
  let checkedTasks = document.querySelectorAll('.ammend-box input[type="checkbox"]:checked');
  for (let i = checkedTasks.length - 1; i >= 0; i--) {
    checkedTasks[i].parentElement.parentElement.remove();
  }
  checkEdit();
  updateTaskCounter();
  
  // Save to localStorage
  saveTasksToStorage();
}
function editTask() {
  const checkedTasks = document.querySelectorAll('.ammend-box input[type="checkbox"]:checked');
  if (checkedTasks.length !== 1) return;

  // Enter edit mode
  isEditMode = true;
  taskBeingEdited = checkedTasks[0].parentElement.parentElement;
  const taskTextElement = taskBeingEdited.querySelector('p');
  originalTaskText = taskTextElement.textContent;

  // Put original text in input field
  const userInput = document.getElementById("user-input");
  userInput.value = originalTaskText;

  // Update button states
  updateButtonsForEditMode(true);
  
  // Disable interaction with other elements
  disableMainScreen(true);
}

function saveEdit() {
  if (!isEditMode || !taskBeingEdited) return;

  const userInput = document.getElementById("user-input");
  const newText = userInput.value.trim();
  
  if (newText === "") {
    // Don't save empty tasks
    return;
  }

  // Update the task text
  const taskTextElement = taskBeingEdited.querySelector('p');
  taskTextElement.textContent = newText;

  // Exit edit mode
  exitEditMode();
  
  // Save to localStorage
  saveTasksToStorage();
}

function cancelEdit() {
  if (!isEditMode) return;
  
  // Exit edit mode without saving
  exitEditMode();
}

function exitEditMode() {
  isEditMode = false;
  taskBeingEdited = null;
  originalTaskText = "";

  // Clear input field
  const userInput = document.getElementById("user-input");
  userInput.value = "";

  // Restore button states
  updateButtonsForEditMode(false);
  
  // Re-enable interaction with main screen
  disableMainScreen(false);
  
  // Update edit button state
  checkEdit();
}

function updateButtonsForEditMode(enterEditMode) {
  const editButton = document.getElementById("edit-button");
  const removeButton = document.getElementById("remove-button");
  const addButton = document.getElementById("add-button");

  if (enterEditMode) {
    // Enter edit mode
    editButton.disabled = true;
    removeButton.textContent = "Cancel";
    removeButton.onclick = cancelEdit;
    addButton.textContent = "Save";
    addButton.onclick = saveEdit;
  } else {
    // Exit edit mode
    editButton.disabled = false;
    removeButton.textContent = "Remove";
    removeButton.onclick = removeTask;
    addButton.textContent = "Add";
    addButton.onclick = addTask;
  }
}

function disableMainScreen(disable) {
  const tasksSection = document.getElementById("tasks-section");
  const masterCheckboxes = document.querySelectorAll('.master-done-checkbox, .master-edit-checkbox');
  
  if (disable) {
    // Disable interaction
    tasksSection.style.pointerEvents = "none";
    tasksSection.style.opacity = "0.6";
    masterCheckboxes.forEach(checkbox => checkbox.disabled = true);
  } else {
    // Re-enable interaction
    tasksSection.style.pointerEvents = "auto";
    tasksSection.style.opacity = "1";
    masterCheckboxes.forEach(checkbox => checkbox.disabled = false);
  }
}
function checkEdit() {
  const checkedTasks = document.querySelectorAll('.ammend-box input[type="checkbox"]:checked');
  const editButton = document.getElementById("edit-button");
  editButton.disabled = checkedTasks.length !== 1;
}

function updateTaskCounter() {
  const totalTasks = document.querySelectorAll('.item-wrapper').length;
  const completedTasks = document.querySelectorAll('.completed-box input[type="checkbox"]:checked').length;
  const counterElement = document.getElementById("task-counter");
  counterElement.textContent = `Completed items: ${completedTasks}/${totalTasks}.`;
}

function toggleAllAmendCheckboxes() {
  const masterCheckbox = document.getElementById("master-edit-checkbox");
  const amendCheckboxes = document.querySelectorAll('.ammend-box input[type="checkbox"]');
  
  amendCheckboxes.forEach(function(checkbox) {
    checkbox.checked = masterCheckbox.checked;
  });
  
  // Update edit button state after changing checkboxes
  checkEdit();
}

function toggleAllCompletedCheckboxes() {
  const masterCheckbox = document.getElementById("master-done-checkbox");
  const completedCheckboxes = document.querySelectorAll('.completed-box input[type="checkbox"]');
  
  if (masterCheckbox.checked) {
    // Save current state before checking all
    savedCompletedState.clear();
    completedCheckboxes.forEach(function(checkbox, index) {
      savedCompletedState.set(index, checkbox.checked);
      checkbox.checked = true;
    });
  } else {
    // Restore saved state
    completedCheckboxes.forEach(function(checkbox, index) {
      if (savedCompletedState.has(index)) {
        checkbox.checked = savedCompletedState.get(index);
      }
    });
  }
  
  // Update counter after changing checkboxes
  updateTaskCounter();
  
  // Save to localStorage
  saveTasksToStorage();
}

function checkMasterDoneCheckbox() {
  const completedCheckboxes = document.querySelectorAll('.completed-box input[type="checkbox"]');
  const masterDoneCheckbox = document.getElementById("master-done-checkbox");
  
  if (completedCheckboxes.length === 0) {
    masterDoneCheckbox.checked = false;
    return;
  }
  
  const allChecked = Array.from(completedCheckboxes).every(checkbox => checkbox.checked);
  const allUnchecked = Array.from(completedCheckboxes).every(checkbox => !checkbox.checked);
  
  // Auto-check master if all are manually checked
  if (allChecked && !masterDoneCheckbox.checked) {
    masterDoneCheckbox.checked = true;
    // Save the current state when auto-checking
    savedCompletedState.clear();
    completedCheckboxes.forEach(function(checkbox, index) {
      savedCompletedState.set(index, checkbox.checked);
    });
  }
  
  // Auto-uncheck master if all are manually unchecked
  if (allUnchecked && masterDoneCheckbox.checked) {
    masterDoneCheckbox.checked = false;
    // Clear saved state when all are unchecked
    savedCompletedState.clear();
  }
}

// Listen for changes on all checkboxes in the document
document.addEventListener('change', function(e) {
  if (e.target && e.target.matches('.ammend-box > input[type="checkbox"].item-checkbox')) {
    checkEdit();
  }
  if (e.target && e.target.matches('.completed-box > input[type="checkbox"]')) {
    updateTaskCounter();
    // Check if master done checkbox should be auto-checked
    checkMasterDoneCheckbox();
    // Save to localStorage when completion status changes
    saveTasksToStorage();
  }
});

// Listen for Enter key press in the input field
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const userInput = document.getElementById("user-input");
    if (document.activeElement === userInput) {
      if (isEditMode) {
        saveEdit();
      } else {
        addTask();
      }
    }
  }
});

// Initialize edit button as disabled when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Load saved tasks from localStorage
  loadTasksFromStorage();
  
  checkEdit(); // This will disable the button since no tasks exist initially
  updateTaskCounter(); // Initialize counter
});


let itemContainer = document.getElementById("items-container");