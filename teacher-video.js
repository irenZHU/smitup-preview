// Add approved, real or generated video assets here when they are available.
// Example: { artem: 'assets/artem-hover.mp4' }.
const teacherHoverVideos = { artem: 'assets/teacher-upload.mp4' };
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.ribbon-group .teacher-photo').forEach(card => {
    const source = teacherHoverVideos[card.dataset.person];
    if (!source) return;
    const video = document.createElement('video');
    video.className = 'teacher-hover-video';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-hidden', 'true');
    video.src = source;
    card.append(video);
    let active = false, timer;
    const show = () => { if(active && !reducedMotion.matches && video.readyState >= 2) card.classList.add('has-teacher-video'); };
    video.addEventListener('loadeddata', show);
    video.addEventListener('playing', show);
    const stop = () => {
      active = false;
      card.classList.remove('has-teacher-video');
      clearTimeout(timer);
      timer = setTimeout(() => { if(!active) { video.pause(); video.currentTime = 0; } }, 200);
    };
    const play = () => {
      if(reducedMotion.matches) return;
      active = true; clearTimeout(timer);
      video.play().then(show).catch(stop);
    };
    card.addEventListener('pointerenter', event => { if(event.pointerType === 'mouse') play(); });
    card.addEventListener('pointerleave', stop);
    card.addEventListener('focus', play);
    card.addEventListener('blur', stop);
    video.addEventListener('error', stop);
    reducedMotion.addEventListener('change', () => { if(reducedMotion.matches) stop(); });
    document.addEventListener('visibilitychange', () => { if(document.hidden) stop(); });
  });
})();
