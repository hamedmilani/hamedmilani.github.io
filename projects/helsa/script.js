// script.js

let shifts = {};

// Load saved shifts from localStorage into memory
function loadSavedShifts() {
  const saved = JSON.parse(localStorage.getItem('shifts') || '[]');
  saved.forEach(shift => {
    shifts[shift.name] = { startDate: shift.startDate, pattern: shift.pattern };
  });
}

// Save new shift to localStorage
function saveNewShift() {
  const name = document.getElementById('shiftName').value.trim();
  const startDate = document.getElementById('shiftStartDate').value;
  if (!name || !startDate || shiftPattern.length === 0) {
    alert("Please fill in all fields.");
    return;
  }

  const newShift = { name, startDate, pattern: [...shiftPattern] };
  const all = JSON.parse(localStorage.getItem('shifts') || '[]');
  all.push(newShift);
  localStorage.setItem('shifts', JSON.stringify(all));
  shifts[name] = { startDate, pattern: [...shiftPattern] };

  closeModal();
  updateShiftSelects();
}

let shiftPattern = [];

function addShiftToPattern(type) {
  shiftPattern.push(type);
  updatePatternDisplay();
}

function updatePatternDisplay() {
  const display = document.getElementById('currentPatternDisplay');
  if (display) {
    display.innerHTML = shiftPattern.map(t => `<span>${t}</span>`).join(" → ");
  }
}

function openModal() {
  document.getElementById('defineShiftModal').style.display = 'block';
  document.getElementById('shiftName').value = '';
  document.getElementById('shiftStartDate').value = '';
  shiftPattern = [];
  updatePatternDisplay();
}

function closeModal() {
  document.getElementById('defineShiftModal').style.display = 'none';
}

function updateShiftSelects() {
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    select.innerHTML = `<option value="">-- Select Shift --</option>`;
    for (let name in shifts) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.innerText = name;
      select.appendChild(opt);
    }

    const addNew = document.createElement('option');
    addNew.value = 'add-new';
    addNew.textContent = 'Add new shift...';
    select.appendChild(addNew);

    select.onchange = (e) => {
      if (e.target.value === 'add-new') openModal();
    };
  });
}

function calculateSummary() {
  const name = document.getElementById('calcShiftSelect').value;
  const shift = shifts[name];
  const start = new Date(document.getElementById('calcStartDate').value);
  const end = new Date(document.getElementById('calcEndDate').value);

  if (!shift || isNaN(start) || isNaN(end) || end < start) {
    alert('Invalid input.');
    return;
  }

  const result = { Day: 0, Evening: 0, Night: 0, Rest: 0 };
  let current = new Date(start);
  let i = 0;
  const pattern = shift.pattern;

  while (current <= end) {
    const type = pattern[i % pattern.length];
    result[type] = (result[type] || 0) + 1;
    i++;
    current.setDate(current.getDate() + 1);
  }

  const holidays = countWeekends(start, end);
  const workingDays = i - result.Rest - holidays;

  const output = `
    <h3>Summary</h3>
    <p>Total Days: ${i}</p>
    <p>Day Shifts: ${result.Day || 0}</p>
    <p>Evening Shifts: ${result.Evening || 0}</p>
    <p>Night Shifts: ${result.Night || 0}</p>
    <p>Rest Days: ${result.Rest || 0}</p>
    <p>Weekends (off): ${holidays}</p>
    <p>Total Working Days: ${workingDays}</p>
  `;

  const resBox = document.getElementById('calcResults');
  resBox.innerHTML = output;
  resBox.style.display = 'block';
}

function countWeekends(start, end) {
  let count = 0;
  let d = new Date(start);
  while (d <= end) {
    if (d.getDay() === 0 || d.getDay() === 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

// On load
window.onload = () => {
  loadSavedShifts();
  updateShiftSelects();
};

function showCalendar() {
  const name = document.getElementById('calendarShiftSelect').value;
  const shift = shifts[name];
  const start = new Date(document.getElementById('calendarStartDate').value);
  const end = new Date(document.getElementById('calendarEndDate').value);
  const container = document.getElementById('calendarResults');
  container.innerHTML = '';

  if (!shift || isNaN(start) || isNaN(end) || end < start) {
    alert('Invalid input.');
    return;
  }

  let current = new Date(start);
  let i = 0;
  const pattern = shift.pattern;

  while (current <= end) {
    const type = pattern[i % pattern.length];
    const dayBox = document.createElement('div');
    dayBox.className = 'day-box';
    dayBox.innerHTML = `
      <strong>${current.toDateString()}</strong><br/>
      ${type}
    `;
    container.appendChild(dayBox);
    i++;
    current.setDate(current.getDate() + 1);
  }
}

