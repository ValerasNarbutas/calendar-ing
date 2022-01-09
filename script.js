// sessionStorage.clear()
console.log('Hi')
const date = new Date();
const monthsLabel = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let dateClicked = null;

let events = sessionStorage.getItem("events")
  ? JSON.parse(sessionStorage.getItem("events"))
  : [];

const monthDays = document.querySelector(".monthDays");
const displayEvent = document.querySelector(".displayEvent");
const newEvent = document.querySelector(".newEvent");
const eventTypeLabels = ["Meeting", "Call", "Out of Office"]

//   SHOW EVENT MODULES
function showEventModules(date) {
  dateClicked = date;
//   console.log(dateClicked);
  //   CHECK IF EVENT EXISTS ON DAY CLICKED
  const dayEvent = events.find((e) => e.date === dateClicked);
  if (dayEvent) {
    document.getElementById("eventTitle").innerText = dayEvent.title;
    document.getElementById("eventDate").innerHTML = dateClicked;
    document.getElementById("eventDescription").innerText =
      dayEvent.description;
    document.getElementById(
      "eventTime"
    ).innerText = `From: ${dayEvent.startTime}, To: ${dayEvent.endTime}`;
    document.getElementById("eventTypeDescription").innerText = dayEvent.type;
    displayEvent.style.display = "block";
  } else {
    displayEvent.style.display = "none";
    newEvent.style.display = "block";
  }
}

function loadCalendar() {
  // MONTH RESET
  date.setDate(1);
  //   let daySquare = document.createElement("div");

  const firstDayIndex = date.getDay();
  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();
  const monthLength = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();
  const nextDays = 7 - lastDayIndex;

  //   HEADER DATE
  document.getElementById("headerDate").innerHTML = `${
    monthsLabel[date.getMonth()]
  }, ${date.getFullYear()}`;

  monthDays.innerHTML = "";

  //   DISPLAY REMAINING DAYS FROM PREV MONTH
  for (let i = firstDayIndex - 1; i > 0; i--) {
    let daySquare = document.createElement("div");
    daySquare.classList.add("prevDate");
    daySquare.innerText = prevLastDay - i + 1;
    monthDays.appendChild(daySquare);
  }

  //   DISPLAY CURRENT MONTH DAYS
  for (let j = 1; j <= monthLength; j++) {
    let daySquare = document.createElement("div");
    daySquare.classList.add("monthDays");

    let dateString = `${j}.${date.getMonth() + 1}.${date.getFullYear()}`;
    // TRUE OR FALSE FOR EVENT ON DATE EXISTING
    const dateEvent = events.find((e) => e.date === dateString);

    //   DISPLAY CURRENT DAY
    if (
      j === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      daySquare.classList.add("today");
      daySquare.innerText = j;
    }

    // ERRORS WITH MAY
    if (prevLastDay === 30 && firstDayIndex === 0) {
      while (j <= 30) {
        let daySquare = document.createElement("div");
        daySquare.innerText = j + 1;
        monthDays.appendChild(daySquare);
        j++;
      }
    }

    // IF EVENT EXISTS ON DATE, APPEND EVENT TITLE TO DAY SQUARE
    if (dateEvent) {
      const eventDiv = document.createElement("div");
      eventDiv.classList.add("dayEvent");
      eventDiv.innerText = dateEvent.title;
      daySquare.innerText = j;
      if(dateEvent.type == eventTypeLabels[0]){
           eventDiv.classList.add('meeting')
      }else if(dateEvent.type == eventTypeLabels[1]){
        eventDiv.classList.add('call')
      }else if(dateEvent.type == eventTypeLabels[2]){
        eventDiv.classList.add('ooo')
      }
      daySquare.appendChild(eventDiv);
    } else {
      daySquare.innerText = j;
    }
    // DISPLAY REMAINING DAYS IN CURRENT MONTH

    daySquare.addEventListener("click", () => showEventModules(dateString));
    monthDays.appendChild(daySquare);
  }
}

// PREVIOUS MONTH
document.getElementById("prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  loadCalendar();
});

// NEXT MONTH
document.getElementById("next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  loadCalendar();
});

// CLOSE FORM
let closeForm = () => {

  eventTitleInput.classList.remove("error");
  newEvent.style.display = "none";

  eventTitleInput.value = "";
  startTimeInput.value = "";
  endTimeInput.value = "";
  eventDescriptionInput.value = "";
  dateClicked = null;
  loadCalendar();
};

// CLOSE EVENT DETAILS
let closeEvent = () => {
  displayEvent.style.display = "none";
};

// SAVE EVENT
let saveEvent = () => {
  let eventType = document.getElementById("eventType");

  if (eventTitleInput.value) {
    events.push({
      date: dateClicked,
      title: eventTitleInput.value,
      startTime: startTimeInput.value,
      endTime: endTimeInput.value,
      description: eventDescriptionInput.value,
      type: eventType.options[eventType.selectedIndex].text,
    });

    sessionStorage.setItem("events", JSON.stringify(events));
    closeForm();
  } else {
    eventTitleInput.classList.add("error");
  }
};

// REMOVE EVENT
let deleteEvent = () => {

  events = events.filter((e) => e.date !== dateClicked);
  sessionStorage.setItem("events", JSON.stringify(events));
  closeEvent();
  loadCalendar();
  alert("Event Has Been Removed");
};

document.getElementById("save").addEventListener("click", saveEvent);
document.getElementById("closeForm").addEventListener("click", closeForm);
document.getElementById("closeEvent").addEventListener("click", closeEvent);
document.getElementById("delete").addEventListener("click", deleteEvent);

loadCalendar();
