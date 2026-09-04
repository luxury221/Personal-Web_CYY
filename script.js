/* CYY companion loader + AI-mode cleanup.
   The shared runtime still provides transitions, decks, ripple and scroll narrative.
   Floral drift and click-ink are intentionally hidden in the LLM Systems redesign:
   motion should communicate systems and evidence rather than decorative motifs. */
(() => {
  document.documentElement.classList.add('cyy-ai-mode');
  const style = document.createElement('style');
  style.textContent = '.cyy-ai-mode .petal-canvas,.cyy-ai-mode .ink-layer{display:none!important}';
  document.head.appendChild(style);

  const sources = [
    'assets/cys-pet/pet.js?v=0.5.0',
    'assets/cys-pet/pet-v06.js?v=0.6.0',
    'assets/cys-pet/pet-v061.js?v=0.6.1',
    'assets/cys-pet/pet-v062.js?v=0.6.2.1',
    'assets/cys-pet/pet-v07.js?v=0.7.0'
  ];
  sources.forEach((src) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onerror = () => console.error('[CYY] failed to load companion layer', src);
    document.body.appendChild(script);
  });
})();