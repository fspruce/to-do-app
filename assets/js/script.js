function addTask(){
  let userTask = document.getElementById("user-input");
  let itemContainer = document.getElementById("item-container");
  
  // Check if input has value
  if (!userTask.value.trim()) {
    return; // Don't add empty tasks
  }
  
  newItem = {
    wrapper: document.createElement("div"),
    content: document.createElement("p"),
    checkbox: document.createElement("input")
  }
  
  // Style the wrapper for flexbox layout
  newItem.wrapper.classList.add("item-wrapper");
  newItem.wrapper.style.display = "flex";
  newItem.wrapper.style.justifyContent = "space-between";
  newItem.wrapper.style.alignItems = "center";
  newItem.wrapper.style.padding = "10px";
  newItem.wrapper.style.borderBottom = "1px solid rgba(255, 255, 255, 0.2)";
  
  // Style the content (text on left)
  newItem.content.innerText = userTask.value;
  newItem.content.style.flex = "1";
  newItem.content.style.textAlign = "left";
  newItem.content.style.margin = "0";
  
  // Style the checkbox (on right with padding)
  newItem.checkbox.type = "checkbox";
  newItem.checkbox.classList.add("item-checkbox");
  newItem.checkbox.style.marginLeft = "15px";
  newItem.checkbox.style.marginRight = "10px";
  
  newItem.wrapper.appendChild(newItem.content);
  newItem.wrapper.appendChild(newItem.checkbox);
  itemContainer.appendChild(newItem.wrapper);
  
  // Clear the input field after adding
  userTask.value = "";
}
function removeTask(){
  let checkedTasks = document.querySelectorAll('input[type="checkbox"]:checked');
  for (let i = checkedTasks.length - 1; i >= 0; i--) {
    checkedTasks[i].parentElement.remove();
  }
  checkEdit();
}
function checkEdit() {
  const checkedTasks = document.querySelectorAll('input[type="checkbox"]:checked');
  const editButton = document.getElementById("edit-button");
  editButton.disabled = checkedTasks.length !== 1;
}

// Listen for changes on all checkboxes in the document
document.addEventListener('change', function(e) {
  if (e.target && e.target.matches('input[type="checkbox"].item-checkbox')) {
    checkEdit();
  }
});

// Initialize edit button as disabled when page loads
document.addEventListener('DOMContentLoaded', function() {
  checkEdit(); // This will disable the button since no tasks exist initially
});


let itemContainer = document.getElementById("items-container");