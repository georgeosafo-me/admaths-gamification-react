import React from 'react';

const GhanaFlagPointer = () => {
  return (
    <div className="relative w-12 h-16 filter drop-shadow-lg z-20 -top-6 left-1/2 -translate-x-1/2">
      {/* Flag Pole / Structure (Optional, focusing on the pointer shape) */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Red Stripe */}
        <path d="M10,0 L90,0 L90,30 L10,30 Z" fill="#CE1126" />
        {/* Yellow Stripe */}
        <path d="M10,30 L90,30 L90,60 L10,60 Z" fill="#FCD116" />
        {/* Green Stripe */}
        <path d="M10,60 L90,60 L50,100 L10,60 Z" fill="#006B3F" />
        {/* Black Star */}
        <polygon points="50,35 54,48 67,48 56,56 60,69 50,61 40,69 44,56 33,48 46,48" fill="black" />
      </svg>
    </div>
  );
};

export default GhanaFlagPointer;
