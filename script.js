const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.voice-card-featured').forEach((card) => {
  const button = card.querySelector('.voice-card-summary');
  const review = card.querySelector('.voice-review-body');
  const label = card.querySelector('.voice-open-label');

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(isOpen));
    card.classList.toggle('is-open', isOpen);
    review.hidden = !isOpen;
    label.textContent = isOpen ? button.dataset.closeLabel : button.dataset.openLabel;
  });
});

document.querySelectorAll('.voices').forEach((section) => {
  const viewport = section.querySelector('.voice-viewport');
  const previous = section.querySelector('[data-voice-prev]');
  const next = section.querySelector('[data-voice-next]');
  const cards = [...viewport.querySelectorAll('.voice-card')];

  const activeIndex = () => {
    const snapPoint = viewport.getBoundingClientRect().left + viewport.clientLeft + parseFloat(getComputedStyle(viewport).paddingLeft);
    return cards.reduce((closest, card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - snapPoint);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Infinity }).index;
  };

  const updateControls = () => {
    const index = activeIndex();
    previous.disabled = index === 0;
    next.disabled = index >= cards.length - 1;
  };

  previous.addEventListener('click', () => {
    const target = cards[Math.max(0, activeIndex() - 1)];
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  });

  next.addEventListener('click', () => {
    const target = cards[Math.min(cards.length - 1, activeIndex() + 1)];
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  });

  viewport.addEventListener('scroll', updateControls, { passive: true });
  window.addEventListener('resize', updateControls);
  updateControls();
});
