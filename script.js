const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const scrollTopBtn = document.getElementById('scrollTopBtn');

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.querySelector('.cta-text').textContent = theme === 'dark' ? 'Dark' : 'Light';
}

function loadTheme() {
  const stored = localStorage.getItem('cybersafe-theme');
  if (stored === 'light' || stored === 'dark') {
    setTheme(stored);
    return;
  }
  // Default based on prefers-color-scheme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  localStorage.setItem('cybersafe-theme', next);
});

// Accordion behavior
const accordions = document.querySelectorAll('.accordion-toggle');
accordions.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const targetId = toggle.dataset.target;
    const panel = document.getElementById(targetId);
    const expanded = toggle.getAttribute('aria-expanded') === 'true';

    // Close all panels
    accordions.forEach((other) => {
      const otherTarget = other.dataset.target;
      const otherPanel = document.getElementById(otherTarget);
      if (otherPanel) {
        otherPanel.hidden = true;
      }
      other.setAttribute('aria-expanded', 'false');
    });

    // Toggle current
    if (!expanded) {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Scroll to top button
window.addEventListener('scroll', () => {
  if (window.scrollY > 320) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile nav toggle
const mobileNavToggle = document.getElementById('mobileNavToggle');
const siteHeader = document.querySelector('.site-header');

if (mobileNavToggle && siteHeader) {
  mobileNavToggle.addEventListener('click', () => {
    const open = siteHeader.classList.toggle('nav-open');
    const icon = mobileNavToggle.querySelector('.fa-solid');
    if (icon) {
      icon.classList.toggle('fa-bars', !open);
      icon.classList.toggle('fa-xmark', open);
    }
  });
}


// Scroll reveal animations
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((el) => {
  const delay = el.dataset.revealDelay;
  if (delay) {
    el.style.setProperty('--reveal-delay', delay);
  }
  revealObserver.observe(el);
});

// Quiz interactivity
const quizForm = document.getElementById('quizForm');
const quizResult = document.getElementById('quizResult');
const quizReset = document.getElementById('quizReset');
const quizAnswers = { q1: 'b', q2: 'b', q3: 'c' };

function resetQuiz() {
  quizForm.reset();
  quizResult.textContent = '';
  quizForm.querySelectorAll('.quiz-option').forEach((option) => {
    option.classList.remove('correct', 'incorrect');
  });
}

if (quizForm) {
  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(quizForm);
    let correct = 0;

    Object.keys(quizAnswers).forEach((key) => {
      const answer = formData.get(key);
      const options = quizForm.querySelectorAll(`input[name="${key}"]`);
      options.forEach((input) => {
        const label = input.closest('.quiz-option');
        if (!label) return;

        if (input.value === quizAnswers[key]) {
          label.classList.add('correct');
        } else {
          label.classList.remove('correct');
        }

        if (input.checked && input.value !== quizAnswers[key]) {
          label.classList.add('incorrect');
        } else {
          label.classList.remove('incorrect');
        }
      });

      if (answer === quizAnswers[key]) {
        correct += 1;
      }
    });

    const scoreText = `You scored ${correct} of ${Object.keys(quizAnswers).length}.`;
    const encouragement =
      correct === Object.keys(quizAnswers).length
        ? 'Excellent! You have a strong security sense.'
        : 'Nice try — revisit the tips above and try again!';

    quizResult.textContent = `${scoreText} ${encouragement}`;
  });

  quizReset.addEventListener('click', () => {
    resetQuiz();
  });
}

// Initialize
loadTheme();
