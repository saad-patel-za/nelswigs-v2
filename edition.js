const stage = document.querySelector('.comparison-photo');
const range = document.querySelector('#shade-range');
range.addEventListener('input', () => stage.style.setProperty('--split', range.value + '%'));

for (const pick of document.querySelectorAll('[data-compare]')) {
  pick.addEventListener('click', () => {
    const product = products[Number(pick.dataset.compare)];
    const photo = stage.querySelector('img');
    const name = product.name.split(' - ')[0];
    photo.src = product.images[0];
    photo.alt = name;
    document.querySelector('#compare-name').textContent = name;
    document.querySelectorAll('[data-compare]').forEach(button => {
      button.setAttribute('aria-pressed', String(button === pick));
    });
  });
}

const rail = document.querySelector('.rail');
const controls = document.querySelectorAll('.rail-controls button');
controls.forEach((button, index) => button.addEventListener('click', () => {
  const distance = rail.firstElementChild.offsetWidth + parseFloat(getComputedStyle(rail).gap);
  rail.scrollBy({ left: (index ? 1 : -1) * distance, behavior: 'smooth' });
}));

const searchToggle = document.querySelector('#search-toggle');
const searchPanel = document.querySelector('#search-panel');
function closeSearch(restoreFocus = false) {
  searchPanel.hidden = true;
  searchToggle.setAttribute('aria-expanded', 'false');
  if (restoreFocus) searchToggle.focus();
}
searchToggle.addEventListener('click', () => {
  if (!searchPanel.hidden) return closeSearch(true);
  searchPanel.hidden = false;
  searchToggle.setAttribute('aria-expanded', 'true');
  document.querySelector('#site-search').focus();
});
document.addEventListener('click', event => {
  if (!searchPanel.contains(event.target) && !searchToggle.contains(event.target)) closeSearch();
});
searchPanel.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeSearch(true);
});

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const announcement = document.querySelector('.announcement');
const tickerToggle = document.querySelector('.ticker-toggle');
tickerToggle.addEventListener('click', () => {
  const paused = announcement.classList.toggle('paused');
  tickerToggle.setAttribute('aria-label', paused ? 'Resume announcement movement' : 'Pause announcement movement');
  tickerToggle.textContent = paused ? '▷' : 'Ⅱ';
});

const studio = document.querySelector('#studio');
const shadeTints = ['#dec4a8', '#d6bdaf', '#ead2be', '#ddccbe', '#f4d9bf'];
function animateStudio(event) {
  const trigger = event.target.closest('[data-style], #studio-view');
  if (!trigger) return;
  if (trigger.hasAttribute('data-style')) {
    studio.style.setProperty('--studio-tint', shadeTints[Number(trigger.dataset.style)]);
  }
  if (motionPreference.matches) return;
  const portrait = studio.querySelector('#studio-image');
  portrait.getAnimations().forEach(animation => animation.cancel());
  portrait.animate([{opacity:.5, transform:'scale(.96)'},{opacity:1, transform:'scale(1)'}],
    {duration:520, easing:'cubic-bezier(.2,.7,.2,1)'});
}
studio.addEventListener('click', animateStudio);
const entrance = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entrance.unobserve(entry.target);
    if (!motionPreference.matches) entry.target.animate(
      [{opacity:.45, transform:'translateY(15px)'},{opacity:1, transform:'translateY(0)'}],
      {duration:600, easing:'ease-out'}
    );
  }
}, {threshold:.12});
document.querySelectorAll('.scene h2,.portrait,.edit-photo,.rail').forEach(el => entrance.observe(el));
