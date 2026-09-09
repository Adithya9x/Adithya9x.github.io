const ring = document.getElementById('cursorRing');
const dot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let lastMoveTime = performance.now();
let lastX = 0, lastY = 0;
let velocity = 0;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('mousemove', (e) => {
  const now = performance.now();
  const dt = Math.max(now - lastMoveTime, 1);
  const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
  velocity = (dist / dt) * 1000;

  mouseX = e.clientX;
  mouseY = e.clientY;
  lastX = e.clientX;
  lastY = e.clientY;
  lastMoveTime = now;

  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';

  updateHud(now, velocity);
});

function animateRing() {
  ringX += (mouseX - ringX) * (reduceMotion ? 1 : 0.18);
  ringY += (mouseY - ringY) * (reduceMotion ? 1 : 0.18);
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button').forEach((el) => {
  el.addEventListener('mouseenter', () => ring.classList.add('active'));
  el.addEventListener('mouseleave', () => ring.classList.remove('active'));
});

const hudDwell = document.getElementById('hudDwell');
const hudVelocity = document.getElementById('hudVelocity');
const hudFill = document.getElementById('hudFill');
const hudDecision = document.getElementById('hudDecision');
let idleStart = performance.now();

function updateHud(now, v) {
  idleStart = now;
  const composite = Math.min(100, Math.round(v / 8));
  hudVelocity.textContent = String(Math.round(v)).padStart(3, '0') + ' px/s';
  hudFill.style.width = composite + '%';

  if (composite < 40) {
    hudFill.style.background = '#3bb26a';
    hudDecision.style.color = '#3bb26a';
    hudDecision.textContent = 'ALLOW';
  } else if (composite < 75) {
    hudFill.style.background = '#d98e2b';
    hudDecision.style.color = '#d98e2b';
    hudDecision.textContent = 'OTP';
  } else {
    hudFill.style.background = '#c81e3a';
    hudDecision.style.color = '#ff3b57';
    hudDecision.textContent = 'BLOCK';
  }
}

function tickDwell() {
  const dwell = Math.round(performance.now() - idleStart);
  hudDwell.textContent = String(dwell).padStart(4, '0') + 'ms';
  requestAnimationFrame(tickDwell);
}
tickDwell();

const revealTargets = document.querySelectorAll('.about, .work, .certs, .contact');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((el) => observer.observe(el));
