/* =============================================
   GODOTDESDE0 — INTRO
   script.js
   ============================================= */

/* --- Scroll fade-in observer --- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(
  '.for-card, .how-step, .clase-row, .stat'
).forEach((el) => {
  el.classList.add('fade-in');
  observer.observe(el);
});

/* --- Stagger delays for grids --- */
document.querySelectorAll('.cards-grid .for-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 60}ms`;
});

document.querySelectorAll('.how-step').forEach((el, i) => {
  el.style.transitionDelay = `${i * 80}ms`;
});

document.querySelectorAll('.clase-row').forEach((el, i) => {
  el.style.transitionDelay = `${i * 50}ms`;
});

/* --- Nav active link highlight --- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => navObserver.observe(s));

/* --- Locked class rows: prevent navigation --- */
document.querySelectorAll('.clase-row.locked').forEach((row) => {
  row.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Esta clase estará disponible pronto 👀');
  });
});

/* --- Toast notification --- */
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: #18181f;
    border: 1px solid rgba(255,255,255,0.12);
    color: #f0f0f5;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 20px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.25s ease, transform 0.25s ease;
    white-space: nowrap;
    pointer-events: none;
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
