let events = loadEventsFromLocalStorage() || [];
let selectedEvent = null; // Track the selected event
const calendarBody = document.querySelector(".calendar-table tbody");
const monthDisplay = document.querySelector(".current-month-year");
const now = new Date();
let currentMonth = now.getMonth();
let currentYear = now.getFullYear();

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

//Save and load from storage
function saveEventsToLocalStorage() {
    localStorage.setItem("events", JSON.stringify(events));
}

function loadEventsFromLocalStorage() {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : [];
}

function generateCalendar() {
    calendarBody.innerHTML = "";

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let dayCount = 0;
    let row = document.createElement("tr");

    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement("td");
        row.appendChild(cell);
        dayCount++;
    }

    //Add cells for days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("td");
        cell.textContent = day;

        if (
            day === now.getDate() &&
            currentMonth === now.getMonth() &&
            currentYear === now.getFullYear()
        ) {
            cell.classList.add("today");
        }

        events.forEach((event, index) => {
            const eventDate = new Date(event.date);
            if (
                eventDate.getDate() === day &&
                eventDate.getMonth() === currentMonth &&
                eventDate.getFullYear() === currentYear
            ) {
                const eventDiv = document.createElement("div");
                eventDiv.className = `event ${event.category.toLowerCase()}`;
                eventDiv.textContent = `${event.name} @ ${event.time}`;
                eventDiv.addEventListener("click", () => selectEvent(index)); // Select event for deletion
                cell.appendChild(eventDiv);
            }
        });

        row.appendChild(cell);
        dayCount++;

        if (dayCount === 7) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
            dayCount = 0;
        }
    }

    if (dayCount > 0) {
        for (let i = dayCount; i < 7; i++) {
            const cell = document.createElement("td");
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }

    monthDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
}

//Add event
function addEvent() {
    const name = document.getElementById("eventName").value;
    const dateInput = document.getElementById("eventDate").value;
    const timeInput = document.getElementById("eventTime").value;
    const category = document.getElementById("eventCategory").value;

    if (name && dateInput) {
        // Parse the date manually to avoid time zone issues
        const [year, month, day] = dateInput.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        events.push({
            name,
            date: date.toISOString().split("T")[0],
            time: timeInput,
            category
        });

        saveEventsToLocalStorage();
        generateCalendar();
        document.getElementById("event-form").reset();

        const confirmationMessage = document.getElementById("confirmationMessage");
        confirmationMessage.style.display = "block";
        setTimeout(() => {
            confirmationMessage.style.display = "none";
        }, 3000);
    } else {
        alert("Please fill out all required fields.");
    }
}

//Select an event
function selectEvent(index) {
    selectedEvent = index;
    document.getElementById("deleteEventBtn").style.display = "block";
}

//Delete a selected event
function deleteEvent() {
    if (selectedEvent !== null) {
        events.splice(selectedEvent, 1);
        saveEventsToLocalStorage();
        selectedEvent = null;
        generateCalendar();
        document.getElementById("deleteEventBtn").style.display = "none";
    }
}

function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = now.toLocaleDateString("en-US", options);
    const time = now.toLocaleTimeString("en-US", { hour12: true });

    clock.innerHTML = `${date} | ${time}`;
}

// Navigation buttons
document.querySelector(".prev-month").addEventListener("click", () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    generateCalendar();
});

document.querySelector(".next-month").addEventListener("click", () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    generateCalendar();
});

document.querySelector(".prev-year").addEventListener("click", () => {
    currentYear--;
    generateCalendar();
});

document.querySelector(".next-year").addEventListener("click", () => {
    currentYear++;
    generateCalendar();
});

//Initialize calendar
document.getElementById("addEventBtn").addEventListener("click", addEvent);
document.getElementById("deleteEventBtn").addEventListener("click", deleteEvent);
generateCalendar();
setInterval(updateClock, 1000);
updateClock();
