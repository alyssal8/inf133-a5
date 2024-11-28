let taskForm = $("#task-form");
let taskList = $("#task-list");
let tasks = [];

function addTask(event) {
    event.preventDefault();

    // Convert the task form data into a JSON object
    const taskFormData = taskForm.serializeArray();
    let task = {};
    $.each(taskFormData, function(index, item) {
        task[item.name] = item.value;
    });
    
    tasks.push(task);
    displayTasks();
}

function displayTasks() {
    taskList.empty();
    
    // Display each task's info
    for (let i = 0; i < tasks.length; i++) {
        taskList.append("<b>" + tasks[i].taskName + "</b>");
        if (tasks[i].taskDescription) {
            taskList.append("<br>");
            taskList.append(tasks[i].taskDescription);
        }
        taskList.append("<br>");
        taskList.append("<i>Priority: " + tasks[i].taskPriority + "</i>");
        taskList.append("<br>");
        taskList.append("<i>Category: " + tasks[i].taskCategory + "</i>");
        if (tasks[i].taskDateTime) {
            taskList.append("<br>");
            const taskDateTime = new Date(tasks[i].taskDateTime)
            taskList.append("<i>" + taskDateTime.toLocaleString('en-US', {dateStyle: 'short', timeStyle: 'short'}) + "</i>");
        }
        taskList.append("<br><br>");
    }
}

taskForm.on('submit', addTask);
