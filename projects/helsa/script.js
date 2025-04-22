let shifts = {};

function openModal() {
  document.getElementById('defineShiftModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('defineShiftModal').style.display = 'none';
}

let pattern = [];
document.querySelectorAll('#iconPicker .icon').forEach(el => {
  el.onclick = () => {
    pattern.push(el.dataset.type);
    document.getElementById('patternPreview').innerText = pattern.join(' → ');
  };
});

function saveShift() {
  const name = document.getElementById('shiftName').value;
  const startDate = document.getElementById('shiftStartDate').value;
  if (!name || !startDate || pattern.length === 0) {
    alert('Please complete all fields.');
    return;
  }

  shifts[name] = { startDate, pattern: [...pattern] };
  updateShiftSelects();
  pattern = [];
  document.getElementById('patternPreview').innerText = '';
  closeModal();
}

function updateShiftSelects() {
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    select.innerHTML = `<option>Add new shift...</option>`;
    for (let key in shifts) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.innerText = key;
      select.appendChild(opt);
    }

    select.onchange = () => {
      if (select.value === "Add new shift...") {
        openModal();
      }
    };
  });
}

function calculateSummary() {
  const shift = shifts[document.getElementById('calcShiftSelect').value];
  const start = new Date(document.getElementById('calcStartDate').value);
  const end = new Date(document.getElementById('calcEndDate').value);
  if (!shift || !start || !end || end < start) return alert('Invalid input.');

  const pattern = shift.pattern;
  const result = { Day: 0, Evening: 0, Night: 0, Rest: 0 };
  let current = new Date(start);
  let i = 0;

  while (current <= end) {
    const type = pattern[i % pattern.length];
    result[type]++;
    i++;
    current.setDate(current.getDate() + 1);
  }

  const holidays = countWeekends(start, end);
  const workingDays = (i - result.Rest - holidays);

  const output = `
    <h3>Summary</h3>
    <p>Total Days: ${i}</p>
    <p>Day Shifts: ${result.Day}</p>
    <p>Evening Shifts: ${result.Evening}</p>
    <p>Night Shifts: ${result.Night}</p>
    <p>Rest Days: ${result.Rest}</p>
    <p>Official Holidays (weekends): ${holidays}</p>
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
    const day = d.getDay();
    if (day === 0 || day === 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}
