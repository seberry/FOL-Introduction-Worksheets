// Keep the location cue in step with reading; navigation works without JavaScript.
const sections = [...document.querySelectorAll('.topic')];
const links = [...document.querySelectorAll('.sidebar a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (!visible.length) return;
    const target = `#${visible[0].target.id}`;
    links.forEach((link) => {
      if (link.getAttribute('href') === target) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-5% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}
