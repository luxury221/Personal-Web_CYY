/* CYS Archive Companion loader.
   The site runtime (script-core.js) loads as a regular parser-blocking
   script tag so the cover state is correct at first paint. This loader only
   fetches the companion layers — all appended at once with async=false:
   fetches run in parallel while execution stays in insertion order. */
(() => {
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
    script.onerror = () => console.error('[CYS] failed to load', src);
    document.body.appendChild(script);
  });
})();