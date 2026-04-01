
let selectedDate = "";
let selectedSlots = [];

// Shareable link (event id)
let urlParams = new URLSearchParams(window.location.search);
let eventId = urlParams.get('event') || Math.random().toString(36).substring(2);

// Update URL with event id
window.history.replaceState({}, '', `?event=${eventId}`);

function goToCalendar() {
  document.getElementById('home').classList.add('hidden');

  const pickingTime = document.getElementById('picking-time');
  pickingTime.classList.remove('hidden');
  pickingTime.classList.add('flex'); // makes the grid container visible
}


flatpickr("#datePicker", {
  onChange: function(selectedDates, dateStr) {
    selectedDate = dateStr;
  }
});

function goToSlots() {
  document.getElementById('calendar').classList.add('hidden');
  document.getElementById('slots').classList.remove('hidden');
  document.getElementById('selectedDate').innerText = selectedDate;

  generateSlots();
}

function generateSlots() {
  const container = document.getElementById('timeSlots');
  container.innerHTML = '';

  let times = ["9:30", "9:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30"];

  times.forEach(time => {
    let div = document.createElement('div');
    div.className = 'slot';
    div.innerText = time;

    div.onclick = () => {
      div.classList.toggle('selected');
      if (selectedSlots.includes(time)) {
        selectedSlots = selectedSlots.filter(t => t !== time);
      } else {
        selectedSlots.push(time);
      }
    };

    container.appendChild(div);
  });
}

function saveAvailability() {
  let data = JSON.parse(localStorage.getItem(eventId)) || {};

  let userId = "user_" + Math.random().toString(36).substring(2,6);
  data[userId] = selectedSlots;

  localStorage.setItem(eventId, JSON.stringify(data));

  alert("Saved! Share this link with others:\n" + window.location.href);

  console.log(data);
}


