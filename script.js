const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section:not(.hero)').forEach(section => {
  section.classList.add('fade-section');
  observer.observe(section);
});

const phrases = [
  'Python Developer',
  'Telegram Bot Builder',
  'FastAPI enthusiast',
  'Web Developer',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEl = document.getElementById('typewriter-text');

function typeWriter() {
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typeEl.textContent = current.slice(0, charIndex--);
  } else {
    typeEl.textContent = current.slice(0, charIndex++);
  }

  let delay = isDeleting ? 50 : 90;

  if (!isDeleting && charIndex === current.length + 1) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 300;
  }

  setTimeout(typeWriter, delay);
}
typeWriter();

let mouseX = -999, mouseY = -999;
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY + window.scrollY;
  });
  card.addEventListener('mouseleave', () => {
    mouseX = -999; mouseY = -999;
  });
});

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 2.5 + 0.8;
    this.alpha = Math.random() * 0.6 + 0.2;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.life = Math.random() * 200 + 100;
    this.age = 0;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.age++;
    if (this.age > this.life) this.reset();
  }
  draw() {
    const scrollY = window.scrollY;
    const dx = this.x - mouseX;
    const dy = this.y - (mouseY - scrollY);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const boost = dist < 150 ? (1 - dist / 150) * 1.8 : 0;
    const alpha = Math.min(1, this.alpha + boost);
    const radius = this.r + boost * 2;

    if (boost > 0) {
      const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * 4);
      glow.addColorStop(0, `rgba(203, 176, 255, ${alpha})`);
      glow.addColorStop(1, `rgba(169, 127, 255, 0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius * 4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(169, 127, 255, ${alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const mx = (particles[i].x + particles[j].x) / 2;
        const my = (particles[i].y + particles[j].y) / 2;
        const mdx = mx - mouseX;
        const mdy = my - (mouseY - window.scrollY);
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        const boost = mdist < 150 ? (1 - mdist / 150) * 0.4 : 0;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(169, 127, 255, ${0.15 * (1 - dist / 120) + boost})`;
        ctx.lineWidth = 0.7 + boost;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}
animate();
