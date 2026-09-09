const dot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateDot() {
  const ease = reduceMotion ? 1 : 0.2;
  dotX += (mouseX - dotX) * ease;
  dotY += (mouseY - dotY) * ease;
  dot.style.left = dotX + 'px';
  dot.style.top = dotY + 'px';
  requestAnimationFrame(animateDot);
}
animateDot();

document.querySelectorAll('a, button, .project-card, .cert-card').forEach((el) => {
  el.addEventListener('mouseenter', () => dot.classList.add('active'));
  el.addEventListener('mouseleave', () => dot.classList.remove('active'));
});

const sectionTargets = document.querySelectorAll('.about, .work, .certs, .contact');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
sectionTargets.forEach((el) => sectionObserver.observe(el));

function staggerReveal(selector, delayStep) {
  const items = document.querySelectorAll(selector);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = Array.from(items).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('reveal'), index * delayStep);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((item) => obs.observe(item));
}

staggerReveal('.skill-group', 90);
staggerReveal('.project-card', 100);
staggerReveal('.cert-card', 80);
