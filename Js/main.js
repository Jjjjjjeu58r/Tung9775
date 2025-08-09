// Theme toggle with localStorage
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function setTheme(mode) {
  root.setAttribute('data-theme', mode);
  localStorage.setItem('theme', mode);
}

(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    setTheme(saved);
  } else {
    // auto detect prefers-color-scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
})();

themeToggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'light' ? 'dark' : 'light');
});

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navToggle.classList.toggle('active');
  navList.classList.toggle('open');
});

// Close nav when clicking link (mobile)
navList?.addEventListener('click', e => {
  if (e.target.matches('a') && window.innerWidth < 900) {
    navToggle.click();
  }
});

// Animate stats count
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  let start = 0;
  const duration = 1200;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * ease);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statEls = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      animateCount(entry.target);
      entry.target.dataset.done = 'true';
    }
  });
},{ threshold: 0.5 });

statEls.forEach(el => statObserver.observe(el));

// Scroll reveal
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
},{ threshold: .3 });

revealEls.forEach(el => revealObserver.observe(el));

// Contact form (demo)
const form = document.getElementById('contactForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const statusEl = form.querySelector('.form-status');
  const formData = new FormData(form);
  const errors = validateForm(formData, form);

  if (errors === 0) {
    statusEl.textContent = 'Đang gửi...';
    // Fake submit
    setTimeout(() => {
      statusEl.textContent = 'Gửi thành công! Cảm ơn bạn đã liên hệ.';
      form.reset();
    }, 900);
  } else {
    statusEl.textContent = 'Vui lòng kiểm tra các trường bị lỗi.';
  }
});

function validateForm(fd, form) {
  let err = 0;
  const showError = (name, msg) => {
    const field = form.querySelector(`[name="${name}"]`)?.closest('.field, .field-inline');
    if (!field) return;
    const small = field.querySelector('.error');
    if (small) small.textContent = msg;
    if (msg) err++;
  };
  ['name','email','message'].forEach(name => showError(name,''));
  showError('consent','');

  if (!fd.get('name')?.trim()) showError('name','Vui lòng nhập tên');
  const email = fd.get('email')?.trim();
  if (!email) showError('email','Email bắt buộc');
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) showError('email','Email không hợp lệ');

  if (!fd.get('message')?.trim()) showError('message','Vui lòng nhập nội dung');
  if (!fd.get('consent')) showError('consent','Cần đồng ý');

  return err;
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Optional: Add reveal attribute programmatically to large sections
document.querySelectorAll('.project-card, .timeline-item, .skill-block, .post-card')
  .forEach(el => el.setAttribute('data-reveal',''));