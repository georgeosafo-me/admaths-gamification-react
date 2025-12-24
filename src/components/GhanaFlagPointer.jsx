import React from 'react';

const GhanaFlagPointer = () => {
  // Adjusted positioning: z-index high, centered horizontally, positioned at the top overlapping the wheel
  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 w-16 h-16 drop-shadow-xl pointer-events-none">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Shape: An inverted pentagon or triangle pointing down */}
        <defs>
          <clipPath id="pointerShape">
            <path d="M10,0 L90,0 L90,60 L50,95 L10,60 Z" />
          </clipPath>
        </defs>
        
        <g clipPath="url(#pointerShape)">
            {/* Red Stripe (Top) */}
            <rect x="0" y="0" width="100" height="33" fill="#CE1126" />
            {/* Yellow Stripe (Middle) */}
            <rect x="0" y="33" width="100" height="33" fill="#FCD116" />
            {/* Green Stripe (Bottom) */}
            <rect x="0" y="66" width="100" height="34" fill="#006B3F" />
            {/* Black Star */}
            <polygon points="50,38 54,48 65,48 56,55 60,66 50,59 40,66 44,55 35,48 46,48" fill="black" />
        </g>
        
        {/* Outline */}
        <path d="M10,0 L90,0 L90,60 L50,95 L10,60 Z" fill="none" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default GhanaFlagPointer;
