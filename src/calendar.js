var now = new Date();
var monthIndex = now.getMonth();
var year = now.getFullYear();

var months = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"];

var monthDisplay = document.querySelector(".current-month-year");
var previousButton = document.querySelector(".calendar-controls .prev");
var nextButton = document.querySelector(".calendar-controls .next");
var dayCells = document.querySelectorAll(".calendar-table td");

//Display the current month & year
monthDisplay.textContent = months[monthIndex] + " " + year;

//Highlight current day (if present on calendar)
var dateNumbers = document.querySelectorAll(".date-number");
for (var i = 0; i < dateNumbers.length; i++) {
    var dayNumber = Number(dateNumbers[i].textContent);
    if (dayNumber === now.getDate()) {
        dateNumbers[i].parentElement.classList.add("today");
    }
}

