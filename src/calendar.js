var now = new Date();
var monthIndex = now.getMonth();
var year = now.getFullYear();

var months = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"];

var monthDisplay = document.querySelector(".current-month-year");
var previousButton = document.querySelector(".calendar-controls .prev");
var nextButton = document.querySelector(".calendar-controls .next");
var calendarBody = document.querySelector(".calendar-table tbody");

function generateCalendar() {
  calendarBody.innerHTML = "";
  var firstDay = new Date(year, monthIndex, 1).getDay();

  //num days in a month
  var daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  //rows for each week
  var row = document.createElement("tr");
  var dayCount = 0;
  for (var i = 0; i < firstDay; i++) {
    var cell = document.createElement("td");
    row.appendChild(cell);
    dayCount++;
  }

  for (var i = 1; i <= daysInMonth; i++) {
    var cell = document.createElement("td");
    cell.innerHTML = i;

    //today's date (check if true)
    if (i === now.getDate() && monthIndex === now.getMonth() && year === now.getFullYear()) {
      cell.classList.add("today");
    }

    row.appendChild(cell);
    dayCount++;

    if (dayCount === 7) {
      calendarBody.appendChild(row);
      row = document.createElement("tr");
      dayCount = 0;
    }
  }

  if (dayCount > 0) {
    for (var i = dayCount; i < 7; i++) {
      var cell = document.createElement("td");
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }

  monthDisplay.textContent = months[monthIndex] + " " + year;
}

generateCalendar();
