// Tweaks: accent color + paper tone
(function () {
  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "sienna",
    "paper": "bone"
  }/*EDITMODE-END*/;

  const ACCENTS = {
    sienna: 'oklch(0.52 0.14 38)',
    forest: 'oklch(0.45 0.09 155)',
    ink:    'oklch(0.28 0.02 260)',
    plum:   'oklch(0.40 0.12 340)',
  };
  const ACCENTS2 = {
    sienna: 'oklch(0.42 0.13 38)',
    forest: 'oklch(0.35 0.08 155)',
    ink:    'oklch(0.20 0.02 260)',
    plum:   'oklch(0.30 0.11 340)',
  };
  const PAPERS = {
    bone:  { p: 'oklch(0.972 0.008 85)', p2: 'oklch(0.945 0.010 82)', p3: 'oklch(0.905 0.012 80)' },
    cool:  { p: 'oklch(0.975 0.004 240)', p2: 'oklch(0.945 0.006 240)', p3: 'oklch(0.905 0.008 240)' },
    linen: { p: 'oklch(0.960 0.014 70)', p2: 'oklch(0.930 0.018 70)', p3: 'oklch(0.895 0.020 70)' },
  };

  let state = Object.assign({}, DEFAULTS);

  function apply() {
    const r = document.documentElement.style;
    r.setProperty('--accent', ACCENTS[state.accent] || ACCENTS.sienna);
    r.setProperty('--accent-2', ACCENTS2[state.accent] || ACCENTS2.sienna);
    const pp = PAPERS[state.paper] || PAPERS.bone;
    r.setProperty('--paper', pp.p);
    r.setProperty('--paper-2', pp.p2);
    r.setProperty('--paper-3', pp.p3);
  }

  function renderPanel() {
    const accentBtns = Object.entries(ACCENTS).map(([k, v]) =>
      `<button data-accent="${k}" class="${k === state.accent ? 'on' : ''}" style="background:${v}" title="${k}"></button>`
    ).join('');
    const paperBtns = Object.entries(PAPERS).map(([k, v]) =>
      `<button data-paper="${k}" class="${k === state.paper ? 'on' : ''}" style="background:${v.p};border-color:var(--ink)" title="${k}"></button>`
    ).join('');
    return `
      <div class="tweaks-panel" id="tweaksPanel">
        <h4>Tweaks</h4>
        <div class="tweaks-row">
          <label>Accent</label>
          <div class="tweaks-swatches" data-group="accent">${accentBtns}</div>
        </div>
        <div class="tweaks-row">
          <label>Paper</label>
          <div class="tweaks-swatches" data-group="paper">${paperBtns}</div>
        </div>
      </div>
      <button class="tweaks-fab" id="tweaksFab" aria-label="Tweaks">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/><path d="M12 1v6M12 17v6M4.2 4.2l4.3 4.3M15.5 15.5l4.3 4.3M1 12h6M17 12h6M4.2 19.8l4.3-4.3M15.5 8.5l4.3-4.3"/>
        </svg>
      </button>`;
  }

  function mount() {
    apply();
    document.body.insertAdjacentHTML('beforeend', renderPanel());
    const fab = document.getElementById('tweaksFab');
    const panel = document.getElementById('tweaksPanel');
    let active = false;

    window.addEventListener('message', (e) => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') {
        active = true;
        fab.classList.add('visible');
      } else if (e.data.type === '__deactivate_edit_mode') {
        active = false;
        fab.classList.remove('visible');
        panel.classList.remove('open');
      }
    });
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');

    fab.addEventListener('click', () => panel.classList.toggle('open'));

    document.querySelectorAll('.tweaks-swatches button').forEach(btn => {
      btn.addEventListener('click', () => {
        const accent = btn.getAttribute('data-accent');
        const paper = btn.getAttribute('data-paper');
        if (accent) state.accent = accent;
        if (paper) state.paper = paper;
        apply();
        // re-render selection markers
        document.querySelectorAll('.tweaks-swatches button').forEach(b => {
          const a = b.getAttribute('data-accent');
          const p = b.getAttribute('data-paper');
          b.classList.toggle('on', (a && a === state.accent) || (p && p === state.paper));
        });
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: state }, '*');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
