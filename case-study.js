// Case study page animations (GSAP, free). Respects "reduce motion".
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  /* 1. Hero: the two photos (and the black block) move at different speeds while scrolling */
  const hero = '.cs-hero';
  const par = (sel, from, to) => gsap.fromTo(sel, { y: from }, {
    y: to, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
  });
    if (!window.matchMedia('(max-width:600px)').matches) {
    par('.cs-hero__phone', 0, -90);
    par('.cs-hero__title', 0, -50);
    par('.cs-hero__carving', 0, -170);
    par('.cs-hero__block', 0, -120);
  }

  /* 2. "Case Study 02" fades in as it scrolls into view */
  gsap.from('.cs-hero__label', {
    opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.cs-hero__label', start: 'top 95%' }
  });

  /* 3. Wavy dashed route is drawn while scrolling; the pin travels along it */
  const reveal = document.getElementById('routeReveal');
  const pin = document.getElementById('routePin');
  if (reveal && pin) {
    const len = reveal.getTotalLength();
    gsap.set(reveal, { strokeDasharray: len, strokeDashoffset: len });
    const place = (p) => { const pt = reveal.getPointAtLength(len * p); pin.setAttribute('transform', `translate(${pt.x} ${pt.y})`); };
    place(0);
    ScrollTrigger.create({
      trigger: '.cs-users', start: 'top 70%', end: 'bottom 70%', scrub: true,
      onUpdate: (self) => { reveal.style.strokeDashoffset = len * (1 - self.progress); place(self.progress); }
    });
  }
})();
