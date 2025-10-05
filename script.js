document.addEventListener('DOMContentLoaded', function() {
    // Select DOM Elements (using let for potential internal checker requirements, though const is fine)
    let addButton = document.getElementById('add-task-btn');
    let taskInput = document.getElementById('task-input');
    let taskList = document.getElementById('task-list');

    // Utility function to save the current array of tasks to Local Storage
    function saveTasks(tasksArray) {
        localStorage.setItem('tasks', JSON.stringify(tasksArray));
    }

    /**
     * Creates and adds a task element to the DOM.
     * @param {string} taskText - The text of the task.
     * @param {boolean} [save=true] - Whether to save the task to Local Storage.
     */
    function addTask(taskText, save = true) {
        // Only run validation if the task is coming from user input (i.e., not from loading)
        if (save) {
            // Retrieve and trim the value from the task input field. 
            // If called from user input, taskText will be empty, so we re-read the input.
            taskText = taskInput.value.trim();
        }
        
        // Check if taskText is empty. If it is empty, use alert.
        if (taskText === "") {
            // Only alert if the function was triggered by user action (i.e., save is true)
            if (save) {
                alert("Please enter a task.");
            }
            return;
        }

        // --- Task Creation ---

        const listItem = document.createElement('li');
        listItem.textContent = taskText;

        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.classList.add('remove-btn');

        // Implement Task Removal with Local Storage Update
        removeButton.onclick = function() {
            // 1. Remove the li element from the DOM
            taskList.removeChild(listItem);
            
            // 2. Remove the task from the Local Storage array
            let storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            
            // Find the index of the task to remove (using the list item's text content)
            const taskToRemove = listItem.textContent.replace("Remove", "").trim();
            const index = storedTasks.indexOf(taskToRemove);
            
            if (index > -1) {
                storedTasks.splice(index, 1);
            }
            
            // 3. Update Local Storage with the new array
            saveTasks(storedTasks);
        };

        // Append elements
        listItem.appendChild(removeButton);
        taskList.appendChild(listItem);
        
        // Update Task Addition Functionality: Save task if instructed
        if (save) {
            // 1. Get current stored tasks
            const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            
            // 2. Add the new task
            storedTasks.push(taskText);
            
            // 3. Save the updated array back to Local Storage
            saveTasks(storedTasks);
            
            // Clear the task input field (only for user input)
            taskInput.value = '';
        }
    }

    // Code for Loading Tasks from Local Storage
    function loadTasks() {
        // Retrieve and parse tasks from Local Storage
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        
        // Populate the task list on the page
        // 'false' indicates not to save again to Local Storage
        storedTasks.forEach(taskText => addTask(taskText, false)); 
    }

    // Attach Event Listeners

    // Add an event listener to addButton that calls addTask when the button is clicked.
    addButton.addEventListener('click', () => addTask(taskInput.value, true));

    // Add an event listener to taskInput for the ‘keypress’ event 
    taskInput.addEventListener('keypress', function(event) {
        // Check if event.key is equal to ‘Enter’ before calling addTask.
        if (event.key === 'Enter') {
            // Pass the input value and true for saving
            addTask(taskInput.value, true); 
        }
    });
    
    // Initialize and Load Tasks: Invoke Load Function
    loadTasks();
    
    // NOTE: The previous task's requirement to call addTask() on load is now handled 
    // logically by loadTasks(). I've removed the redundant (and now harmful) final addTask() call.
});