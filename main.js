// ----- Navbar/header behavior -----
const header = document.querySelector('header.site-header');
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');

function setHeaderSolidIfNeeded() {
  const hasHero = !!document.querySelector('.hero');
  if (!hasHero) header.classList.add('solid');
}
function onScroll() {
  const hasHero = !!document.querySelector('.hero');
  if (hasHero) {
    if (window.scrollY > 40) header.classList.add('solid');
    else header.classList.remove('solid');
  } else {
    header.classList.add('solid');
  }
}
window.addEventListener('scroll', onScroll);
setHeaderSolidIfNeeded();
onScroll();
if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));

// ----- Popup helper -----
function showPopup(messageHtml, title = 'Request submitted') {
  const overlay = document.createElement('div');
  overlay.style.cssText =
    'position:fixed;inset:0;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;z-index:9999;';
  const box = document.createElement('div');
  box.style.cssText =
    'background:#fff;max-width:420px;width:calc(100% - 32px);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.2);padding:24px;text-align:center;';
  box.innerHTML = `
    <h3 style="margin:0 0 8px;color:#375973">${title}</h3>
    <p style="margin:0 0 16px;color:#334155">${messageHtml}</p>
    <button type="button" style="padding:10px 16px;border:0;border-radius:10px;background:#375973;color:#fff;font-weight:600;cursor:pointer">OK</button>
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  box.querySelector('button').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  setTimeout(() => document.body.contains(overlay) && close(), 6000);
}

// ----- Booking Form Submission -----
(async function () {
  const form = document.querySelector('form[data-booking]');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    // Debug log
    console.log('Payload being sent to backend:', payload);

    // Basic validation
    if (!payload.name?.trim() || !payload.email?.trim()) {
      showPopup('Please enter your name and a valid email.', 'Missing info');
      return;
    }

    try {
      const res = await fetch('https://timtom-backend.onrender.com/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Request failed');

      // ✅ Popup confirmation only (no inline message)
      showPopup(`
        Thanks, <strong>${payload.name}</strong>! 
        We received your details. A confirmation email has been sent to 
        <strong>${payload.email}</strong>.
      `);

      form.reset();
    } catch (err) {
      showPopup('Sorry, something went wrong while sending your request.<br>Please try again later.', 'Submission failed');
      console.error(err);
    }
  });
})();

