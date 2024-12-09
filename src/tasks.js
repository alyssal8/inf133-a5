let taskForm = $("#task-form");
let taskList = $("#task-list");
let tasks = [];
let selectedIndex;

function addUpdateTask(event) {
    event.preventDefault();
    // Convert the task form data into a JSON object
    const taskFormData = taskForm.serializeArray();
    let task = {};
    $.each(taskFormData, function(index, item) {
        task[item.name] = item.value;
    });
    
    // Performs different functions depending on whether a task is being added or edited
    if ($("#addUpdateTaskBtn").text() == "Add Task") {
        tasks.push(task);
    } else {
        tasks[selectedIndex] = task;
        $("#addUpdateTaskBtn").text("Add Task");
        $("#cancelBtn").hide();
    }

    displayTasks();
}

function cancelUpdate() {
    $("#addUpdateTaskBtn").text("Add Task");
    $("#cancelBtn").hide();

    displayTasks();
}

function editTask(index) {
    // Fill out the form with the task's details
    let task = tasks[index];
    $("#taskName").val(task.taskName);
    $("#taskDescription").val(task.taskDescription);
    $("#taskPriority").val(task.taskPriority);
    $("#taskCategory").val(task.taskCategory);
    $("#taskDateTime").val(task.taskDateTime);

    // Save the index of the task being edited
    selectedIndex = index;
    $("#addUpdateTaskBtn").text("Update Task");
    $("#cancelBtn").show();

    // Indicate which task is being edited
    $(".task").removeClass("selected");
    $(`.task[data-index="${index}"]`).addClass("selected");
}

function deleteTask(index) {
    tasks.splice(index, 1);

    // If the task being deleted was also being edited,
    // clear the form and cancel the edit
    if (selectedIndex = index) {
        selectedIndex = null;
        taskForm[0].reset();
        cancelUpdate();
    } else {
        displayTasks();
    }
}

function displayTasks() {
    taskList.empty();
    
    // Display each task's info
    tasks.forEach((task, index) => {
        const taskHtml = `
            <div class="task" data-index="${index}">
                <b>${task.taskName}</b><br>
                ${task.taskDescription ? `${task.taskDescription}<br>` : ""}
                <i>Priority: ${task.taskPriority}</i><br>
                <i>Category: ${task.taskCategory}</i><br>
                ${
                    task.taskDateTime
                        ? `<i>${new Date(task.taskDateTime).toLocaleString(
                              "en-US",
                              { dateStyle: "short", timeStyle: "short" }
                          )}</i><br>`
                        : ""
                }
                <button type="button" class="editTaskBtn" data-index="${index}">Edit</button>
                <button type="button" class="deleteTaskBtn" data-index="${index}">Delete</button>
            </div>
        `;
        taskList.append(taskHtml);
    });

    // Attach event listeners to the Edit and Delete buttons
    $(".editTaskBtn").on('click', function () {
        editTask($(this).data("index"));
    });

    $(".deleteTaskBtn").on('click', function () {
        deleteTask($(this).data("index"));
    });
}

taskForm.on('submit', addUpdateTask);
$("#cancelBtn").on('click', cancelUpdate);
