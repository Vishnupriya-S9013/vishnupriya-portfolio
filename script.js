// All animations use GSAP (free). Everything respects "reduce motion".
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  /* 1. Hero opening sequence (runs once when the page loads) */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero__photo', { yPercent: 40, opacity: 0, duration: 1.2 })
    .from('.hero__hey span', { opacity: 0, y: 20, duration: 0.9, stagger: 0.15 }, '-=0.6')
    .from('.hero__name', { xPercent: -110, duration: 1.4, ease: 'power4.out' }, '-=0.9')
    .from('.hero__role, .hero__intro, .hero__badge', { opacity: 0, y: 24, duration: 0.8, stagger: 0.1 }, '-=0.8');

  /* 2. Project images move at different speeds while scrolling (tablet and desktop only) */
  if (!window.matchMedia('(max-width:600px)').matches) {
    gsap.utils.toArray('.project img[data-speed]').forEach((img) => {
      const speed = parseFloat(img.dataset.speed);
      gsap.fromTo(img, { y: (1 - speed) * 160 }, {
        y: (speed - 1) * 160, ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  /* 3. About photo: strips slide left/right in a loop.
        Hover = stop and show the straight photo. Mouse leaves = keep moving. */
  const photo = document.querySelector('.about__photo');
  const strips = document.querySelectorAll('.about__photo i');
  const tweens = [];
  const run = (strip, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    tweens[i] = gsap.fromTo(strip, { x: gsap.getProperty(strip, 'x') || dir * -22 }, {
      x: dir * 22, duration: 2.6 + i * 0.35, ease: 'sine.inOut', repeat: -1, yoyo: true
    });
  };
  strips.forEach(run);
  if (photo) {
    photo.addEventListener('mouseenter', () => strips.forEach((strip, i) => {
      tweens[i].kill();
      gsap.to(strip, { x: 0, duration: 0.5, ease: 'power2.out', overwrite: true });
    }));
    photo.addEventListener('mouseleave', () => strips.forEach((strip, i) => {
      gsap.killTweensOf(strip);
      run(strip, i);
    }));
  }
})();
