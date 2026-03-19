// Active nav highlighting on scroll
const sections = document.querySelectorAll('[id]');
const navLinks = document.querySelectorAll('.nav-item');

const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const active = document.querySelector(
          `.nav-item[href="#${e.target.id}"]`
        );
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-20% 0px -70% 0px' }
);

sections.forEach((s) => obs.observe(s));
