const navLinks = document.querySelectorAll('.nav-item');
const sectionNames = {
  overview: 'Introduction',
  collection: 'Info We Collect',
  usage: 'How We Use Data',
  sharing: 'Sharing',
  retention: 'Data Retention',
  rights: 'Your Rights',
  cookies: 'Cookies',
  security: 'Security',
  transfers: 'Int. Transfers',
  children: "Children's Privacy",
  contact: 'Contact Us',
};
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        const a = document.querySelector(`.nav-item[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
        const s = document.getElementById('progressSection');
        if (s && sectionNames[e.target.id])
          s.textContent = sectionNames[e.target.id];
      }
    });
  },
  { rootMargin: '-20% 0px -70% 0px' }
);
document.querySelectorAll('[id]').forEach((s) => obs.observe(s));

const bar = document.getElementById('progressBar');
const pct = document.getElementById('progressPct');
window.addEventListener('scroll', () => {
  const d = document.documentElement;
  const p =
    d.scrollHeight - d.clientHeight > 0
      ? Math.round((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100)
      : 0;
  if (bar) bar.style.width = p + '%';
  if (pct) pct.textContent = p + '% read';
});
