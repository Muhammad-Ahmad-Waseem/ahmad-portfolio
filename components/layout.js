// Shared layout: top nav, footer, reveal-on-scroll
(function () {
  const PAGES = [
    { id: 'home',    label: 'Home',         href: 'index.html' },
    { id: 'about',   label: 'About',        href: 'about.html' },
    { id: 'work',    label: 'Projects',     href: 'projects.html' },
    { id: 'papers',  label: 'Publications', href: 'publications.html' },
    { id: 'cv',      label: 'Experience',   href: 'experience.html' },
    { id: 'now',     label: 'Now',          href: 'now.html' },
    { id: 'writing', label: 'Writing',      href: 'writing.html' },
    { id: 'contact', label: 'Contact',      href: 'contact.html' },
  ];

  function renderTopnav(activeId, basePath) {
    const links = PAGES.map((p, i) => {
      const num = String(i + 1).padStart(2, '0');
      const cls = p.id === activeId ? 'active' : '';
      return `<a href="${basePath}${p.href}" class="${cls}"><span class="num">${num}</span>${p.label}</a>`;
    }).join('');
    return `
      <header class="topnav">
        <a href="${basePath}index.html" class="topnav-brand">
          <span class="mark">a.</span>
          <span class="who"><span>Ahmad <em>Waseem</em></span><small>ML Engineer</small></span>
        </a>
        <nav class="topnav-links" id="topnavLinks">${links}</nav>
        <div class="topnav-right">
          <span class="sub-text"><span class="dot"></span>Available Jul 2026</span>
          <a class="btn-mini" href="${basePath}assets/resume.pdf" download>Résumé</a>
          <button class="mobilenav-toggle" id="mobilenavToggle" aria-label="Menu">Menu</button>
        </div>
      </header>`;
  }

  function renderFooter(basePath) {
    const nav = PAGES.map(p => `<a href="${basePath}${p.href}" class="link">${p.label}</a>`).join('');
    return `
      <footer class="site-footer">
        <div>
          <h3 class="f-display">Let's build something<br/>together.</h3>
          <div style="margin-top:20px; display:flex; gap:14px; flex-wrap:wrap; font-family:var(--f-mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--ink-3);">${nav}</div>
        </div>
        <div class="meta">
          <div><a href="mailto:ahmadwaseem648@gmail.com" class="link">ahmadwaseem648@gmail.com</a></div>
          <div>Buffalo, NY</div>
          <div style="margin-top:10px">© 2026 · Built with care</div>
        </div>
      </footer>`;
  }

  window.SiteLayout = {
    mount(activeId, _pageLabel) {
      // Detect if we're in a subdirectory (e.g. projects/*.html) and set base path
      const path = location.pathname;
      const inSub = /\/projects\//.test(path);
      const base = inSub ? '../' : '';

      const main = document.querySelector('.shell');
      if (main) {
        main.insertAdjacentHTML('afterbegin', renderTopnav(activeId, base));
        main.insertAdjacentHTML('beforeend', renderFooter(base));
      }

      // Mobile nav
      const toggle = document.getElementById('mobilenavToggle');
      const links = document.getElementById('topnavLinks');
      if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));

      // Reveal on scroll
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    },
  };
})();
