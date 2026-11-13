(() => {
  const section = document.querySelector('.elya-section');
  if(!section) return;
  const observer = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting){ section.classList.add('is-ready'); observer.disconnect(); }
  },{threshold:.12});
  observer.observe(section);
})();
