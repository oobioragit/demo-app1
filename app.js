// Set today as minimum date for the date picker
document.getElementById('date').min = new Date().toISOString().split('T')[0];

const bookings = [];

// ── Form submission ──
document.getElementById('bookingForm').addEventListener('submit', function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const service   = document.getElementById('service');
  const date      = document.getElementById('date').value;
  const time      = document.getElementById('time').value;

  const serviceLabel = service.options[service.selectedIndex].text;
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const booking = {
    id: Date.now(),
    name: `${firstName} ${lastName}`,
    email,
    service: serviceLabel,
    date: formattedDate,
    time,
    rawDate: date
  };

  bookings.push(booking);
  renderBookings();

  // Show success banner
  document.querySelector('.booking-form').style.display = 'none';
  const banner = document.getElementById('successBanner');
  banner.classList.add('visible');
  document.getElementById('successDetails').textContent =
    `${firstName}, your ${serviceLabel.split('—')[0].trim()} is booked for ${formattedDate} at ${formatTime(time)}.`;

  // Scroll to confirmation
  banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ── Validation ──
function validateForm() {
  let valid = true;

  const fields = [
    { id: 'firstName', errorId: 'firstNameError', check: v => v.trim().length > 0 },
    { id: 'lastName',  errorId: 'lastNameError',  check: v => v.trim().length > 0 },
    { id: 'email',     errorId: 'emailError',     check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'service',   errorId: 'serviceError',   check: v => v !== '' },
    { id: 'date',      errorId: 'dateError',       check: v => v !== '' },
    { id: 'time',      errorId: 'timeError',       check: v => v !== '' },
  ];

  fields.forEach(({ id, errorId, check }) => {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!check(input.value)) {
      input.classList.add('invalid');
      error.classList.add('visible');
      valid = false;
    } else {
      input.classList.remove('invalid');
      error.classList.remove('visible');
    }
  });

  return valid;
}

// Clear validation state on input
['firstName','lastName','email','service','date','time'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    this.classList.remove('invalid');
    const errorEl = document.getElementById(id + 'Error');
    if (errorEl) errorEl.classList.remove('visible');
  });
});

// ── Render bookings list ──
function renderBookings() {
  const list = document.getElementById('bookingsList');
  if (bookings.length === 0) {
    list.innerHTML = '<p class="empty-state">No bookings yet. Fill in the form above to get started!</p>';
    return;
  }

  list.innerHTML = bookings.map(b => `
    <div class="booking-item" id="booking-${b.id}">
      <div class="booking-item-info">
        <h4>${b.service.split('—')[0].trim()}</h4>
        <p>${b.name} &middot; ${b.date} &middot; ${formatTime(b.time)}</p>
        <p>${b.email}</p>
      </div>
      <div style="display:flex; align-items:center; flex-wrap:wrap; gap:.5rem;">
        <span class="booking-status">Confirmed</span>
        <button class="btn-cancel" onclick="cancelBooking(${b.id})">Cancel</button>
      </div>
    </div>
  `).join('');

  // Scroll to bookings section
  document.getElementById('mybookings').scrollIntoView({ behavior: 'smooth' });
}

// ── Cancel a booking ──
function cancelBooking(id) {
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return;
  bookings.splice(idx, 1);
  const el = document.getElementById('booking-' + id);
  if (el) el.remove();
  if (bookings.length === 0) renderBookings();
}

// ── Reset form ──
function resetForm() {
  document.getElementById('bookingForm').reset();
  document.getElementById('bookingForm').style.display = '';
  document.getElementById('successBanner').classList.remove('visible');
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

// ── Helpers ──
function formatTime(time) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}
