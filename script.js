/* CYY companion + AI systems enhancement loader.
   The stable base runtime remains in script-core.js; this file layers the
   current research-console motion system, portfolio storytelling, visual evidence and the local Research Assistant. */
(() => {
  document.documentElement.classList.add('cyy-ai-mode');

  const cleanupStyle = document.createElement('style');
  cleanupStyle.textContent = '.cyy-ai-mode .petal-canvas,.cyy-ai-mode .ink-layer{display:none!important}';
  document.head.appendChild(cleanupStyle);

  [
    'styles-ai-v2.css?v=20260904.2',
    'styles-content-v3.css?v=20260904.1',
    'styles-evidence-v4.css?v=20260904.1'
  ].forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  });

  const sources = [
    'content-v3-fixes.js?v=20260904.1',
    'cyy-ai-v2.js?v=20260904.2',
    'evidence-v4.js?v=20260904.1',
    'assets/cys-pet/pet.js?v=0.5.0',
    'assets/cys-pet/pet-v06.js?v=0.6.0',
    'assets/cys-pet/pet-v061.js?v=0.6.1',
    'assets/cys-pet/pet-v062.js?v=0.6.2.1',
    'assets/cys-pet/pet-v07.js?v=0.7.0',
    'assets/cys-pet/research-assistant.js?v=2.0.0',
    'assets/cys-pet/research-greetings.js?v=1.0.0'
  ];

  sources.forEach((src) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onerror = () => console.error('[CYY] failed to load enhancement layer', src);
    document.body.appendChild(script);
  });
})();