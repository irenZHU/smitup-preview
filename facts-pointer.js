(() => {
  const section = document.querySelector('.elya-section');
  const arrow = document.querySelector('.facts-pointer');
  if (!section || !arrow) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  const update = () => {
    pending = false;
    const top = section.getBoundingClientRect().top;
    const visible = scrollY > 40 && top < innerHeight * .72;
    arrow.style.setProperty('--pointer-opacity', visible ? '1' : '0');
    const offset = reduced.matches ? 0 : Math.max(-22, Math.min(22, (innerHeight * .4 - top) * .055));
    arrow.style.setProperty('--pointer-offset', `${offset.toFixed(2)}px`);
  };
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  update();
})();
