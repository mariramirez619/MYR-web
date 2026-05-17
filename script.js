// ══════════════════════════════════
//   MYR Technology — JavaScript
// ══════════════════════════════════

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  });
});

/* ── Scroll reveal (solution cards) ── */
const revealCards = document.querySelectorAll('.solution-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      entry.target.style.animationDelay = delay + 'ms';
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealCards.forEach(card => observer.observe(card));

/* ── Smooth section highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchorLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
  });
});

/* ── Counter animation for stats ── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1600;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statValues = entry.target.querySelectorAll('.stat-value');
      statValues.forEach(sv => {
        const raw = sv.textContent;
        const num = parseInt(raw);
        const suffix = raw.replace(/\d/g, '');
        animateCounter(sv, num, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const aboutSection = document.getElementById('sobre');
if (aboutSection) statsObserver.observe(aboutSection);

/* ── Formulario de Contacto (Firebase) ── */
const formulario = document.getElementById('miFormulario');
if (formulario) {
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Capturar datos de los inputs
    const nombreUsuario = document.getElementById('nombre').value;
    const emailUsuario = document.getElementById('email').value;
    const tipoProyectoUsuario = document.getElementById('tipoProyecto').value;
    const mensajeUsuario = document.getElementById('mensaje').value;

    const btnSubmit = formulario.querySelector('button[type="submit"]');
    const originalText = btnSubmit.textContent;
    btnSubmit.textContent = 'Enviando...';
    btnSubmit.disabled = true;

    try {
      // Asegurarse de que window.db esté disponible (cargado desde index.html)
      if (window.db && window.addDoc && window.collection) {
        // Guardar en la base de datos
        await window.addDoc(window.collection(window.db, "contactos"), {
          nombre: nombreUsuario,
          email: emailUsuario,
          tipo_proyecto: tipoProyectoUsuario,
          mensaje: mensajeUsuario,
          fecha: new Date()
        });
        showToast("¡Mensaje enviado!", "Nos pondremos en contacto contigo muy pronto.");
        formulario.reset();
      } else {
        console.error("Firebase no está inicializado aún.");
        showToast("Error de conexión", "Hubo un error al conectar con el servidor. Intenta de nuevo.", true);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      showToast("Error al enviar", "Hubo un problema al enviar tu mensaje. Intenta de nuevo más tarde.", true);
    } finally {
      btnSubmit.textContent = originalText;
      btnSubmit.disabled = false;
    }
  });
}

// Función para mostrar notificaciones Toast en lugar de alert()
function showToast(title, message, isError = false) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColor = 'var(--bg-card)';
  const borderColor = isError ? '#ff4d4d' : 'var(--cyan)';
  const iconHtml = isError 
    ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
    : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';

  toast.style.cssText = `
    background: ${bgColor};
    border: 1px solid var(--border);
    border-left: 4px solid ${borderColor};
    color: var(--text);
    padding: 16px 20px;
    border-radius: var(--radius);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 14px;
    transform: translateX(120%);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    min-width: 280px;
    max-width: 350px;
  `;

  toast.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
      ${iconHtml}
    </div>
    <div style="display: flex; flex-direction: column; overflow: hidden;">
      <span style="font-family: var(--font-head); font-size: 0.95rem; font-weight: 600; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${title}</span>
      <span style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin-top: 2px;">${message}</span>
    </div>
  `;

  container.appendChild(toast);

  // Animar entrada
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });
  });

  // Remover después de 5 segundos
  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}