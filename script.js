document.addEventListener('DOMContentLoaded', function() {
    let addButton = document.getElementById('add-task-btn');
    let taskInput = document.getElementById('task-input');
    let taskList = document.getElementById('task-list');

    function saveTasks(tasksArray) {
        localStorage.setItem('tasks', JSON.stringify(tasksArray));
    }

    function addTask(taskText, save = true) {
        if (save) {
            taskText = taskInput.value.trim();
        }
        
        if (taskText === "") {
            if (save) {
                alert("Please enter a task.");
            }
            return;
        }

        const listItem = document.createElement('li');
        listItem.textContent = taskText;

        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.classList.add('remove-btn');

        removeButton.onclick = function() {
            taskList.removeChild(listItem);
            
            let storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            
            const taskToRemove = listItem.textContent.replace("Remove", "").trim();
            const index = storedTasks.indexOf(taskToRemove);
            
            if (index > -1) {
                storedTasks.splice(index, 1);
            }
            
            saveTasks(storedTasks);
        };

        listItem.appendChild(removeButton);
        taskList.appendChild(listItem);
        
        if (save) {
            const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            
            storedTasks.push(taskText);
            
            saveTasks(storedTasks);
            
            taskInput.value = '';
        }
    }

    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        
        storedTasks.forEach(taskText => addTask(taskText, false)); 
    }

    addButton.addEventListener('click', () => addTask(taskInput.value, true));

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask(taskInput.value, true); 
        }
    });

    loadTasks();
});