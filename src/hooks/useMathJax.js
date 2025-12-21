import { useEffect } from 'react';

const useMathJax = (dependencies = []) => {
  useEffect(() => {
    if (!window.MathJax) {
      window.MathJax = {
        tex: {
          // Standard delimiters: $...$ for inline, $$...$$ for block
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true
        },
        svg: {
          fontCache: 'global'
        },
        options: {
          enableMenu: false
        }
      };
    }

    if (!document.getElementById('mathjax-script')) {
      const script = document.createElement('script');
      script.id = 'mathjax-script';
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
      script.async = true;
      document.head.appendChild(script);
    }

    if (window.MathJax && window.MathJax.typesetPromise) {
      setTimeout(() => {
        window.MathJax.typesetPromise()
          .then(() => {
            // Optional: Force styles if MathJax overrides
          })
          .catch((err) => console.log('MathJax typeset failed: ', err));
      }, 100);
    }
  }, dependencies);
};

export default useMathJax;
