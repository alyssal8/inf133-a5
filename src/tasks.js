let taskForm = $("#task-form");
let taskList = $("#task-list");
let tasks = [];
let selectedIndex;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

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
    if (selectedIndex == index) {
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

function updateClock() {
    const clock = $("#clock");
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = now.toLocaleDateString("en-US", options);
    const time = now.toLocaleTimeString("en-US", { hour12: true });

    clock.html(`${date} | ${time}`);
}

function updateWeather() {
    const weather = $("#weather");
    // Uses the Open-Meteo API to retrieve the temperature
    const url = "https://api.open-meteo.com/v1/forecast?latitude=33.6695&longitude=-117.8231&hourly=temperature_2m&temperature_unit=fahrenheit&wind_speed_unit=ms&precipitation_unit=inch&timezone=America%2FLos_Angeles&forecast_hours=1";
    $.getJSON(url, function (data) {
        weather.html(`${data.hourly.temperature_2m[0]}°F`);
    });
}

function textToSpeech () {
    // Uses the Web Speech API for text to speech
    // Find the target for text to speech
    const target = $("#" + $(this).data("target"));

    // Start listening
    recognition.start();
    $("#speechStatus").html("<br>Listening...");

    // Handle result
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        // Checks if the target already has text
        if (target.val()) {
            target.val(target.val() + " " + transcript);
        } else {
            target.val(transcript);
        }
    };

    // Stop listening
    recognition.onend = function () {
        $("#speechStatus").empty();
    };
}

taskForm.on('submit', addUpdateTask);
$("#cancelBtn").on('click', cancelUpdate);

// Clock updates every second
setInterval(updateClock, 1000);
$(document).ready(updateClock);
$(document).ready(updateWeather);

$(".speechBtn").on('click', textToSpeech);
