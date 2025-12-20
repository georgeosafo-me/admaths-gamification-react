import { useEffect } from 'react';

const useMathJax = (dependencies = []) => {
  useEffect(() => {
    // 1. Config MathJax if not already configured
    if (!window.MathJax) {
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
        },
        svg: {
          fontCache: 'global'
        }
      };
    }

    // 2. Load script if not present
    if (!document.getElementById('mathjax-script')) {
      const script = document.createElement('script');
      script.id = 'mathjax-script';
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // 3. Typeset whenever dependencies change
    if (window.MathJax && window.MathJax.typesetPromise) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        window.MathJax.typesetPromise().catch((err) => console.log('MathJax typeset failed: ', err));
      }, 50);
    }
  }, dependencies);
};

export default useMathJax;
